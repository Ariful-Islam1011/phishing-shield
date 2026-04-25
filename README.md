# Phishing Shield

A comprehensive phishing detection system that uses intentional friction to prevent users from clicking malicious links.

## Overview

Phishing Shield interprets friction as a protective mechanism rather than an obstacle. By adding 2-3 seconds of analysis and clear security warnings, we force users to think before clicking suspicious links.

**Key Insight:** 90% of phishing attacks succeed because users click in under 3 seconds without verification. We use friction to stop this.

## Features

### Chrome Extension
- Real-time Detection: Monitors all links on every website
- Visual Warnings: Non-intrusive popup alerts with risk assessment
- Risk Scoring: Color-coded risk levels (Safe, Suspicious, Phishing)
- Live Statistics: Track threats detected in real-time

### REST API Server
- Typosquatting Detection: Identifies domain spoofing (paypa1.com vs paypal.com)
- Pattern Recognition: Detects IP addresses, URL shorteners, missing HTTPS
- Keyword Analysis: Flags phishing keywords (verify, confirm, update, login)
- Smart Normalization: Catches digit substitutions (0 to o, 1 to l, 5 to s)

### Web Analyzer
- Manual URL Checking: Submit any URL for instant analysis
- Clean Dashboard: Modern, minimal user interface
- Detailed Findings: Explains why a link is flagged as suspicious
- Mobile Friendly: Works on all devices

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend Extension | JavaScript, HTML5, CSS3 (Chrome Manifest V3) |
| Backend API | Node.js, Express.js, String-Similarity Algorithm |
| Web Analyzer | Vanilla JavaScript, Modern CSS |
| Deployment | Netlify (Frontend), Local Server (Backend) |

## Project Structure

```
phishing-shield/
├── backend/
│   ├── server.js              # Express API server
│   ├── package.json           # Dependencies
│   └── node_modules/
├── extension/
│   ├── manifest.json          # Chrome extension config
│   ├── content.js             # Link detection and analysis
│   ├── background.js          # Background worker
│   ├── popup.html             # Stats popup UI
│   └── popup.js               # Popup logic
├── analyzer.html              # Web analyzer dashboard
├── index.html                 # Home page
├── test.html                  # Test page with examples
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 14+
- Chrome/Chromium browser
- Python 3

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ariful-Islam1011/phishing-shield.git
cd phishing-shield
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Start the backend server
```bash
npm start
```

Server runs on http://localhost:3000

4. Load Chrome Extension
- Open Chrome: chrome://extensions/
- Enable "Developer mode"
- Click "Load unpacked"
- Select the extension/ folder

5. Test the analyzer
```bash
python3 -m http.server 8000
```
Open: http://localhost:8000/analyzer.html

## Detection Methods

### Typosquatting Detection
Identifies domain spoofing with 85%+ similarity threshold:
- paypa1.com vs paypal.com (1 vs l)
- amaz0n.com vs amazon.com (0 vs o)
- gmai1.com vs gmail.com (1 vs l)

### Suspicious Pattern Detection
- Direct IP addresses
- URL shorteners (bit.ly, ow.ly, etc)
- Missing HTTPS encryption
- Phishing keywords (verify, confirm, update, login, account)

### Risk Scoring
```
0-40%   = SAFE
40-70%  = SUSPICIOUS
70%+    = PHISHING
```

## Risk Score Calculation

| Detection Type | Risk Points |
|---|---|
| Typosquatting match | +50 |
| Domain age less than 7 days | +25 |
| Direct IP address | +40 |
| URL shortener | +30 |
| Missing HTTPS | +25 |
| Phishing keywords | +20 |

## Usage

### Web Analyzer
1. Visit: https://phishing-shild.netlify.app
2. Paste URL: https://paypa1.com/verify
3. View risk analysis and findings

### Browser Extension
1. Visit any website
2. Hover over links to see analysis
3. Click suspicious link to view warning
4. Check extension icon for statistics

## API Documentation

### Analyze URL
```
POST http://localhost:3000/api/analyze
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Response:
```json
{
  "url": "https://paypa1.com/verify",
  "domain": "paypa1.com",
  "riskScore": 60,
  "safe": false,
  "reasons": [
    "Domain resembles: paypal.com",
    "Phishing keywords: verify"
  ],
  "verdict": "SUSPICIOUS"
}
```

### Get Statistics
```
GET http://localhost:3000/api/stats
```

### Health Check
```
GET http://localhost:3000/health
```

## Architecture

1. User visits webpage
2. Extension monitors links
3. User hovers or clicks link
4. API analyzes URL
5. Risk score calculated
6. Warning displayed or link opens

## Security Considerations

- Privacy First: No tracking of user browsing history
- Local Analysis: Works offline with cached data
- No Personal Data: Only analyzes URL patterns
- Open Source: Code is transparent and reviewable

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Learning Value

This project demonstrates:
- Chrome Extension API (Manifest V3)
- Express.js REST API development
- String similarity algorithms
- DOM manipulation and event handling
- Real-time data processing
- Frontend-backend communication
- Security best practices

## Live Demo

Web Analyzer: https://phishing-shild.netlify.app

Code Repository: https://github.com/Ariful-Islam1011/phishing-shield

## Support

For issues, questions, or suggestions, create a GitHub issue or review the detailed setup guide.