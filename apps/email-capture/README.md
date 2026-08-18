# 📧 Email Capture - Newsletter Signup Page

**Production-ready email signup form for Ting's community.**

## ✨ Features

- ✅ Beautiful, modern UI (mobile responsive)
- ✅ Name + Email capture
- ✅ Interest selection (Sleep, Wellness, Spiritual, Books)
- ✅ Form validation
- ✅ Webhook integration ready
- ✅ Emailit integration support
- ✅ Local storage fallback for testing
- ✅ Zero external dependencies (pure HTML/CSS/JS)

## 🚀 Quick Deploy

### Netlify Deploy
1. Go to [Netlify](https://app.netlify.com)
2. **Add new site** → **Import existing project**
3. Select `tinglott/artisy-store` repo
4. **Base directory:** `apps/email-capture`
5. **Deploy**
6. You'll get a live URL (e.g., `https://xxx.netlify.app/`)

### After Deploy
- Add the webhook URL from Emailit to `WEBHOOK_URL_PLACEHOLDER` in `index.html`
- Update store.html email modal link to your new URL
- Test with a signup!

## 📋 How It Works

1. User fills name + email + interests
2. Data is sent to webhook endpoint
3. Emailit receives signup & adds to list
4. Welcome email auto-sends
5. User joins the community

## 🔧 Webhook Setup

Once deployed, connect to Emailit:
1. Emailit: **Automations** → **Create**
2. Trigger: **Webhook**
3. Copy webhook URL
4. Replace `WEBHOOK_URL_PLACEHOLDER` in `index.html`
5. Redeploy

## 📍 Default Behavior (Testing)

If no webhook URL is set, the form:
- ✅ Shows success message
- ✅ Saves data to browser localStorage
- ✅ Ready for real webhook when you add it

## 💾 Data Flow

```
User Form → JS → Webhook → Emailit → Welcome Email → Community
```

## 🎨 Customization

Edit `index.html` to:
- Change colors (search `#667eea`)
- Update copy/messaging
- Add/remove interest options
- Modify form fields

## 📱 Mobile Ready

- Fully responsive
- Touch-friendly buttons
- Works on all devices

---

**Status:** ✅ Production Ready | **Cost:** $0 | **Time to Deploy:** 2 minutes
