import asyncio
from pytube import Playlist
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def import_playlist():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Playlist URL
    playlist_url = "https://www.youtube.com/playlist?list=PLG7v1z1ZY96eVnBd3DHyMgEQXB8_VQc3u"
    
    print(f"📺 Loading playlist: {playlist_url}")
    print("⏳ This may take a moment...\n")
    
    try:
        # Load playlist
        playlist = Playlist(playlist_url)
        
        print(f"✅ Found playlist: {playlist.title}")
        print(f"📹 Total videos: {len(playlist.video_urls)}\n")
        
        imported_count = 0
        skipped_count = 0
        
        for idx, video_url in enumerate(playlist.video_urls, 1):
            try:
                # Get video info using pytube
                from pytube import YouTube
                yt = YouTube(video_url)
                
                # Extract video ID from URL
                video_id = video_url.split('v=')[1].split('&')[0] if 'v=' in video_url else video_url.split('/')[-1]
                
                # Try to extract day number from title
                title = yt.title
                day_match = re.search(r'[Dd]ay\s*(\d+)', title)
                day_number = int(day_match.group(1)) if day_match else idx
                
                # Check if video already exists
                existing = await db.videos.find_one({"youtubeId": video_id})
                if existing:
                    print(f"⏭️  Skipped (already exists): Day {day_number} - {title}")
                    skipped_count += 1
                    continue
                
                # Get video description and published date
                description = yt.description if yt.description else ""
                publish_date = yt.publish_date.strftime('%Y-%m-%d') if yt.publish_date else datetime.utcnow().strftime('%Y-%m-%d')
                
                # Create reflection from description (first 500 chars) or use title
                reflection = description[:500] if description else f"Watch Day {day_number} of my Average2Epic journey."
                
                # Create excerpt
                excerpt = reflection[:80] + "..." if len(reflection) > 80 else reflection
                
                # Default tags
                tags = ["Average2Epic", "Day " + str(day_number), "Transformation"]
                
                # Add more specific tags based on title
                if any(word in title.lower() for word in ['fitness', 'workout', 'gym', 'training']):
                    tags.append("Fitness")
                if any(word in title.lower() for word in ['morning', 'routine']):
                    tags.append("Morning Routine")
                if any(word in title.lower() for word in ['grind', 'discipline', 'consistency']):
                    tags.append("Discipline")
                
                # Create video document
                video_doc = {
                    "title": title,
                    "youtubeId": video_id,
                    "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                    "day": day_number,
                    "date": publish_date,
                    "reflection": reflection,
                    "tags": tags,
                    "excerpt": excerpt,
                    "createdAt": datetime.utcnow(),
                    "updatedAt": datetime.utcnow()
                }
                
                # Insert into database
                await db.videos.insert_one(video_doc)
                
                print(f"✅ Imported: Day {day_number} - {title}")
                imported_count += 1
                
            except Exception as e:
                print(f"❌ Error importing video {idx}: {str(e)}")
                continue
        
        print(f"\n🎉 Import Complete!")
        print(f"✅ Successfully imported: {imported_count} videos")
        print(f"⏭️  Skipped (already exist): {skipped_count} videos")
        print(f"📊 Total processed: {len(playlist.video_urls)} videos")
        
    except Exception as e:
        print(f"❌ Error loading playlist: {str(e)}")
        print("\nTrying alternative method...")
        
        # Alternative: Parse playlist manually
        import urllib.request
        import json
        
        playlist_id = "PLG7v1z1ZY96eVnBd3DHyMgEQXB8_VQc3u"
        
        print("\n⚠️  Note: Without YouTube API key, I can only import basic info.")
        print("You may need to manually edit reflections in the admin panel.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(import_playlist())
