import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { EventContext } from 'firebase-functions';
import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

// Initialize Firestore targeting the specific project
const db = new Firestore({ projectId: 'newway-73103' });

export const scriptGenerator = onDocumentCreated('videos/{docId}', async (snap: DocumentSnapshot, ctx: EventContext) => {
    try {
      const data = snap.data() as { headline?: string; url?: string };
      const { url } = data;
      if (!url) {
        console.error('No URL found in document');
        return null;
      }

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const articleText = $('p')
        .map((_: any, el: any) => $(el).text())
        .get()
        .join(' ');

      const text =
        articleText.length > 1000 ? articleText.slice(0, 1000) : articleText;

      const prompt = `Generate a playful 30-second voiceover script with scene descriptions for a video based on this article:\n${text}`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const script = completion.choices[0].message?.content.trim() || '';

      await db.collection('videos').doc(ctx.params.docId).update({
        script,
        scriptGeneratedAt: new Date(),
      });
    } catch (error) {
      console.error('scriptGenerator error:', error);
    }
    return null;
  });
