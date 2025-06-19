import os
import requests
from google.cloud import firestore, storage


def video_creator(event, context):
    # Initialize clients
    db = firestore.Client(project='newway-73103')
    client = storage.Client(project='newway-73103')

    # Extract document path from the Firestore event resource
    resource = context.resource  # e.g. "projects/.../documents/videos/{docId}"
    path = resource.split('/documents/')[1]
    doc_ref = db.document(path)
    doc = doc_ref.get().to_dict()

    # Only proceed if 'script' exists and 'videoUrl' is not set
    if 'script' in doc and 'videoUrl' not in doc:
        script = doc['script']

        # Call Veo 3 API
        resp = requests.post(
            os.environ['VEO_API_ENDPOINT'],
            json={'script': script, 'resolution': '720p'},
            headers={'Authorization': f"Bearer {os.environ['VEO_API_KEY']}"}
        )
        resp.raise_for_status()
        video_bytes = resp.content

        # Upload to Cloud Storage
        bucket = client.bucket(os.environ['GCP_BUCKET_NAME'])
        blob = bucket.blob(f"{path.split('/')[-1]}.mp4")
        blob.upload_from_string(video_bytes, content_type='video/mp4')
        video_url = (
            f"https://storage.googleapis.com/"
            f"{os.environ['GCP_BUCKET_NAME']}/{path.split('/')[-1]}.mp4"
        )

        # Update Firestore document
        doc_ref.update({
            'videoUrl': video_url,
            'videoGeneratedAt': firestore.SERVER_TIMESTAMP
        })

