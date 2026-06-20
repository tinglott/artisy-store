# Sacred Cycles Backend

Lead capture API for the Sacred Cycles Renewal landing page.

## Deploy on Replit

1. Import `https://github.com/tinglott/artisy-store` from GitHub
2. Set **Root Directory** to `sacred-cycles-backend` during import
3. In Replit **Secrets** tab, add:
   - `ALLOWED_ORIGINS` → `https://shop.artistrystore.com`
   - `ADMIN_API_KEY` → any secret string you choose (save it!)
4. Click **Run** — server starts automatically
5. Copy your Replit URL and update `sacred-cycles.html` form action

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/subscribe` | Add email to lead list |
| POST | `/api/unsubscribe` | Remove email from lead list |
| GET | `/api/leads` | View all leads (requires `x-admin-key` header) |
