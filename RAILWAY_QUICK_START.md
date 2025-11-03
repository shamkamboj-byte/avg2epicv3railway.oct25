# 🚂 Railway.app Quick Start - Average2Epic

## 5-Minute Setup

### 1. Push to GitHub
```bash
cd /app
git init
git add .
git commit -m "Ready for Railway"
git remote add origin https://github.com/YOUR_USERNAME/average2epic.git
git push -u origin main
```

### 2. Create Railway Project
- Go to [railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub"
- Select your repo

### 3. Add Services

**MongoDB:**
- Click "+ New" → "Database" → "MongoDB"
- Copy the `MONGO_URL` from Variables tab

**Backend:**
- Click "+ New" → "GitHub Repo" → Select repo
- Settings:
  - Root Directory: `backend`
  - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Variables:
  ```
  MONGO_URL=<paste from MongoDB service>
  DB_NAME=average2epic
  JWT_SECRET=your_secret_key
  CORS_ORIGINS=*
  ```
- Generate Domain → Copy URL

**Frontend:**
- Click "+ New" → "GitHub Repo" → Select repo again  
- Settings:
  - Root Directory: `frontend`
  - Build Command: `yarn install && yarn build`
  - Start Command: `npx serve -s build -l $PORT`
- Variables:
  ```
  REACT_APP_BACKEND_URL=<paste backend URL>
  ```
- Generate Domain → Your app is live! 🎉

### 4. Initialize Data
```bash
npm i -g @railway/cli
railway login
railway link
railway run --service backend python init_admin.py
railway run --service backend python import_playlist_ytdlp.py
```

### 5. Add Custom Domain (Optional)
- Frontend → Settings → Custom Domain
- Enter: `average2epic.com`
- Add DNS CNAME: `@ → your-frontend.railway.app`

**Done!** Your app is deployed. 🚀

**Cost:** ~$15-25/month after $5 free credit

Full guide: See `RAILWAY_DEPLOYMENT_GUIDE.md`
