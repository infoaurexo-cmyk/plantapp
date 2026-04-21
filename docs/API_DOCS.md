# 🌱 Plant Health API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Health Check

### Check API Status
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Plant Health Analysis API is running",
  "timestamp": "2026-04-21T13:35:00.000Z"
}
```

---

## Users API

### Create New User
```
POST /users
Content-Type: application/json

{
  "username": "john_gardener",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 1
}
```

### Get User Profile
```
GET /users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_gardener",
    "email": "john@example.com",
    "plantsCount": 3,
    "created_at": "2026-04-21T10:00:00",
    "updated_at": "2026-04-21T10:00:00"
  }
}
```

### Update User Profile
```
PUT /users/:userId
Content-Type: application/json

{
  "username": "john_gardener_pro",
  "email": "john.pro@example.com"
}
```

### Get User's Analysis History
```
GET /users/:userId/analysis-history
```

---

## Plants API

### Add New Plant
```
POST /plants
Content-Type: application/json

{
  "user_id": 1,
  "name": "Tomato Plant",
  "species": "Solanum lycopersicum",
  "type": "vegetable",
  "location": "Backyard",
  "water_frequency": "daily",
  "sunlight_requirement": "6-8 hours",
  "notes": "Growing in pots",
  "image_url": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Plant added successfully",
  "plantId": 1
}
```

### Get All Plants for User
```
GET /plants/:userId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Tomato Plant",
      "species": "Solanum lycopersicum",
      "type": "vegetable",
      "location": "Backyard",
      "water_frequency": "daily",
      "sunlight_requirement": "6-8 hours",
      "notes": "Growing in pots",
      "image_url": "https://...",
      "created_at": "2026-04-21T10:00:00"
    }
  ]
}
```

### Get Plant Details
```
GET /plants/details/:plantId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plant": {...},
    "recentAnalysis": [...]
  }
}
```

### Update Plant
```
PUT /plants/:plantId
Content-Type: application/json

{
  "name": "Tomato Plant",
  "water_frequency": "every 2 days",
  ...
}
```

### Delete Plant
```
DELETE /plants/:plantId
```

---

## Analysis API

### Analyze Plant Health
```
POST /analysis
Content-Type: application/json

{
  "plant_id": 1,
  "symptoms": "Yellow leaves with brown spots on edges",
  "image_base64": "data:image/jpeg;base64,..." (optional)
}
```

**Response:**
```json
{
  "success": true,
  "analysisId": 5,
  "plantInfo": {
    "name": "Tomato Plant",
    "type": "vegetable",
    "species": "Solanum lycopersicum",
    "plantIdentification": {
      "species": "Solanum lycopersicum",
      "commonName": "Tomato",
      "probability": "95.23",
      "genus": "Solanum"
    }
  },
  "analysis": {
    "detectedIssue": "Leaf spot disease",
    "severity": "Medium",
    "symptoms": "Yellow leaves with brown spots on edges",
    "recommendations": "1. Remove affected leaves carefully\n2. Spray neem oil or baking soda mix\n3. Reduce watering, improve airflow..."
  }
}
```

### Get Analysis History for Plant
```
GET /analysis/plant/:plantId
```

### Get Single Analysis Result
```
GET /analysis/:analysisId
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "user_id and name are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Plant not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details..."
}
```

---

## Testing with curl

### Test health endpoint
```bash
curl http://localhost:5000/api/health
```

### Create a user
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@example.com"}'
```

### Add a plant
```bash
curl -X POST http://localhost:5000/api/plants \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":1,
    "name":"Tomato",
    "type":"vegetable",
    "species":"Solanum lycopersicum"
  }'
```

### Analyze plant
```bash
curl -X POST http://localhost:5000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "plant_id":1,
    "symptoms":"Yellow leaves with brown spots"
  }'
```

---

## Database Schema

### users table
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- created_at, updated_at (DATETIME)

### plants table
- id (INTEGER PRIMARY KEY)
- user_id (FOREIGN KEY)
- name, species, type, location
- water_frequency, sunlight_requirement
- notes, image_url
- created_at, updated_at

### plant_analysis table
- id (INTEGER PRIMARY KEY)
- plant_id (FOREIGN KEY)
- symptoms, detected_issue, severity
- recommendations
- image_url, created_at

---

**Last Updated:** April 21, 2026
