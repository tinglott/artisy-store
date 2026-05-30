# NEXUS Integration Hub v2.0

Production-ready multi-platform automation server with Grok AI, Whop API, and Content360.

## Quick Start

```bash
npm install
cp .env.template .env
# Edit .env with your API keys
npm start
```

## Environment Variables

Required:
- `GROK_API_KEY` — xAI Grok API token
- `EVERYWHERE_WEBHOOK_SECRET` — Secure webhook token

Optional (for full features):
- `GEMINI_API_KEY` — Google Gemini fallback
- `WHOP_API_KEY` — Whop store management
- `CONTENT360_API_KEY` — Social media publishing
- `BREVO_API_KEY` — Email marketing

## API Endpoints

- `GET /` — Status & connection status
- `POST /api/grok` — Call Grok AI (body: `{prompt, system}`)
- `GET /api/whop/products` — List Whop products
- `POST /api/publish` — Publish to social platforms (body: `{content, platform}`)

## Deployment (Vercel)

Env vars are pre-configured in Vercel dashboard. Deploy with:

```bash
vercel deploy
```

Server will start on `process.env.PORT` (default 3000).

## Hermes Integration

Install the Hermes business skill for CLI automation:

```bash
cp hermes-ting-business-skill.json ~/.hermes/skills/
```

Then use:

```bash
hermes -z "list my Whop products"
hermes -z "publish a viral post about my products"
```
