# 🌱 Plant Health Analysis App

A mobile plant health analysis application that helps gardeners diagnose plant issues and get AI-powered care recommendations.

## Project Structure

```
PlantApp/
├── backend/                 # Node.js + Express API server
│   ├── server.js           # Main server file
│   ├── database.js         # SQLite setup & helpers
│   ├── routes/
│   │   ├── plants.js       # Plant management endpoints
│   │   ├── users.js        # User profile endpoints
│   │   └── analysis.js     # Plant analysis endpoints
│   ├── models/             # Data models (expandable)
│   ├── package.json        # Dependencies
│   ├── .env               # Environment variables
│   └── plant_app.db       # SQLite database (auto-created)
│
├── mobile/                 # Flutter mobile app (coming next)
│   └── plant_app/
│
├── docs/
│   ├── API_DOCS.md        # Complete API documentation
│   ├── SETUP.md           # Setup instructions
│   └── PLANT_DATABASE.md  # Plant knowledge base
│
└── README.md             # This file
```

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + Express | v25.8.0 |
| Database | SQLite 3 | 3.43.2 |
| AI Engine | Ollama (Gemma2) | Latest |
| Plant ID | PlantNet API | Free tier |
| Mobile | Flutter | 3.41.7 |

## Getting Started

### Prerequisites

Ensure you have installed:
- ✅ Node.js (v25.8.0)
- ✅ npm (v11.11.0)
- ✅ Ollama with Gemma2 model
- ✅ SQLite 3

### Installation

1. **Navigate to backend folder**
   ```bash
   cd PlantApp/backend
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file with your settings
   - Get PlantNet API key from https://www.plantnet.org/

4. **Start the server**
   ```bash
   npm start
   ```

   You should see:
   ```
   ✅ Database initialized successfully
   🌱 Plant Health API Server running on http://localhost:5000
   📍 Health check: http://localhost:5000/api/health
   ```

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Users
- `POST /api/users` - Create new user
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users/:userId/analysis-history` - Get analysis history

### Plants
- `POST /api/plants` - Add new plant
- `GET /api/plants/:userId` - Get all user plants
- `GET /api/plants/details/:plantId` - Get plant details
- `PUT /api/plants/:plantId` - Update plant info
- `DELETE /api/plants/:plantId` - Delete plant

### Analysis
- `POST /api/analysis` - Analyze plant health
- `GET /api/analysis/plant/:plantId` - Get plant analysis history
- `GET /api/analysis/:analysisId` - Get specific analysis

See [API_DOCS.md](docs/API_DOCS.md) for complete documentation and examples.

## Testing the API

### Quick Test Script

```bash
# Health check
curl http://localhost:5000/api/health

# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@example.com"}'

# Add a plant
curl -X POST http://localhost:5000/api/plants \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":1,
    "name":"Tomato Plant",
    "type":"vegetable",
    "species":"Solanum lycopersicum"
  }'

# Analyze plant
curl -X POST http://localhost:5000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "plant_id":1,
    "symptoms":"Yellow leaves with brown spots on edges"
  }'
```

## Database

### Tables Created Automatically

1. **users** - User accounts and profiles
2. **plants** - Plant inventory for each user
3. **plant_analysis** - Analysis history and results
4. **diseases** - Disease/pest knowledge base
5. **care_tips** - Generic care recommendations

The database is stored at `backend/plant_app.db` (auto-created on first run).

## Features Implemented (Phase 3)

✅ Express server setup
✅ SQLite database with 5 tables
✅ User management (create, read, update)
✅ Plant management (add, read, update, delete)
✅ Plant health analysis with Ollama AI
✅ Plant identification via PlantNet API
✅ Analysis history tracking
✅ CORS enabled for mobile app
✅ Error handling
✅ API documentation

## Next Steps (Phase 4-9)

- [ ] Phase 4: Expand database schema with disease data
- [ ] Phase 5: PlantNet API integration for image identification
- [ ] Phase 6: Enhanced AI recommendations
- [ ] Phase 7: Build Flutter mobile app
- [ ] Phase 8: Deploy to cloud (Render/Railway)
- [ ] Phase 9: Build comprehensive plant knowledge base

## Environment Variables

Edit `.env` file to configure:

```
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
OLLAMA_BASE_URL=http://localhost:11434 # Local AI
PLANTNET_API_KEY=your_api_key         # Plant ID API
DATABASE_PATH=./plant_app.db          # DB location
CORS_ORIGIN=*                         # CORS settings
```

## Troubleshooting

### Port 5000 already in use
```bash
# Use different port in .env
PORT=3000
```

### Database errors
```bash
# Remove old database
rm plant_app.db

# Run server again (recreates fresh database)
npm start
```

### Ollama not responding
```bash
# Make sure Ollama is running
ollama serve

# Check Ollama models
ollama list
```

## Development Notes

- Database queries use parameterized statements (safe from SQL injection)
- All API responses include `success` flag
- Error messages are user-friendly
- Images can be sent as base64 in request body
- Each analysis is stored with timestamp for history tracking

## Cost

**Total Cost: $0**
- Node.js: Free & Open Source
- SQLite: Free & Open Source
- Flutter: Free & Open Source
- Ollama: Free & Open Source
- PlantNet: Free tier (500 calls/day)

## Resources

- [Flutter Docs](https://flutter.dev/docs)
- [Node.js Docs](https://nodejs.org/docs)
- [Express Documentation](https://expressjs.com)
- [SQLite Reference](https://www.sqlite.org/docs.html)
- [PlantNet API](https://www.plantnet.org/en)
- [Ollama](https://ollama.ai)

---

**Status:** Phase 3 Complete ✅
**Next Phase:** Phase 4 - Database Schema Expansion
**Last Updated:** April 21, 2026

🚀 **Backend API is ready for mobile app integration!** 🌱
