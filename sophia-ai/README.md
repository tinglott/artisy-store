# Sophia v7.0 — AI Influencer & Concierge

**Created by T. Lott Creative**

Sophia is your AI-powered influencer, concierge, and empathetic sales assistant. She combines therapeutic empathy, marketing intelligence, body language analysis, and witty charm into one system.

## Features

- 🎤 **Voice Input** — Talk to Sophia using your microphone (Whisper speech-to-text)
- 📹 **Body Language Analysis** — Webcam reads engagement via MediaPipe
- 🧠 **Adaptive Responses** — Switches between empathy, education, and sales based on mood
- 🗣️ **Natural Voice** — Edge-TTS with Ava Multilingual Neural voice
- 💾 **Memory** — Remembers previous conversations per session
- 🔍 **Research** — Wikipedia + YouTube trend scraping for real-time knowledge
- 🏠 **100% Local** — Runs on Ollama (no cloud API required)

## Quick Start

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install [Ollama](https://ollama.ai) and pull a model:
```bash
ollama pull llama3.2
```

### Run with Docker
```bash
cd sophia-ai
docker compose up --build
```

Open **http://localhost:8000** in your browser.

### Run without Docker
```bash
cd sophia-ai
pip install -r requirements.txt
playwright install chromium
ollama serve &
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## Architecture

```
sophia-ai/
├── backend/
│   └── main.py          # FastAPI server + all AI logic
├── frontend/
│   └── index.html       # WebRTC client (webcam + mic + chat)
├── static/
│   └── responses/       # Generated TTS audio files
├── data/
│   └── sophia.db        # SQLite conversation + memory storage
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## AI Stack

| Component | Technology | Purpose |
|-----------|-----------|----------|
| LLM | Ollama (llama3.2) | Conversation intelligence |
| Speech-to-Text | OpenAI Whisper | Voice input processing |
| Text-to-Speech | Edge-TTS (Ava Neural) | Natural voice output |
| Body Language | MediaPipe | Pose + face + hand analysis |
| Agent Framework | LangGraph | Stateful conversation flow |
| Research | Wikipedia + Playwright | Background knowledge |
| Storage | SQLite | Conversations + memory |

## Products Sophia Knows About

- **Sacred Cycles Renewal Course** — 4-week transformation for burned-out professionals
- **Romance Audiobooks** — Love stories with heart ($4.99 each)
- **Wellness Wall Art** — Nature-inspired printable art ($2.99)
- **Words of Life** — Free bonus with every purchase

## Store Links

- 🛒 **Whop**: https://whop.com/tlott12
- 🛒 **Gumroad**: https://tlott12.gumroad.com

## LemonAI Integration (Future Enhancement)

Sophia can be enhanced with [LemonAI](https://github.com/hexdocom/lemonai) for:
- Self-evolving capabilities (learns from every conversation)
- Code interpreter sandbox
- Deep research reports
- Multi-tool integrations

To integrate: Fork LemonAI, add Sophia's personality prompts to the agent config, and connect Ollama as the LLM backend.

---

© 2026 T. Lott Creative. All rights reserved.