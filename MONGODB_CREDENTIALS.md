# Average2Epic - MongoDB Authentication Credentials

## 🔐 MongoDB Users Created

### 1. Admin User (Full Access)
```
Username: admin
Password: Average2Epic_Admin_2025!
Database: admin
Roles: 
  - userAdminAnyDatabase
  - readWriteAnyDatabase
```

**Connection String:**
```
mongodb://admin:Average2Epic_Admin_2025!@localhost:27017/admin
```

**Use Case:** Full database administration, creating users, managing all databases

---

### 2. Application User (App Access)
```
Username: average2epic_app
Password: Average2Epic_App_2025!
Database: test_database
Roles:
  - readWrite on test_database
```

**Connection String (Used by Backend):**
```
mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database
```

**Use Case:** Your Average2Epic application uses this to connect to MongoDB

---

## 📝 Current Configuration

### Backend .env File Location:
```
/app/backend/.env
```

### Current Connection String:
```
MONGO_URL="mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database"
DB_NAME="test_database"
JWT_SECRET="average2epic_jwt_secret_key_2025_change_in_production"
```

---

## 🔧 How to Use These Credentials

### Connect via mongosh (Admin):
```bash
mongosh "mongodb://admin:Average2Epic_Admin_2025!@localhost:27017/admin"
```

### Connect via mongosh (App User):
```bash
mongosh "mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database"
```

### Python Connection (FastAPI):
```python
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = "mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database"
client = AsyncIOMotorClient(mongo_url)
db = client["test_database"]
```

### MongoDB Compass (GUI Tool):
```
Connection String:
mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database
```

---

## 🚀 For Deployment

### On Emergent:
```
Emergent will create its own MongoDB instance with auto-generated credentials.
You don't need these credentials on Emergent deployment.
```

### On Your Own Linux Server:
```bash
# 1. Install MongoDB
sudo apt install mongodb-org

# 2. Start MongoDB without auth
sudo systemctl start mongod

# 3. Create users (use the same commands that created these users)
mongosh admin --eval '
db.createUser({
  user: "admin",
  pwd: "Average2Epic_Admin_2025!",
  roles: [ 
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
'

mongosh test_database --eval '
db.createUser({
  user: "average2epic_app",
  pwd: "Average2Epic_App_2025!",
  roles: [ { role: "readWrite", db: "test_database" } ]
})
'

# 4. Enable authentication
sudo nano /etc/mongod.conf

# Add:
security:
  authorization: enabled

# 5. Restart MongoDB
sudo systemctl restart mongod

# 6. Update your .env file with the connection string
```

---

## 🔑 Important Security Notes

1. **Change passwords in production!** These are development credentials.

2. **Never commit .env to git**
   ```bash
   echo ".env" >> .gitignore
   ```

3. **Use environment variables** on production servers

4. **Rotate credentials** every 90 days for security

5. **Use different credentials** for each environment:
   - Development: Current credentials
   - Staging: Different credentials
   - Production: Strong, unique credentials

---

## 📊 Database Information

```
Database Name: test_database
Collections:
  - videos (46 documents)
  - contacts (contact form submissions)
  - admins (admin users for login)

Current Stats:
  - Total Videos: 46
  - Max Day: 56
  - Current Level: 5
```

---

## 🔄 Backup Commands

### Backup with Authentication:
```bash
mongodump --uri="mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database" --out=/backup/$(date +%Y%m%d)
```

### Restore with Authentication:
```bash
mongorestore --uri="mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database" /backup/20251022/test_database
```

---

## ✅ Verification

Your backend is already using these credentials and working perfectly!

Test API:
```bash
curl http://localhost:8001/api/videos?limit=1
```

Should return Day 56 video data.

---

## 📞 Support

If you have issues with MongoDB authentication:
1. Check MongoDB is running: `sudo supervisorctl status mongodb`
2. Check logs: `tail -f /var/log/mongodb/mongod.log`
3. Test connection: `mongosh "mongodb://average2epic_app:Average2Epic_App_2025!@localhost:27017/test_database?authSource=test_database"`

---

**KEEP THIS FILE SECURE! Contains sensitive credentials.**
