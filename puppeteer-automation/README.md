---
title: Puppeteer Claude Automation
emoji: 🚀
colorFrom: gray
colorTo: gray
sdk: docker
pinned: false
---

# 🚀 Puppeteer + Claude Automation Suite

Free headless browser automation with Claude AI integration. Deploy to HF Spaces or run locally.

## Features

✅ **Screenshot URLs** — Capture page state  
✅ **Web Scraping** — Extract text & data  
✅ **Form Automation** — Fill & submit forms  
✅ **AI Content Generation** — Claude + browser tasks  
✅ **Click & Interact** — Browser user actions  
✅ **Webhooks** — Trigger via webhook  
✅ **Scheduled Tasks** — Cron-based automation  

## Environment Variables

```
CLAUDE_API_KEY=your_api_key_here
FREE_CLAUDE_ENDPOINT=https://api.anthropic.com/v1/messages (optional)
PORT=3000 (default)
HEADLESS=true (default)
```

## API Endpoints

### 1. Screenshot
```bash
curl -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "filename": "page.png"
  }'
```

### 2. Scrape
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selector": "h1, p"
  }'
```

### 3. Fill Form
```bash
curl -X POST http://localhost:3000/api/fill-form \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/form",
    "formData": {
      "input[name=\"email\"]": "test@example.com",
      "input[name=\"password\"]": "password123"
    }
  }'
```

### 4. AI Content + Screenshot
```bash
curl -X POST http://localhost:3000/api/ai-content \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate 3 social media hooks for digital products",
    "screenshotUrl": "https://artisy-store.com"
  }'
```

### 5. Interact (Click & Type)
```bash
curl -X POST http://localhost:3000/api/interact \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "actions": [
      { "type": "click", "selector": ".search-button" },
      { "type": "type", "selector": "input[type=\"search\"]", "text": "query" },
      { "type": "wait", "ms": 2000 },
      { "type": "click", "selector": ".submit" }
    ]
  }'
```

### 6. Webhook Trigger
```bash
curl -X POST http://localhost:3000/api/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "ai-content",
    "prompt": "Write a product description",
    "screenshotUrl": "https://example.com"
  }'
```

### 7. Health Check
```bash
curl http://localhost:3000/health
```

## Local Setup

```bash
npm install
CLAUDE_API_KEY=your_key npm start
```

## Deploy to HF Spaces

1. Create new Space (Docker SDK)
2. Clone repo
3. Add secrets: `CLAUDE_API_KEY`
4. Push code
5. Auto-deploys in ~2-3 min

## Webhooks & Scheduling

Webhook endpoint for external triggers:
```
POST https://your-space.hf.space/api/trigger
```

Add scheduled tasks in `index.js` using cron syntax:
```javascript
cron.schedule('0 9 * * *', async () => {
  // Your task here
});
```

## Zero-Cost Free Claude Setup

If using free tier or proxy:
1. Update `FREE_CLAUDE_ENDPOINT`
2. Use compatible API key format
3. Adjust `model` parameter as needed

---

**Ting's Automation Stack** | Build headless browser + AI workflows with zero cost 🚀
