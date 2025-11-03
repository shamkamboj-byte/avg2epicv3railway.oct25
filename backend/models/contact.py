from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class Contact(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    area: str
    message: str
    status: str = "new"
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    area: str
    message: str
