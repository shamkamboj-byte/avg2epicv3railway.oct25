# MongoDB Web API Documentation
## External Database Access for Average2Epic

---

## 🔐 **Authentication Credentials**

### **Admin Access (Full Permissions)**
```
API User: average2epic_admin
API Key: Average2Epic_API_Key_2025!
Permissions: read, write, delete
```

### **Read-Only Access**
```
API User: average2epic_readonly
API Key: Average2Epic_ReadOnly_2025!
Permissions: read
```

---

## 🌐 **API Base URL**

### **Current (Development):**
```
http://localhost:8001/api/db
```

### **After Deployment:**
```
https://average2epic.com/api/db
```

---

## 📡 **All Available Endpoints**

### **1. Get Connection Info**
```http
GET /api/db/info
```

**Headers:**
```
X-API-User: average2epic_admin
X-API-Key: Average2Epic_API_Key_2025!
```

**Response:**
```json
{
  "success": true,
  "database": "test_database",
  "collections": ["videos", "contacts", "admins"],
  "connection_type": "Authenticated API Access",
  "user": "average2epic_admin",
  "permissions": ["read", "write", "delete"]
}
```

---

### **2. Query Documents**
```http
POST /api/db/query
```

**Headers:**
```
X-API-User: average2epic_admin
X-API-Key: Average2Epic_API_Key_2025!
Content-Type: application/json
```

**Body:**
```json
{
  "collection": "videos",
  "filter": {"day": 56},
  "projection": {"title": 1, "day": 1, "tags": 1},
  "limit": 10,
  "skip": 0,
  "sort": {"day": -1}
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "count": 1,
  "documents": [
    {
      "_id": "671734abc...",
      "title": "Day 56 | 8 Days Straight",
      "day": 56,
      "tags": ["Average2Epic", "Day 56", "Transformation"]
    }
  ]
}
```

---

### **3. Count Documents**
```http
POST /api/db/count
```

**Body:**
```json
{
  "collection": "videos",
  "filter": {"tags": "Fitness"}
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "count": 15,
  "filter": {"tags": "Fitness"}
}
```

---

### **4. Insert Document**
```http
POST /api/db/insert
```

**Body:**
```json
{
  "collection": "videos",
  "document": {
    "title": "Day 57 | New Video",
    "youtubeId": "abc123",
    "day": 57,
    "tags": ["Average2Epic", "Day 57"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "inserted_id": "671734abc..."
}
```

---

### **5. Update Documents**
```http
POST /api/db/update
```

**Body:**
```json
{
  "collection": "videos",
  "filter": {"day": 56},
  "update": {
    "$set": {
      "reflection": "Updated reflection text"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "matched_count": 1,
  "modified_count": 1
}
```

---

### **6. Delete Documents**
```http
POST /api/db/delete
```

**Body:**
```json
{
  "collection": "videos",
  "filter": {"day": 999}
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "deleted_count": 1
}
```

---

### **7. Aggregate (Advanced Queries)**
```http
POST /api/db/aggregate
```

**Body:**
```json
{
  "collection": "videos",
  "pipeline": [
    {"$match": {"tags": "Fitness"}},
    {"$group": {
      "_id": "$tags",
      "count": {"$sum": 1}
    }},
    {"$sort": {"count": -1}}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "collection": "videos",
  "count": 5,
  "results": [...]
}
```

---

### **8. List Collections**
```http
GET /api/db/collections
```

**Response:**
```json
{
  "success": true,
  "database": "test_database",
  "collections": [
    {"name": "videos", "document_count": 46},
    {"name": "contacts", "document_count": 5},
    {"name": "admins", "document_count": 1}
  ]
}
```

---

### **9. Database Statistics**
```http
GET /api/db/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "database": "test_database",
    "total_collections": 3,
    "collections": {
      "videos": {"document_count": 46},
      "contacts": {"document_count": 5},
      "admins": {"document_count": 1}
    }
  }
}
```

---

## 💻 **Usage Examples**

### **Using cURL:**

#### Get all videos:
```bash
curl -X POST "http://localhost:8001/api/db/query" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "videos",
    "filter": {},
    "limit": 10,
    "sort": {"day": -1}
  }'
```

#### Get database info:
```bash
curl -X GET "http://localhost:8001/api/db/info" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!"
```

#### Count videos by tag:
```bash
curl -X POST "http://localhost:8001/api/db/count" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "videos",
    "filter": {"tags": "Fitness"}
  }'
```

---

### **Using Python:**

```python
import requests

# Configuration
BASE_URL = "http://localhost:8001/api/db"
HEADERS = {
    "X-API-User": "average2epic_admin",
    "X-API-Key": "Average2Epic_API_Key_2025!",
    "Content-Type": "application/json"
}

# Get database info
response = requests.get(f"{BASE_URL}/info", headers=HEADERS)
print(response.json())

# Query videos
query_data = {
    "collection": "videos",
    "filter": {"day": 56},
    "limit": 10
}
response = requests.post(f"{BASE_URL}/query", headers=HEADERS, json=query_data)
videos = response.json()["documents"]
print(f"Found {len(videos)} videos")

# Count all videos
count_data = {
    "collection": "videos",
    "filter": {}
}
response = requests.post(f"{BASE_URL}/count", headers=HEADERS, json=count_data)
print(f"Total videos: {response.json()['count']}")

# Get collections
response = requests.get(f"{BASE_URL}/collections", headers=HEADERS)
collections = response.json()["collections"]
for coll in collections:
    print(f"{coll['name']}: {coll['document_count']} documents")
```

---

### **Using JavaScript (Node.js):**

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8001/api/db';
const headers = {
  'X-API-User': 'average2epic_admin',
  'X-API-Key': 'Average2Epic_API_Key_2025!',
  'Content-Type': 'application/json'
};

// Get database info
async function getInfo() {
  const response = await axios.get(`${BASE_URL}/info`, { headers });
  console.log(response.data);
}

// Query videos
async function queryVideos() {
  const response = await axios.post(`${BASE_URL}/query`, {
    collection: 'videos',
    filter: { day: 56 },
    limit: 10
  }, { headers });
  
  console.log('Videos:', response.data.documents);
}

// Count videos
async function countVideos() {
  const response = await axios.post(`${BASE_URL}/count`, {
    collection: 'videos',
    filter: {}
  }, { headers });
  
  console.log('Total videos:', response.data.count);
}

// Run
getInfo();
queryVideos();
countVideos();
```

---

### **Using Postman:**

1. **Create New Request**
2. **Set Method:** POST
3. **Set URL:** `http://localhost:8001/api/db/query`
4. **Headers Tab:**
   - Add `X-API-User`: `average2epic_admin`
   - Add `X-API-Key`: `Average2Epic_API_Key_2025!`
   - Add `Content-Type`: `application/json`
5. **Body Tab:**
   - Select `raw` and `JSON`
   - Add query:
   ```json
   {
     "collection": "videos",
     "filter": {},
     "limit": 10
   }
   ```
6. **Click Send**

---

## 🔒 **Security Features**

### **API Key Authentication:**
- Every request requires valid API user and key
- Keys are hashed for security
- Two access levels: admin (full) and readonly

### **Permission System:**
```
Admin User:
  ✅ read - Query and view data
  ✅ write - Insert and update data
  ✅ delete - Delete data

Read-Only User:
  ✅ read - Query and view data
  ❌ write - Cannot insert/update
  ❌ delete - Cannot delete
```

### **Rate Limiting (Recommended):**
```python
# Add to production for security
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@limiter.limit("100/minute")
@router.post("/query")
async def query_collection(...):
    ...
```

---

## 🌍 **Access from External Applications**

### **After Deployment on Emergent:**

Your API will be accessible at:
```
https://average2epic.com/api/db
```

### **From Any Application/Service:**

```python
# Mobile app, desktop app, another website, etc.
import requests

API_URL = "https://average2epic.com/api/db"
HEADERS = {
    "X-API-User": "average2epic_admin",
    "X-API-Key": "Average2Epic_API_Key_2025!"
}

# Get all videos
response = requests.post(
    f"{API_URL}/query",
    headers=HEADERS,
    json={
        "collection": "videos",
        "filter": {},
        "limit": 100
    }
)

videos = response.json()["documents"]
# Use videos in your application
```

---

## 📊 **Common Use Cases**

### **1. Get Latest Videos:**
```json
POST /api/db/query
{
  "collection": "videos",
  "filter": {},
  "sort": {"day": -1},
  "limit": 10
}
```

### **2. Search Videos by Tag:**
```json
POST /api/db/query
{
  "collection": "videos",
  "filter": {"tags": "Fitness"},
  "limit": 20
}
```

### **3. Get Specific Day:**
```json
POST /api/db/query
{
  "collection": "videos",
  "filter": {"day": 56},
  "limit": 1
}
```

### **4. Count Videos by Level:**
```json
POST /api/db/aggregate
{
  "collection": "videos",
  "pipeline": [
    {"$group": {
      "_id": {"$ceil": {"$divide": ["$day", 12]}},
      "count": {"$sum": 1}
    }},
    {"$sort": {"_id": 1}}
  ]
}
```

### **5. Get All Contact Form Submissions:**
```json
POST /api/db/query
{
  "collection": "contacts",
  "filter": {},
  "sort": {"createdAt": -1},
  "limit": 50
}
```

---

## 🔄 **MongoDB Operations Reference**

### **Supported MongoDB Queries:**

#### Comparison:
```json
{"day": 56}                    // Equals
{"day": {"$gt": 50}}          // Greater than
{"day": {"$gte": 50}}         // Greater than or equal
{"day": {"$lt": 60}}          // Less than
{"day": {"$lte": 60}}         // Less than or equal
{"day": {"$ne": 56}}          // Not equal
{"day": {"$in": [55, 56, 57]}} // In array
```

#### Logical:
```json
{"$and": [{"day": {"$gt": 50}}, {"day": {"$lt": 60}}]}
{"$or": [{"tags": "Fitness"}, {"tags": "Discipline"}]}
{"$not": {"day": 56}}
```

#### Array:
```json
{"tags": "Fitness"}           // Array contains
{"tags": {"$all": ["Fitness", "Discipline"]}}  // Contains all
{"tags": {"$size": 3}}        // Array size
```

#### Text:
```json
{"title": {"$regex": "Day 5", "$options": "i"}}  // Case-insensitive search
```

---

## 📖 **API Documentation**

### **Interactive Docs:**

After deployment, access interactive documentation at:
```
https://average2epic.com/docs
```

Or locally:
```
http://localhost:8001/docs
```

This provides:
- Try-it-now interface
- Automatic API testing
- Schema documentation
- Example requests/responses

---

## ⚠️ **Important Notes**

### **Security:**
1. **Change API keys in production!**
2. Never commit API keys to git
3. Use environment variables for keys
4. Enable HTTPS in production (automatic on Emergent)
5. Consider IP whitelisting for extra security

### **Best Practices:**
1. Use read-only access when possible
2. Limit query results with `limit` parameter
3. Use specific filters instead of fetching all documents
4. Monitor API usage
5. Implement rate limiting in production

### **Limitations:**
1. Max 100 documents per query by default
2. Aggregation pipelines limited to 1000 results
3. No file upload/download (use separate endpoints)
4. Complex transactions not supported in this API

---

## 🎯 **Quick Start**

### **Test Your API Now:**

```bash
# 1. Get database info
curl -X GET "http://localhost:8001/api/db/info" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!"

# 2. Get all videos
curl -X POST "http://localhost:8001/api/db/query" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!" \
  -H "Content-Type: application/json" \
  -d '{"collection": "videos", "filter": {}, "limit": 10}'

# 3. Get database stats
curl -X GET "http://localhost:8001/api/db/stats" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: Average2Epic_API_Key_2025!"
```

---

## 📞 **Support**

If you encounter issues:
1. Check API key is correct
2. Verify collection name exists
3. Check request body format
4. Review error messages in response
5. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`

---

**Your MongoDB is now accessible via Web API from anywhere on the internet!** 🌐
