import * as functions from 'firebase-functions';
import { Firestore } from '@google-cloud/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Configuration, OpenAIApi } from 'openai';

// Initialize Firestore targeting the specific project
const db = new Firestore({ projectId: 'newway-73103' });

export const scriptGenerator = functions.firestore
  .document('videos/{docId}')
  .onCreate(async (snap, ctx) => {
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
        .map((_, el) => $(el).text())
        .get()
        .join(' ');

      const text =
        articleText.length > 1000 ? articleText.slice(0, 1000) : articleText;

      const prompt = `Generate a playful 30-second voiceover script with scene descriptions for a video based on this article:\n${text}`;

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createCompletion({
        model: 'gpt-4',
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      });

      const script = completion.data.choices[0]?.text?.trim() || '';

      await db.collection('videos').doc(ctx.params.docId).update({
        script,
        scriptGeneratedAt: new Date(),
      });
    } catch (error) {
      console.error('scriptGenerator error:', error);
    }
    return null;
  });
