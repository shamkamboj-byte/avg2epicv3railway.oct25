from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models.video import Video, VideoCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os
from utils.auth import verify_token
from database import db

router = APIRouter(prefix="/api/videos", tags=["videos"])

@router.get("", response_model=dict)
async def get_videos(
    page: int = 1,
    limit: int = 12,
    tag: Optional[str] = None
):
    try:
        skip = (page - 1) * limit
        
        # Build query
        query = {}
        if tag and tag != "All":
            query["tags"] = tag
        
        # Get total count
        total = await db.videos.count_documents(query)
        
        # Get videos
        cursor = db.videos.find(query).sort("day", -1).skip(skip).limit(limit)
        videos = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for video in videos:
            video["id"] = str(video["_id"])
            del video["_id"]
        
        total_pages = (total + limit - 1) // limit
        
        return {
            "videos": videos,
            "pagination": {
                "currentPage": page,
                "totalPages": total_pages,
                "totalVideos": total,
                "hasNext": page < total_pages,
                "hasPrev": page > 1
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{video_id}", response_model=Video)
async def get_video(video_id: str):
    try:
        from bson import ObjectId
        video = await db.videos.find_one({"_id": ObjectId(video_id)})
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        video["id"] = str(video["_id"])
        del video["_id"]
        return video
    except Exception as e:
        raise HTTPException(status_code=404, detail="Video not found")

@router.post("", response_model=Video)
async def create_video(
    video: VideoCreate,
    current_user: dict = Depends(verify_token)
):
    try:
        # Create excerpt from reflection
        excerpt = video.reflection[:80] + "..." if len(video.reflection) > 80 else video.reflection
        
        video_dict = video.dict()
        video_dict["excerpt"] = excerpt
        video_dict["createdAt"] = datetime.utcnow()
        video_dict["updatedAt"] = datetime.utcnow()
        
        result = await db.videos.insert_one(video_dict)
        
        created_video = await db.videos.find_one({"_id": result.inserted_id})
        created_video["id"] = str(created_video["_id"])
        del created_video["_id"]
        
        return created_video
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{video_id}")
async def delete_video(
    video_id: str,
    current_user: dict = Depends(verify_token)
):
    try:
        from bson import ObjectId
        result = await db.videos.delete_one({"_id": ObjectId(video_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Video not found")
        return {"success": True, "message": "Video deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{video_id}", response_model=Video)
async def update_video(
    video_id: str,
    video: VideoCreate,
    current_user: dict = Depends(verify_token)
):
    try:
        from bson import ObjectId
        
        # Create excerpt from reflection
        excerpt = video.reflection[:80] + "..." if len(video.reflection) > 80 else video.reflection
        
        video_dict = video.dict()
        video_dict["excerpt"] = excerpt
        video_dict["updatedAt"] = datetime.utcnow()
        
        result = await db.videos.update_one(
            {"_id": ObjectId(video_id)},
            {"$set": video_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Video not found")
        
        updated_video = await db.videos.find_one({"_id": ObjectId(video_id)})
        updated_video["id"] = str(updated_video["_id"])
        del updated_video["_id"]
        
        return updated_video
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tags/all", response_model=List[str])
async def get_all_tags():
    try:
        # Get all unique tags
        tags = await db.videos.distinct("tags")
        return ["All"] + sorted(tags)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
