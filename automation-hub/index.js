const express = require('express');
const axios = require('axios');
const { EventEmitter } = require('events');

const app = express();
app.use(express.json());

// LLM CONFIG
const LLM_CONFIG = {
  primary: {
    name: 'grok',
    provider: 'grok',
    apiKey: process.env.GROK_API_KEY || '',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-3',
    temperature: 0.7,
    maxTokens: 1024,
  },
  secondary: {
    name: 'gemini',
    provider: 'gemini',
    apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    maxTokens: 1024,
  },
};

const API_CONFIG = {
  nexusApp: process.env.NEXUS_APP_URL || 'https://artisy-store-c6xh.vercel.app',
  content360ApiKey: process.env.CONTENT360_API_KEY || '',
  content360Workspace: process.env.CONTENT360_WORKSPACE || '',
  whopApiKey: process.env.WHOP_API_KEY || '',
  contentChannelIds: {
    youtube: '124523',
    instagram: '124522',
    linkedin: '124525',
    tiktok: '124524',
  },
};

const QUEUE_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 5000,
  batchSize: 5,
  checkIntervalMs: 30000,
};

// STATE
const state = {
  taskQueue: [],
  processedTasks: new Map(),
  costTracking: {
    grok: { calls: 0, tokens: 0, cost: 0 },
    gemini: { calls: 0, tokens: 0, cost: 0 },
  },
  llmStats: {
    primarySuccess: 0,
    primaryFail: 0,
    fallbackUsed: 0,
  },
};

// LLM ROUTING
async function callLLM(prompt, context = {}) {
  try {
    console.log('🧠 LLM: Calling Grok (primary)...');
    const grokResult = await callGrok(prompt, context);
    state.llmStats.primarySuccess++;
    return { provider: 'grok', result: grokResult, fallback: false };
  } catch (grokError) {
    console.warn('⚠️ Grok failed, falling back to Gemini:', grokError.message);
    state.llmStats.primaryFail++;

    try {
      console.log('🧠 LLM: Calling Gemini (secondary/free)...');
      const geminiResult = await callGemini(prompt, context);
      state.llmStats.fallbackUsed++;
      return { provider: 'gemini', result: geminiResult, fallback: true };
    } catch (geminiError) {
      console.error('❌ Both LLMs failed');
      throw geminiError;
    }
  }
}

async function callGrok(prompt, context = {}) {
  const config = LLM_CONFIG.primary;
  const payload = {
    messages: [
      { role: 'system', content: 'You are NEXUS, an AI automation system.' },
      { role: 'user', content: prompt },
    ],
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  };

  try {
    const response = await axios.post(`${config.baseUrl}/chat/completions`, payload, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const result = response.data.choices[0].message.content;
    state.costTracking.grok.calls++;
    state.costTracking.grok.tokens += response.data.usage.total_tokens;
    state.costTracking.grok.cost += (response.data.usage.total_tokens / 1000) * 0.015;
    return result;
  } catch (error) {
    throw new Error(`Grok API error: ${error.message}`);
  }
}

async function callGemini(prompt, context = {}) {
  const config = LLM_CONFIG.secondary;
  try {
    const response = await axios.post(
      `${config.baseUrl}/${config.model}:generateContent?key=${config.apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    state.costTracking.gemini.calls++;
    state.costTracking.gemini.cost = 0;
    return result;
  } catch (error) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// TASK EXECUTION
async function executeNexusTask(taskType, payload) {
  const prompt = `Task: ${taskType} | Context: ${JSON.stringify(payload)} | Return JSON format.`;
  try {
    const llmResponse = await callLLM(prompt, payload);
    return {
      status: 'success',
      taskType,
      provider: llmResponse.provider,
      fallback: llmResponse.fallback,
      result: llmResponse.result,
    };
  } catch (error) {
    return { status: 'error', taskType, error: error.message };
  }
}

async function postToContent360(contentId, platforms = ['youtube', 'instagram', 'linkedin']) {
  try {
    const scoreResponse = await callLLM(
      `Score content virality: ${contentId}. Return JSON: {score: 0-100}`,
      { contentId }
    );

    let score = 75;
    try {
      const parsed = JSON.parse(scoreResponse.result);
      score = parsed.score || 75;
    } catch {}

    if (score >= 60) {
      for (const platform of platforms) {
        await postToPlatform(contentId, platform);
      }
      return { status: 'posted', contentId, score, platforms, provider: scoreResponse.provider };
    } else {
      return { status: 'skipped', contentId, score, reason: 'low_score' };
    }
  } catch (error) {
    return { status: 'error', contentId, error: error.message };
  }
}

async function postToPlatform(contentId, platform) {
  const channelId = API_CONFIG.contentChannelIds[platform];
  if (!channelId) return;

  try {
    const response = await axios.post(
      'https://api.onlysocial.io/v1/publish',
      { contentId, channelId, platform },
      { headers: { Authorization: `Bearer ${API_CONFIG.content360ApiKey}` } }
    );
    console.log(`📱 Posted to ${platform}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to post to ${platform}`);
    throw error;
  }
}

// QUEUE PROCESSOR
async function processQueue() {
  while (true) {
    if (state.taskQueue.length === 0) {
      await new Promise(resolve => setTimeout(resolve, QUEUE_CONFIG.checkIntervalMs));
      continue;
    }

    const batch = state.taskQueue.splice(0, QUEUE_CONFIG.batchSize);
    for (const task of batch) {
      try {
        let result;
        switch (task.type) {
          case 'score_content':
            result = await executeNexusTask('score_content', task.payload);
            break;
          case 'post_content':
            result = await postToContent360(task.payload.contentId, task.payload.platforms);
            break;
          case 'lemon_register':
            result = await executeNexusTask('lemon_register', task.payload);
            break;
          case 'analyze_design':
            result = await executeNexusTask('analyze_design', task.payload);
            break;
          default:
            result = { status: 'error', error: `Unknown: ${task.type}` };
        }

        state.processedTasks.set(task.id, { ...task, result, completedAt: new Date().toISOString() });
        console.log(`✅ Task completed: ${task.id}`);
      } catch (error) {
        state.processedTasks.set(task.id, { ...task, status: 'error', error: error.message, completedAt: new Date().toISOString() });
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// ROUTES
app.post('/queue', (req, res) => {
  const { type, payload } = req.body;
  if (!type) return res.status(400).json({ error: 'Type required' });

  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  state.taskQueue.push({ id: taskId, type, payload: payload || {} });
  res.json({ taskId, status: 'queued', queueLength: state.taskQueue.length });
});

app.get('/task/:taskId', (req, res) => {
  const task = state.processedTasks.get(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

app.get('/stats', (req, res) => {
  res.json({
    queue: { pending: state.taskQueue.length, processed: state.processedTasks.size },
    llm: { ...state.llmStats, costTracking: state.costTracking },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.post('/webhook/everywhere', (req, res) => {
  const { action, payload } = req.body;
  console.log(`🖥️ Webhook: ${action}`);

  switch (action) {
    case 'video_downloaded':
      state.taskQueue.push({
        id: `webhook_${Date.now()}`,
        type: 'post_content',
        payload: { contentId: payload.videoId, platforms: ['youtube', 'tiktok', 'instagram'] },
      });
      break;
    case 'design_created':
      state.taskQueue.push({ id: `webhook_${Date.now()}`, type: 'analyze_design', payload });
      break;
    case 'batch_export':
      state.taskQueue.push({
        id: `webhook_${Date.now()}`,
        type: 'lemon_register',
        payload: { taskType: 'batch_export', files: payload.files, destination: payload.destination },
      });
      break;
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }
  res.json({ status: 'queued', action });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🤖 NEXUS AUTOMATION HUB - RUNNING ON PORT ${PORT}`);
  console.log('Primary LLM: Grok (xAI)');
  console.log('Fallback: Gemini (Free)\n');
  processQueue();
});

module.exports = { app, callLLM, executeNexusTask, postToContent360 };