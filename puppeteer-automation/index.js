// Puppeteer + Free Claude API Integration
// Runs locally & deploys to HF Spaces

const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cron = require('node-cron');
const app = express();

app.use(express.json());

// ==================== CONFIG ====================
const FREE_CLAUDE_ENDPOINT = process.env.FREE_CLAUDE_ENDPOINT || 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const PORT = process.env.PORT || 3000;

let browser = null;

// ==================== INIT BROWSER ====================
async function initBrowser() {
  if (browser) return browser;
  
  const isHeadless = process.env.HEADLESS !== 'false';
  const launchArgs = isHeadless ? 
    { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] } :
    { headless: false };
  
  browser = await puppeteer.launch(launchArgs);
  console.log('✅ Browser initialized');
  return browser;
}

// ==================== CLAUDE INTEGRATION ====================
async function callClaude(prompt, systemPrompt = '') {
  try {
    if (!CLAUDE_API_KEY) {
      return { error: 'CLAUDE_API_KEY not set' };
    }

    const response = await axios.post(FREE_CLAUDE_ENDPOINT, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
      ...(systemPrompt && { system: systemPrompt })
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude error:', error.message);
    return { error: error.message };
  }
}

// ==================== PUPPETEER TASKS ====================

// Task 1: Screenshot a URL
app.post('/api/screenshot', async (req, res) => {
  const { url, filename } = req.body;
  
  try {
    const b = await initBrowser();
    const page = await b.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `/tmp/${filename || 'screenshot.png'}` });
    await page.close();
    
    res.json({ success: true, file: filename || 'screenshot.png' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task 2: Scrape page content
app.post('/api/scrape', async (req, res) => {
  const { url, selector } = req.body;
  
  try {
    const b = await initBrowser();
    const page = await b.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const data = await page.evaluate((sel) => {
      if (sel) {
        return Array.from(document.querySelectorAll(sel)).map(el => el.innerText);
      }
      return document.body.innerText;
    }, selector);
    
    await page.close();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task 3: Form automation
app.post('/api/fill-form', async (req, res) => {
  const { url, formData } = req.body;
  
  try {
    const b = await initBrowser();
    const page = await b.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    for (const [selector, value] of Object.entries(formData)) {
      await page.type(selector, value);
    }
    
    await page.screenshot({ path: '/tmp/filled-form.png' });
    await page.close();
    
    res.json({ success: true, screenshot: 'filled-form.png' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task 4: Generate content with Claude + capture screenshot
app.post('/api/ai-content', async (req, res) => {
  const { prompt, screenshotUrl } = req.body;
  
  try {
    // Get AI response
    const aiResponse = await callClaude(prompt);
    
    // If URL provided, screenshot it
    let screenshot = null;
    if (screenshotUrl) {
      const b = await initBrowser();
      const page = await b.newPage();
      await page.goto(screenshotUrl, { waitUntil: 'networkidle2' });
      await page.screenshot({ path: '/tmp/ai-task-screenshot.png' });
      await page.close();
      screenshot = 'ai-task-screenshot.png';
    }
    
    res.json({ 
      success: true, 
      aiResponse, 
      screenshot 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task 5: Click & interact
app.post('/api/interact', async (req, res) => {
  const { url, actions } = req.body;
  // actions = [{ type: 'click', selector: '.button' }, { type: 'type', selector: 'input', text: 'hello' }]
  
  try {
    const b = await initBrowser();
    const page = await b.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    for (const action of actions) {
      if (action.type === 'click') {
        await page.click(action.selector);
      } else if (action.type === 'type') {
        await page.type(action.selector, action.text);
      } else if (action.type === 'wait') {
        await page.waitForTimeout(action.ms || 1000);
      }
    }
    
    await page.screenshot({ path: '/tmp/interaction-result.png' });
    await page.close();
    
    res.json({ success: true, screenshot: 'interaction-result.png' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WEBHOOK ENDPOINT ====================
app.post('/api/trigger', async (req, res) => {
  const { taskType, ...params } = req.body;
  
  console.log(`🔔 Webhook triggered: ${taskType}`);
  
  // Route to appropriate task
  let result;
  switch(taskType) {
    case 'screenshot':
      // Call screenshot endpoint internally
      result = await axios.post(`http://localhost:${PORT}/api/screenshot`, params);
      break;
    case 'scrape':
      result = await axios.post(`http://localhost:${PORT}/api/scrape`, params);
      break;
    case 'ai-content':
      result = await axios.post(`http://localhost:${PORT}/api/ai-content`, params);
      break;
    default:
      return res.status(400).json({ error: 'Unknown task type' });
  }
  
  res.json(result.data);
});

// ==================== SCHEDULED TASKS ====================
// Example: Run a task every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('⏰ Scheduled task running...');
  // Add your recurring task here
  // e.g., scrape a page, generate content, take screenshots
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Puppeteer + Claude server running on port ${PORT}`);
  console.log(`📡 Webhook: POST http://localhost:${PORT}/api/trigger`);
});

process.on('exit', async () => {
  if (browser) await browser.close();
});

