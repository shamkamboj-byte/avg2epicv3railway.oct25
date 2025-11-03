from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from database import db
import hashlib
import secrets
from datetime import datetime

router = APIRouter(prefix="/api/db", tags=["database-api"])

# API Keys for authentication (in production, store these securely)
API_KEYS = {
    "average2epic_admin": {
        "key": hashlib.sha256("Average2Epic_API_Key_2025!".encode()).hexdigest(),
        "permissions": ["read", "write", "delete"],
        "description": "Full access to database"
    },
    "average2epic_readonly": {
        "key": hashlib.sha256("Average2Epic_ReadOnly_2025!".encode()).hexdigest(),
        "permissions": ["read"],
        "description": "Read-only access"
    }
}

# Models
class QueryRequest(BaseModel):
    collection: str
    filter: Dict[str, Any] = {}
    projection: Optional[Dict[str, Any]] = None
    limit: int = 100
    skip: int = 0
    sort: Optional[Dict[str, int]] = None

class InsertRequest(BaseModel):
    collection: str
    document: Dict[str, Any]

class UpdateRequest(BaseModel):
    collection: str
    filter: Dict[str, Any]
    update: Dict[str, Any]

class DeleteRequest(BaseModel):
    collection: str
    filter: Dict[str, Any]

class AggregateRequest(BaseModel):
    collection: str
    pipeline: List[Dict[str, Any]]

class ConnectionInfo(BaseModel):
    mongo_url: str
    database: str
    collections: List[str]

# Authentication
def verify_api_key(x_api_key: str = Header(...), x_api_user: str = Header(...)):
    """Verify API key authentication"""
    if x_api_user not in API_KEYS:
        raise HTTPException(status_code=401, detail="Invalid API user")
    
    provided_key = x_api_key
    expected_key = API_KEYS[x_api_user]["key"]
    
    if provided_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return {
        "user": x_api_user,
        "permissions": API_KEYS[x_api_user]["permissions"]
    }

def check_permission(auth: dict, required_permission: str):
    """Check if user has required permission"""
    if required_permission not in auth["permissions"]:
        raise HTTPException(
            status_code=403, 
            detail=f"Permission denied. Required: {required_permission}"
        )

# Endpoints

@router.get("/info")
async def get_connection_info(auth: dict = Depends(verify_api_key)):
    """Get MongoDB connection information"""
    try:
        # Get list of collections
        collections = await db.list_collection_names()
        
        return {
            "success": True,
            "database": db.name,
            "collections": collections,
            "connection_type": "Authenticated API Access",
            "user": auth["user"],
            "permissions": auth["permissions"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_collection(
    request: QueryRequest,
    auth: dict = Depends(verify_api_key)
):
    """Query documents from a collection"""
    check_permission(auth, "read")
    
    try:
        collection = db[request.collection]
        
        # Build query
        cursor = collection.find(request.filter, request.projection)
        
        if request.sort:
            cursor = cursor.sort(list(request.sort.items()))
        
        cursor = cursor.skip(request.skip).limit(request.limit)
        
        # Execute query
        documents = await cursor.to_list(length=request.limit)
        
        # Convert ObjectId to string
        for doc in documents:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "collection": request.collection,
            "count": len(documents),
            "documents": documents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/count")
async def count_documents(
    request: QueryRequest,
    auth: dict = Depends(verify_api_key)
):
    """Count documents in a collection"""
    check_permission(auth, "read")
    
    try:
        collection = db[request.collection]
        count = await collection.count_documents(request.filter)
        
        return {
            "success": True,
            "collection": request.collection,
            "count": count,
            "filter": request.filter
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/insert")
async def insert_document(
    request: InsertRequest,
    auth: dict = Depends(verify_api_key)
):
    """Insert a document into collection"""
    check_permission(auth, "write")
    
    try:
        collection = db[request.collection]
        
        # Add timestamp
        request.document["createdAt"] = datetime.utcnow()
        
        result = await collection.insert_one(request.document)
        
        return {
            "success": True,
            "collection": request.collection,
            "inserted_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update")
async def update_document(
    request: UpdateRequest,
    auth: dict = Depends(verify_api_key)
):
    """Update documents in collection"""
    check_permission(auth, "write")
    
    try:
        collection = db[request.collection]
        
        # Add update timestamp
        if "$set" in request.update:
            request.update["$set"]["updatedAt"] = datetime.utcnow()
        else:
            request.update["$set"] = {"updatedAt": datetime.utcnow()}
        
        result = await collection.update_many(request.filter, request.update)
        
        return {
            "success": True,
            "collection": request.collection,
            "matched_count": result.matched_count,
            "modified_count": result.modified_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete")
async def delete_document(
    request: DeleteRequest,
    auth: dict = Depends(verify_api_key)
):
    """Delete documents from collection"""
    check_permission(auth, "delete")
    
    try:
        collection = db[request.collection]
        result = await collection.delete_many(request.filter)
        
        return {
            "success": True,
            "collection": request.collection,
            "deleted_count": result.deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/aggregate")
async def aggregate_collection(
    request: AggregateRequest,
    auth: dict = Depends(verify_api_key)
):
    """Run aggregation pipeline on collection"""
    check_permission(auth, "read")
    
    try:
        collection = db[request.collection]
        cursor = collection.aggregate(request.pipeline)
        results = await cursor.to_list(length=1000)
        
        # Convert ObjectId to string
        for doc in results:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "collection": request.collection,
            "count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/collections")
async def list_collections(auth: dict = Depends(verify_api_key)):
    """List all collections in database"""
    check_permission(auth, "read")
    
    try:
        collections = await db.list_collection_names()
        
        # Get stats for each collection
        collection_stats = []
        for coll_name in collections:
            count = await db[coll_name].count_documents({})
            collection_stats.append({
                "name": coll_name,
                "document_count": count
            })
        
        return {
            "success": True,
            "database": db.name,
            "collections": collection_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_database_stats(auth: dict = Depends(verify_api_key)):
    """Get database statistics"""
    check_permission(auth, "read")
    
    try:
        collections = await db.list_collection_names()
        
        stats = {
            "database": db.name,
            "total_collections": len(collections),
            "collections": {}
        }
        
        for coll_name in collections:
            count = await db[coll_name].count_documents({})
            stats["collections"][coll_name] = {
                "document_count": count
            }
        
        return {
            "success": True,
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
