# NEXUS Triple Feature Setup
## GPT-4o Vision + Lemon Agent + Everywhere AI

**Status:** ✅ Ready to deploy  
**Date:** May 28, 2026  
**Features Added:** 3 (Vision/Audio, Orchestration, Desktop Integration)

---

## 🎯 What's New

### 1. **Multimodal Vision & Audio (GPT-4o)**
Analyze images, score virality, validate designs, detect optimal upload times.

**Files:**
- `/app/api/nexus/multimodal.ts` — GPT-4o vision module

**Usage:**
```bash
POST /api/nexus
{
  "task": "score virality",
  "agent": "multimodal",
  "context": {
    "imageUrl": "https://...",
    "prompt": "Rate this hook..."
  }
}
```

**Capabilities:**
- `analyzeVision()` — General image analysis
- `scoreViraality()` — Rate content 0-100
- `validateSacredCyclesDesign()` — Brand compliance check
- `detectOptimalUploadTime()` — Best time per platform
- `analyzeProductPresentation()` — Product shot quality
- `analyzeBatch()` — Multiple images at once

---

### 2. **Lemon Agent Orchestrator**
Self-evolving task routing that learns from your successes.

**Files:**
- `/app/api/nexus/lemon-agent.ts` — Orchestration module

**Usage:**
```bash
POST /api/nexus
{
  "task": "register task",
  "agent": "lemon",
  "lemon": {
    "taskType": "social_post",
    "priority": "high",
    "payload": { "contentId": "content_123", "platform": "youtube" }
  }
}
```

**Capabilities:**
- `registerTask()` — Queue task for processing
- `completeTask()` — Log success/failure
- `getLearningProfile()` — View what's working
- `getRecommendations()` — AI-driven suggestions
- `routeSacredCyclesPost()` — Auto-distribute content

**How it learns:**
- Tracks success rate per task type
- Calculates optimal run times
- Recommends frequency adjustments
- Evolves routing rules over time

---

### 3. **Everywhere AI Integration**
Desktop AI assistant that sends webhooks to NEXUS.

**Files:**
- `/app/api/nexus/everywhere-webhook.ts` — Webhook receiver

**Setup (Next Step):**
1. Install Everywhere on your computer (see below)
2. Configure webhook URL: `https://artisy-store-c6xh.vercel.app/api/nexus/everywhere-webhook`
3. Add token to `.env.local`: `EVERYWHERE_API_TOKEN=your_token`

**Supported Actions:**
- `download_video` — Queue video download
- `organize_content` — Auto-organize files
- `trigger_social_post` — Post from desktop selection
- `analyze_screenshot` — Vision analysis of screen
- `create_script` — Generate script from context
- `batch_export` — Export multiple files

---

## 📦 Environment Variables

**New in .env.local:**
```
# Multimodal (uses existing OPENAI_API_KEY)
OPENAI_API_KEY=sk-proj-...

# Lemon Agent
LEMON_AGENT_WEBHOOK=http://localhost:3001/webhook

# Everywhere AI
EVERYWHERE_API_TOKEN=everywhere_secret_token_xyz
```

---

## 🚀 Deployment Steps

### Stage 1: Push to GitHub
```bash
cd /tmp/nexus-build/artisy-store
git add .
git commit -m "feat: Add GPT-4o Vision, Lemon Agent, Everywhere AI integration"
git push origin nexus-deploy
```

### Stage 2: Vercel Redeploy
1. Go to `vercel.com/dashboard`
2. Select `artisy-store-c6xh`
3. Deployments → Click latest
4. Click "Redeploy" (or wait for auto-deploy from GitHub push)

**Expected build time:** 2-3 minutes

### Stage 3: Add Env Vars (Vercel Dashboard)
Settings → Environment Variables:
```
OPENAI_API_KEY = sk-proj-...
LEMON_AGENT_WEBHOOK = http://localhost:3001/webhook
EVERYWHERE_API_TOKEN = everywhere_secret_token_xyz
```

Redeploy after adding variables.

---

## 💻 Install Everywhere AI (Next)

### Option A: Pre-built Windows
1. Go to: https://github.com/Sylinko/Everywhere/releases
2. Download: `Everywhere-x.x.x-windows-x64.exe`
3. Run installer
4. Launch app
5. Configure:
   - **LLM:** Select Claude/GPT-4o
   - **Webhook URL:** `https://artisy-store-c6xh.vercel.app/api/nexus/everywhere-webhook`
   - **Token:** `everywhere_secret_token_xyz` (from env vars)

### Option B: Build from Source
```bash
git clone https://github.com/Sylinko/Everywhere.git
cd Everywhere
npm install
npm run build
npm start
```

---

## 🧪 Quick Test

### Test Multimodal
```bash
curl -X POST https://artisy-store-c6xh.vercel.app/api/nexus \
  -H "Content-Type: application/json" \
  -d '{
    "task": "score virality",
    "agent": "multimodal",
    "context": {
      "imageUrl": "https://via.placeholder.com/1200x630",
      "prompt": "Rate this hook"
    }
  }'
```

### Test Lemon Agent
```bash
curl -X POST https://artisy-store-c6xh.vercel.app/api/nexus \
  -H "Content-Type: application/json" \
  -d '{
    "task": "register task",
    "agent": "lemon",
    "lemon": {
      "taskType": "social_post",
      "priority": "high",
      "payload": { "contentId": "content_123" }
    }
  }'
```

### Test Everywhere Webhook
```bash
curl -X POST https://artisy-store-c6xh.vercel.app/api/nexus/everywhere-webhook \
  -H "Content-Type: application/json" \
  -H "x-everywhere-token: everywhere_secret_token_xyz" \
  -d '{
    "id": "task_123",
    "source": "voice_command",
    "action": "download_video",
    "context": { "timestamp": "2026-05-28T23:00:00Z" },
    "payload": { "url": "https://example.com/video.mp4", "platform": "youtube" },
    "requestToken": "token"
  }'
```

---

## 📊 API Examples

### Sacred Cycles Design Validation
```javascript
const response = await fetch('/api/nexus', {
  method: 'POST',
  body: JSON.stringify({
    task: 'validate Sacred Cycles design',
    agent: 'multimodal',
    context: {
      imageUrl: 'https://github.com/.../sacred_cycles_post_1.png'
    }
  })
})
```

### Auto-Route Content Across Platforms
```javascript
const response = await fetch('/api/nexus', {
  method: 'POST',
  body: JSON.stringify({
    task: 'route Sacred Cycles post',
    agent: 'lemon',
    lemon: {
      taskType: 'social_post',
      priority: 'high',
      payload: {
        contentId: 'post_hormones_v1',
        platforms: ['youtube', 'instagram', 'tiktok']
      }
    }
  })
})
```

### Get AI Recommendations
```javascript
const response = await fetch('/api/nexus', {
  method: 'POST',
  body: JSON.stringify({
    task: 'get recommendations',
    agent: 'lemon'
  })
})

// Response shows:
// - Which task types have highest success rates
// - Optimal times to run each task
// - Suggested frequency adjustments
// - Estimated success probability
```

---

## 🔗 Integrations

### With Content360 (Social Posting)
```javascript
// Lemon routes task → Content360 posts to YouTube/Instagram/LinkedIn
const task = {
  type: 'social_post',
  payload: {
    contentId: 'sc_post_1',
    platform: 'youtube',
    videoUrl: 'https://...',
    title: 'Sacred Cycles: Hormone Health Reset',
    description: '...'
  }
}
```

### With HumanPal (Video Creation)
```javascript
// Lemon tracks HumanPal video generation status
// When complete → Multimodal scores the video frame
// If score > 80 → Lemon routes to social posting
```

### With n8n (Automation)
```javascript
// n8n triggers Lemon Agent for task registration
// Lemon learns success patterns
// n8n uses learning data to optimize workflow
```

---

## 📈 Monitoring

**Dashboard URL:** `/` (NEXUS preview)

**Check Status:**
```bash
curl https://artisy-store-c6xh.vercel.app/api/nexus
```

Returns:
- 5 core agents + 3 new agents
- Feature status
- Webhook endpoints

**Logs:**
- Vercel Dashboard → Functions → /api/nexus
- Real-time request logs
- Error tracking

---

## ⚠️ Important Notes

1. **GPT-4o costs:** ~$0.001 per image analysis (Vision API pricing)
2. **Lemon Agent (local):** Free to self-host
3. **Lemon Agent (cloud):** Check lemonai.ai for pricing
4. **Everywhere AI:** Free (open source)
5. **Vercel:** Free tier (no additional charges)

---

## 🎓 Next Steps

1. ✅ **Today:** Deploy code to GitHub + Vercel
2. ✅ **Today:** Add env vars to Vercel
3. 🔜 **Tomorrow:** Install Everywhere AI on computer
4. 🔜 **Tomorrow:** Test all three features
5. 🔜 **June 6:** Integrate into n8n workflows
6. 🔜 **June 6:** Begin Sacred Cycles automation

---

## 📞 Support

- **GPT-4o Vision:** Check OpenAI API docs for rate limits
- **Lemon Agent:** GitHub: hexdocom/lemonai
- **Everywhere AI:** GitHub: Sylinko/Everywhere
- **NEXUS:** Your deployed endpoint
