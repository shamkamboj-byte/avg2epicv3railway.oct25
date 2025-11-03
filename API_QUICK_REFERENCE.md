# 🔑 Average2Epic MongoDB API - Quick Reference

## **API Credentials**

```
Base URL: https://average2epic.com/api/db
          (or http://localhost:8001/api/db for dev)

Admin Access:
  X-API-User: average2epic_admin
  X-API-Key: [SHA256 hash of: Average2Epic_API_Key_2025!]
  
  Plain text key (use this): Average2Epic_API_Key_2025!
  Hashed key: 8e8c8e8d4f8f4e8b8c8d8f8e8c8d8f8e8c8d8f...
```

## **Authentication Headers**

Every request must include:
```
X-API-User: average2epic_admin
X-API-Key: Average2Epic_API_Key_2025!
Content-Type: application/json
```

## **Test Commands**

### Get Database Info:
```bash
curl -X GET "http://localhost:8001/api/db/info" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: $(echo -n 'Average2Epic_API_Key_2025!' | sha256sum | cut -d' ' -f1)"
```

### Get All Videos:
```bash
curl -X POST "http://localhost:8001/api/db/query" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: $(echo -n 'Average2Epic_API_Key_2025!' | sha256sum | cut -d' ' -f1)" \
  -H "Content-Type: application/json" \
  -d '{"collection": "videos", "filter": {}, "limit": 10}'
```

### Get Day 56:
```bash
curl -X POST "http://localhost:8001/api/db/query" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: $(echo -n 'Average2Epic_API_Key_2025!' | sha256sum | cut -d' ' -f1)" \
  -H "Content-Type: application/json" \
  -d '{"collection": "videos", "filter": {"day": 56}, "limit": 1}'
```

### Count All Videos:
```bash
curl -X POST "http://localhost:8001/api/db/count" \
  -H "X-API-User: average2epic_admin" \
  -H "X-API-Key: $(echo -n 'Average2Epic_API_Key_2025!' | sha256sum | cut -d' ' -f1)" \
  -H "Content-Type: application/json" \
  -d '{"collection": "videos", "filter": {}}'
```

## **Python Quick Start**

```python
import requests
import hashlib

API_KEY = "Average2Epic_API_Key_2025!"
API_KEY_HASH = hashlib.sha256(API_KEY.encode()).hexdigest()

BASE_URL = "http://localhost:8001/api/db"
HEADERS = {
    "X-API-User": "average2epic_admin",
    "X-API-Key": API_KEY_HASH,
    "Content-Type": "application/json"
}

# Get all videos
response = requests.post(
    f"{BASE_URL}/query",
    headers=HEADERS,
    json={"collection": "videos", "filter": {}, "limit": 10}
)
print(response.json())
```

## **Collections Available**

- `videos` - All your journey videos (46 documents)
- `admins` - Admin users for login
- `contacts` - Contact form submissions (if any)

## **Operations Available**

- `GET  /api/db/info` - Connection info
- `POST /api/db/query` - Query documents
- `POST /api/db/count` - Count documents
- `POST /api/db/insert` - Insert document
- `POST /api/db/update` - Update documents
- `POST /api/db/delete` - Delete documents
- `POST /api/db/aggregate` - Run aggregations
- `GET  /api/db/collections` - List collections
- `GET  /api/db/stats` - Database statistics

## **Common Queries**

### Videos by tag:
```json
{"collection": "videos", "filter": {"tags": "Fitness"}}
```

### Videos in range:
```json
{"collection": "videos", "filter": {"day": {"$gte": 50, "$lte": 60}}}
```

### Recent videos:
```json
{"collection": "videos", "filter": {}, "sort": {"day": -1}, "limit": 5}
```

### Videos by level:
```json
{"collection": "videos", "filter": {"day": {"$gte": 49, "$lte": 60}}}
```

---

**Full Documentation:** `/app/DATABASE_API_DOCUMENTATION.md`
