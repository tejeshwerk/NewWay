import os
import requests
from flask import Flask
from google.cloud import firestore
from openai import OpenAI

app = Flask(__name__)

# Firestore client
db = firestore.Client(project='newway-73103')
COLLECTION = os.environ.get('FIRESTORE_COLLECTION', 'videos')
OPENAI_KEY = os.environ['OPENAI_API_KEY']

# OpenAI client
openai = OpenAI(api_key=OPENAI_KEY)

@app.pubsub_topic('projects/newway-73103/topics/onNewVideo')
def script_generator(event, context):
    # event contains Firestore document name
    doc_path = event['value']['name']  # full resource path
    doc_ref = db.document(doc_path)
    data = doc_ref.get().to_dict()
    url = data.get('url')
    # fetch article
    resp = requests.get(url)
    resp.raise_for_status()
    # simple HTML strip
    text = ''.join(resp.text.splitlines())[:1000]
    # build prompt
    prompt = (
        "Create a playful 30-second voiceover script with scene descriptions "
        "for a video based on this article text:\n\n" + text
    )
    # call OpenAI
    completion = openai.chat.completions.create(
        model='gpt-4',
        messages=[{'role':'user','content':prompt}],
        max_tokens=500,
        temperature=0.7
    )
    script = completion.choices[0].message.content.strip()
    # update Firestore
    doc_ref.update({
        'script': script,
        'scriptGeneratedAt': firestore.SERVER_TIMESTAMP
    })

