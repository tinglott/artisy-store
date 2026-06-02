#!/usr/bin/env python3
"""
YouTube Shorts Daily Uploader - Sacred Cycles
Automated video upload with OAuth2 authentication
"""

import os, json, pickle
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

OAUTH_SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
CREDS_FILE = '/agent/home/.youtube_oauth_token.pickle'
VIDEO_FILE = '/tmp/sacred_cycles_final.mp4'

def get_authenticated_service():
    creds = None
    if os.path.exists(CREDS_FILE):
        with open(CREDS_FILE, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            print("OAuth token refreshed")
    if creds:
        with open(CREDS_FILE, 'wb') as token:
            pickle.dump(creds, token)
    return build('youtube', 'v3', credentials=creds)

def upload_video(video_file, title, description):
    if not os.path.exists(video_file):
        print(f"Video not found: {video_file}")
        return False
    print(f"Uploading: {Path(video_file).name} ({os.path.getsize(video_file)/1024:.0f}KB)")
    body = {
        'snippet': {'title': title, 'description': description, 'tags': ['wellness', 'sacred_cycles'], 'categoryId': '27'},
        'status': {'privacyStatus': 'public', 'madeForKids': False}
    }
    media = MediaFileUpload(video_file, mimetype='video/mp4', resumable=True, chunksize=1024*1024)
    try:
        youtube = get_authenticated_service()
        request = youtube.videos().insert(part='snippet,status', body=body, media_body=media)
        response = None
        while response is None:
            status, response = request.next_chunk()
            if status:
                print(f"Progress: {int(status.progress()*100)}%")
        print(f"Success: https://youtube.com/watch?v={response['id']}")
        return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

if __name__ == '__main__':
    title = "Your mornings are chaos. Sacred Cycles changes everything."
    description = "Transform your mornings with Sacred Cycles.\nhttps://whop.com/tlott12/sacred-cycles-morning-reset"
    upload_video(VIDEO_FILE, title, description)