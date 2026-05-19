# SEO Blog Automation — Setup & Implementation Guide

## Phase 1: Prerequisites (30 minutes)

### 1. WriteSeed API Key
- Login: `https://www.writeseed.com`
- Go to Account Settings → API Keys
- Copy your API key
- **Save it here for reference**: ________________

### 2. GitHub Personal Access Token
- Login to GitHub → Settings → Developer Settings → Personal Access Tokens
- Click "Generate new token (classic)"
- **Scopes needed**: `repo` (full control of private repositories)
- Name: "n8n-seo-blog-automation"
- Expiration: 90 days
- Click "Generate"
- **Copy immediately** (you won't see it again)
- **Save it here for reference**: ________________

### 3. Google AI Studio (Gemini API) — FREE
- Go to `https://aistudio.google.com`
- Sign in with `tinglott@gmail.com`
- Create new API key
- **Save it here for reference**: ________________
- No credit card needed. Free tier: 2M tokens/month (plenty for 5 posts/week)

### 4. GitHub Blog Folder Setup
- Go to `https://github.com/tinglott/artisy-store`
- Create new folder: click "Add file" → "Create new file"
- Path: `blog/index.md` (this creates the folder)
- Content: Just type `# Blog Index` and commit
- This creates the `/blog/` directory structure

### 5. GitHub Pages Verification
- Verify domain is set to publish from `main` branch
- Settings → Pages → Should show "Your site is published at: https://raw.githack.com/tinglott/artisy-store/main/"

---

## Phase 2: n8n Workflow Setup (60 minutes)

### Step 1: Create n8n Account (FREE)
- Go to `https://n8n.cloud`
- Sign up with `tinglott@gmail.com`
- Verify email
- Create first workflow

### Step 2: Build Workflow Nodes

#### NODE 1: Keyword Input (Trigger)
- **Type**: Manual Trigger or Scheduled Trigger
- **Output**: 
  ```json
  {
    "keyword": "how to overcome addiction as a nurse",
    "audience": "healthcare professionals",
    "intent": "informational"
  }
  ```

#### NODE 2: Google Gemini API (Keyword Expansion)
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={{GEMINI_API_KEY}}`
- **Body**:
  ```json
  {
    "contents": [
      {
        "parts": [
          {
            "text": "Expand this SEO keyword into a blog post outline with 3-4 main sections. Keyword: {{$node['Keyword Input'].json.keyword}}. Return as JSON with outline sections."
          }
        ]
      }
    ]
  }
  ```
- **Output**: Blog outline from Gemini

#### NODE 3: WriteSeed Content Generation
- **Type**: HTTP Request (or WriteSeed integration if available)
- **Method**: POST
- **URL**: `https://api.writeseed.com/generate` (check WriteSeed API docs for exact endpoint)
- **Headers**: `Authorization: Bearer {{WRITESEED_API_KEY}}`
- **Body**:
  ```json
  {
    "title": "{{$node['Keyword Input'].json.keyword}}",
    "keyword": "{{$node['Keyword Input'].json.keyword}}",
    "outline": "{{$node['Gemini API'].json.outline}}",
    "tone": "conversational, empathetic, evidence-based",
    "word_count": 1500,
    "style": "wellness blog",
    "prompt_template": "Use the WriteSeed prompt template provided"
  }
  ```
- **Output**: Blog content (HTML or markdown)

#### NODE 4: HTML Generation (Function Node)
- **Type**: Function
- **Code**: (pseudocode)
  ```javascript
  // Read blog template
  const template = require('/blog_template.html');
  
  // Replace variables
  const html = template
    .replace('{{TITLE}}', keyword)
    .replace('{{META_DESCRIPTION}}', `Learn about ${keyword}. Expert wellness advice from a 23-year registered nurse.`)
    .replace('{{BLOG_CONTENT}}', blogContent)
    .replace('{{DATE_PUBLISHED}}', new Date().toISOString())
    .replace('{{INTERNAL_LINKS}}', generateInternalLinks());
  
  return { html, slug: keyword.replace(/\s+/g, '-').toLowerCase() };
  ```
- **Output**: Complete HTML file + slug

#### NODE 5: GitHub Commit & Push
- **Type**: GitHub integration (or HTTP Git API)
- **Action**: Create or update file
- **Repository**: `tinglott/artisy-store`
- **Branch**: `main`
- **Path**: `blog/{{$node['HTML Generation'].json.slug}}.html`
- **Content**: `{{$node['HTML Generation'].json.html}}`
- **Commit Message**: `[SEO] {{$node['Keyword Input'].json.keyword}} - auto-generated blog post`
- **Output**: GitHub response (file URL)

#### NODE 6: Update Sitemap
- **Type**: Function
- **Code**: Add new blog post to sitemap.xml with proper priority
- **Output**: Updated sitemap

#### NODE 7: OnlySocial Post (Notification)
- **Type**: Webhook or Integration
- **Action**: Queue message for next OnlySocial trigger
- **Content**: Blog post headline + first 100 words + raw.githack.com link
- **Output**: Confirmation

---

## Phase 3: Test Workflow (10 minutes)

### Test with Keyword #1: "how to overcome addiction as a nurse"
1. **In n8n**, click "Execute Workflow"
2. **Check output** at each node:
   - Node 1: Keyword input shows correct data
   - Node 2: Gemini outline generated
   - Node 3: WriteSeed content received
   - Node 4: HTML file created
   - Node 5: GitHub commit successful
3. **Verify in GitHub**: `https://github.com/tinglott/artisy-store/blob/main/blog/how-to-overcome-addiction-as-a-nurse.html`
4. **Test live URL**: `https://raw.githack.com/tinglott/artisy-store/main/blog/how-to-overcome-addiction-as-a-nurse.html`
5. **Check appearance**: Should render nicely with gradient header, content, CTA, and internal links

---

## Phase 4: Schedule & Scale (5 minutes)

### Once Test is Successful:
1. **Set n8n trigger** to "Scheduled" (e.g., 3x per week on Monday/Wednesday/Friday)
2. **Input 5 keywords** into a simple queue:
   - "how to overcome addiction as a nurse"
   - "mental health recovery for 50+ professionals"
   - "suicide prevention resources for healthcare workers"
   - "building a new life after recovery"
   - "wellness habits for night shift workers"
3. **Workflow generates 1 blog post automatically** every schedule run
4. **OnlySocial posts the blog link** at next 9 AM / 2 PM / 8 PM trigger
5. **Track Google Search Console clicks** weekly

---

## Phase 5: Measurement & Optimization

### Weekly Checks:
- [ ] Google Search Console → New Keywords section (shows impressions + CTR)
- [ ] Google Analytics → Blog folder traffic
- [ ] Gumroad landing page clicks via `?utm_source=seo_blog` parameter
- [ ] Email signups (if Brevo funnel activated)

### Optimization Actions:
- If keyword ranks page 1-2 → Boost with OnlySocial + Pinterest pins
- If keyword gets 0 impressions → Rewrite for different keyword
- If CTR low → Improve meta description
- If conversion low → Update CTA or internal links

---

## File Locations (Reference)

| File | Location | Purpose |
|------|----------|---------|
| n8n Workflow Blueprint | `/agent/home/n8n_seo_blog_workflow.md` | Reference for node setup |
| Blog HTML Template | `/agent/home/seo_blog_template.html` | Template for generated blogs |
| WriteSeed Prompt | `/agent/home/writeseed_blog_prompt_template.txt` | Content generation instructions |
| Generated Blogs | `GitHub: tinglott/artisy-store/blog/` | Live blog posts |
| Blog Rotation File | `/agent/home/blog_rotation_tracking.json` | Track post performance |

---

## Cost Summary
- **n8n**: FREE (cloud, up to 1000 executions/month)
- **WriteSeed**: FREE (you already own lifetime license)
- **Gemini API**: FREE (2M tokens/month free tier)
- **GitHub**: FREE (public repos)
- **raw.githack.com**: FREE (CDN for GitHub files)

**Total cost: $0**

---

## Success Metrics (Target)

| Timeframe | Metric | Target |
|-----------|--------|--------|
| Week 1-2 | Workflow tested, 1 blog live | ✓ |
| Week 3-4 | 5 blogs published | 5 posts × 0 traffic (new domain) |
| Week 5-6 | First Google impressions | 5-20 impressions total |
| Week 7-8 | Keywords ranking | 1-2 keywords page 3-5 |
| Week 9-12 | Traffic clicks | 20-50 clicks/month |
| Month 4+ | Conversions to Gumroad | 5-10% CTR to landing page |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WriteSeed API returns 401 | Check API key format (Bearer token) |
| GitHub push fails | Verify Personal Access Token has `repo` scope |
| Gemini API rate limited | Free tier has limits; reduce keyword batch size |
| HTML renders incorrectly | Check template escaping (quotes, special chars) |
| Blog not appearing in raw.githack.com | Wait 5 minutes for CDN cache, then clear browser cache |

---

## Next Steps (When Ready)
1. [ ] Gather API keys (WriteSeed, GitHub, Gemini)
2. [ ] Create GitHub blog folder
3. [ ] Build n8n workflow (follow nodes above)
4. [ ] Test with 1 keyword
5. [ ] Add to schedule (3x/week)
6. [ ] Monitor Google Search Console
7. [ ] Scale successful keywords
8. [ ] Integrate with Brevo email funnel (once running)
