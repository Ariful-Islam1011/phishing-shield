const API_SERVER = 'http://localhost:3000';

async function updateStats() {
  try {
    const response = await fetch(`${API_SERVER}/api/stats`);
    const stats = await response.json();

    document.getElementById('analyzed').textContent = stats.linksAnalyzed || 0;
    document.getElementById('detected').textContent = stats.phishingDetected || 0;
    document.getElementById('rate').textContent = stats.detectionRate || '0%';
  } catch (error) {
    console.log('Stats error:', error);
    document.getElementById('analyzed').textContent = 'Error';
  }
}

updateStats();
setInterval(updateStats, 2000); // Update every 2 seconds