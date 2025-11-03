from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Video(BaseModel):
    id: Optional[str] = None
    title: str
    youtubeId: str
    embedUrl: str
    day: int
    date: str
    reflection: str
    tags: List[str]
    excerpt: Optional[str] = None
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

class VideoCreate(BaseModel):
    title: str
    youtubeId: str
    embedUrl: str
    day: int
    date: str
    reflection: str
    tags: List[str]
