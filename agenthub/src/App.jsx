import { useState, useEffect, useRef } from "react";

const AGENTS = [
  {
    id: "content",
    name: "Content Creator",
    icon: "🎬",
    color: "#00FFD1",
    desc: "Vertical video scripts, hooks, captions & funnel content",
    badge: "TikTok • Reels • Shorts",
    systemPrompt: `You are an expert social media content strategist and video script writer specializing in vertical short-form content (9:16 format) for TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels for T. Lott Creative — a brand focused on wellness, spirituality, transformation, and digital product sales.

Your mission: create scroll-stopping, engagement-driving content that converts viewers into leads and customers.

## HOOK FORMULAS:
- "POV: [Relatable scenario]"
- "Things I wish I knew before [relevant situation]"
- "Red flags that [target audience] ignores"
- "Unpopular opinion about [niche topic]"
- "How I [achieved specific result] in [timeframe]"
- "The [number] mistakes [target audience] makes"

## SCRIPT STRUCTURE:
Seconds 0-3: Scroll-stopping hook
Seconds 4-7: Problem identification
Seconds 8-45: Value delivery
Seconds 46-60: Strong CTA

## OUTPUT FORMAT (always use this):
### 📱 VIDEO TITLE & HOOK
- 3 alternative titles
- Opening hook (first 3 seconds)

### 🎬 COMPLETE VIDEO SCRIPT
- Full script with timing markers
- Visual cues, text overlays, audio suggestions

### ✍️ CAPTION & DESCRIPTION
- Full ready-to-post caption
- 20-30 strategic hashtags
- Funnel CTA

### 📊 PERFORMANCE NOTES
- Why this will perform well
- Conversion potential

Always lead with value. Use emotional triggers strategically. Keep brand voice: empowering, spiritual, transformational.`,
  },
  {
    id: "research",
    name: "Research Agent",
    icon: "🔬",
    color: "#A78BFA",
    desc: "Deep research across AI tools, trends, competitors & strategies",
    badge: "HuggingFace • GitHub • Web",
    systemPrompt: `You are a deep research agent for T. Lott Creative, a wellness/spirituality/digital products brand. You specialize in:

1. AI tools research (HuggingFace models, GitHub repos, open-source alternatives)
2. Market & competitor analysis
3. Content trend analysis for TikTok, Instagram, YouTube
4. Digital product business strategies
5. Productivity systems and automation workflows
6. Finding FREE or low-cost alternatives to expensive tools

When researching AI tools, always prioritize:
- Open-source options (HuggingFace, GitHub)
- Low API cost solutions
- Tools that work well on mobile/Replit
- Supabase-compatible integrations

Format findings clearly with:
- 🎯 Key Findings
- 🛠️ Recommended Tools/Resources  
- 💡 Action Steps
- ⚡ Quick Wins
- 🔗 Relevant Links/Resources

Be thorough, practical, and business-focused.`,
  },
  {
    id: "employee",
    name: "AI Employee Builder",
    icon: "🤖",
    color: "#F59E0B",
    desc: "Design, spec & deploy AI agents for specific business roles",
    badge: "n8n • Zapier • Replit",
    systemPrompt: `You are an AI systems architect specializing in building AI employee agents for small businesses. You help T. Lott Creative design and deploy AI agents for:

- Customer service bots
- Content scheduling agents
- Email marketing automation
- Social media management agents
- Sales funnel automation
- Product creation assistants

## Your Stack Knowledge:
- Frontend: React/JSX on Replit
- Backend: Supabase (database, auth, edge functions)
- LLMs: Claude API (Sonnet), Groq/Llama 3.3 (for low-cost tasks)
- Automation: n8n, Zapier, Make
- Deployment: Replit, Vercel
- Open source models: HuggingFace

## For Each AI Employee Request, Provide:
### 🤖 Agent Profile
- Role & responsibilities
- Trigger conditions
- Input/output format

### 🏗️ Technical Blueprint
- Stack recommendation
- Step-by-step build guide (mobile-friendly, Replit-based)
- Supabase schema if needed
- Sample code snippets

### 💰 Cost Optimization
- How to minimize API usage
- When to use Groq vs Claude
- Caching strategies

### 🚀 Deployment Steps
- Replit setup
- Environment variables needed
- Testing checklist

Always consider that Ting works primarily from mobile without terminal access.`,
  },
  {
    id: "productivity",
    name: "Productivity Coach",
    icon: "⚡",
    color: "#EC4899",
    desc: "AI-powered techniques to 10x output & automate repetitive tasks",
    badge: "Systems • Workflows • Growth",
    systemPrompt: `You are a productivity and business systems coach specializing in AI-powered workflows for solo entrepreneurs and small business owners. You serve T. Lott Creative — a wellness/spirituality/digital products brand run by a solo founder (Ting) who works primarily from mobile.

## Your Expertise:
1. AI prompt engineering for maximum output with minimum input
2. Batch content creation systems
3. Revenue-generating automation workflows
4. Digital product creation pipelines
5. Email/social media scheduling systems
6. Time-blocking and deep work for creators

## Core Principles You Teach:
- Do once, automate forever
- Content repurposing: 1 idea → 10 pieces of content
- AI-assisted, human-refined
- Revenue actions first, admin last
- Mobile-first workflows

## Output Format:
### ⚡ The Technique/System
- What it is and why it works

### 📋 Step-by-Step Implementation
- Mobile-friendly steps
- Tools needed (free/low-cost preferred)

### 🔄 The Automation Opportunity
- What can be automated with AI
- Specific prompts or tools to use

### 📈 Expected Results
- Time saved
- Revenue impact potential

### 🎯 This Week's Action
- The ONE thing to implement first

Always be specific, actionable, and optimized for a mobile-first solo entrepreneur.`,
  },
  {
    id: "strategy",
    name: "Business Strategist",
    icon: "📈",
    color: "#34D399",
    desc: "Revenue strategy, digital product launches & funnel optimization",
    badge: "Artistry Store • Funnels • Revenue",
    systemPrompt: `You are a digital business strategist for T. Lott Creative and Artistry Store (artistrystore.com) — a wellness/spirituality digital products brand.

## Business Context:
- T. Lott Creative: brand focused on wellness, spirituality, transformation, digital products
- Artistry Store: digital products marketplace at artistrystore.com
- Revenue channels: digital product sales, content monetization
- Tech stack: Supabase, Stripe, React, Replit, n8n/Zapier

## Your Strategic Focus Areas:
1. Digital product launch strategy
2. Sales funnel design and optimization
3. Content-to-revenue pipeline
4. Email list growth and monetization
5. Pricing strategy for digital products
6. Platform selection (where to sell, where to show up)
7. Partnership and affiliate opportunities

## Output Format:
### 🎯 Strategic Analysis
- Current situation assessment
- Opportunity identified

### 💡 Recommended Strategy
- Specific action plan
- Priority order

### 💰 Revenue Projection
- Conservative / optimistic estimates
- Key assumptions

### 🛠️ Implementation Roadmap
- Week 1 / Month 1 / Quarter 1 actions
- Resources needed

### ⚠️ Risks & Mitigation
- What could go wrong
- How to hedge

Be direct, data-informed, and focused on revenue outcomes.`,
  },
  {
    id: "learning",
    name: "Learning Accelerator",
    icon: "🧠",
    color: "#60A5FA",
    desc: "Master AI tools, no-code platforms & creator skills fast",
    badge: "Tutorials • Resources • Skills",
    systemPrompt: `You are a personalized learning coach helping Ting (founder of T. Lott Creative) rapidly master skills needed to grow her business. You specialize in:

1. AI tools and prompt engineering
2. No-code/low-code development (Replit, Supabase, n8n)
3. Social media content strategy
4. Digital product creation
5. Email marketing systems
6. Video content production

## Your Teaching Approach:
- Mobile-first instruction (Ting works from phone)
- Visual and practical over theoretical
- 20% learning, 80% doing
- Connect every skill to a revenue outcome
- Reference free resources (YouTube, GitHub, HuggingFace docs)

## Learning Path Format:
### 🎯 Skill Overview
- What it is, why it matters for the business
- Time to competency

### 📚 Best Free Resources
- Specific YouTube channels/videos
- GitHub repos
- HuggingFace tutorials
- Documentation links

### 🏃 Fast-Track Practice Plan
- Day 1-3: Foundation
- Day 4-7: First project
- Week 2+: Build & apply

### 💡 AI Shortcut
- How to use AI to learn this faster
- Prompts to use

### 🔗 How This Connects to T. Lott Creative
- Specific application to the business

Make learning feel like an adventure, not homework.`,
  },
];

const QUICK_ACTIONS = [
  { label: "Write TikTok Script", agent: "content", prompt: "Write a TikTok script for Artistry Store digital products targeting women 25-45 interested in spirituality and wellness. Goal: drive traffic to artistrystore.com" },
  { label: "Find Free AI Tools", agent: "research", prompt: "Research the best free and open-source AI tools on HuggingFace and GitHub that can replace expensive SaaS tools for content creation, image generation, and marketing automation for a small digital products business." },
  { label: "Build Email Bot", agent: "employee", prompt: "Design an AI email marketing agent for T. Lott Creative that automatically segments subscribers and sends personalized wellness/spirituality content sequences to drive digital product sales on Artistry Store." },
  { label: "10x My Output", agent: "productivity", prompt: "Give me a mobile-first AI productivity system to 10x my content output for T. Lott Creative and Artistry Store without burning out. I create wellness/spirituality digital products and short-form video content." },
  { label: "Launch Strategy", agent: "strategy", prompt: "Create a 30-day digital product launch strategy for Artistry Store. Include content funnel, email sequence, and social media plan optimized for wellness/spirituality audience." },
  { label: "Learn n8n Fast", agent: "learning", prompt: "Create a fast-track learning plan for n8n automation that I can follow from my phone. I want to automate my content publishing and email marketing for T. Lott Creative within 2 weeks." },
];

export default function TLottAgentHub() {
  const [activeAgent, setActiveAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAgents, setShowAgents] = useState(true);
  const [particles, setParticles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const pts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectAgent = (agent) => {
    setActiveAgent(agent);
    setMessages([
      {
        role: "assistant",
        content: `${agent.icon} **${agent.name} activated.**\n\nI'm ready to help with ${agent.desc.toLowerCase()}. What do you need?`,
        agent: agent.id,
      },
    ]);
    setShowAgents(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleQuickAction = (action) => {
    const agent = AGENTS.find((a) => a.id === action.agent);
    setActiveAgent(agent);
    setMessages([
      {
        role: "assistant",
        content: `${agent.icon} **${agent.name} activated.**\n\nProcessing your request...`,
        agent: agent.id,
      },
    ]);
    setShowAgents(false);
    sendMessage(action.prompt, agent);
  };

  const sendMessage = async (text, agentOverride) => {
    const agent = agentOverride || activeAgent;
    if (!text.trim() || !agent) return;

    const userMsg = { role: "user", content: text };
    const newMessages = agentOverride
      ? [{ role: "assistant", content: `${agent.icon} Ready. Processing...`, agent: agent.id }, userMsg]
      : [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const conversationHistory = newMessages
        .filter((m) => m.role === "user" || (m.role === "assistant" && !m.content.includes("activated") && !m.content.includes("Processing")))
        .map((m) => ({ role: m.role, content: m.content }));

      if (conversationHistory.length === 0 || conversationHistory[conversationHistory.length - 1].role !== "user") {
        conversationHistory.push({ role: "user", content: text });
      }

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${import.meta.env.VITE_GROK_KEY || ""}`
        },
        body: JSON.stringify({
          model: "grok-3",
          max_tokens: 1000,
          system: agent.systemPrompt,
          messages: conversationHistory.slice(-10),
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I encountered an issue. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, agent: agent.id },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please check your API setup and try again.", agent: agent.id },
      ]);
    }
    setLoading(false);
  };

  const handleSend = () => sendMessage(input);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetHub = () => {
    setActiveAgent(null);
    setMessages([]);
    setShowAgents(true);
    setInput("");
  };

  const currentAgent = activeAgent ? AGENTS.find((a) => a.id === activeAgent.id) : null;
  const accentColor = currentAgent?.color || "#00FFD1";

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/### (.*?)(\n|$)/g, '<div class="msg-h3">$1</div>')
      .replace(/## (.*?)(\n|$)/g, '<div class="msg-h2">$1</div>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #030712; }

        .hub-root {
          min-height: 100vh;
          background: #030712;
          font-family: 'Inter', sans-serif;
          color: #e2e8f0;
          position: relative;
          overflow-x: hidden;
        }

        .particle {
          position: fixed;
          border-radius: 50%;
          background: rgba(0,255,209,0.15);
          animation: float linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes float {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(30px); opacity: 0; }
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0,255,209,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,209,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
          pointer-events: none;
        }

        .hub-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* HEADER */
        .hub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0 16px;
          border-bottom: 1px solid rgba(0,255,209,0.1);
        }

        .hub-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hub-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #00FFD1, #A78BFA);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          color: #030712;
          font-family: 'Orbitron', sans-serif;
          flex-shrink: 0;
        }

        .hub-logo-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #00FFD1;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .hub-logo-sub {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hub-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00FFD1;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* AGENT GRID */
        .agents-section { padding: 24px 0 16px; }

        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (min-width: 600px) {
          .agents-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        .agent-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .agent-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-color);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: 14px;
        }

        .agent-card:hover::before { opacity: 0.05; }
        .agent-card:hover {
          border-color: var(--card-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }

        .agent-card:active { transform: translateY(0); }

        .agent-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
          position: relative;
          z-index: 1;
        }

        .agent-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--card-color);
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }

        .agent-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          line-height: 1.4;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .agent-badge {
          font-size: 9px;
          color: var(--card-color);
          opacity: 0.6;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
        }

        /* QUICK ACTIONS */
        .quick-section { padding: 4px 0 20px; }

        .quick-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quick-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
        }

        .quick-btn:hover {
          background: rgba(0,255,209,0.1);
          border-color: rgba(0,255,209,0.4);
          color: #00FFD1;
        }

        /* CHAT */
        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          padding-bottom: 16px;
        }

        .chat-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 12px;
        }

        .back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 10px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .chat-agent-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--accent);
        }

        .chat-agent-badge {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          margin-left: auto;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .message {
          margin-bottom: 14px;
          animation: msgIn 0.3s ease;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg-user {
          display: flex;
          justify-content: flex-end;
        }

        .msg-user-bubble {
          background: rgba(0,255,209,0.12);
          border: 1px solid rgba(0,255,209,0.2);
          border-radius: 16px 16px 4px 16px;
          padding: 10px 14px;
          max-width: 80%;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255,255,255,0.9);
        }

        .msg-assistant {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .msg-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .msg-ai-bubble {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px 16px 16px 16px;
          padding: 12px 14px;
          max-width: calc(100% - 44px);
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
        }

        .msg-h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          margin: 10px 0 4px;
          letter-spacing: 0.5px;
        }

        .msg-h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          font-weight: 900;
          color: var(--accent);
          margin: 12px 0 4px;
        }

        /* TYPING */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px 16px 16px 16px;
          width: fit-content;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* INPUT */
        .chat-input-area {
          margin-top: 12px;
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .chat-input-wrap {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 10px 14px;
          transition: border-color 0.2s;
        }

        .chat-input-wrap:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0,255,209,0.08);
        }

        .chat-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          resize: none;
          line-height: 1.5;
          max-height: 100px;
        }

        .chat-textarea::placeholder { color: rgba(255,255,255,0.25); }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* WELCOME */
        .welcome-banner {
          background: linear-gradient(135deg, rgba(0,255,209,0.06), rgba(167,139,250,0.06));
          border: 1px solid rgba(0,255,209,0.15);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 20px;
          text-align: center;
        }

        .welcome-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
          font-weight: 900;
          background: linear-gradient(135deg, #00FFD1, #A78BFA, #F59E0B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
        }

        .welcome-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .resource-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .resource-tag {
          font-size: 10px;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid;
          opacity: 0.7;
          letter-spacing: 0.5px;
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>

      <div className="hub-root">
        <div className="grid-bg" />
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div className="hub-inner">
          <div className="hub-header">
            <div className="hub-logo" onClick={resetHub} style={{ cursor: "pointer" }}>
              <div className="hub-logo-icon">TL</div>
              <div>
                <div className="hub-logo-text">AgentHub</div>
                <div className="hub-logo-sub">T. Lott Creative</div>
              </div>
            </div>
            <div className="hub-status">
              <div className="status-dot" />
              All agents online
            </div>
          </div>

          {showAgents ? (
            <>
              <div className="welcome-banner">
                <div className="welcome-title">YOUR AI WORKFORCE</div>
                <div className="welcome-sub">
                  6 specialized agents powered by Grok • Built for wellness, content & digital products
                </div>
                <div className="resource-row">
                  {["HuggingFace", "GitHub", "Supabase", "n8n", "Replit", "Groq"].map((r, i) => (
                    <span key={r} className="resource-tag" style={{
                      borderColor: ["#00FFD1","#A78BFA","#F59E0B","#34D399","#60A5FA","#EC4899"][i],
                      color: ["#00FFD1","#A78BFA","#F59E0B","#34D399","#60A5FA","#EC4899"][i],
                    }}>{r}</span>
                  ))}
                </div>
              </div>

              <div className="agents-section">
                <div className="section-title">Choose Your Agent</div>
                <div className="agents-grid">
                  {AGENTS.map((agent) => (
                    <div
                      key={agent.id}
                      className="agent-card"
                      style={{ "--card-color": agent.color }}
                      onClick={() => selectAgent(agent)}
                    >
                      <span className="agent-icon">{agent.icon}</span>
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-desc">{agent.desc}</div>
                      <div className="agent-badge">{agent.badge}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-section">
                <div className="section-title">Quick Actions</div>
                <div className="quick-grid">
                  {QUICK_ACTIONS.map((qa) => (
                    <button key={qa.label} className="quick-btn" onClick={() => handleQuickAction(qa)}>
                      ⚡ {qa.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="chat-container" style={{ "--accent": accentColor }}>
              <div className="chat-topbar">
                <button className="back-btn" onClick={resetHub}>← Hub</button>
                <span className="chat-agent-name">
                  {currentAgent?.icon} {currentAgent?.name}
                </span>
                <span className="chat-agent-badge">{currentAgent?.badge}</span>
              </div>

              <div className="messages-area">
                {messages.map((msg, i) => (
                  <div key={i} className="message">
                    {msg.role === "user" ? (
                      <div className="msg-user">
                        <div className="msg-user-bubble">{msg.content}</div>
                      </div>
                    ) : (
                      <div className="msg-assistant">
                        <div className="msg-avatar">{currentAgent?.icon}</div>
                        <div
                          className="msg-ai-bubble"
                          style={{ "--accent": accentColor }}
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="message">
                    <div className="msg-assistant">
                      <div className="msg-avatar">{currentAgent?.icon}</div>
                      <div className="typing-indicator" style={{ "--accent": accentColor }}>
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <div className="chat-input-wrap">
                  <textarea
                    ref={inputRef}
                    className="chat-textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Ask ${currentAgent?.name}...`}
                    rows={1}
                    disabled={loading}
                  />
                </div>
                <button
                  className="send-btn"
                  style={{ background: accentColor, color: "#030712" }}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
