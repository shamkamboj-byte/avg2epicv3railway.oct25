# 🚂 Railway.app Deployment Guide for Average2Epic

## Overview
This guide will help you deploy the Average2Epic full-stack application to Railway.app.

**Tech Stack:**
- Backend: FastAPI (Python)
- Frontend: React
- Database: MongoDB

---

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Credit Card** (for Railway): Railway offers $5/month free credits, then pay-as-you-go

---

## Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub

```bash
# Initialize git if not already done
cd /app
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Railway deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/average2epic.git
git branch -M main
git push -u origin main
```

### 1.2 Create .gitignore (if not exists)

Ensure these are ignored:
```
node_modules/
__pycache__/
*.pyc
.env
build/
dist/
.cache/
```

---

## Step 2: Railway Project Setup

### 2.1 Create New Project

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `average2epic` repository
5. Railway will detect it as a monorepo

### 2.2 Create Three Services

You need to create 3 separate services:

#### Service 1: MongoDB Database
1. Click **"+ New"** → **"Database"** → **"Add MongoDB"**
2. Railway will automatically provision MongoDB
3. Note the connection string from Variables tab

#### Service 2: Backend (FastAPI)
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Name it: `backend`
3. In **Settings**:
   - **Root Directory**: `/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Click **"Deploy"**

#### Service 3: Frontend (React)
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo again
2. Name it: `frontend`
3. In **Settings**:
   - **Root Directory**: `/frontend`
   - **Build Command**: `yarn install && yarn build`
   - **Start Command**: `npx serve -s build -l $PORT`
   - Add build dependency: `yarn add -D serve`
4. Click **"Deploy"**

---

## Step 3: Environment Variables

### 3.1 Backend Environment Variables

Go to Backend service → **Variables** tab → Add these:

```bash
# MongoDB Connection (copy from MongoDB service)
MONGO_URL=mongodb://mongo:PASSWORD@mongorailway.proxy.rlwy.net:PORT/railway

# Database Name
DB_NAME=average2epic

# JWT Secret
JWT_SECRET=average2epic_jwt_secret_key_2025_change_in_production

# CORS Origins (use frontend Railway URL)
CORS_ORIGINS=https://your-frontend.railway.app
```

**To get MONGO_URL:**
1. Go to MongoDB service
2. Click **"Variables"** tab
3. Copy the `MONGO_URL` value (starts with `mongodb://`)
4. Paste it in backend variables

### 3.2 Frontend Environment Variables

Go to Frontend service → **Variables** tab → Add:

```bash
# Backend API URL (use backend Railway URL)
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

**To get backend URL:**
1. Go to Backend service
2. Click **"Settings"** tab
3. Under **"Domains"**, copy the Railway-provided URL
4. Use that URL for `REACT_APP_BACKEND_URL`

---

## Step 4: Configure Services

### 4.1 Backend Configuration

**Generate Domain:**
1. Go to Backend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. You'll get: `https://your-backend.railway.app`
4. Copy this URL

**Update Frontend .env:**
1. Go to Frontend service → **Variables**
2. Update `REACT_APP_BACKEND_URL` with backend URL
3. Redeploy frontend

### 4.2 Frontend Configuration

**Generate Domain:**
1. Go to Frontend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. You'll get: `https://your-frontend.railway.app`
4. This is your public URL!

**Update Backend CORS:**
1. Go to Backend service → **Variables**
2. Update `CORS_ORIGINS` with frontend URL
3. Redeploy backend

---

## Step 5: Initialize Database

### 5.1 Create Admin User

1. Go to Backend service → **Deployments** tab
2. Click on latest deployment
3. Open **"Terminal"** or **"Logs"**
4. Run:

```bash
python init_admin.py
```

Or use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run command in backend service
railway run --service backend python init_admin.py
```

### 5.2 Import YouTube Videos

```bash
railway run --service backend python import_playlist_ytdlp.py
```

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Frontend

1. Go to Frontend service → **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Enter your domain: `average2epic.com`
4. Railway will show DNS records

### 6.2 Configure DNS

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: @
Value: your-frontend.railway.app
```

**Option B: A Record**
```
Type: A
Name: @
Value: [Railway IP address shown]
```

### 6.3 Update Environment Variables

After domain is active:

1. Update Backend CORS:
   ```
   CORS_ORIGINS=https://average2epic.com
   ```

2. Frontend should automatically work with custom domain

---

## Step 7: Verify Deployment

### 7.1 Check All Services Running

1. **MongoDB**: Should show "Healthy" status
2. **Backend**: Should show "Deployed" with green indicator
3. **Frontend**: Should show "Deployed" with green indicator

### 7.2 Test the Application

1. Open your frontend URL (or custom domain)
2. Check home page loads
3. Navigate to `/videos` - should show video cards
4. Click a video - should show "The Extra Byte" section
5. Try admin login: `/admin/login` (admin / epic2025)

### 7.3 Check Backend API

Visit: `https://your-backend.railway.app/api/videos`

Should return JSON with video data.

---

## Step 8: Cost Estimation

**Railway Pricing:**
- $5/month free credits (includes hobby plan)
- After free credits:
  - Backend: ~$5-10/month (depends on traffic)
  - Frontend: ~$5/month
  - MongoDB: ~$5-10/month
  - **Total**: ~$15-25/month

**Tips to reduce costs:**
- Use Railway sleep mode for low-traffic apps
- Optimize MongoDB queries
- Enable caching

---

## Troubleshooting

### Issue 1: Backend Won't Start

**Check logs:**
```bash
railway logs --service backend
```

**Common fixes:**
- Ensure `MONGO_URL` is correct
- Check all dependencies in `requirements.txt`
- Verify `PORT` environment variable exists (Railway auto-adds it)

### Issue 2: Frontend Shows 404

**Check build output:**
```bash
railway logs --service frontend
```

**Common fixes:**
- Ensure `build/` folder was created
- Check `serve` package is installed
- Verify start command: `npx serve -s build -l $PORT`

### Issue 3: CORS Errors

**Fix:**
1. Go to Backend → Variables
2. Update `CORS_ORIGINS` to match frontend URL exactly
3. Redeploy backend

### Issue 4: MongoDB Connection Failed

**Fix:**
1. Go to MongoDB service → Variables
2. Copy the full `MONGO_URL` value
3. Paste it in Backend variables
4. Ensure it includes authentication: `mongodb://user:pass@host:port/db`

### Issue 5: Environment Variables Not Loading

**Frontend:**
- Railway requires rebuild to pick up new env vars
- Go to Frontend → click **"Redeploy"**

**Backend:**
- Railway should auto-restart
- If not, manually restart from **Deployments** tab

---

## Advanced Configuration

### Enable GitHub Auto-Deploy

1. Go to Service → **Settings** → **Source**
2. Enable **"Watch Paths"**
3. Set paths:
   - Backend: `backend/**`
   - Frontend: `frontend/**`
4. Now pushing to GitHub auto-deploys!

### Add Health Checks

**Backend:**
```python
# Add to server.py
@app.get("/health")
async def health():
    return {"status": "healthy"}
```

**Railway Health Check:**
1. Go to Backend → **Settings** → **Health Check**
2. Set path: `/health`
3. Enable health checks

### Set Up Monitoring

1. Go to Service → **Metrics** tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

---

## Post-Deployment Checklist

- [ ] All 3 services deployed successfully
- [ ] MongoDB connection working
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] Admin login works
- [ ] Videos displaying with "The Extra Byte"
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set correctly
- [ ] GitHub auto-deploy enabled
- [ ] Health checks configured

---

## Useful Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs --service backend
railway logs --service frontend

# Open service in browser
railway open

# Run command in service
railway run --service backend python import_playlist_ytdlp.py

# Deploy manually
railway up
```

---

## Support

**Railway Support:**
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app
- Status: https://status.railway.app

**Your Application:**
- Preview: Check Railway deployment URLs
- Custom Domain: https://average2epic.com (after DNS setup)

---

## Summary

✅ Railway.app is perfect for this full-stack project
✅ Automatic HTTPS & SSL certificates
✅ Easy scaling and monitoring
✅ GitHub integration for auto-deploy
✅ Affordable pricing with free tier

**Next Steps:**
1. Push code to GitHub
2. Create Railway project
3. Set up 3 services (MongoDB, Backend, Frontend)
4. Configure environment variables
5. Deploy and test!

Good luck with your deployment! 🚀
