#!/usr/bin/env python3
"""Simple end-to-end smoke test for the News video pipeline."""
import os
import sys
import time
import subprocess
from google.cloud import firestore, storage


def run_smoke_test(project_id: str) -> None:
    """Run smoke test steps and exit with status 1 on failure."""
    # 1) Trigger scheduler job
    result = subprocess.run(
        [
            "gcloud",
            "scheduler",
            "jobs",
            "run",
            "news-fetcher-job",
            "--project",
            project_id,
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("Failed to trigger scheduler job:")
        print(result.stderr)
        sys.exit(1)

    # Wait briefly for job to execute
    time.sleep(10)

    # 2) Verify Firestore documents
    db = firestore.Client(project=project_id)
    docs = list(db.collection("videos").stream())
    if not docs:
        print("No documents found in 'videos' collection")
        sys.exit(1)

    bucket_name = None
    for doc in docs:
        data = doc.to_dict() or {}
        if not data.get("script"):
            print(f"Document {doc.id} missing 'script'")
            sys.exit(1)
        video_url = data.get("videoUrl")
        if not video_url:
            print(f"Document {doc.id} missing 'videoUrl'")
            sys.exit(1)
        if bucket_name is None:
            parts = video_url.split("/")
            if len(parts) >= 5:
                bucket_name = parts[3]

    if bucket_name is None:
        print("Could not determine bucket name from videoUrl")
        sys.exit(1)

    # 3) Check Cloud Storage for MP4 files
    storage_client = storage.Client(project=project_id)
    bucket = storage_client.bucket(bucket_name)
    mp4_exists = any(blob.name.endswith(".mp4") for blob in bucket.list_blobs())
    if not mp4_exists:
        print(f"No MP4 files found in bucket {bucket_name}")
        sys.exit(1)

    print("Smoke test passed!")


def main() -> None:
    project_id = sys.argv[1] if len(sys.argv) > 1 else "newway-73103"
    run_smoke_test(project_id)


if __name__ == "__main__":
    main()
