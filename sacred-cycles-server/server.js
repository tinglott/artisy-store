const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Sacred Cycles app is running', timestamp: new Date() });
});

// Serve the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'satori_sacred_cycles.html'));
});

// Serve the app on any route (for single-page app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'satori_sacred_cycles.html'));
});

app.listen(PORT, () => {
  console.log(`Sacred Cycles Satori app running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});
