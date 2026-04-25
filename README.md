# 🔐 Phishing Shield

**Friction for Security** - A comprehensive phishing detection system that uses intentional friction to prevent users from clicking malicious links.

## 🎯 Project Overview

Phishing Shield interprets the "Friction" theme by recognizing that friction is not always bad. When designed correctly, friction becomes a protective mechanism. By adding 2-3 seconds of analysis and clear security warnings, we force users to think before clicking suspicious links.

**Key Insight:** 90% of phishing attacks succeed because users click in under 3 seconds without verification. We use friction to stop this.

## ✨ Features

### Chrome Extension
- **Real-time Detection** - Monitors all links on every website
- **Visual Warnings** - Beautiful, non-intrusive popup alerts
- **Risk Scoring** - Color-coded risk levels (Safe, Suspicious, Phishing)
- **Live Statistics** - Track threats detected in real-time

### REST API Server
- **Typosquatting Detection** - Identifies domain spoofing (paypa1.com vs paypal.com)
- **Pattern Recognition** - Detects IP addresses, URL shorteners, missing HTTPS
- **Keyword Analysis** - Flags phishing keywords (verify, confirm, update, login)
- **Smart Normalization** - Catches digit substitutions (0→o, 1→l, 5→s)

### Web Analyzer
- **Manual URL Checking** - Submit any URL for instant analysis
- **Beautiful Dashboard** - Modern, clean user interface
- **Detailed Findings** - Explains why a link is flagged as suspicious
- **Mobile Friendly** - Works on all devices

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Extension** | JavaScript, HTML5, CSS3 (Chrome Manifest V3) |
| **Backend API** | Node.js, Express.js, String-Similarity Algorithm |
| **Web Analyzer** | Vanilla JavaScript, Modern CSS |
| **Deployment** | Netlify (Frontend), Local Server (Backend) |
| **Package Manager** | npm |

## 📋 Project Structure

```
phishing-shield/
├── backend/
│   ├── server.js              # Express API server
│   ├── package.json           # Dependencies
│   └── node_modules/          # Installed packages
├── extension/
│   ├── manifest.json          # Chrome extension config
│   ├── content.js             # Link detection & analysis
│   ├── background.js          # Background worker
│   ├── popup.html             # Stats popup UI
│   └── popup.js               # Popup logic
├── analyzer.html              # Web analyzer dashboard
├── index.html                 # Redirects to analyzer
├── test.html                  # Test page with examples
├── .gitignore
├── README.md
└── GETTING_STARTED.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- Chrome/Chromium browser
- Python 3 (for local server)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Ariful-Islam1011/phishing-shield.git
cd phishing-shield
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Start the backend server**
```bash
npm start
```

Server runs on `http://localhost:3000`

**4. Load Chrome Extension**
- Open Chrome: `chrome://extensions/`
- Enable "Developer mode" (top right)
- Click "Load unpacked"
- Select the `extension/` folder

**5. Test the analyzer**
- Start local HTTP server:
  ```bash
  python3 -m http.server 8000
  ```
- Open: `http://localhost:8000/analyzer.html`

## 🔍 Detection Methods

### Typosquatting Detection
Catches domain spoofing with 85%+ similarity threshold:
- `paypa1.com` → `paypal.com` (1 vs l)
- `amaz0n.com` → `amazon.com` (0 vs o)
- `gmai1.com` → `gmail.com` (1 vs l)

### Suspicious Pattern Detection
- Direct IP addresses (192.168.1.1)
- URL shorteners (bit.ly, ow.ly)
- Missing HTTPS encryption
- Phishing keywords (verify, confirm, update, login, account)

### Risk Scoring
```
0-40%   = ✅ SAFE
40-70%  = ⚠️ SUSPICIOUS
70%+    = 🚨 PHISHING
```

## 📊 Risk Score Calculation

| Detection Type | Risk Points |
|---|---|
| Typosquatting match | +50 |
| Domain age < 7 days | +25 |
| Direct IP address | +40 |
| URL shortener | +30 |
| Missing HTTPS | +25 |
| Phishing keywords | +20 |

## 🎬 Demo Usage

### Test on Analyzer
1. Visit: `https://phishing-shild.netlify.app` (or local)
2. Paste suspicious URL: `https://paypa1.com/verify`
3. See risk analysis: 60% SUSPICIOUS
4. Read findings explaining why it's flagged

### Test on Browser
1. Visit any website
2. Hover over links → See analysis badges
3. Click suspicious link → Warning popup appears
4. Click extension icon → View statistics

## 🌐 Live Demo

**Web Analyzer:** https://phishing-shild.netlify.app

## 📚 API Documentation

### Analyze URL
```bash
POST http://localhost:3000/api/analyze
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response:**
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
```bash
GET http://localhost:3000/api/stats
```

### Health Check
```bash
GET http://localhost:3000/health
```

## 🎨 Architecture

```
User visits webpage
    ↓
Content.js monitors links
    ↓
User hovers/clicks link
    ↓
API analyzes URL
    ↓
Risk score returned
    ↓
If suspicious: Show warning popup
If safe: Link opens normally
```

## 🔐 Security Considerations

- **Privacy First** - No tracking of user browsing history
- **Local Analysis** - Can work offline with cached data
- **No Personal Data** - Only analyzes URL patterns
- **Open Source** - Code is transparent and reviewable

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Value

This project demonstrates:
- Chrome Extension API (Manifest V3)
- Express.js REST API
- String similarity algorithms
- DOM manipulation and event listening
- Real-time data processing
- Frontend-backend communication
- Security best practices

## 🏆 Hackathon Submission

**Theme:** Friction  
**Category:** Cybersecurity / User Safety  
**Live Demo:** https://phishing-shild.netlify.app

### Why This Project Wins

1. **Theme Alignment** - Interprets "friction" as a protective feature
2. **Real Problem** - Addresses $4.7B annual phishing loss
3. **Working Solution** - Fully functional and deployable
4. **User-Centric** - Beautiful, intuitive interface
5. **Scalable** - Can extend to emails, messaging apps, etc.

## 📞 Support

For issues, questions, or suggestions:
- Create an GitHub issue
- Check GETTING_STARTED.md for detailed setup guide
- Review API documentation above

## 🙏 Acknowledgments

Built as a hackathon project with focus on making internet safer through intentional friction.

---

**Made with 🔐 for cybersecurity. Friction protects. 🛡️**
