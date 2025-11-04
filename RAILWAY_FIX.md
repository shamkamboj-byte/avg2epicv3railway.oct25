# 🔧 Railway Deployment Error Fix

## Problem
**Error:** "Nixpacks was unable to generate a build plan for this app"

**Cause:** Railway detected a monorepo (both frontend & backend) and doesn't know which to build.

---

## Solution: Deploy Services Separately

You need to create **2 separate services** in Railway, not 1.

---

## Step-by-Step Fix

### 1. Delete Current Failed Service
1. Go to your Railway project
2. Click on the failed service
3. Settings → "Delete Service"

### 2. Create Backend Service

**Option A: From Railway Dashboard**
1. Click "+ New" → "GitHub Repo" → Select your repo
2. **IMPORTANT:** Click "Configure"
3. Set **Root Directory**: `backend`
4. Click "Deploy"

**Option B: Using railway.toml in /backend**
The `backend/railway.toml` file already exists with:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn server:app --host 0.0.0.0 --port $PORT"
```

**Add Environment Variables:**
- Go to Variables tab
- Add:
  ```
  MONGO_URL=<from MongoDB service>
  DB_NAME=average2epic
  JWT_SECRET=your_secret_here
  CORS_ORIGINS=*
  ```

### 3. Create Frontend Service

1. Click "+ New" → "GitHub Repo" → Select your repo AGAIN
2. **IMPORTANT:** Click "Configure"
3. Set **Root Directory**: `frontend`
4. Click "Deploy"

**Add Environment Variables:**
- Go to Variables tab
- Add:
  ```
  REACT_APP_BACKEND_URL=<backend Railway URL>
  ```

### 4. Create MongoDB Service

1. Click "+ New" → "Database" → "MongoDB"
2. Copy the `MONGO_URL` from Variables tab
3. Use this in Backend service variables

---

## Alternative: Single Service with Custom Nixpacks Config

If you want to deploy as a single service, create `nixpacks.toml` at root:

```toml
[phases.setup]
nixPkgs = ['python310', 'nodejs-18_x']

[phases.install]
cmds = [
  'cd backend && pip install -r requirements.txt'
]

[start]
cmd = 'cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT'
```

Then deploy frontend separately as static site.

---

## Recommended Approach

✅ **Deploy 3 separate services:**
1. **Backend** (root: `backend/`)
2. **Frontend** (root: `frontend/`)
3. **MongoDB** (database)

This gives you:
- Independent scaling
- Separate logs
- Better resource management
- Clearer monitoring

---

## After Deployment

1. Get backend URL from Backend service
2. Update `REACT_APP_BACKEND_URL` in Frontend variables
3. Redeploy Frontend
4. Get frontend URL and update `CORS_ORIGINS` in Backend
5. Redeploy Backend

---

## Still Getting Errors?

Check logs:
```bash
railway logs --service backend
railway logs --service frontend
```

Common issues:
- Missing `requirements.txt` in backend
- Missing `package.json` in frontend
- Wrong root directory set
- Missing environment variables
