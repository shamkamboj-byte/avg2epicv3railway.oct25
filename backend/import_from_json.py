"""
YouTube Playlist Importer for Average2Epic

Since YouTube blocks automated scraping, here are 3 options:

OPTION 1: Manual CSV Import (Fastest)
=====================================
1. Go to: https://www.youtube.com/playlist?list=PLG7v1z1ZY96eVnBd3DHyMgEQXB8_VQc3u
2. Open browser console (F12)
3. Run this JavaScript:

let videos = [];
document.querySelectorAll('ytd-playlist-video-renderer').forEach((video, idx) => {
    const title = video.querySelector('#video-title')?.textContent?.trim() || '';
    const url = video.querySelector('a#video-title')?.href || '';
    const videoId = url.split('v=')[1]?.split('&')[0] || '';
    videos.push({day: idx + 1, title, videoId});
});
console.log(JSON.stringify(videos, null, 2));

4. Copy the output
5. Save as: /app/backend/playlist_data.json
6. Run: python import_from_json.py


OPTION 2: Use YouTube API (Need API Key)
=========================================
1. Go to: https://console.cloud.google.com/
2. Create project & enable YouTube Data API v3
3. Get API key
4. Set environment variable: YOUTUBE_API_KEY=your_key
5. Run: python import_with_api.py


OPTION 3: Import via Admin Panel (Manual but works)
====================================================
Use the "Add New Video" button in admin dashboard for each video.
YouTube ID extraction is automatic.


RECOMMENDED: Option 1 (takes 2 minutes)
"""

import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def import_from_json():
    """Import videos from JSON file"""
    
    json_file = ROOT_DIR / 'playlist_data.json'
    
    if not json_file.exists():
        print("❌ playlist_data.json not found!")
        print("\n📋 Follow these steps:")
        print("1. Open: https://www.youtube.com/playlist?list=PLG7v1z1ZY96eVnBd3DHyMgEQXB8_VQc3u")
        print("2. Press F12 to open browser console")
        print("3. Paste this code:\n")
        print("""
let videos = [];
document.querySelectorAll('ytd-playlist-video-renderer').forEach((video, idx) => {
    const title = video.querySelector('#video-title')?.textContent?.trim() || '';
    const url = video.querySelector('a#video-title')?.href || '';
    const videoId = url.split('v=')[1]?.split('&')[0] || '';
    videos.push({day: idx + 1, title, videoId});
});
console.log(JSON.stringify(videos, null, 2));
        """)
        print("\n4. Copy the output")
        print("5. Save as: /app/backend/playlist_data.json")
        print("6. Run this script again")
        return
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Load JSON
    with open(json_file, 'r') as f:
        videos = json.load(f)
    
    print(f"📹 Found {len(videos)} videos to import\n")
    
    imported_count = 0
    skipped_count = 0
    
    for video_data in videos:
        try:
            video_id = video_data.get('videoId', '')
            title = video_data.get('title', '')
            day = video_data.get('day', 1)
            
            if not video_id or not title:
                print(f"⏭️  Skipped: Missing data")
                continue
            
            # Check if exists
            existing = await db.videos.find_one({"youtubeId": video_id})
            if existing:
                print(f"⏭️  Skipped: Day {day} - {title} (already exists)")
                skipped_count += 1
                continue
            
            # Extract day from title if present
            day_match = re.search(r'[Dd]ay\s*(\d+)', title)
            if day_match:
                day = int(day_match.group(1))
            
            # Default reflection
            reflection = f"Day {day} of my Average2Epic transformation journey. Watch as I continue building consistency and discipline."
            excerpt = reflection[:80] + "..."
            
            # Default tags
            tags = ["Average2Epic", f"Day {day}", "Transformation", "Journey"]
            
            # Create video document
            video_doc = {
                "title": title,
                "youtubeId": video_id,
                "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                "day": day,
                "date": datetime.utcnow().strftime('%Y-%m-%d'),
                "reflection": reflection,
                "tags": tags,
                "excerpt": excerpt,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            
            await db.videos.insert_one(video_doc)
            print(f"✅ Imported: Day {day} - {title}")
            imported_count += 1
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print(f"\n🎉 Import Complete!")
    print(f"✅ Imported: {imported_count} videos")
    print(f"⏭️  Skipped: {skipped_count} videos")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(import_from_json())
