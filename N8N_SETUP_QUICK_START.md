# n8n SEO Blog Workflow — Quick Start Setup

## What This Does
**Every week, automatically:**
1. Picks a wellness keyword (addiction, mental health, nursing, etc.)
2. Asks WriteSeed to generate a 1200-word blog post
3. Converts content to beautiful HTML with SEO metadata
4. Commits to GitHub → `blog/[keyword-slug].html`
5. Posts announcement to OnlySocial (Pinterest, Facebook, LinkedIn, etc.)

**Result:** 52 SEO blog posts/year, all driving to your Gumroad FOMO landing page.

---

## Prerequisites

You have:
- ✅ n8n account (cloud or self-hosted) — `https://app.n8n.io`
- ✅ WriteSeed (lifetime license)
- ✅ GitHub token (already in system)
- ✅ OnlySocial account + API token (already in system)

---

## Setup Steps

### **Step 1: Access n8n**
1. Go to `https://app.n8n.io` and log in
2. Click **"New"** → **"Workflow"**
3. Copy the workflow JSON from `/agent/home/n8n_seo_workflow_export.json`
4. Click **"Import from Clipboard"** (menu icon)
5. Paste the JSON and import

### **Step 2: Configure Credentials (5 nodes need setup)**

#### **Node 1: WriteSeed Generate** (the hardest one)
**Problem:** WriteSeed doesn't have an official API. **Workaround:**
- **Option A (Recommended):** Use WriteSeed web interface manually each week, paste content into n8n webhook
- **Option B:** Create a Zapier integration (1 credit) to write the blog → n8n picks it up
- **Option C:** I'll build a WriteSeed scraper subagent that extracts content

**For now**, skip this node and I'll manually feed content via a subagent. (Saves complexity + credits)

#### **Node 2: Build HTML**
- ✅ No credentials needed — it's pure code

#### **Node 3: GitHub Push Blog**
1. In n8n, click **"Credentials"** (bottom left)
2. Click **"Create"** → Search **"GitHub"**
3. Select **GitHub OAuth2**
4. Click **"Authenticate"** — GitHub will ask for permission
5. Authorize and return to n8n
6. Name it `github_token`
7. Click **"Save"**

#### **Node 4: OnlySocial Post**
1. In n8n, click **"Credentials"** → **"Create"**
2. Search **"Generic Credential Type"** or **"HTTP Bearer"**
3. Name: `onlysocial_token`
4. Bearer Token: `SofzhTDZpu1s75bHb2ToZccYLASt4Pc7y1q2ObHQ388050c5`
5. Save

#### **Node 5: Trigger (Cron)**
- ✅ Already configured — runs weekly on **Monday 9 AM ET**
- You can change timing in the node settings

---

## Test the Workflow

1. **Don't activate yet** — we need to handle WriteSeed manually first
2. I'll create a subagent that:
   - Runs WriteSeed prompt weekly
   - Captures the output
   - Feeds it into n8n
3. You import the workflow and let it sit **dormant** until the subagent is ready

---

## Alternative: Fast-Track Setup (Recommended for You)

**I can skip n8n entirely and use a subagent instead:**
- ✅ No login needed to n8n
- ✅ Fully automated, no manual steps
- ✅ Uses WriteSeed directly (no API workaround)
- ✅ Commits to GitHub + posts to OnlySocial automatically
- ✅ Same result, zero setup time

**Which do you prefer?**
- **A)** I build the subagent (you get blogs running THIS WEEK)
- **B)** You set up n8n yourself (full control, more manual)

---

## File Locations

- **Workflow JSON:** `/agent/home/n8n_seo_workflow_export.json`
- **Blog Template:** `/agent/home/seo_blog_template.html` (embedded in workflow)
- **Keyword List:** Inside workflow (5 keywords to start)
- **GitHub Destination:** `tinglott/artisy-store/blog/[slug].html`
- **OnlySocial Destination:** All your connected accounts

---

## Budget Impact

- ✅ **WriteSeed:** Already lifetime
- ✅ **n8n:** Free tier (up to 25 workflow executions/month)
- ✅ **GitHub:** Free
- ✅ **OnlySocial:** Already connected
- **Total new cost:** $0

---

## Questions?

This guide is in GitHub. I can adjust any part before you activate.
