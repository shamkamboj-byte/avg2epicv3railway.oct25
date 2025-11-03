import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from utils.auth import hash_password
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_admin():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if admin already exists
    existing = await db.admins.find_one({"username": "admin"})
    
    if existing:
        print("Admin user already exists")
    else:
        # Create admin user
        admin = {
            "username": "admin",
            "password": hash_password("epic2025")
        }
        await db.admins.insert_one(admin)
        print("Admin user created successfully!")
        print("Username: admin")
        print("Password: epic2025")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
