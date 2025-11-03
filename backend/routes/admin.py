from fastapi import APIRouter, HTTPException, Depends
from models.admin import Admin, AdminLogin, AdminToken
from utils.auth import hash_password, verify_password, create_access_token, verify_token
from datetime import datetime
from database import db

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/login", response_model=dict)
async def login(credentials: AdminLogin):
    try:
        # Find admin user
        admin = await db.admins.find_one({"username": credentials.username})
        
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Verify password
        if not verify_password(credentials.password, admin["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Create access token
        access_token = create_access_token(data={"sub": admin["username"]})
        
        return {
            "success": True,
            "token": access_token,
            "user": {
                "username": admin["username"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify", response_model=dict)
async def verify(current_user: dict = Depends(verify_token)):
    return {
        "valid": True,
        "user": current_user
    }

@router.post("/create", response_model=dict)
async def create_admin(admin: AdminLogin):
    """Create initial admin user - should be disabled in production"""
    try:
        # Check if admin already exists
        existing = await db.admins.find_one({"username": admin.username})
        if existing:
            raise HTTPException(status_code=400, detail="Admin already exists")
        
        # Hash password
        hashed_password = hash_password(admin.password)
        
        admin_dict = {
            "username": admin.username,
            "password": hashed_password,
            "createdAt": datetime.utcnow()
        }
        
        result = await db.admins.insert_one(admin_dict)
        
        return {
            "success": True,
            "message": "Admin created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
