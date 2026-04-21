# Quick Deployment to Railway

## Step 1: Create Railway Account
```bash
# Go to https://railway.app and sign up (free)
# Recommend: GitHub sign-in (easier)
```

## Step 2: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

## Step 3: Deploy Backend
```bash
cd ~/Aurexo_claude/PlantApp/backend

# Initialize backend service
railway init
railway add

# Set environment variables
railway variables set \
  PORT=3000 \
  NODE_ENV=production \
  PLANTNET_API_KEY=<your_key> \
  CORS_ORIGIN=https://your-flutter-url.railway.app

# Deploy
railway up
```

**Note:** Get your backend URL from Railway dashboard after deployment.

## Step 4: Update Flutter App
Edit `mobile/lib/services/api_service.dart`:
```dart
// Replace: const String _baseUrl = 'http://localhost:3000/api';
const String _baseUrl = 'https://<your-backend-url>.railway.app/api';
```

## Step 5: Build & Deploy Flutter Web
```bash
cd ~/Aurexo_claude/PlantApp/mobile

# Build for production
flutter build web --release

# Deploy as static site
cd build/web
railway init
railway add
railway up
```

## Result
- Backend: `https://<name>.railway.app`
- Frontend: `https://<name>.railway.app`
- Full app live & accessible!

---

## Alternative: Push to GitHub & Auto-Deploy
If easier, push to GitHub first:
```bash
cd ~/Aurexo_claude/PlantApp
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR/REPO
git push -u origin main

# Then connect Railway to your GitHub repo
# Railway auto-deploys on push!
```
