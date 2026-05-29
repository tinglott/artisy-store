# 🚀 NEXUS TRIPLE-AGENT DEPLOYMENT GUIDE

## Overview

Three-tier autonomous agent system:
- **Tier 1:** OpenHuman (Desktop automation)
- **Tier 2:** Hermes Agent (27+ platforms)
- **Tier 3:** Gemini (Fallback reasoning)

Total cost: **~$0.30/month**  
Setup time: **35 minutes**

---

## PART A: Install Locally (15 min)

### Automated

```bash
git clone https://github.com/tinglott/artisy-store.git
cd artisy-store/nexus-triple-agent
chmod +x install-all.sh
./install-all.sh
```

### Manual

#### 1. OpenHuman Desktop

**macOS:**
```bash
brew install openhuman
open /Applications/OpenHuman.app
```

**Linux:**
```bash
wget https://github.com/tinyhumansai/openhuman/releases/download/latest/openhuman-x86_64.AppImage
chmod +x openhuman-x86_64.AppImage
./openhuman-x86_64.AppImage &
```

**Windows:**
- Download from: https://github.com/tinyhumansai/openhuman/releases
- Run installer

#### 2. Hermes Agent

```bash
python3 -m pip install hermes-agent
hermes setup
```

#### 3. NEXUS Hub

```bash
mkdir -p ~/.nexus && cd ~/.nexus
cp .env.template .env
# Edit .env with your API keys
npm install
node nexus-integration-hub.js
```

---

## PART B: Deploy to Render (Cloud)

### 1. Go to https://dashboard.render.com

### 2. Click "New +" → "Web Service"

### 3. Connect GitHub
- Repository: `tinglott/artisy-store`
- Branch: `triple-agent-deploy`

### 4. Configuration

**Build Command:**
```bash
cd nexus-triple-agent && npm install
```

**Start Command:**
```bash
cd nexus-triple-agent && node nexus-integration-hub.js
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
GROK_API_KEY=YOUR_GROK_KEY
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

### 5. Click "Create Web Service"

### 6. Wait 3-5 minutes

### 7. Test

```bash
curl https://your-service.onrender.com/health
```

---

## Testing Endpoints

### Health Check
```bash
curl http://localhost:4000/health
```

### Desktop Task (OpenHuman)
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"desktop","prompt":"Open Calculator"}'
```

### Multi-Platform (Hermes)
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"platform","prompt":"Post to Telegram"}'
```

### Reasoning (Gemini)
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"reasoning","prompt":"Explain quantum computing"}'
```

### View Learned Skills
```bash
curl http://localhost:4000/nexus/skills
```

### View Logs
```bash
curl http://localhost:4000/nexus/logs
```

---

## Troubleshooting

### OpenHuman not connecting
```bash
curl http://localhost:19000/health
# If fails, start the app manually
```

### Hermes command not found
```bash
python3 -m pip install --force-reinstall hermes-agent
hermes --version
```

### NEXUS not starting
```bash
node --version  # Should be 18+
npm install
DEBUG=* node nexus-integration-hub.js
```

---

## You're Ready!

✅ Three autonomous agents installed  
✅ Shared memory system  
✅ Unified API  
✅ Production-ready  

**Start sending tasks!** 🚀
