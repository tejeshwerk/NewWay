import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { EventContext } from 'firebase-functions';
import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';

// Initialize Firestore and Storage for the specific project
const db = new Firestore({ projectId: 'newway-73103' });
const storage = new Storage({ projectId: 'newway-73103' });

export const videoCreator = onDocumentUpdated(
  `${process.env.FIRESTORE_COLLECTION}/{docId}`,
  async (
    change: { before: DocumentSnapshot; after: DocumentSnapshot },
    ctx: EventContext
  ) => {
    try {
      const before = change.before.data() as any;
      const after = change.after.data() as any;

      if (!before.script && after.script && !after.videoUrl) {
        const { script } = after;

        const resp = await axios.post(
          process.env.VEO_API_ENDPOINT as string,
          { script, resolution: '720p' },
          {
            headers: { Authorization: `Bearer ${process.env.VEO_API_KEY}` },
            responseType: 'arraybuffer',
          }
        );

        const buffer = Buffer.from(resp.data);

        const bucket = storage.bucket(process.env.GCP_BUCKET_NAME as string);
        const file = bucket.file(`${ctx.params.docId}.mp4`);
        await file.save(buffer, { contentType: 'video/mp4' });

        const videoUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${ctx.params.docId}.mp4`;

        await db
          .collection(process.env.FIRESTORE_COLLECTION as string)
          .doc(ctx.params.docId)
          .update({ videoUrl, videoGeneratedAt: new Date() });
      }
    } catch (error) {
      console.error('videoCreator error:', error);
    }
    return null;
  }
);
