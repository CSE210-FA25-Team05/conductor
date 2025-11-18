#!/bin/bash

# Simple script to test lectures API endpoints
# Make sure server is running: npm run dev

BASE_URL="http://localhost:3001"
COURSE_ID=3  # CSE210
LECTURE_ID=4  # First lecture

echo "Testing Lectures API..."
echo "Make sure server is running: npm run dev"
echo ""

# Test 1: GET all lectures
echo "1. GET /api/courses/$COURSE_ID/lectures"
curl -s "$BASE_URL/api/courses/$COURSE_ID/lectures" | jq '.' || curl -s "$BASE_URL/api/courses/$COURSE_ID/lectures"
echo ""
echo ""

# Test 2: GET single lecture
echo "2. GET /api/courses/$COURSE_ID/lectures/$LECTURE_ID"
curl -s "$BASE_URL/api/courses/$COURSE_ID/lectures/$LECTURE_ID" | jq '.' || curl -s "$BASE_URL/api/courses/$COURSE_ID/lectures/$LECTURE_ID"
echo ""
echo ""

# Test 3: POST create lecture
echo "3. POST /api/courses/$COURSE_ID/lectures"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"lecture_date":"2025-11-20","code":"TEST-L1"}' \
  "$BASE_URL/api/courses/$COURSE_ID/lectures" | jq '.' || curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"lecture_date":"2025-11-20","code":"TEST-L1"}' \
  "$BASE_URL/api/courses/$COURSE_ID/lectures"
echo ""
echo ""

echo "Done! Check the responses above."

