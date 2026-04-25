#!/bin/bash

# 🔐 Phishing Shield - Demo Script
# Run this to set up and demo the project

echo "🔐 Phishing Shield - Hackathon Project"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Starting Backend Server...${NC}"
echo "Run this in Terminal 1:"
echo ""
echo -e "${YELLOW}cd /Users/md.arifulislam/phishing-shield/backend${NC}"
echo -e "${YELLOW}npm start${NC}"
echo ""

echo -e "${BLUE}Step 2: Loading Chrome Extension...${NC}"
echo "1. Open Chrome → chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked'"
echo "4. Navigate to: /Users/md.arifulislam/phishing-shield/extension"
echo "5. Click 'Select'"
echo ""

echo -e "${BLUE}Step 3: Opening Test Page...${NC}"
echo "1. Copy this path into your browser:"
echo "   file:///Users/md.arifulislam/phishing-shield/test.html"
echo "2. Or run: open /Users/md.arifulislam/phishing-shield/test.html"
echo ""

echo -e "${GREEN}===== DEMO READY =====${NC}"
echo ""
echo "Now you can:"
echo "  • Hover over suspicious links → See analysis badges"
echo "  • Click suspicious links → Beautiful warning popup"
echo "  • Check extension popup → See real-time stats"
echo "  • Test API: curl http://localhost:5000/api/stats"
echo ""
echo "Made with 🔐 for Hackathon - Theme: Friction"
