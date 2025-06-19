#!/bin/bash

# Set the project for gcloud commands
PROJECT_ID="newway-73103"

echo "Setting GCP project to $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# Deploy the Cloud Function

echo "Deploying Cloud Function: newsFetcher"
gcloud functions deploy newsFetcher \
  --runtime=nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=newsFetcher \
  --source=functions/newsFetcher \
  --set-env-vars NEWSAPI_KEY=$NEWSAPI_KEY,FIRESTORE_COLLECTION=videos

# Capture the function URL
echo "Retrieving deployed function URL"
FUNC_URL=$(gcloud functions describe newsFetcher --format="value(httpsTrigger.url)")

# Create or update the Cloud Scheduler job
JOB_NAME="news-fetcher-job"
SCHEDULE="* * * * *"
TIMEZONE="America/New_York"
SERVICE_ACCOUNT="[YOUR_SERVICE_ACCOUNT]"

# Attempt to create the job. If it exists, update it instead.
if gcloud scheduler jobs describe "$JOB_NAME" >/dev/null 2>&1; then
  echo "Updating existing scheduler job: $JOB_NAME"
  gcloud scheduler jobs update http "$JOB_NAME" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$FUNC_URL" \
    --http-method=GET \
    --oidc-service-account-email="$SERVICE_ACCOUNT"
else
  echo "Creating scheduler job: $JOB_NAME"
  gcloud scheduler jobs create http "$JOB_NAME" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$FUNC_URL" \
    --http-method=GET \
    --oidc-service-account-email="$SERVICE_ACCOUNT"
fi

# Reminder message

echo "Scheduler is now running every minute. After observing 3 runs, pause it with:"
echo "  gcloud scheduler jobs pause $JOB_NAME"
