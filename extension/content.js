// Phishing Shield Content Script
const API_SERVER = 'http://localhost:3000';
const CACHE = {};

console.log('🔐 Phishing Shield Content Script Loaded');

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href && shouldAnalyzeLink(link.href)) {
    console.log('🔐 Link clicked:', link.href);
    e.preventDefault();
    e.stopPropagation();
    analyzeAndWarn(link);
    return false;
  }
}, true);

function shouldAnalyzeLink(url) {
  if (
    url.startsWith('javascript:') ||
    url.startsWith('data:') ||
    url.startsWith('mailto:') ||
    url.startsWith('chrome://') ||
    url.startsWith('file://') ||
    url === ''
  ) {
    return false;
  }
  return true;
}

async function analyzeAndWarn(linkElement) {
  const url = linkElement.href;
  console.log('🔍 Analyzing:', url);

  try {
    // Create abort controller with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_SERVER}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log('⚠️ API error, opening link');
      window.location.href = url;
      return;
    }

    const result = await response.json();
    console.log('📊 Analysis result:', result);

    if (result.riskScore > 40) {
      showWarning(result);
    } else {
      console.log('✅ Link is safe, opening');
      window.location.href = url;
    }

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    console.log('Opening link anyway');
    window.location.href = url;
  }
}

function showWarning(result) {
  console.log('🚨 Showing warning popup');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
  `;

  // Create popup
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    max-width: 500px;
    width: 90%;
    animation: slideUp 0.3s ease-out;
  `;

  const reasonsHtml = result.reasons
    .map(r => `<li style="margin: 5px 0; font-size: 14px;">⚠️ ${r}</li>`)
    .join('');

  popup.innerHTML = `
    <style>
      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>

    <h2 style="margin: 0 0 15px 0; font-size: 24px; display: flex; align-items: center; gap: 10px;">
      🚨 SECURITY WARNING!
    </h2>

    <p style="margin: 10px 0; font-size: 14px;">A suspicious link was detected on this page.</p>

    <div style="background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; margin: 15px 0;">
      <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">📍 Suspicious URL:</p>
      <p style="margin: 0; word-break: break-all; background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 5px; font-family: monospace; font-size: 11px;">${result.url}</p>

      <p style="margin: 10px 0 5px 0; font-size: 12px; font-weight: bold;">🎯 Risk Level:</p>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="flex: 1; height: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; overflow: hidden;">
          <div style="width: ${result.riskScore}%; height: 100%; background: white;"></div>
        </div>
        <span style="font-weight: bold; font-size: 14px;">${result.riskScore}%</span>
      </div>
      <p style="margin: 5px 0; font-size: 12px; color: #ffe0e0;">${result.verdict}</p>

      <p style="margin: 10px 0 5px 0; font-size: 12px; font-weight: bold;">⚠️ Why it's suspicious:</p>
      <ul style="margin: 5px 0; padding-left: 20px; font-size: 12px;">
        ${reasonsHtml}
      </ul>
    </div>

    <button id="phishing-block" style="
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      background: white;
      color: #ff6b6b;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: transform 0.2s;
    ">
      ❌ BLOCK THIS LINK
    </button>

    <button id="phishing-continue" style="
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: transform 0.2s;
    ">
      ⚠️ CONTINUE ANYWAY
    </button>

    <p style="margin: 15px 0 0 0; font-size: 11px; text-align: center; opacity: 0.8;">
      🔐 Phishing Shield - Friction for Security
    </p>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Block button
  document.getElementById('phishing-block').addEventListener('click', () => {
    console.log('User blocked the link');
    overlay.remove();
    alert('✅ Link blocked! You were protected from a phishing attempt.');
  });

  // Continue button
  document.getElementById('phishing-continue').addEventListener('click', () => {
    console.log('User continuing to link');
    overlay.remove();
    window.location.href = result.url;
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
    }
  }, { once: true });
}

console.log('✅ Phishing Shield ready!');
