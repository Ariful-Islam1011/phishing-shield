const express = require('express');
const cors = require('cors');
const stringSimilarity = require('string-similarity');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Store stats
let stats = {
  linksAnalyzed: 0,
  phishingDetected: 0,
  blockedLinks: []
};

// Known legitimate domains
const knownLegitDomains = [
  'paypal.com', 'amazon.com', 'apple.com', 'google.com', 'facebook.com',
  'linkedin.com', 'microsoft.com', 'twitter.com', 'instagram.com', 'github.com',
  'gmail.com', 'yahoo.com', 'outlook.com', 'dropbox.com', 'netflix.com',
  'uber.com', 'airbnb.com', 'ebay.com', 'spotify.com', 'slack.com'
];

// Typosquatting detection
function checkTyposquatting(domain) {
  // Remove www prefix first
  const cleanDomain = domain.replace('www.', '').replace('www2.', '');
  const baseDomain = cleanDomain.split('.')[0];

  for (let legit of knownLegitDomains) {
    const legitimateClean = legit.replace('www.', '').split('.')[0];

    // Skip if exact match
    if (baseDomain === legitimateClean) {
      continue;
    }

    // Check digit replacements (0->o, 1->l, 5->s, etc)
    const baseDomainNormalized = baseDomain
      .replace(/0/g, 'o')  // 0 to o
      .replace(/1/g, 'l')  // 1 to l
      .replace(/3/g, 'e')  // 3 to e
      .replace(/4/g, 'a')  // 4 to a
      .replace(/5/g, 's')  // 5 to s
      .replace(/7/g, 't')  // 7 to t
      .replace(/8/g, 'b')  // 8 to b
      .replace(/9/g, 'g'); // 9 to g

    // If after normalization it matches, it's a typo (0 replaced with o, etc)
    if (baseDomainNormalized === legitimateClean && baseDomainNormalized !== baseDomain) {
      return {
        found: true,
        similarity: 0.95,
        realDomain: legit,
        fakeDomain: domain
      };
    }

    // Also check regular string similarity
    const similarity = stringSimilarity.compareTwoStrings(baseDomain, legitimateClean);
    if (similarity > 0.75 && similarity < 1.0) {
      return {
        found: true,
        similarity: similarity,
        realDomain: legit,
        fakeDomain: domain
      };
    }
  }
  return { found: false };
}

// Suspicious patterns
function checkSuspiciousPatterns(url, domain) {
  let patterns = [];
  let riskAdd = 0;

  // IP address check
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(domain)) {
    patterns.push('Direct IP address (suspicious)');
    riskAdd += 40;
  }

  // URL shorteners
  const shorteners = ['bit.ly', 'short.link', 'tinyurl.com', 'ow.ly'];
  if (shorteners.some(s => domain.includes(s))) {
    patterns.push('URL shortener detected');
    riskAdd += 30;
  }

  // HTTPS check
  if (!url.startsWith('https://')) {
    patterns.push('Not using HTTPS (insecure)');
    riskAdd += 25; // Increased from 10
  }

  // Phishing keywords
  const phishingKeywords = ['verify', 'confirm', 'update', 'login', 'secure', 'account'];
  const urlLower = url.toLowerCase();
  const keywordMatches = phishingKeywords.filter(kw => urlLower.includes(kw));
  if (keywordMatches.length > 0) {
    patterns.push(`Phishing keywords: ${keywordMatches.join(', ')}`);
    riskAdd += 20; // Increased from 10
  }

  return { patterns, riskAdd };
}

// Main API endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    stats.linksAnalyzed++;

    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const domain = urlObj.hostname;
    let riskScore = 0;
    let reasons = [];

    // TYPOSQUATTING CHECK
    const typos = checkTyposquatting(domain);
    if (typos.found) {
      riskScore += 50;
      reasons.push(`Domain resembles: ${typos.realDomain}`);
    }

    // SUSPICIOUS PATTERNS CHECK
    const patterns = checkSuspiciousPatterns(url, domain);
    riskScore += patterns.riskAdd;
    reasons.push(...patterns.patterns);

    riskScore = Math.min(100, riskScore);
    const safe = riskScore < 40;

    if (!safe) {
      stats.phishingDetected++;
      stats.blockedLinks.push({
        url: url,
        timestamp: new Date(),
        riskScore: riskScore
      });
    }

    res.json({
      url: url,
      domain: domain,
      riskScore: riskScore,
      safe: safe,
      reasons: reasons,
      verdict: riskScore > 70 ? 'PHISHING' : riskScore > 40 ? 'SUSPICIOUS' : 'SAFE'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    linksAnalyzed: stats.linksAnalyzed,
    phishingDetected: stats.phishingDetected,
    safeLinks: stats.linksAnalyzed - stats.phishingDetected,
    detectionRate: stats.linksAnalyzed > 0
      ? ((stats.phishingDetected / stats.linksAnalyzed) * 100).toFixed(2) + '%'
      : '0%',
    recentDetections: stats.blockedLinks.slice(-10)
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔐 Phishing Shield API running on http://localhost:${PORT}`);
});
