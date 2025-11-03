from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Admin(BaseModel):
    id: Optional[str] = None
    username: str
    password: str
    createdAt: Optional[datetime] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    token: str
    username: str
