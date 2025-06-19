#!/bin/bash

# Set required environment variables before running this script:
#   NEWSAPI_KEY, OPENAI_API_KEY, VEO_API_KEY, VEO_API_ENDPOINT,
#   GCP_BUCKET_NAME, FIRESTORE_COLLECTION=videos, PROJECT_ID=newway-73103

# Set project
gcloud config set project "$PROJECT_ID"

# 1) Deploy News Fetcher (Python)
gcloud functions deploy news_fetcher \
  --runtime=python39 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=app \
  --source=functions/news_fetcher \
  --set-env-vars NEWSAPI_KEY=$NEWSAPI_KEY,FIRESTORE_COLLECTION=$FIRESTORE_COLLECTION \
  --project=$PROJECT_ID

# 2) Create Pub/Sub topic for Script Generator
gcloud pubsub topics create onNewVideo --project=$PROJECT_ID || true

# 3) Deploy Script Generator (Python)
gcloud functions deploy script_generator \
  --runtime=python39 \
  --trigger-topic onNewVideo \
  --entry-point=script_generator \
  --source=functions/script_generator \
  --set-env-vars OPENAI_API_KEY=$OPENAI_API_KEY,FIRESTORE_COLLECTION=$FIRESTORE_COLLECTION \
  --project=$PROJECT_ID

# 4) Deploy Video Creator (Python)
gcloud functions deploy video_creator \
  --runtime=python39 \
  --trigger-event providers/cloud.firestore/eventTypes/document.update \
  --trigger-resource "projects/$PROJECT_ID/databases/(default)/documents/$FIRESTORE_COLLECTION/{docId}" \
  --entry-point=video_creator \
  --source=functions/video_creator \
  --set-env-vars VEO_API_KEY=$VEO_API_KEY,VEO_API_ENDPOINT=$VEO_API_ENDPOINT,GCP_BUCKET_NAME=$GCP_BUCKET_NAME \
  --project=$PROJECT_ID

# 5) Schedule News Fetcher to run every minute (3 times test)
JOB_NAME=news-fetcher-job
gcloud scheduler jobs describe $JOB_NAME --project=$PROJECT_ID &>/dev/null \
  && gcloud scheduler jobs update http $JOB_NAME --schedule="* * * * *" --time-zone="America/New_York" --uri=$(gcloud functions describe news_fetcher --format="value(httpsTrigger.url)") --http-method=GET \
  || gcloud scheduler jobs create http $JOB_NAME --schedule="* * * * *" --time-zone="America/New_York" --uri=$(gcloud functions describe news_fetcher --format="value(httpsTrigger.url)") --http-method=GET

echo "Deployed all functions and scheduled news_fetcher. Watch Firestore and logs for end-to-end flow."
