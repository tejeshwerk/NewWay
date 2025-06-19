import { Firestore } from '@google-cloud/firestore';
import fetch from 'node-fetch';
import { Request, Response } from 'express';

// Initialize Firestore targeting the specific project
const db = new Firestore({ projectId: 'newway-73103' });

export const newsFetcher = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&pageSize=3',
      {
        headers: {
          'X-Api-Key': process.env.NEWSAPI_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const articles = (data.articles || []).slice(0, 3);

    const writes = articles.map((article: any) => {
      const record = {
        headline: article.title,
        url: article.url,
        fetchedAt: new Date(),
      };
      return db
        .collection(process.env.FIRESTORE_COLLECTION || 'videos')
        .add(record);
    });

    await Promise.all(writes);

    res.status(200).json({ count: articles.length });
  } catch (err) {
    console.error('newsFetcher error:', err);
    res.status(500).send('Internal Server Error');
  }
};
