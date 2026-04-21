# 🛠️ Plant Health App - Backend Setup Guide

## Phase 3: Backend Setup Complete! ✅

This guide walks through what was built in Phase 3.

---

## What We Built

### 1. Project Structure
```
PlantApp/
├── backend/
│   ├── server.js              # Main Express server
│   ├── database.js            # SQLite database setup
│   ├── routes/
│   │   ├── plants.js          # Plant CRUD operations
│   │   ├── users.js           # User management
│   │   └── analysis.js        # Plant analysis & AI
│   ├── models/                # Ready for expansion
│   ├── package.json           # Dependencies
│   └── .env                   # Configuration
├── mobile/                    # Flutter app (next phase)
└── docs/                      # Documentation
```

### 2. Database (SQLite)

**5 Tables created automatically:**

#### users
```
id (PRIMARY KEY)
username (UNIQUE)
email (UNIQUE)
created_at, updated_at
```

#### plants
```
id (PRIMARY KEY)
user_id (FOREIGN KEY)
name, species, type
location, water_frequency, sunlight_requirement
notes, image_url
created_at, updated_at
```

#### plant_analysis
```
id (PRIMARY KEY)
plant_id (FOREIGN KEY)
symptoms, detected_issue, severity
recommendations, image_url
created_at
```

#### diseases
```
id (PRIMARY KEY)
name, description, symptoms
organic_remedies, prevention_tips
affected_plants, severity_level
```

#### care_tips
```
id (PRIMARY KEY)
plant_type, care_category
tip, frequency
```

### 3. API Endpoints

**11 Total Endpoints:**

#### Health
- `GET /api/health` - Server status

#### Users (4 endpoints)
- `POST /api/users` - Create user
- `GET /api/users/:userId` - Get profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users/:userId/analysis-history` - Analysis history

#### Plants (5 endpoints)
- `POST /api/plants` - Add plant
- `GET /api/plants/:userId` - Get all plants
- `GET /api/plants/details/:plantId` - Get details
- `PUT /api/plants/:plantId` - Update plant
- `DELETE /api/plants/:plantId` - Delete plant

#### Analysis (3 endpoints)
- `POST /api/analysis` - Analyze plant
- `GET /api/analysis/plant/:plantId` - Get history
- `GET /api/analysis/:analysisId` - Get result

### 4. AI Integration

**Ollama Integration:**
- Connects to local Ollama service (port 11434)
- Uses Gemma2 model for recommendations
- Natural language processing for symptoms
- Generates personalized care advice

**PlantNet API Integration:**
- Free plant identification (500 calls/day)
- Identifies plants from photos
- Returns species, common names, probability scores
- Ready to integrate with image uploads

### 5. Features

✅ User account management
✅ Plant inventory tracking
✅ Health analysis with AI
✅ Symptom-to-recommendation mapping
✅ Analysis history storage
✅ Image support (base64)
✅ Database auto-initialization
✅ Error handling & validation
✅ CORS enabled
✅ Environment configuration

---

## Running the Backend

### Start Server
```bash
cd PlantApp/backend
npm start
```

**Expected output:**
```
✅ Database initialized successfully
🌱 Plant Health API Server running on http://localhost:5000
📍 Health check: http://localhost:5000/api/health
```

### Check if Running
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Plant Health Analysis API is running",
  "timestamp": "2026-04-21T13:35:00Z"
}
```

---

## Quick Test Workflow

### 1. Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_garden",
    "email": "jane@example.com"
  }'
```
**Response:** Returns `userId: 1`

### 2. Add Plant
```bash
curl -X POST http://localhost:5000/api/plants \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Tomato Plant",
    "species": "Solanum lycopersicum",
    "type": "vegetable",
    "location": "Backyard",
    "water_frequency": "daily",
    "sunlight_requirement": "6-8 hours"
  }'
```
**Response:** Returns `plantId: 1`

### 3. Analyze Plant
```bash
curl -X POST http://localhost:5000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "plant_id": 1,
    "symptoms": "Yellow leaves with brown spots, plant looks droopy"
  }'
```

**Response:**
```json
{
  "success": true,
  "analysisId": 1,
  "plantInfo": {
    "name": "Tomato Plant",
    "species": "Solanum lycopersicum"
  },
  "analysis": {
    "detectedIssue": "Possible leaf spot disease or overwatering",
    "severity": "Medium",
    "recommendations": "1. Check soil moisture...\n2. Remove affected leaves...\n..."
  }
}
```

### 4. Get Plant Details
```bash
curl http://localhost:5000/api/plants/details/1
```

### 5. View Analysis History
```bash
curl http://localhost:5000/api/users/1/analysis-history
```

---

## Environment Configuration

Edit `backend/.env`:

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./plant_app.db

# AI Engine
OLLAMA_BASE_URL=http://localhost:11434

# Plant API
PLANTNET_API_KEY=your_key_here

# API Settings
CORS_ORIGIN=*
```

---

## Dependencies Installed

```json
{
  "express": "^5.2.1",      // Web framework
  "sqlite3": "^6.0.1",      // Database
  "cors": "^2.8.6",         // Cross-origin requests
  "dotenv": "^17.4.2",      // Environment variables
  "axios": "^1.15.1",       // HTTP client
  "multer": "^2.1.1",       // File uploads
  "body-parser": "^2.2.2"   // JSON parsing
}
```

---

## Database Location

- **File:** `PlantApp/backend/plant_app.db`
- **Auto-created:** Yes (on first server start)
- **Size:** Grows with data
- **Backup:** Copy the .db file

### View Database (optional)
```bash
# Using sqlite3 command line
sqlite3 plant_app.db

# List tables
.tables

# View users
SELECT * FROM users;

# Exit
.quit
```

---

## Next Phase: Phase 4

**Goal:** Expand database with disease/plant knowledge base

**Tasks:**
1. Research 20-30 common plants
2. Document their care requirements
3. Add common diseases and pests
4. Create organic remedy database
5. Populate care_tips and diseases tables

**Time:** 2-3 hours

---

## Troubleshooting

### Issue: "Port 5000 already in use"
```bash
# Change port in .env
PORT=3000

# Or kill process using port
lsof -ti:5000 | xargs kill -9
```

### Issue: "Cannot find module 'express'"
```bash
# Reinstall dependencies
npm install
```

### Issue: "Database is locked"
```bash
# Close all connections, then delete and restart
rm plant_app.db
npm start
```

### Issue: "Ollama connection refused"
```bash
# Make sure Ollama is running
ollama serve

# In another terminal, start server
npm start
```

### Issue: "CORS error from Flutter app"
```bash
# Update CORS_ORIGIN in .env
# For local testing:
CORS_ORIGIN=*

# For production:
CORS_ORIGIN=https://yourdomain.com
```

---

## Files Created

### Backend Core
- ✅ `server.js` - Express server setup
- ✅ `database.js` - SQLite initialization
- ✅ `package.json` - Dependencies

### Routes (3 files)
- ✅ `routes/users.js` - User endpoints
- ✅ `routes/plants.js` - Plant endpoints
- ✅ `routes/analysis.js` - Analysis & AI

### Configuration
- ✅ `.env` - Environment variables
- ✅ `.gitignore` - Git ignore rules

### Documentation
- ✅ `docs/API_DOCS.md` - Complete API reference
- ✅ `docs/SETUP.md` - This file
- ✅ `README.md` - Project overview

---

## Performance Notes

- Database queries use prepared statements (SQL injection safe)
- Ollama calls have 30-second timeout
- Large image uploads limited to 50MB
- Results stored with timestamps for history
- PlantNet API: 500 free calls/day limit

---

## Security Considerations

✅ SQL injection: Prevented with parameterized queries
✅ CORS: Configurable per environment
✅ Input validation: Basic checks on required fields
✅ File uploads: Limited to 50MB, base64 encoded
✅ Error messages: Generic, no sensitive data exposed

---

## Ready for Next Phase!

✅ Backend API is fully functional
✅ Database is auto-initialized
✅ All endpoints tested
✅ Documentation complete

**Next:** Start building the Flutter mobile app (Phase 7)

---

**Status:** Phase 3 - Backend API ✅ COMPLETE
**Time Spent:** ~1.5 hours
**Last Updated:** April 21, 2026

🚀 Let's move to the next phase!
