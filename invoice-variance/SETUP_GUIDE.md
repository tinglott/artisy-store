# Invoice Variance B2B SaaS — Quick Setup Guide

**Time estimate: 30 minutes to MVP running locally**

---

## 🎯 Goal
Build a working MVP that:
1. ✅ Accepts invoice PDF uploads
2. ✅ Extracts data (vendor, items, prices) using OCR + AI
3. ✅ Matches items against inventory database
4. ✅ Detects missing items and shortages
5. ✅ Auto-generates professional purchase orders

---

## 📋 Prerequisites

### You Need:
- **Python 3.9+** (check: `python --version`)
- **GitHub account** (for free Models API)
- **Supabase account** (free tier)
- **Render account** (free tier, for deployment)

### Time Investment:
- Getting API keys: 5 minutes
- Local setup: 10 minutes
- First test: 5 minutes
- Deploy to Render: 5 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Get GitHub Models API Token (5 min)

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Fine-grained personal access token"**
3. Name it: `invoice-variance-api`
4. **Scopes:** Select "all" (simpler than picking individual scopes)
5. Copy the token and save it somewhere

### Step 2: Create Supabase Project (5 min)

1. Go to https://supabase.com
2. Sign up or log in
3. Click **"New project"**
   - Project name: `invoice-variance`
   - Password: Save somewhere secure
   - Region: closest to you
4. **Wait for project to initialize** (2 min)
5. Once ready, go to **Settings → Database → Connection info**
6. Copy these values:
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_KEY = your-anon-key-here
   ```

### Step 3: Create Database Schema (3 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open `supabase_schema.sql` (in this folder)
4. Copy all the SQL
5. Paste into Supabase query editor
6. Click **"Run"** (▶️)
7. Wait for completion (should say "Success")

### Step 4: Local Setup (10 min)

```bash
# 1. Navigate to project
cd /tasklet/agent/home/invoice_variance_b2b

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
# or: venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env

# 5. Edit .env with your keys
# GITHUB_MODELS_API_KEY=your_github_token_here
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-supabase-anon-key-here
```

### Step 5: Test Locally (5 min)

```bash
# Start the server
python -m uvicorn app.main:app --reload

# In another terminal, run tests
python test_api.py
```

Visit: **http://localhost:8000/docs** to see interactive API explorer

### Step 6: Deploy to Render (5 min)

1. Push code to GitHub (or create new repo)
2. Go to https://render.com
3. Sign in with GitHub
4. Click **"New +"** → **"Web Service"**
5. Select your repository
6. Configure:
   - **Name:** `invoice-variance-api`
   - **Environment:** Python 3
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker`
7. Add **Environment Variables:**
   ```
   GITHUB_MODELS_API_KEY = (paste your token)
   SUPABASE_URL = (paste URL)
   SUPABASE_KEY = (paste key)
   ```
8. Click **"Create Web Service"**
9. **Wait 2-3 minutes** for deployment

Your API is now live at: **https://invoice-variance-api.onrender.com**

---

## ✅ Verification Checklist

- [ ] GitHub token works (tested via `test_api.py`)
- [ ] Supabase schema created (checked in SQL Editor)
- [ ] Local API running at `http://localhost:8000/docs`
- [ ] Can upload PDF and get extraction results
- [ ] Inventory matching works
- [ ] PO PDF generates
- [ ] Render deployment successful

---

## 🧪 First Test (5 min)

### Test with Sample Data

**File:** `test_api.py`

```bash
python test_api.py
```

This will:
1. ✅ Test `/health` endpoint
2. ✅ Test GitHub Models API connectivity
3. ✅ Test full pipeline with sample invoice

Expected output:
```
Status: 200
Response: {
  "status": "success",
  "invoice": {...},
  "inventory_analysis": {...},
  "purchase_order": {...}
}
```

---

## 🎯 What's Next?

### Phase 1: MVP (Week 1–2)
- ✅ API working
- ✅ Invoice extraction
- ✅ Inventory matching
- ✅ PO generation

### Phase 2: Dashboard (Week 3–4)
- Add React frontend
- Invoice history
- Inventory management
- PO tracking

### Phase 3: Automation (Week 5–6)
- Email/Slack alerts
- Webhook ingestion
- CSV inventory import
- Multi-user teams

### Phase 4: Monetization (Week 7–8)
- Stripe integration
- Subscription tiers
- API rate limiting
- Analytics dashboard

---

## 🆘 Troubleshooting

### GitHub Models API returns 401
- **Check:** Token is copied correctly
- **Check:** Token hasn't expired
- **Check:** Token has required scopes

### Supabase connection fails
- **Check:** URL and KEY are correct
- **Check:** Project is initialized
- **Check:** No trailing spaces in .env

### PDF extraction fails
- **Check:** PDF is readable (not corrupted)
- **Check:** PDF has text (not just image)
- **Check:** PaddleOCR installed correctly

### Local server won't start
- **Check:** Port 8000 not in use (`lsof -i :8000`)
- **Check:** Virtual environment activated
- **Check:** All dependencies installed

---

## 📚 Reference

| Component | Free Tier | Limits |
|-----------|-----------|--------|
| GitHub Models API | ✅ Free | No rate limit (unconfirmed) |
| Supabase Database | ✅ Free | 500 MB storage, 50K monthly active users |
| Supabase Storage | ✅ Free | 1 GB storage |
| Render Web | ✅ Free | 750 hours/month (~1 app continuous) |
| PaddleOCR | ✅ Free | No limits (local) |

---

## 🚀 Ready?

**Let's get started!** 

Next steps:
1. Get GitHub token (5 min)
2. Create Supabase project (5 min)
3. Run local setup (10 min)
4. Deploy to Render (5 min)

**By the end of today, you'll have a live B2B SaaS!** 🎉
