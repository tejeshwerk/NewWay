import os
import requests
from google.cloud import firestore
from flask import Flask, jsonify

app = Flask(__name__)

# Firestore client
db = firestore.Client(project='newway-73103')
COLLECTION = os.environ.get('FIRESTORE_COLLECTION', 'videos')
NEWSAPI_KEY = os.environ['NEWSAPI_KEY']

@app.route('/', methods=['GET'])
def fetch_headlines():
    url = 'https://newsapi.org/v2/top-headlines'
    params = {'country': 'us', 'pageSize': 3, 'apiKey': NEWSAPI_KEY}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    articles = resp.json().get('articles', [])[:3]
    for art in articles:
        doc = {
            'headline': art.get('title'),
            'url': art.get('url'),
            'fetchedAt': firestore.SERVER_TIMESTAMP
        }
        db.collection(COLLECTION).add(doc)
    return jsonify({'count': len(articles)}), 200
