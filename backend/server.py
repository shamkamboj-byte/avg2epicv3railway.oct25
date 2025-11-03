from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routes
from routes import videos, contact, admin
from routes import db_api
from database import client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix for basic routes
api_router = APIRouter(prefix="/api")

# Add your basic routes
@api_router.get("/")
async def root():
    return {"message": "Average2Epic API"}

# Include the router in the main app
app.include_router(api_router)

# Include feature routers (they already have /api prefix)
app.include_router(videos.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(db_api.router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()