import { NextRequest, NextResponse } from 'next/server'

interface NexusTask {
  task: string
  agent?: string
  context?: Record<string, any>
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

export async function GET() {
  return NextResponse.json({
    name: 'NEXUS SuperAgent API',
    version: '1.0.0',
    agents: Object.entries(AGENTS).map(([id, info]) => ({
      id, ...info
    })),
    status: 'operational'
  })
}
