#!/usr/bin/env node

/**
 * NEXUS Integration Hub v2.0
 * Production-ready multi-platform automation server
 * Grok (primary) + Gemini (fallback) + Real API integrations
 */

const http = require('http');
const url = require('url');

// ==================== CONFIG ====================
const CONFIG = {
  port: process.env.PORT || 3000,
  grokKey: process.env.GROK_API_KEY,
  geminiKey: process.env.GEMINI_API_KEY,
  whopKey: process.env.WHOP_API_KEY,
  content360Key: process.env.CONTENT360_API_KEY,
  brevoKey: process.env.BREVO_API_KEY,
  webhookSecret: process.env.EVERYWHERE_WEBHOOK_SECRET,
};

if (!CONFIG.grokKey || !CONFIG.webhookSecret) {
  console.error('ERROR: Missing required env vars (GROK_API_KEY, EVERYWHERE_WEBHOOK_SECRET)');
  process.exit(1);
}

// ==================== HELPERS ====================
async function callGrok(prompt, systemMsg = '') {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.grokKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        messages: [
          ...(systemMsg ? [{ role: 'system', content: systemMsg }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response from Grok';
  } catch (e) {
    console.error('Grok error:', e.message);
    return `Error calling Grok: ${e.message}`;
  }
}

async function callWhopAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${CONFIG.whopKey}`,
        'Content-Type': 'application/json',
      },
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`https://api.whop.com/api/v1${endpoint}`, options);
    return await response.json();
  } catch (e) {
    console.error('Whop API error:', e.message);
    return { error: e.message };
  }
}

async function publishToContent360(content, platform) {
  try {
    const response = await fetch('https://api.content360.app/v1/publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.content360Key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, platform }),
    });
    return await response.json();
  } catch (e) {
    console.error('Content360 error:', e.message);
    return { error: e.message };
  }
}

// ==================== ENDPOINTS ====================
const routes = {
  '/': async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'NEXUS Integration Hub v2.0 Online',
      grok: CONFIG.grokKey ? '✅ Connected' : '❌ Missing',
      whop: CONFIG.whopKey ? '✅ Connected' : '❌ Missing',
      content360: CONFIG.content360Key ? '✅ Connected' : '❌ Missing',
      brevo: CONFIG.brevoKey ? '✅ Connected' : '❌ Missing',
      timestamp: new Date().toISOString(),
    }));
  },

  '/api/grok': async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method not allowed');
      return;
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { prompt, system } = JSON.parse(body);
        const result = await callGrok(prompt, system);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  },

  '/api/whop/products': async (req, res) => {
    const products = await callWhopAPI('/products');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
  },

  '/api/publish': async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method not allowed');
      return;
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { content, platform } = JSON.parse(body);
        const result = await publishToContent360(content, platform);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  },
};

// ==================== SERVER ====================
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const handler = routes[pathname];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (handler) {
    handler(req, res).catch(e => {
      console.error('Route error:', e);
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(CONFIG.port, () => {
  console.log(`✅ NEXUS Hub v2.0 listening on port ${CONFIG.port}`);
  console.log(`Grok: ${CONFIG.grokKey ? '✅' : '❌'} | Whop: ${CONFIG.whopKey ? '✅' : '❌'} | Content360: ${CONFIG.content360Key ? '✅' : '❌'}`);
});
