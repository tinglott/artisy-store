# ✨ Ting's Smart Companion — Deployment Guide

## Overview
A **smart AI companion** that lives on your website, helping visitors understand your expertise and build trust. Not a chatbot—a contextual, helpful guide powered by your RN + mental health credentials.

**Architecture:**
- Frontend: HTML5 + vanilla JS (lightweight, no dependencies)
- Brain: Hybrid fallback chain (Ollama local → Groq → Gemini)
- Knowledge: Ting's 15+ years psychiatric nursing + trending data
- Deployment: GitHub Pages (instant, free)

---

## What It Does

### For Visitors:
- **Ask anything** about mental health, wellness, emotional regulation
- **Get answers** grounded in Ting's actual clinical experience
- **Discover CopeSheets** naturally when relevant (never pushy)
- **Feel trust** because they're talking to someone who knows

### For You:
- **Proves expertise** without you having to be present 24/7
- **Builds brand credibility** with every conversation
- **Handles FAQs** automatically
- **Works offline** (if Ollama is running) or falls back to cloud

---

## Architecture

```
┌─────────────────────────────────────┐
│  Website Visitor                     │
│  (Companion chat interface)          │
└──────────────┬──────────────────────┘
               │
               ▼
       ┌───────────────────┐
       │   Frontend JS     │
       │  (index.html)     │
       └────────┬──────────┘
                │
        ┌───────┴─────────────┬──────────────┬──────────────┐
        │                     │              │              │
        ▼                     ▼              ▼              ▼
    ┌────────┐         ┌──────────┐   ┌──────────┐   ┌────────────┐
    │ Ollama │         │  Groq    │   │ Gemini   │   │ Fallback   │
    │(Local) │         │ (Cloud)  │   │(Cloud)   │   │(Knowledge) │
    └────────┘         └──────────┘   └──────────┘   └────────────┘
       (1)                 (2)            (3)             (4)
       
    Try local first → Fall back to cloud → Fall back to knowledge base
```

---

## Deployment Steps

### Step 1: Add to GitHub
Push the companion folder to your `gh-pages` branch:

```bash
# Files to push:
/5day-challenge/index.html          # Main companion interface
/5day-challenge/companion-api.js    # (Optional reference)
```

**Command:**
```bash
git add 5day-challenge/
git commit -m "Add Ting's Smart Companion"
git push origin gh-pages
```

**Live at:** `https://shop.artistrystore.com/5day-challenge/`

### Step 2: Embed on Your Website
Add this to `store.html` (or any page):

```html
<!-- Ting's Smart Companion -->
<section class="companion-embed">
    <h2>Ask Ting's Companion</h2>
    <iframe 
        src="/5day-challenge/" 
        style="width: 100%; height: 600px; border: none; border-radius: 12px;"
        title="Ting's Smart Companion"
    ></iframe>
</section>
```

Or link directly:
```html
<a href="/5day-challenge/" target="_blank">Chat with Ting's Companion →</a>
```

### Step 3: (Optional) Run Ollama Locally
For best performance, run Ollama on your machine:

```bash
# Install Ollama: https://ollama.ai

# Pull Hermes model:
ollama pull hermes2

# Start server (runs on localhost:11434):
ollama serve
```

When Ollama is running, the companion uses it first (fastest, most private).

---

## Configuration

### API Keys
The companion uses free APIs:

1. **Groq** — Free tier, no auth required
   - Model: `mixtral-8x7b-32768`
   - Key: Already configured in code

2. **Gemini** — Free tier, no auth required
   - Model: `gemini-2.5-flash`
   - Key: Already configured in code

3. **Ollama** — Self-hosted, completely free
   - Model: `hermes2`
   - No key needed

---

## What Visitors See

### First Message
> "Hi! I'm Ting's Smart Companion. I'm here to help with questions about mental health, wellness, or just being human. Ting's a psychiatric nurse with 15+ years of real experience. What's on your mind?"

### Example Exchanges

**Q: I'm stressed about work**
> "Stress is real. Ting teaches grounding from 15+ years of nursing—the 5-4-3-2-1 sense exercise, box breathing, body scans. These are clinically proven ways to calm your nervous system. CopeSheets has practical cards for each technique."

**Q: Who is Ting?**
> "I'm Ting's Smart Companion. Ting Lott is a psychiatric nurse with 15+ years of clinical experience helping people through mental health challenges. She's also taught elementary school and is an ordained minister. She knows wellness from the inside."

**Q: What are CopeSheets?**
> "CopeSheets are grounding tools built from Ting's nursing experience—practical cards with techniques for stress, anxiety, grief, insomnia. $1.99 on our marketplace. Simple, effective, and designed by someone who actually knows what works."

---

## Performance

### Response Time
- **Ollama (local):** < 3 seconds
- **Groq (cloud):** 1-2 seconds
- **Gemini (cloud):** 1-2 seconds
- **Fallback (knowledge):** < 500ms

### Browser Support
- Chrome, Firefox, Safari, Edge
- Mobile: Full responsive design
- No login required

---

## Customization

### Change the Personality
Edit the `COMPANION_SYSTEM` prompt in `index.html`:

```javascript
const COMPANION_SYSTEM = `You are Ting's Smart Companion...`
```

### Add More Knowledge
Expand the fallback knowledge base in `buildFallbackResponse()`:

```javascript
if (lower.includes('your-topic')) {
    return "Your answer here...";
}
```

### Integrate Wikipedia / Trending
Add this after getting the response:

```javascript
// Fetch trending health topics
const wikiResp = await fetch('https://en.wikipedia.org/w/api.php?...');
```

---

## Analytics

Track conversations (optional):

```javascript
// Add to sendMessage():
console.log({
    timestamp: new Date(),
    userMessage: text,
    companionResponse: response.text,
    source: response.source
});

// Send to analytics service (Mixpanel, Segment, etc.)
```

---

## Troubleshooting

### "Local Ollama not found"
- Make sure Ollama is running: `ollama serve`
- Check it's accessible: `curl http://localhost:11434/api/generate`

### "Groq failed"
- Verify API key in code (already set)
- Check rate limits (free tier: 30 req/min)

### "Gemini failed"
- Verify key is valid (already set)
- Check quota limits

### Falls back to Knowledge Base
- All cloud APIs down? This is expected
- Fallback uses keyword matching (still helpful)

---

## Next Steps

1. ✅ Push to GitHub Pages
2. ✅ Add iframe/link to store.html
3. ✅ Test with questions about wellness, mental health, CopeSheets
4. ✅ (Optional) Run Ollama locally for best UX
5. ✅ Share link on social: "Ask Ting's Companion anything about wellness"

---

## Support

Questions? Check:
- Ollama docs: https://ollama.ai
- Groq docs: https://console.groq.com/docs
- Gemini docs: https://ai.google.dev

**The companion is live and ready. Your voice is in it. Let it work for you.** 🌟