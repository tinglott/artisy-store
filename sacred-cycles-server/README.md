# Sacred Cycles Satori - Interactive Course Platform

Complete 8-week healing journey with interactive app, daily practice tracking, and resonance scoring.

## Features

✅ **Interactive 8-Week Course** - Week-by-week navigation with daily practices
✅ **Daily Checklist** - 5 modalities per day (Breathwork, Crystal, Sound, Massage, Acupressure)
✅ **Resonance Score** - Real-time progress tracking (0-100)
✅ **Audio Lessons** - All 8 course lessons embedded
✅ **Reflection Journaling** - Weekly reflection prompts
✅ **Dark/Light Mode** - User preference toggle
✅ **Offline Access** - Progress saves to device, works without internet
✅ **Responsive Design** - Mobile, tablet, desktop

## Local Development

```bash
npm install
npm start
```

Access at `http://localhost:3000`

## Deployment to Render

1. **Connect GitHub repo** to Render
2. **Create new Web Service**
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment:** Node 18.x

The app will be live at `https://sacred-cycles.onrender.com` (or your custom domain)

## Architecture

- **Server:** Express.js
- **App:** Single-page HTML/CSS/JavaScript
- **Storage:** localStorage (device-based, persistent)
- **Audio:** Embedded MP3 files in public folder

## File Structure

```
sacred_cycles_server/
├── server.js              # Express app
├── package.json           # Dependencies
├── render.yaml            # Render config
├── README.md             # This file
└── public/
    └── satori_sacred_cycles.html  # Main app
```

## Support

For technical issues, contact: tinglott@gmail.com

---

**Version:** 1.0.0
**Author:** Ting Lott Creative
**License:** Proprietary
