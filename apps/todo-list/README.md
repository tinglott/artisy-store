# 🎯 Task Master - AI-Powered To-Do List

A beautiful, serverless to-do list app built with Puter.js that syncs your tasks to the cloud and includes AI-powered task suggestions powered by Grok.

## ✨ Features

### Core Functionality
- ✅ **Add & Manage Tasks** - Create tasks with automatic priority detection
- ☁️ **Cloud Sync** - All tasks stored in Puter's key-value store (syncs across devices)
- 🔐 **User Authentication** - Sign in with your Puter account
- 📊 **Smart Stats** - Track total, active, and completed tasks
- 🔍 **Advanced Filtering** - Filter by status (all, active, completed) and priority (high, medium, low)
- 🗑️ **Delete Tasks** - Remove tasks with confirmation

### AI Features
- 🤖 **AI Task Suggestions** - Click "AI Ideas" button to generate 5 smart task suggestions using Grok
- 🎯 **Priority Auto-Detection** - Keywords like "urgent", "asap", "important" automatically set high priority
- 💡 **Smart Context** - AI understands task types and suggests relevant activities

### User Experience
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- ⚡ **Real-time Updates** - Instant task rendering and statistics
- 🔄 **Local Persistence** - Automatic save to Puter cloud storage
- ♿ **Accessible** - Keyboard navigation and proper form labels

## 🚀 Getting Started

### Local Development
```bash
# Clone the repo
git clone https://github.com/tinglott/artisy-store.git
cd artisy-store/apps/todo-list

# Start a local HTTP server (required for Puter.js to work)
python3 -m http.server 8000
# or
npx http-server

# Open http://localhost:8000
```

### Production Deployment (Netlify)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import from Git"**
3. Select your GitHub repository: `tinglott/artisy-store`
4. **Base directory:** `apps/todo-list`
5. Click **Deploy**
6. Your app is live! 🎉

## 🛠️ Technology Stack

- **Puter.js SDK v2** - Serverless backend
- **Puter Auth** - User authentication
- **Puter KV Store** - Cloud data persistence
- **Grok AI (xAI)** - AI task suggestions
- **Vanilla JavaScript** - No build tools needed
- **CSS3** - Modern styling with gradients and animations

## 📋 How to Use

### Adding Tasks
1. Type your task in the input field
2. Press Enter or click "✨ Add"
3. Auto-detection sets priority based on keywords:
   - "urgent", "asap", "important" → 🔴 High
   - "soon" → 🟡 Medium
   - Default → 🟢 Low

### AI Task Ideas
1. Click the "🤖 AI Ideas" button
2. Wait for Grok to generate suggestions
3. New tasks appear instantly in your list
4. Auto-saved to your Puter account

### Filtering & Organization
- **All** - Show all tasks
- **Active** - Show incomplete tasks
- **Completed** - Show finished tasks
- **Priority Filters** - Filter by urgency level

### Completing Tasks
- Click the checkbox to mark as complete
- Completed tasks show with strikethrough
- Can be toggled back to active

## 🔑 API Keys

The app includes Grok API key for AI features:
- Grok model: `grok-3-latest`
- Endpoint: `https://api.x.ai/v1/chat/completions`
- Used for: Smart task generation

## 📚 Puter.js APIs Used

- `puter.auth.signIn()` / `puter.auth.signOut()` - Authentication
- `puter.auth.isSignedIn()` - Check auth status
- `puter.auth.getUser()` - Get user info
- `puter.kv.get() / puter.kv.set()` - Cloud data storage
- `puter.ui.authenticateWithPuter()` - Auth UI

## 🎨 Customization

Edit `index.html` to:
- Change colors: Update gradient colors in `:root`
- Modify AI behavior: Adjust Grok prompt
- Add new features: Extend task object with new properties

## 📄 License

MIT License - Feel free to use and modify!

## 🔗 Resources

- [Puter.js Docs](https://docs.puter.com)
- [Puter Developer](https://developer.puter.com)
- [Grok API Docs](https://docs.x.ai)

---

**Made with ❤️ using Puter.js**
