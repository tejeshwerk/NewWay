import * as functions from 'firebase-functions';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';

// Initialize Firestore and Storage for the specific project
const db = new Firestore({ projectId: 'newway-73103' });
const storage = new Storage({ projectId: 'newway-73103' });

export const videoCreator = functions.firestore
  .document(`${process.env.FIRESTORE_COLLECTION}/{docId}`)
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data() as any;
      const afterData = change.after.data() as any;

      if (!beforeData.script && afterData.script && !beforeData.videoUrl) {
        const { script } = afterData;

        const response = await axios.post(
          process.env.VEO_API_ENDPOINT || '',
          { script, resolution: '720p' },
          {
            headers: { Authorization: `Bearer ${process.env.VEO_API_KEY}` },
            responseType: 'arraybuffer',
          }
        );

        const buffer = response.data as Buffer;

        const bucket = storage.bucket(process.env.GCP_BUCKET_NAME || '');
        const file = bucket.file(`${context.params.docId}.mp4`);
        await file.save(buffer, { contentType: 'video/mp4' });

        const videoUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${context.params.docId}.mp4`;

        await db
          .collection(process.env.FIRESTORE_COLLECTION || 'videos')
          .doc(context.params.docId)
          .update({ videoUrl, videoGeneratedAt: new Date() });
      }
    } catch (error) {
      console.error('videoCreator error:', error);
    }
    return null;
  });
