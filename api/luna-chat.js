// Vercel Serverless Function: /api/luna-chat.js
// Luna Chat with Full Product Knowledge Database
// Smart recommendations based on user interests

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // Complete Product Database (88 products)
  const products = {
    wellness: [
      { name: "Calm in a Chaotic World", desc: "Practical stress relief strategies for mental clarity" },
      { name: "Sleep Smarter", desc: "Interactive flipbook with practical sleep improvement techniques" },
      { name: "Soul Sync", desc: "Spiritual wellness and inner harmony guide" },
      { name: "Beyond Breathlessness", desc: "Respiratory health and breathing exercises" },
      { name: "Stress Less", desc: "Stress management with coping strategies" },
      { name: "Natural Diabetes Control", desc: "Disease management and natural health approaches" },
      { name: "Yoga Nidra Study Guide", desc: "Meditation practice and relaxation techniques" },
      { name: "Sacred Cycles Mind Body", desc: "Women's health and holistic wellness guide" },
      { name: "Serotonin Connection", desc: "Mental health and mood management science" },
      { name: "Maintain It", desc: "Habit maintenance and personal development" },
      { name: "Calm in a Minute", desc: "Quick anxiety relief and mindfulness techniques" },
      { name: "Better Sleep 30 Days (Audiobook)", desc: "30-day sleep improvement program with voice narration" },
      { name: "Understanding Stress (Audiobook)", desc: "Professional stress management guide in audio format" },
      { name: "Finding Calm (Audiobook)", desc: "Anxiety relief and meditation in audio format" }
    ],
    business: [
      { name: "AI in Business", desc: "Business efficiency and AI automation strategies" },
      { name: "Beyond Productivity", desc: "Time management and workflow optimization" },
      { name: "Funnel Your Way to Freedom", desc: "Sales funnel and conversion optimization" },
      { name: "Hook Engage Convert", desc: "Copywriting and persuasion strategies" },
      { name: "Strategic Guide Business Phone", desc: "Business communication and client relations" },
      { name: "Goal Achievement System", desc: "Goal setting and success strategies" },
      { name: "AI Copywriter", desc: "AI writing and content creation guide" },
      { name: "Content Marketing", desc: "Content strategy and audience engagement" },
      { name: "Email Mastery", desc: "Email marketing automation and list building" },
      { name: "Social Media Empire", desc: "Social media marketing and audience growth" },
      { name: "YouTube Mastery", desc: "Video marketing and channel growth strategies" },
      { name: "Audiobook Gold Rush", desc: "Audiobook creation and passive income" }
    ],
    finance: [
      { name: "Trusts & Estate Planning", desc: "Legal planning and wealth protection" },
      { name: "Dividend Investing", desc: "Passive income from stock dividends" },
      { name: "Money Automated", desc: "Financial automation and money management" },
      { name: "2026 Real Estate Playbook", desc: "Real estate investing and property strategy" },
      { name: "Invisible Investor", desc: "Passive investing and financial independence" },
      { name: "Budgeting Mastery", desc: "Budget planning and expense tracking" },
      { name: "Crypto Basics", desc: "Cryptocurrency and blockchain fundamentals" },
      { name: "Stock Market Basics", desc: "Stock investing and market fundamentals" }
    ],
    creative: [
      { name: "Harmonizing AI", desc: "AI music production and creative guide" },
      { name: "Studio on a Shoestring", desc: "Home studio setup and budget recording" },
      { name: "Starting a Daycare", desc: "Childcare business and startup guide" },
      { name: "StoryCraft Flipbook Creator", desc: "Interactive flipbook creation tool" },
      { name: "CourseForge 2026", desc: "Online course builder and educational tool" },
      { name: "Safari Clue Seekers", desc: "Educational adventure game for kids" }
    ],
    templates: [
      { name: "Faith Affirmations Canva Template", desc: "Editable faith-based template" },
      { name: "Scripture Art Canva Template", desc: "Biblical art design template" },
      { name: "Christian Quote Template", desc: "Inspirational Christian design template" },
      { name: "Prayer Journal Template", desc: "Spiritual practice journal template" },
      { name: "Devotional Cover Template", desc: "Faith resource book cover template" },
      { name: "Meditation Guide Template", desc: "Mindfulness design template" },
      { name: "Wellness Tracker Template", desc: "Health tracking design template" },
      { name: "Self-Care Checklist Template", desc: "Wellness checklist template" },
      { name: "Healthy Living Template", desc: "Health lifestyle design template" },
      { name: "Mindfulness Journal Template", desc: "Self-care journal template" },
      { name: "Patriotic Pride Template", desc: "Community inspiration template" },
      { name: "Community Hero Template", desc: "Recognition and appreciation template" },
      { name: "Empowerment Affirmation Template", desc: "Motivation design template" },
      { name: "Strength & Resilience Template", desc: "Personal growth template" },
      { name: "Inspire Others Template", desc: "Community support template" },
      { name: "Nurse Appreciation Canva Template", desc: "Healthcare worker celebration template" },
      { name: "Healthcare Hero Template", desc: "Medical professional appreciation template" },
      { name: "RN Life Canva Template", desc: "Nursing lifestyle template" },
      { name: "Nursing Student Template", desc: "Nursing education template" },
      { name: "Self-Care for Nurses Template", desc: "Nurse wellness and burnout prevention template" }
    ],
    faith: [
      { name: "Lives of the Apostles (Audiobook)", desc: "Biblical history and apostolic teachings" },
      { name: "365 Days of Peace & Happiness", desc: "Daily inspiration and spiritual growth" },
      { name: "Closer to Jesus series", desc: "Christian guide and devotional resource" },
      { name: "Spiritual Renewal Collection", desc: "Faith renewal and spiritual guidance" }
    ],
    nursing: [
      { name: "Nurse Mom's Kit", desc: "Complete nursing mother package with work-life balance support" },
      { name: "Nurses Week Audio Special", desc: "Healthcare worker appreciation audio" }
    ],
    bundles: [
      { name: "Album Bundle 1 - Original Music Collection", desc: "Curated music bundle with royalty-free licensing" },
      { name: "Album Bundle 2 - Creative Soundtrack", desc: "Original composition music bundle" },
      { name: "Album Bundle 3 - Background Music Set", desc: "Ambient and royalty-free music" },
      { name: "Album Bundle 4 - Original Compositions", desc: "Creative audio bundle" },
      { name: "Album Bundle 5 - Music Collection", desc: "Digital audio collection" },
      { name: "Recipe Collection Bundle", desc: "Cooking guide and meal planning" },
      { name: "Journaling Prompts Collection", desc: "Self-discovery and reflection prompts" },
      { name: "Workout Routine Bundle", desc: "Fitness guide and exercise routines" },
      { name: "Meditation Script Pack", desc: "Relaxation and mindfulness scripts" },
      { name: "Affirmation Card Bundle", desc: "Daily motivation and confidence building" },
      { name: "Children's Story Bundle", desc: "Kids entertainment and bedtime stories" },
      { name: "Web App Bundle", desc: "Productivity tools and business applications" }
    ],
    apps: [
      { name: "Mother's Day Gift Maker App", desc: "Interactive gift creation app" },
      { name: "Moments of Grace App", desc: "Memory maker and family moments app" },
      { name: "ParentWise ADHD App", desc: "ADHD parenting tool and family resources" },
      { name: "Quiz Funnel", desc: "Interactive quiz for lead generation" },
      { name: "FinFlow Pro v2", desc: "Financial planning and wealth tracking" }
    ],
    aiProducts: [
      { name: "AI-Assisted Digital Products - For Nurses", desc: "Automation tools for nursing professionals" },
      { name: "AI-Assisted Digital Products - For Entrepreneurs", desc: "Business automation and productivity tools" },
      { name: "AI-Assisted Digital Products - For Content Creators", desc: "Creator resources and automation tools" }
    ],
    designBundles: [
      { name: "Faith & Wellness Sticker Design Bundle", desc: "Professional sticker designs for personal or commercial use" },
      { name: "Global Wellness Mothers Art Collection", desc: "Culturally inspired wellness artwork" }
    ]
  };

  // Smart Product Matching
  function recommendProducts(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Wellness queries
    if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('rest')) {
      return products.wellness.filter(p => p.name.toLowerCase().includes('sleep') || p.name.toLowerCase().includes('calm'));
    }
    if (msg.includes('stress') || msg.includes('anxiety') || msg.includes('calm') || msg.includes('peace')) {
      return products.wellness.filter(p => p.name.toLowerCase().includes('stress') || p.name.toLowerCase().includes('calm') || p.name.toLowerCase().includes('soul'));
    }
    if (msg.includes('nurse') || msg.includes('nursing') || msg.includes('rn') || msg.includes('healthcare')) {
      return [...products.nursing, ...products.templates.filter(p => p.name.includes('Nurse'))];
    }
    if (msg.includes('faith') || msg.includes('christian') || msg.includes('prayer') || msg.includes('spiritual')) {
      return [...products.faith, ...products.templates.filter(p => p.name.includes('Faith') || p.name.includes('Christian') || p.name.includes('Prayer'))];
    }
    if (msg.includes('mother') || msg.includes('mom') || msg.includes('parent')) {
      return products.apps.filter(p => p.name.includes('Mother') || p.name.includes('ParentWise'));
    }
    
    // Business queries
    if (msg.includes('business') || msg.includes('sales') || msg.includes('marketing') || msg.includes('funnel')) {
      return products.business;
    }
    if (msg.includes('course') || msg.includes('teach') || msg.includes('student')) {
      return [products.business[5], products.creative[4]]; // Goal Achievement, CourseForge
    }
    if (msg.includes('music') || msg.includes('audio') || msg.includes('studio')) {
      return products.creative.filter(p => p.name.toLowerCase().includes('music') || p.name.toLowerCase().includes('studio')) || products.bundles.filter(p => p.name.includes('Album'));
    }
    
    // Finance queries
    if (msg.includes('money') || msg.includes('invest') || msg.includes('stock') || msg.includes('crypto') || msg.includes('finance')) {
      return products.finance;
    }
    
    // Template queries
    if (msg.includes('template') || msg.includes('canva') || msg.includes('design')) {
      return products.templates;
    }
    
    // Default: return wellness focus
    return products.wellness.slice(0, 3);
  }

  try {
    const recommendations = recommendProducts(message);
    const productList = recommendations
      .slice(0, 2)
      .map(p => `• **${p.name}** - ${p.desc}`)
      .join('\n');

    const systemPrompt = `You are Luna, a warm wellness guide for TLott12 Digital Products. 
Based on the user's question, recommend 1-2 relevant products and explain why they'd help.
Keep your response under 100 words. Be friendly and encouraging.

Recommended products for this question:
${productList}

User: "${message}"
Luna:`;

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (HF_API_KEY) {
      try {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
          {
            headers: { Authorization: `Bearer ${HF_API_KEY}` },
            method: 'POST',
            body: JSON.stringify({
              inputs: systemPrompt,
              parameters: { max_new_tokens: 120 }
            })
          }
        );

        const result = await response.json();
        
        if (response.ok && result[0]?.generated_text) {
          const aiText = result[0].generated_text.split('Luna:')[1]?.trim();
          if (aiText) {
            return res.status(200).json({ reply: aiText.substring(0, 300).trim() });
          }
        }
      } catch (aiError) {
        console.log('AI fallback - using smart recommendations');
      }
    }

    // Intelligent Fallback (when HuggingFace unavailable)
    const fallbackResponses = {
      sleep: `I recommend **${recommendations[0]?.name}** - ${recommendations[0]?.desc}. Perfect for your needs! Available instantly. 💚`,
      stress: `Try **${recommendations[0]?.name}** for immediate relief. Many people find it transforms their daily peace. 💚`,
      business: `For your business goals, **${recommendations[0]?.name}** is perfect - it provides step-by-step strategies. 💚`,
      faith: `Deepen your faith journey with **${recommendations[0]?.name}**. Thousands have found it transformative. 💚`,
      default: `Great question! I recommend **${recommendations[0]?.name}** - ${recommendations[0]?.desc}. Available instantly at payhip.com/tlott12! 💚`
    };

    const category = message.toLowerCase().includes('sleep') ? 'sleep' 
      : message.toLowerCase().includes('stress') ? 'stress'
      : message.toLowerCase().includes('business') ? 'business'
      : message.toLowerCase().includes('faith') ? 'faith'
      : 'default';

    return res.status(200).json({ 
      reply: fallbackResponses[category]
    });

  } catch (error) {
    console.error('Luna error:', error);
    return res.status(200).json({ 
      reply: "I'm here to help! 💚 What wellness, business, or faith topic can I guide you with today? Visit payhip.com/tlott12 to explore all our products!" 
    });
  }
}
