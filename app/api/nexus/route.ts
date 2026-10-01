import { NextRequest, NextResponse } from 'next/server'
import * as multimodal from './multimodal'
import { createLemonOrchestrator } from './lemon-agent'

interface NexusTask {
  task: string
  agent?: string
  context?: Record<string, any>
  multimodal?: {
    imageUrl?: string
    prompt?: string
    contentType?: string
  }
  lemon?: {
    taskType?: string
    priority?: 'high' | 'normal' | 'low'
    payload?: Record<string, unknown>
  }
}

// Built-in agent capabilities
const AGENTS = {
  canva: {
    name: 'Canva Designer',
    capabilities: ['create_design', 'list_designs', 'export_design'],
    status: 'ready'
  },
  whop: {
    name: 'Whop Manager',
    capabilities: ['list_products', 'create_product', 'manage_plans'],
    status: 'ready'
  },
  social: {
    name: 'Social Publisher',
    capabilities: ['post_content', 'schedule_post', 'analytics'],
    status: 'ready'
  },
  content: {
    name: 'Content Creator',
    capabilities: ['generate_copy', 'seo_optimize', 'translate'],
    status: 'ready'
  },
  analytics: {
    name: 'Analytics Engine',
    capabilities: ['revenue_report', 'traffic_analysis', 'conversion_tracking'],
    status: 'ready'
  },
  multimodal: {
    name: 'Vision & Audio AI',
    capabilities: ['analyze_vision', 'score_virality', 'detect_optimal_time', 'validate_design'],
    status: 'ready',
    model: 'gpt-4o'
  },
  lemon: {
    name: 'Lemon Agent Orchestrator',
    capabilities: ['register_task', 'auto_route', 'learn_patterns', 'get_recommendations'],
    status: 'ready',
    description: 'Self-evolving task orchestration'
  },
  everywhere: {
    name: 'Everywhere AI Integration',
    capabilities: ['receive_webhook', 'route_actions', 'sync_desktop'],
    status: 'ready',
    description: 'Desktop AI context integration'
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: NexusTask = await req.json()
    const { task, agent, context } = body

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 })
    }

    // Route to appropriate agent
    const selectedAgent = agent || detectAgent(task)
    const agentInfo = AGENTS[selectedAgent as keyof typeof AGENTS]

    // Execute task
    const result = await executeTask(task, selectedAgent, context || {})

    return NextResponse.json({
      success: true,
      agent: agentInfo?.name || selectedAgent,
      task,
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function detectAgent(task: string): string {
  const lower = task.toLowerCase()
  if (lower.includes('design') || lower.includes('canva') || lower.includes('template')) return 'canva'
  if (lower.includes('product') || lower.includes('whop') || lower.includes('price')) return 'whop'
  if (lower.includes('post') || lower.includes('social') || lower.includes('publish')) return 'social'
  if (lower.includes('revenue') || lower.includes('analytics') || lower.includes('report')) return 'analytics'
  return 'content'
}

async function executeTask(task: string, agent: string, context: Record<string, any>) {
  // Whop API integration
  if (agent === 'whop') {
    return await handleWhopTask(task, context)
  }
  
  // Canva API integration
  if (agent === 'canva') {
    return await handleCanvaTask(task, context)
  }

  // Content generation
  if (agent === 'content') {
    return { 
      status: 'completed',
      output: `Content task processed: ${task}`,
      actions: ['Generated content ready for review']
    }
  }

  // Social publishing
  if (agent === 'social') {
    return await handleSocialTask(task, context)
  }

  // Analytics
  if (agent === 'analytics') {
    return {
      status: 'completed',
      output: `Analytics query processed: ${task}`,
      actions: ['Report generated']
    }
  }

  // Multimodal Vision & Audio (GPT-4o)
  if (agent === 'multimodal') {
    return await handleMultimodalTask(task, context)
  }

  // Lemon Agent Orchestrator
  if (agent === 'lemon') {
    return await handleLemonTask(task, context)
  }

  // Everywhere AI Integration
  if (agent === 'everywhere') {
    return { 
      status: 'ready',
      output: 'Everywhere AI webhook endpoint active',
      webhookUrl: '/api/nexus/everywhere-webhook',
      actions: ['Desktop AI integration ready']
    }
  }

  return { status: 'completed', output: `Task processed by ${agent}` }
}

async function handleWhopTask(task: string, context: Record<string, any>) {
  const whopKey = process.env.WHOP_API_KEY
  if (!whopKey) return { status: 'error', output: 'Whop API key not configured' }

  try {
    // List products
    if (task.toLowerCase().includes('list')) {
      const res = await fetch('https://api.whop.com/api/v1/products', {
        headers: { 'Authorization': `Bearer ${whopKey}` }
      })
      const data = await res.json()
      return { status: 'completed', output: data, count: data?.data?.length || 0 }
    }

    // Create product
    if (task.toLowerCase().includes('create')) {
      const res = await fetch('https://api.whop.com/api/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whopKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(context)
      })
      const data = await res.json()
      return { status: 'completed', output: data }
    }

    return { status: 'completed', output: 'Whop agent ready' }
  } catch (e: any) {
    return { status: 'error', output: e.message }
  }
}

async function handleCanvaTask(task: string, context: Record<string, any>) {
  const canvaToken = process.env.CANVA_ACCESS_TOKEN
  if (!canvaToken) return { status: 'pending', output: 'Connect Canva via OAuth to enable design automation' }

  try {
    if (task.toLowerCase().includes('list')) {
      const res = await fetch('https://api.canva.com/rest/v1/designs', {
        headers: { 'Authorization': `Bearer ${canvaToken}` }
      })
      const data = await res.json()
      return { status: 'completed', output: data }
    }
    return { status: 'completed', output: 'Canva agent ready' }
  } catch (e: any) {
    return { status: 'error', output: e.message }
  }
}

async function handleSocialTask(task: string, context: Record<string, any>) {
  const c360Key = process.env.CONTENT360_API_KEY
  if (!c360Key) return { status: 'pending', output: 'Connect Content360 to enable social publishing' }

  try {
    const res = await fetch('https://app.content360.io/api/v1/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c360Key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workspace_id: process.env.CONTENT360_WORKSPACE,
        ...context
      })
    })
    const data = await res.json()
    return { status: 'completed', output: data }
  } catch (e: any) {
    return { status: 'error', output: e.message }
  }
}

async function handleMultimodalTask(task: string, context: Record<string, any>) {
  try {
    const { imageUrl, prompt, contentType } = context

    // Detect task type
    if (task.toLowerCase().includes('score') || task.toLowerCase().includes('virality')) {
      const result = await multimodal.scoreViraality(imageUrl)
      return { status: 'completed', output: result }
    }

    if (task.toLowerCase().includes('validate') || task.toLowerCase().includes('design')) {
      const result = await multimodal.validateSacredCyclesDesign(imageUrl)
      return { status: 'completed', output: result }
    }

    if (task.toLowerCase().includes('optimal') || task.toLowerCase().includes('time')) {
      const platform = context.platform || 'youtube'
      const result = await multimodal.detectOptimalUploadTime(imageUrl, platform)
      return { status: 'completed', output: result }
    }

    if (task.toLowerCase().includes('product')) {
      const productName = context.productName || 'Sacred Cycles'
      const result = await multimodal.analyzeProductPresentation(imageUrl, productName)
      return { status: 'completed', output: result }
    }

    // Generic vision analysis
    if (imageUrl && prompt) {
      const result = await multimodal.analyzeVision({ imageUrl, prompt, contentType })
      return { status: 'completed', output: result }
    }

    return { status: 'error', output: 'Missing imageUrl or prompt for vision task' }
  } catch (e: any) {
    return { status: 'error', output: e.message }
  }
}

async function handleLemonTask(task: string, context: Record<string, any>) {
  try {
    const webhookUrl = process.env.LEMON_AGENT_WEBHOOK || 'http://localhost:3001/webhook'
    const lemon = createLemonOrchestrator(webhookUrl)

    // Register task
    if (task.toLowerCase().includes('register') || task.toLowerCase().includes('create')) {
      const taskType = context.taskType || 'social_post'
      const result = await lemon.registerTask({
        type: taskType as any,
        priority: context.priority || 'normal',
        payload: context.payload || {},
      })
      return { status: 'completed', output: result }
    }

    // Get recommendations
    if (task.toLowerCase().includes('recommend') || task.toLowerCase().includes('learning')) {
      const result = await lemon.getRecommendations()
      return { status: 'completed', output: result }
    }

    // Route Sacred Cycles post
    if (task.toLowerCase().includes('sacred') || task.toLowerCase().includes('route')) {
      const contentId = context.contentId || `content_${Date.now()}`
      const platforms = context.platforms || ['youtube', 'instagram', 'tiktok']
      const result = await lemon.routeSacredCyclesPost(contentId, platforms)
      return { status: 'completed', output: result }
    }

    // Get status
    const status = lemon.getStatus()
    return { status: 'completed', output: status }
  } catch (e: any) {
    return { status: 'error', output: e.message }
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'NEXUS SuperAgent API',
    version: '2.0.0',
    description: 'Ting\'s full-featured AI command center with Vision, Audio, Orchestration & Desktop AI',
    agents: Object.entries(AGENTS).map(([id, info]) => ({
      id, ...info
    })),
    features: {
      'gpt4o-vision': 'Analyze images, score virality, validate designs, detect optimal upload times',
      'lemon-orchestrator': 'Self-evolving task routing, learns from successes, auto-routes Sacred Cycles posts',
      'everywhere-ai': 'Desktop AI integration via webhooks, offline-first with cloud coordination'
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  })
}
