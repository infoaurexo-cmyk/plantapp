#!/bin/bash

# 🌱 Plant Health API - Test Script
# This script demonstrates all major API endpoints

echo "🌱 Plant Health API - Test Workflow"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000/api"

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check${NC}"
curl -s $BASE_URL/health | jq '.'
echo ""

# Test 2: Create User
echo -e "${BLUE}2. Creating New User${NC}"
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_gardener",
    "email": "jane@example.com"
  }')
echo $USER_RESPONSE | jq '.'
USER_ID=$(echo $USER_RESPONSE | jq -r '.userId')
echo -e "${GREEN}User ID: $USER_ID${NC}"
echo ""

# Test 3: Get User Profile
echo -e "${BLUE}3. Getting User Profile${NC}"
curl -s $BASE_URL/users/$USER_ID | jq '.'
echo ""

# Test 4: Add a Plant
echo -e "${BLUE}4. Adding New Plant${NC}"
PLANT_RESPONSE=$(curl -s -X POST $BASE_URL/plants \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": $USER_ID,
    \"name\": \"Tomato Plant\",
    \"species\": \"Solanum lycopersicum\",
    \"type\": \"vegetable\",
    \"location\": \"Backyard\",
    \"water_frequency\": \"daily\",
    \"sunlight_requirement\": \"6-8 hours\",
    \"notes\": \"Growing in pots, planted 2 weeks ago\"
  }")
echo $PLANT_RESPONSE | jq '.'
PLANT_ID=$(echo $PLANT_RESPONSE | jq -r '.plantId')
echo -e "${GREEN}Plant ID: $PLANT_ID${NC}"
echo ""

# Test 5: Get All Plants
echo -e "${BLUE}5. Getting All Plants for User${NC}"
curl -s $BASE_URL/plants/$USER_ID | jq '.'
echo ""

# Test 6: Get Plant Details
echo -e "${BLUE}6. Getting Plant Details${NC}"
curl -s $BASE_URL/plants/details/$PLANT_ID | jq '.'
echo ""

# Test 7: Analyze Plant (requires Ollama running)
echo -e "${BLUE}7. Analyzing Plant Health (requires Ollama)${NC}"
ANALYSIS_RESPONSE=$(curl -s -X POST $BASE_URL/analysis \
  -H "Content-Type: application/json" \
  -d "{
    \"plant_id\": $PLANT_ID,
    \"symptoms\": \"Yellow leaves with brown spots on the edges, some leaves are drooping\"
  }")
echo $ANALYSIS_RESPONSE | jq '.'
ANALYSIS_ID=$(echo $ANALYSIS_RESPONSE | jq -r '.analysisId')
echo -e "${GREEN}Analysis ID: $ANALYSIS_ID${NC}"
echo ""

# Test 8: Get Analysis History
echo -e "${BLUE}8. Getting Analysis History for Plant${NC}"
curl -s $BASE_URL/analysis/plant/$PLANT_ID | jq '.'
echo ""

# Test 9: Get User Analysis History
echo -e "${BLUE}9. Getting User's Analysis History${NC}"
curl -s $BASE_URL/users/$USER_ID/analysis-history | jq '.'
echo ""

# Test 10: Update Plant
echo -e "${BLUE}10. Updating Plant Information${NC}"
curl -s -X PUT $BASE_URL/plants/$PLANT_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Tomato Plant (Updated)\",
    \"water_frequency\": \"every 2 days\",
    \"notes\": \"Adjusted watering schedule\"
  }" | jq '.'
echo ""

echo -e "${GREEN}✅ API Test Complete!${NC}"
echo ""
echo "Summary of created IDs:"
echo "  User ID: $USER_ID"
echo "  Plant ID: $PLANT_ID"
echo "  Analysis ID: $ANALYSIS_ID"
echo ""
echo "Next: Try deleting the plant with:"
echo "  curl -X DELETE http://localhost:5000/api/plants/$PLANT_ID"
