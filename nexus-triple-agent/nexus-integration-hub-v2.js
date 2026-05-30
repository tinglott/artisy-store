#!/usr/bin/env node

/**
 * NEXUS INTEGRATION HUB v2.0 — TING'S FULL SYSTEM
 * Grok (PRIMARY) + Gemini (FALLBACK) + Hermes CLI
 *
 * REAL platform connections:
 *  Whop API       -> product management + sales data
 *  Content360     -> YouTube + Instagram + LinkedIn
 *  Brevo          -> email marketing (list 3)
 *  Dev.to         -> blog publishing
 *  Switchy        -> short links
 *  Grok (xAI)     -> content generation (PRIMARY LLM)
 *  Gemini         -> fallback reasoning
 *  Hermes CLI     -> Twitter/X, Telegram, Discord, 27+ platforms
 */

'use strict';

const http   = require('http');
const https  = require('https');
const { exec } = require('child_process');
const util   = require('util');
const execPromise = util.promisify(exec);

const PORT              = process.env.PORT || 4000;
const GROK_KEY          = process.env.GROK_API_KEY;
const GEMINI_KEY        = process.env.GEMINI_API_KEY;
const WHOP_KEY          = process.env.WHOP_API_KEY;
const CONTENT360_KEY    = process.env.CONTENT360_API_KEY;
const CONTENT360_WS     = process.env.CONTENT360_WORKSPACE || '45e309be-a9df-4509-a329-1ffb6e48272b';
const BREVO_KEY         = process.env.BREVO_API_KEY;
const DEVTO_KEY         = process.env.DEVTO_API_KEY;
const SWITCHY_KEY       = process.env.SWITCHY_API_KEY;

const C360 = { youtube: '124523', instagram: '124522', linkedin: '124525' };
const WHOP_BIZ_ID = 'biz_Ab80KlD47F4YUN';
const HERMES_VENV = process.env.HERMES_VENV || '/home/tasklet/hermes-venv';
const HERMES_CMD  = `source ${HERMES_VENV}/bin/activate && hermes`;

// MEMORY STORE
const Memory = {
  logs: [],
  metrics: { grok:0, gemini:0, hermes:0, whop:0, content360:0, brevo:0, devto:0, total_tasks:0, started: Date.now() },
  log(level, msg, source='nexus') {
    this.logs.push({ ts: new Date().toISOString(), level, msg, source });
    if (this.logs.length > 5000) this.logs = this.logs.slice(-2500);
    console.log(`[${level.toUpperCase()}][${source}] ${msg}`);
  }
};

// HTTP HELPER
function apiCall(url, opts={}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const body = opts.body ? JSON.stringify(opts.body) : null;
    const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}), ...(body ? {'Content-Length': Buffer.byteLength(body)} : {}) };
    const req = lib.request({ hostname: parsed.hostname, port: parsed.port||(parsed.protocol==='https:'?443:80), path: parsed.pathname+parsed.search, method: opts.method||'GET', headers }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, data }); } });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// 1. GROK — PRIMARY LLM
const GrokAgent = {
  async generate(prompt, sys='', maxTokens=2048) {
    if (!GROK_KEY) throw new Error('GROK_API_KEY not set');
    const messages = [];
    if (sys) messages.push({ role:'system', content:sys });
    messages.push({ role:'user', content:prompt });
    const res = await apiCall('https://api.x.ai/v1/chat/completions', {
      method:'POST', headers:{ Authorization:`Bearer ${GROK_KEY}` },
      body:{ model:'grok-3-mini', messages, max_tokens:maxTokens, temperature:0.8 }
    });
    if (res.status !== 200) throw new Error(`Grok error ${res.status}: ${JSON.stringify(res.data)}`);
    Memory.metrics.grok++;
    return res.data.choices[0].message.content;
  },

  async generateAdCaption(product) {
    const sys = `You are a viral social media copywriter for Ting's digital product store at whop.com/tlott12. Hook first. Boom shakalack boom energy. Always end with CTA to whop.com/tlott12`;
    return this.generate(`Write a viral TikTok/Instagram caption for: ${product.name} ($${product.price||'varies'}). Category: ${product.category||'digital product'}. 3-4 lines max. Hook first. 3-5 emojis. CTA: whop.com/tlott12`, sys, 512);
  },

  async generateBlogPost(keyword) {
    const sys = `Health and wellness writer. Tone: 23-year registered nurse. No AI fluff. No: elevate, enhance, top-notch. Mention whop.com/tlott12 naturally.`;
    return this.generate(`Write 1200-word SEO blog post for keyword: "${keyword}". Include H1, 3-4 H2s, intro, practical advice, CTA to whop.com/tlott12`, sys, 2000);
  },

  async generateVideoScript(product, style='hook') {
    const sys = `Write 45-60 sec video scripts. Format: Hook (7s) -> Problem (10s) -> Solution (25s) -> CTA (10s). End: Get yours at whop.com/tlott12`;
    return this.generate(`Script for: ${product.name}. Style: ${style}. Target: women seeking wellness`, sys, 600);
  },

  async generateEmail(subject, productName, segment='wellness') {
    const sys = `Email copywriter for Ting Lott's digital products. Nurse-like tone. Real talk. Store: whop.com/tlott12`;
    return this.generate(`Email: Subject: ${subject}. Product: ${productName}. Segment: ${segment}. 150-200 words. Clear CTA to whop.com/tlott12`, sys, 800);
  }
};

// 2. GEMINI — FALLBACK
const GeminiAgent = {
  async generate(prompt, maxTokens=2048) {
    if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not set');
    const res = await apiCall(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method:'POST',
      body:{ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.7, maxOutputTokens:maxTokens } }
    });
    if (res.status !== 200) throw new Error(`Gemini error ${res.status}`);
    Memory.metrics.gemini++;
    return res.data.candidates[0].content.parts[0].text;
  }
};

// 3. WHOP API
const WhopAgent = {
  async listProducts(limit=20) {
    if (!WHOP_KEY) throw new Error('WHOP_API_KEY not set');
    const res = await apiCall(`https://api.whop.com/api/v2/companies/${WHOP_BIZ_ID}/products?per=${limit}`, { headers:{ Authorization:`Bearer ${WHOP_KEY}` } });
    Memory.metrics.whop++;
    if (res.status !== 200) throw new Error(`Whop error ${res.status}`);
    return res.data.data || [];
  },
  async getProduct(id) {
    if (!WHOP_KEY) throw new Error('WHOP_API_KEY not set');
    const res = await apiCall(`https://api.whop.com/api/v2/products/${id}`, { headers:{ Authorization:`Bearer ${WHOP_KEY}` } });
    Memory.metrics.whop++;
    return res.data;
  },
  async getMemberships(limit=10) {
    if (!WHOP_KEY) throw new Error('WHOP_API_KEY not set');
    const res = await apiCall(`https://api.whop.com/api/v2/memberships?per=${limit}`, { headers:{ Authorization:`Bearer ${WHOP_KEY}`, 'X-Business-Id':WHOP_BIZ_ID } });
    Memory.metrics.whop++;
    return res.data.data || [];
  },
  async getSalesStats() {
    if (!WHOP_KEY) throw new Error('WHOP_API_KEY not set');
    const res = await apiCall(`https://api.whop.com/api/v2/companies/${WHOP_BIZ_ID}/stats`, { headers:{ Authorization:`Bearer ${WHOP_KEY}` } });
    Memory.metrics.whop++;
    return res.data;
  },
  async getRotationProduct() {
    const products = await this.listProducts(97);
    if (!products.length) throw new Error('No products found');
    return products[Math.floor(Math.random()*products.length)];
  }
};

// 4. CONTENT360
const Content360Agent = {
  async postVideo(videoUrl, caption, platforms=['youtube','instagram','linkedin']) {
    if (!CONTENT360_KEY) throw new Error('CONTENT360_API_KEY not set');
    const channelIds = platforms.map(p=>C360[p]).filter(Boolean);
    const res = await apiCall('https://app.content360.co/api/v1/posts', {
      method:'POST',
      headers:{ Authorization:`Bearer ${CONTENT360_KEY}`, 'X-Workspace-Id':CONTENT360_WS },
      body:{ type:'video', channels:channelIds, caption, video_url:videoUrl, publish_now:true }
    });
    Memory.metrics.content360++;
    if (res.status >= 400) throw new Error(`Content360 error ${res.status}: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async schedulePost(caption, platforms, scheduledAt) {
    if (!CONTENT360_KEY) throw new Error('CONTENT360_API_KEY not set');
    const channelIds = platforms.map(p=>C360[p]).filter(Boolean);
    const res = await apiCall('https://app.content360.co/api/v1/posts', {
      method:'POST',
      headers:{ Authorization:`Bearer ${CONTENT360_KEY}`, 'X-Workspace-Id':CONTENT360_WS },
      body:{ type:'text', channels:channelIds, caption, scheduled_at:scheduledAt, publish_now:false }
    });
    Memory.metrics.content360++;
    return res.data;
  }
};

// 5. BREVO
const BrevoAgent = {
  async sendEmail({ to, subject, htmlContent, senderName='Ting Lott', senderEmail='tinglott@gmail.com' }) {
    if (!BREVO_KEY) throw new Error('BREVO_API_KEY not set');
    const res = await apiCall('https://api.brevo.com/v3/smtp/email', {
      method:'POST', headers:{ 'api-key':BREVO_KEY },
      body:{ sender:{ name:senderName, email:senderEmail }, to:Array.isArray(to)?to:[{ email:to }], subject, htmlContent }
    });
    Memory.metrics.brevo++;
    if (res.status >= 400) throw new Error(`Brevo error ${res.status}`);
    return res.data;
  },
  async sendCampaignToList({ listId=3, subject, htmlContent, name }) {
    if (!BREVO_KEY) throw new Error('BREVO_API_KEY not set');
    const res = await apiCall('https://api.brevo.com/v3/emailCampaigns', {
      method:'POST', headers:{ 'api-key':BREVO_KEY },
      body:{ name:name||subject, subject, sender:{ name:'Ting Lott', email:'tinglott@gmail.com' }, htmlContent, recipients:{ listIds:[listId] }, scheduledAt:new Date(Date.now()+60000).toISOString() }
    });
    Memory.metrics.brevo++;
    if (res.status >= 400) throw new Error(`Brevo campaign error ${res.status}`);
    return res.data;
  },
  async getContactCount(listId=3) {
    if (!BREVO_KEY) throw new Error('BREVO_API_KEY not set');
    const res = await apiCall(`https://api.brevo.com/v3/contacts/lists/${listId}`, { headers:{ 'api-key':BREVO_KEY } });
    return res.data;
  }
};

// 6. DEV.TO
const DevToAgent = {
  async publishArticle({ title, body_markdown, tags=['wellness','health','selfcare'], published=true }) {
    if (!DEVTO_KEY) throw new Error('DEVTO_API_KEY not set');
    const res = await apiCall('https://dev.to/api/articles', {
      method:'POST', headers:{ 'api-key':DEVTO_KEY },
      body:{ article:{ title, body_markdown, published, tags:tags.slice(0,4) } }
    });
    if (res.status >= 400) throw new Error(`Dev.to error ${res.status}`);
    Memory.log('info', `Published: ${res.data?.url}`, 'devto');
    return res.data;
  }
};

// 7. SWITCHY
const SwitchyAgent = {
  async createLink({ destination, title, campaign }) {
    if (!SWITCHY_KEY) throw new Error('SWITCHY_API_KEY not set');
    const res = await apiCall('https://api.switchy.io/v1/links', {
      method:'POST', headers:{ Authorization:`Bearer ${SWITCHY_KEY}` },
      body:{ destination_url:destination, title:title||'Ting Store', campaign }
    });
    if (res.status >= 400) throw new Error(`Switchy error ${res.status}`);
    return res.data;
  },
  async updateLink(linkId, destination) {
    const res = await apiCall(`https://api.switchy.io/v1/links/${linkId}`, {
      method:'PUT', headers:{ Authorization:`Bearer ${SWITCHY_KEY}` },
      body:{ destination_url:destination }
    });
    return res.data;
  }
};

// 8. HERMES CLI
const HermesCLI = {
  async run(prompt) {
    Memory.metrics.hermes++;
    const cmd = `bash -c "${HERMES_CMD} -z '${prompt.replace(/'/g,"'\\''")}' 2>&1"`;
    try {
      const { stdout, stderr } = await execPromise(cmd, { timeout:60000 });
      return { success:true, output:stdout||stderr };
    } catch(e) {
      return { success:false, error:e.message };
    }
  },
  async postToTwitter(caption) { return this.run(`Post to Twitter/X: "${caption}" from account @Ziggylott1`); },
  async status() {
    try {
      const { stdout } = await execPromise(`bash -c "${HERMES_CMD} --version 2>&1"`, { timeout:10000 });
      return { available:true, version:stdout.trim() };
    } catch(e) { return { available:false, error:e.message }; }
  }
};

// 9. ORCHESTRATOR
const Orchestrator = {
  async execute(task) {
    const { type, ...p } = task;
    Memory.metrics.total_tasks++;
    Memory.log('info', `Task: ${type}`, 'orchestrator');
    try {
      switch(type) {
        case 'generate_caption':     return await this._genCaption(p);
        case 'generate_blog':        return await this._genBlog(p);
        case 'generate_video_script':return await this._genScript(p);
        case 'generate_email':       return await this._genEmail(p);
        case 'whop_list_products':   return { success:true, data: await WhopAgent.listProducts(p.limit||20) };
        case 'whop_get_product':     return { success:true, data: await WhopAgent.getProduct(p.product_id) };
        case 'whop_sales_stats':     return { success:true, data: await WhopAgent.getSalesStats() };
        case 'whop_memberships':     return { success:true, data: await WhopAgent.getMemberships(p.limit||10) };
        case 'post_video':           return await this._postVideo(p);
        case 'post_twitter':         return await HermesCLI.postToTwitter(p.caption);
        case 'schedule_post':        return { success:true, data: await Content360Agent.schedulePost(p.caption, p.platforms||['instagram','linkedin'], p.scheduled_at) };
        case 'full_campaign':        return await this._fullCampaign(p);
        case 'daily_ad_rotation':    return await this._adRotation(p);
        case 'send_email':           return { success:true, data: await BrevoAgent.sendEmail(p) };
        case 'email_campaign':       return { success:true, data: await BrevoAgent.sendCampaignToList(p) };
        case 'email_list_stats':     return { success:true, data: await BrevoAgent.getContactCount(p.list_id||3) };
        case 'publish_blog':         return await this._publishBlog(p);
        case 'create_link':          return { success:true, data: await SwitchyAgent.createLink(p) };
        case 'update_link':          return { success:true, data: await SwitchyAgent.updateLink(p.link_id, p.destination) };
        case 'hermes_run':           return await HermesCLI.run(p.prompt);
        case 'hermes_status':        return { success:true, data: await HermesCLI.status() };
        case 'system_health':        return this._health();
        default:                     return { success:false, error:`Unknown task: ${type}` };
      }
    } catch(e) {
      Memory.log('error', `Task failed [${type}]: ${e.message}`, 'orchestrator');
      if (['generate_caption','generate_blog','generate_email'].includes(type)) {
        try { const fb = await GeminiAgent.generate(JSON.stringify(p)); return { success:true, data:fb, via:'gemini_fallback' }; }
        catch(ge) { return { success:false, error:`Both LLMs failed: ${e.message} / ${ge.message}` }; }
      }
      return { success:false, error:e.message };
    }
  },

  async _genCaption(p) {
    const product = p.product || (p.rotate ? await WhopAgent.getRotationProduct() : null);
    if (!product) throw new Error('product or rotate:true required');
    const caption = await GrokAgent.generateAdCaption(product);
    return { success:true, data:{ caption, product:product.name } };
  },
  async _genBlog(p) {
    const content = await GrokAgent.generateBlogPost(p.keyword||'wellness tips for women');
    return { success:true, data:{ keyword:p.keyword, content } };
  },
  async _genScript(p) {
    const product = p.product || (p.rotate ? await WhopAgent.getRotationProduct() : null);
    if (!product) throw new Error('product required');
    const script = await GrokAgent.generateVideoScript(product, p.style);
    return { success:true, data:{ script, product:product.name } };
  },
  async _genEmail(p) {
    const content = await GrokAgent.generateEmail(p.subject||'This changes everything', p.product_name||'Sacred Cycles', p.segment||'wellness');
    return { success:true, data:{ email_content:content } };
  },
  async _postVideo(p) {
    if (!p.video_url && !p.video_path) throw new Error('video_url required');
    let caption = p.caption || (p.product ? await GrokAgent.generateAdCaption(p.product) : 'Get yours at whop.com/tlott12!');
    const result = await Content360Agent.postVideo(p.video_url||p.video_path, caption, p.platforms||['youtube','instagram']);
    return { success:true, data:result, caption };
  },
  async _publishBlog(p) {
    let content = p.content, title = p.title;
    if (!content && p.keyword) {
      content = await GrokAgent.generateBlogPost(p.keyword);
      const m = content.match(/^#\s+(.+)$/m);
      title = m ? m[1] : `${p.keyword} Guide`;
    }
    if (!content || !title) throw new Error('content+title or keyword required');
    const result = await DevToAgent.publishArticle({ title, body_markdown:content, tags:p.tags||['wellness','health','selfcare','mindfulness'] });
    return { success:true, data:{ url:result.url, id:result.id, title } };
  },
  async _fullCampaign(p) {
    const product = p.product || await WhopAgent.getRotationProduct();
    const caption = await GrokAgent.generateAdCaption(product);
    const results = { product:product.name, caption };
    if (p.all || p.platforms?.includes('content360')) {
      results.content360 = await Content360Agent.schedulePost(caption, ['youtube','instagram','linkedin'], new Date(Date.now()+300000).toISOString()).catch(e=>({ error:e.message }));
    }
    if (p.all || p.platforms?.includes('twitter')) {
      results.twitter = await HermesCLI.postToTwitter(caption.slice(0,280)).catch(e=>({ error:e.message }));
    }
    if (p.include_blog) {
      results.blog = await this._publishBlog({ keyword:product.name }).catch(e=>({ error:e.message }));
    }
    return { success:true, data:results };
  },
  async _adRotation(p) {
    const slots = p.slots || ['morning','afternoon','evening'];
    const results = [];
    for (const slot of slots) {
      const product = await WhopAgent.getRotationProduct();
      const caption = await GrokAgent.generateAdCaption(product);
      const post = await Content360Agent.schedulePost(caption, ['instagram','linkedin'], new Date(Date.now()+results.length*18000000).toISOString()).catch(e=>({ error:e.message }));
      results.push({ slot, product:product.name, caption, post });
    }
    return { success:true, data:{ rotation:results, total:results.length } };
  },
  _health() {
    return { success:true, data:{ status:'ok', uptime_ms:Date.now()-Memory.metrics.started, metrics:Memory.metrics, platform_keys:{ grok:!!GROK_KEY, gemini:!!GEMINI_KEY, whop:!!WHOP_KEY, content360:!!CONTENT360_KEY, brevo:!!BREVO_KEY, devto:!!DEVTO_KEY, switchy:!!SWITCHY_KEY, hermes:true }, recent_logs:Memory.logs.slice(-10) } };
  }
};

// HTTP SERVER
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type','application/json');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  if (req.method==='OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.url==='/health' && req.method==='GET') {
    res.writeHead(200); res.end(JSON.stringify(Orchestrator._health().data)); return;
  }
  if (req.url==='/platforms' && req.method==='GET') {
    res.writeHead(200); res.end(JSON.stringify({ platforms:[
      { id:'whop',       label:'Whop Store (97 products)',    capabilities:['list_products','get_product','sales_stats','memberships','ad_rotation'], key:!!WHOP_KEY },
      { id:'content360', label:'Content360 (YT+IG+LinkedIn)', capabilities:['post_video','schedule_post'], key:!!CONTENT360_KEY },
      { id:'grok',       label:'Grok AI / xAI (PRIMARY LLM)', capabilities:['generate_caption','generate_blog','generate_script','generate_email'], key:!!GROK_KEY },
      { id:'gemini',     label:'Gemini (FALLBACK LLM)',       capabilities:['generate','reasoning'], key:!!GEMINI_KEY },
      { id:'brevo',      label:'Brevo Email Marketing',       capabilities:['send_email','email_campaign','list_stats'], key:!!BREVO_KEY },
      { id:'devto',      label:'Dev.to Blog (2.5M readers)',  capabilities:['publish_blog','auto_blog_from_keyword'], key:!!DEVTO_KEY },
      { id:'switchy',    label:'Switchy Short Links',         capabilities:['create_link','update_link'], key:!!SWITCHY_KEY },
      { id:'hermes',     label:'Hermes CLI (27+ platforms)',  capabilities:['post_twitter_x','telegram','discord','multi_platform'], key:true }
    ]})); return;
  }
  if (req.url.startsWith('/whop/products') && req.method==='GET') {
    try { const p = await WhopAgent.listProducts(20); res.writeHead(200); res.end(JSON.stringify({ success:true, count:p.length, products:p })); }
    catch(e) { res.writeHead(500); res.end(JSON.stringify({ success:false, error:e.message })); }
    return;
  }
  if (req.url==='/nexus/task' && req.method==='POST') {
    let body='';
    req.on('data', c=>body+=c);
    req.on('end', async () => {
      try {
        const task = JSON.parse(body);
        const result = await Orchestrator.execute(task);
        res.writeHead(result.success?200:400); res.end(JSON.stringify(result));
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({ success:false, error:e.message })); }
    });
    return;
  }
  if (req.url==='/nexus/logs' && req.method==='GET') {
    res.writeHead(200); res.end(JSON.stringify({ logs:Memory.logs.slice(-50), total:Memory.logs.length })); return;
  }
  res.writeHead(404); res.end(JSON.stringify({ error:'Not found. Try: GET /health, GET /platforms, POST /nexus/task' }));
});

server.listen(PORT, () => {
  console.log(`\n=== NEXUS INTEGRATION HUB v2.0 ===`);
  console.log(`Port: ${PORT}`);
  console.log(`Grok:       ${GROK_KEY       ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Gemini:     ${GEMINI_KEY     ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Whop:       ${WHOP_KEY       ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Content360: ${CONTENT360_KEY ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Brevo:      ${BREVO_KEY      ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Dev.to:     ${DEVTO_KEY      ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Switchy:    ${SWITCHY_KEY    ? 'CONNECTED' : 'MISSING KEY'}`);
  console.log(`Hermes CLI: READY (${HERMES_VENV})`);
  console.log(`\nEndpoints: GET /health | GET /platforms | GET /whop/products | POST /nexus/task | GET /nexus/logs\n`);
});

server.on('error', e => { console.error('Server error:', e.message); process.exit(1); });
process.on('SIGINT', () => { server.close(); process.exit(0); });
