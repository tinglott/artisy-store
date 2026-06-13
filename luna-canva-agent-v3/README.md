# LUNA 3.0 - Lumina Canva Agent

Advanced creative AI agent combining Groq reasoning, Lumina image gen, Canva workflows, and GitHub versioning.

## Features

- **Groq LLM Proxy** — Fast reasoning with llama-3.3-70b-versatile
- **Lumina Image Generation** — AI-powered visual creation (simulated, ready for real Lumina models)
- **Canva Integration** — Design brief export and workflow automation
- **GitHub Sync** — Version control for design assets and iterations
- **Multi-Brand Support** — Sacred Cycles, Lunar Bloom, Cosmic Ritual, Ethereal Studio
- **Agent Modes** — Strategist, Canva Executor, Creative Director, Brand Analyst
- **Health Monitoring** — Real-time system status

## Setup

### 1. Create HuggingFace Space (Docker)

1. Go to https://huggingface.co/spaces
2. Create new Space → Docker runtime
3. Clone/fork this repo or upload files directly

### 2. Add Secrets

In your Space's **Settings → Repository secrets**:
- `GROQ_API_KEY` — Get free from https://console.groq.com (required)
- `HF_TOKEN` — (optional, for Lumina Inference Endpoints)
- `GITHUB_TOKEN` — (optional, for design versioning)

### 3. Deploy

HuggingFace will auto-build and deploy on push. App runs on port 7860.

## Local Testing

```bash
pip install -r requirements.txt
export GROQ_API_KEY="your-key-here"
python app.py
# Navigate to http://localhost:7860
```

## API Endpoints

- `GET /` — Serve LUNA 3.0 UI
- `POST /api/groq` — Proxy to Groq API
- `POST /api/lumina-generate` — Generate images (stub, ready for real Lumina)
- `POST /api/canva-export` — Export design briefs
- `POST /api/github-sync` — Sync to GitHub
- `GET /api/health` — System status

## Real Integrations (Future)

### Lumina Image Generation
```python
# Replace stub with real HF Diffusers pipeline
from huggingface_hub import InferenceClient
client = InferenceClient(token=HF_TOKEN)
image = client.text_to_image(prompt)
```

### Canva Connect API
```python
# Use official Canva starter kit
# https://www.canva.dev/docs/api/reference/design-apis/
```

### GitHub Sync
```python
import requests
# Use GitHub REST API to commit design assets
```

## Pricing (on Gumroad)

LUNA 3.0 — $97 lifetime (already listed, just add product link)

## Support

For issues or improvements, contact Ting Lott.
