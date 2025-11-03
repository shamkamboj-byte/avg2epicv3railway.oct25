from fastapi import APIRouter, HTTPException
from models.contact import Contact, ContactCreate
from datetime import datetime
from database import db

router = APIRouter(prefix="/api/contact", tags=["contact"])

@router.post("", response_model=dict)
async def create_contact(contact: ContactCreate):
    try:
        contact_dict = contact.dict()
        contact_dict["status"] = "new"
        contact_dict["createdAt"] = datetime.utcnow()
        
        result = await db.contacts.insert_one(contact_dict)
        
        return {
            "success": True,
            "message": "Message received successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=list)
async def get_contacts():
    try:
        cursor = db.contacts.find().sort("createdAt", -1)
        contacts = await cursor.to_list(length=100)
        
        for contact in contacts:
            contact["id"] = str(contact["_id"])
            del contact["_id"]
        
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
