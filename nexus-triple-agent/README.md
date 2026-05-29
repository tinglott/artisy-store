# 🚀 NEXUS TRIPLE-AGENT SYSTEM

**Three autonomous agents working together. One unified API.**

---

## What You Get

### Tier 1: OpenHuman 🖥️
- Desktop application control
- Mouse, keyboard, screenshots
- Voice interaction
- Application automation
- Real-time task execution
- **Cost: $0**

### Tier 2: Hermes Agent 🤖
- 27+ messaging platforms
- Web scraping & browser automation
- IDE integration (VS Code, Zed, JetBrains)
- Plugin ecosystem
- File system access
- **Cost: ~$0.01–0.10/task**

### Tier 3: Gemini (Fallback) ✨
- Text analysis & generation
- Code generation
- Reasoning tasks
- Always available
- **Cost: FREE**

---

## Quick Start (35 min)

### 1. Install Everything

```bash
./install-all.sh
```

### 2. Setup Environment

```bash
cp .env.template .env
# Edit .env with your API keys
```

### 3. Start Services

```bash
# Terminal 1: OpenHuman
open /Applications/OpenHuman.app

# Terminal 2: NEXUS Hub
cd ~/.nexus
npm start
```

### 4. Test

```bash
curl http://localhost:4000/health
```

---

## API Examples

### Desktop Task
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"desktop","prompt":"Open Calculator"}'
```

### Multi-Platform Task
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"platform","prompt":"Post to Instagram, TikTok, LinkedIn"}'
```

### Reasoning Task
```bash
curl -X POST http://localhost:4000/nexus/task \
  -H 'Content-Type: application/json' \
  -d '{"taskType":"reasoning","prompt":"Analyze data and summarize"}'
```

---

## Files

| File | Purpose |
|------|---------|
| `nexus-integration-hub.js` | Main routing engine (424 lines) |
| `package.json` | Dependencies |
| `install-all.sh` | One-command installer |
| `.env.template` | Environment template |
| `DEPLOYMENT_GUIDE.md` | Full setup instructions |

---

## Costs

| Component | Cost |
|-----------|------|
| OpenHuman | $0 |
| Hermes | ~$0.30/mo |
| Gemini | FREE |
| Render hosting | FREE |
| **TOTAL** | **~$0.30/mo** |

---

## Deploy to Render (Always-On)

1. https://dashboard.render.com → "New" → "Web Service"
2. Connect GitHub: branch `triple-agent-deploy`
3. Add env vars from `.env.template`
4. Click "Create"
5. Live in 3-5 min

---

## Learn More

- **OpenHuman:** https://github.com/tinyhumansai/openhuman (29.5K ⭐)
- **Hermes:** https://github.com/nousresearch/hermes-agent
- **Full Setup:** See `DEPLOYMENT_GUIDE.md`

---

## You Now Have

A true **multi-agent autonomous system** that:
- Controls your desktop
- Distributes to 27+ platforms
- Learns from experience
- Costs $0.30/month
- Runs in 35 minutes

**That's the power of three tiers.** 🚀
