import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { EventContext } from 'firebase-functions';
import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

// Initialize Firestore targeting the specific project
const db = new Firestore({ projectId: 'newway-73103' });

export const scriptGenerator = onDocumentCreated(
  `${process.env.FIRESTORE_COLLECTION}/{docId}`,
  async (snap: DocumentSnapshot, ctx: EventContext) => {
    try {
      const { url, headline } = snap.data() as {
        headline?: string;
        url?: string;
      };

      if (!url) {
        console.error('No URL found in document');
        return null;
      }

      const resp = await axios.get(url);
      const $ = cheerio.load(resp.data);
      const articleText = $('p')
        .map((i, el) => $(el).text())
        .get()
        .join(' ');

      const trimmedText =
        articleText.length > 1000 ? articleText.slice(0, 1000) : articleText;

      const prompt =
        'Create a playful 30-second voiceover script with scene descriptions for a video based on this article text:\n\n' +
        trimmedText;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const script = completion.choices[0].message?.content.trim() || '';

      await db
        .collection(process.env.FIRESTORE_COLLECTION as string)
        .doc(ctx.params.docId)
        .update({ script, scriptGeneratedAt: new Date() });
    } catch (error) {
      console.error('scriptGenerator error:', error);
    }
    return null;
  }
);
