import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime
import re
import subprocess
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def import_playlist_with_descriptions():
    """Import YouTube playlist with full descriptions and update existing videos"""
    
    # Playlist URL
    playlist_url = "https://www.youtube.com/playlist?list=PLG7v1z1ZY96eVnBd3DHyMgEQXB8_VQc3u"
    
    print(f"📺 Fetching playlist with full descriptions...")
    print(f"🔗 URL: {playlist_url}\n")
    
    try:
        # Use yt-dlp to get full video info including descriptions
        cmd = [
            'yt-dlp',
            '--flat-playlist',
            '--dump-json',
            '--no-warnings',
            playlist_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode != 0:
            print(f"❌ Error fetching playlist: {result.stderr}")
            return
        
        # Parse JSON output (one JSON object per line)
        videos_data = []
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    video_info = json.loads(line)
                    videos_data.append(video_info)
                except json.JSONDecodeError:
                    continue
        
        print(f"✅ Found {len(videos_data)} videos in playlist\n")
        
        # Now fetch full details for each video (including description)
        print("📥 Fetching full video details (descriptions, dates, etc.)...\n")
        
        detailed_videos = []
        for idx, video_info in enumerate(videos_data, 1):
            video_id = video_info.get('id', '')
            if not video_id:
                continue
            
            print(f"  [{idx}/{len(videos_data)}] Fetching: {video_info.get('title', 'Unknown')[:60]}...")
            
            # Fetch full video details
            detail_cmd = [
                'yt-dlp',
                '--dump-json',
                '--no-warnings',
                f"https://www.youtube.com/watch?v={video_id}"
            ]
            
            try:
                detail_result = subprocess.run(detail_cmd, capture_output=True, text=True, timeout=30)
                if detail_result.returncode == 0:
                    detail_info = json.loads(detail_result.stdout)
                    detailed_videos.append(detail_info)
                else:
                    # Fallback to basic info if detailed fetch fails
                    detailed_videos.append(video_info)
            except Exception as e:
                print(f"    ⚠️  Could not fetch details: {str(e)}")
                detailed_videos.append(video_info)
        
        print(f"\n✅ Fetched details for {len(detailed_videos)} videos\n")
        
        # Connect to MongoDB
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        imported_count = 0
        updated_count = 0
        skipped_count = 0
        
        for idx, video_info in enumerate(detailed_videos, 1):
            try:
                video_id = video_info.get('id', '')
                title = video_info.get('title', '')
                
                if not video_id or not title:
                    continue
                
                # Extract day number from title
                day_match = re.search(r'[Dd]ay\s*(\d+)', title)
                day_number = int(day_match.group(1)) if day_match else idx
                
                # Get upload date
                upload_date = video_info.get('upload_date', '')
                if upload_date and len(upload_date) == 8:  # Format: YYYYMMDD
                    date_str = f"{upload_date[0:4]}-{upload_date[4:6]}-{upload_date[6:8]}"
                else:
                    date_str = datetime.utcnow().strftime('%Y-%m-%d')
                
                # Get FULL description (this is the key improvement!)
                description = video_info.get('description', '')
                
                # Create reflection from full description or default
                if description and len(description) > 20:
                    # Use the full YouTube description as reflection
                    reflection = description.strip()
                else:
                    # Fallback if no description
                    reflection = f"Day {day_number} of my Average2Epic transformation journey. Building consistency, discipline, and becoming the best version of myself."
                
                # Create excerpt (first 80 chars of reflection)
                excerpt = reflection[:80] + "..." if len(reflection) > 80 else reflection
                
                # Smart tagging based on title and description
                tags = ["Average2Epic", f"Day {day_number}", "Transformation"]
                
                combined_text = (title + " " + description).lower()
                if any(word in combined_text for word in ['fitness', 'workout', 'gym', 'training', 'exercise']):
                    tags.append("Fitness")
                if any(word in combined_text for word in ['morning', 'routine', 'am']):
                    tags.append("Morning Routine")
                if any(word in combined_text for word in ['grind', 'discipline', 'consistency', 'hustle']):
                    tags.append("Discipline")
                if any(word in combined_text for word in ['mindset', 'mental', 'focus', 'motivation']):
                    tags.append("Mindset")
                if any(word in combined_text for word in ['progress', 'update', 'check']):
                    tags.append("Progress")
                
                # Check if video already exists
                existing = await db.videos.find_one({"youtubeId": video_id})
                
                # Create video document
                video_doc = {
                    "title": title,
                    "youtubeId": video_id,
                    "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                    "day": day_number,
                    "date": date_str,
                    "reflection": reflection,  # Full YouTube description!
                    "tags": tags,
                    "excerpt": excerpt,
                    "updatedAt": datetime.utcnow()
                }
                
                if existing:
                    # Update existing video with new description
                    await db.videos.update_one(
                        {"youtubeId": video_id},
                        {"$set": video_doc}
                    )
                    print(f"✅ Updated: Day {day_number} - {title[:60]}")
                    updated_count += 1
                else:
                    # Insert new video
                    video_doc["createdAt"] = datetime.utcnow()
                    await db.videos.insert_one(video_doc)
                    print(f"✅ Imported: Day {day_number} - {title[:60]}")
                    imported_count += 1
                
            except Exception as e:
                print(f"❌ Error processing video: {str(e)}")
                continue
        
        print(f"\n🎉 Sync Complete!")
        print(f"✅ New videos imported: {imported_count}")
        print(f"🔄 Existing videos updated: {updated_count}")
        print(f"📊 Total videos in playlist: {len(detailed_videos)}")
        
        client.close()
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout: Playlist fetch took too long")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(import_playlist_with_descriptions())
