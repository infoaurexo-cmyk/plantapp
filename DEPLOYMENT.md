# Deployment Guide - Railway.app

## Prerequisites
1. Railway account: https://railway.app (free)
2. Railway CLI installed: `npm install -g @railway/cli`
3. GitHub account (recommended for auto-deploy)

## Deployment Steps

### Option 1: Using Railway CLI (Fastest)

```bash
# Login to Railway
railway login

# Create new project
cd ~/Aurexo_claude/PlantApp
railway init

# Set up backend service
cd backend
railway add

# Set environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set OLLAMA_BASE_URL=http://localhost:11434
railway variables set OLLAMA_MODEL=llama3.2
railway variables set PLANTNET_API_KEY=<YOUR_KEY>
railway variables set DATABASE_PATH=/data/plant_app.db
railway variables set CORS_ORIGIN=*

# Deploy backend
railway up

# Deploy Flutter web (static hosting)
cd ../mobile
railway add

# Update API endpoint in flutter app to production URL
# in lib/services/api_service.dart:
# const String _baseUrl = 'https://<railway-backend-url>/api';

# Build and deploy web
flutter build web --release
railway variables set FLUTTER_WEB_ROOT=build/web
railway up
```

### Option 2: Using GitHub (Recommended)

1. Push repo to GitHub
2. Connect Railway to GitHub repo
3. Railway auto-deploys on push
4. Set environment variables in Railway dashboard

## Environment Variables to Set

**Backend:**
- `PORT`: 3000 (Railway assigns this)
- `NODE_ENV`: production
- `OLLAMA_BASE_URL`: URL of Ollama instance
- `OLLAMA_MODEL`: llama3.2
- `PLANTNET_API_KEY`: Get from plantnet.org
- `DATABASE_PATH`: /data/plant_app.db
- `CORS_ORIGIN`: https://your-flutter-domain.railway.app

**Flutter Web:**
- Update `const String _baseUrl = 'https://<backend-url>/api'` in api_service.dart

## Database Migration

SQLite works on Railway, but for production consider:
- PostgreSQL (Railway provides free tier)
- Or use volumes for persistent storage

## Testing

1. Get backend URL from Railway dashboard
2. Update Flutter app API endpoint
3. Rebuild: `flutter build web --release`
4. Test all features:
   - Login/signup
   - Add plant
   - Analyze with symptoms
   - Analyze with photo
   - View analysis history

## Production Checklist

- [ ] Backend deployed and healthy
- [ ] Flutter web deployed
- [ ] API endpoints updated
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Database working
- [ ] PlantNet API key configured
- [ ] All features tested
