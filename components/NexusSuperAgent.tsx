'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

type TabId = 'execution' | 'agents' | 'canva' | 'whop' | 'social' | 'logs'
type LogEntry = { time: string; agent: string; message: string; type: 'info' | 'success' | 'error' | 'warn' }

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'execution', label: 'EXECUTION', icon: '⚡' },
  { id: 'agents', label: 'AGENTS', icon: '🤖' },
  { id: 'canva', label: 'CANVA', icon: '🎨' },
  { id: 'whop', label: 'WHOP', icon: '🏪' },
  { id: 'social', label: 'SOCIAL', icon: '📱' },
  { id: 'logs', label: 'LOGS', icon: '📋' },
]

const AGENTS = [
  { id: 'canva', name: 'Canva Designer', icon: '🎨', status: 'ready', desc: 'Create & manage designs' },
  { id: 'whop', name: 'Whop Manager', icon: '🏪', status: 'ready', desc: 'Products, plans & sales' },
  { id: 'social', name: 'Social Publisher', icon: '📱', status: 'ready', desc: 'Multi-platform posting' },
  { id: 'content', name: 'Content Creator', icon: '✍️', status: 'ready', desc: 'Copy, SEO & scripts' },
  { id: 'analytics', name: 'Analytics Engine', icon: '📊', status: 'ready', desc: 'Revenue & traffic reports' },
]

export default function NexusSuperAgent() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<TabId>('execution')
  const [taskInput, setTaskInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [results, setResults] = useState<any[]>([])
  const [whopProducts, setWhopProducts] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const addLog = (agent: string, message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      agent, message, type
    }])
  }

  const executeTask = async () => {
    if (!taskInput.trim() || isProcessing) return
    setIsProcessing(true)
    addLog('NEXUS', `Processing: ${taskInput}`, 'info')

    try {
      const res = await fetch('/api/nexus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput })
      })
      const data = await res.json()

      if (data.success) {
        addLog(data.agent, `✅ ${JSON.stringify(data.result?.output || data.result).slice(0, 200)}`, 'success')
        setResults(prev => [data, ...prev].slice(0, 50))
      } else {
        addLog('NEXUS', `❌ ${data.error}`, 'error')
      }
    } catch (e: any) {
      addLog('NEXUS', `❌ ${e.message}`, 'error')
    }

    setIsProcessing(false)
    setTaskInput('')
  }

  const fetchWhopProducts = async () => {
    addLog('Whop', 'Fetching products...', 'info')
    try {
      const res = await fetch('/api/nexus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'list products', agent: 'whop' })
      })
      const data = await res.json()
      if (data.success && data.result?.output?.data) {
        setWhopProducts(data.result.output.data)
        addLog('Whop', `✅ Loaded ${data.result.output.data.length} products`, 'success')
      }
    } catch (e: any) {
      addLog('Whop', `❌ ${e.message}`, 'error')
    }
  }

  // Login screen
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1025 50%, #0a0a0f 100%)' }}>
        <div className="w-full max-w-md p-8 rounded-2xl border border-purple-900/30" style={{ background: 'rgba(18,18,26,0.9)', backdropFilter: 'blur(20px)' }}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⚡</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              NEXUS SuperAgent
            </h1>
            <p className="text-zinc-500 mt-2">AI Business Automation Platform</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); signIn('credentials', { password: (e.target as any).password.value }) }}>
            <input
              name="password"
              type="password"
              placeholder="Access Code"
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white mb-4 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <button type="submit" className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:from-purple-500 hover:to-violet-500 transition-all">
              Enter NEXUS
            </button>
          </form>
          <p className="text-zinc-600 text-xs text-center mt-4">TLOTT12 Enterprise • v1.0</p>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-purple-400 text-xl animate-pulse">⚡ Initializing NEXUS...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-zinc-800/50 flex flex-col`} style={{ background: '#0d0d14' }}>
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="text-2xl">⚡</span>
            {sidebarOpen && <span className="font-bold text-purple-300">NEXUS</span>}
          </div>
        </div>
        
        {sidebarOpen && (
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2 px-2">Agents</div>
            {AGENTS.map(agent => (
              <div key={agent.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/30 cursor-pointer mb-1 transition-colors">
                <span>{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-300 truncate">{agent.name}</div>
                  <div className="text-xs text-zinc-600 truncate">{agent.desc}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${agent.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
            ))}
          </div>
        )}
        
        {sidebarOpen && (
          <div className="p-3 border-t border-zinc-800/50">
            <div className="flex items-center gap-2 p-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">T</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-300 truncate">TLOTT12</div>
                <div className="text-xs text-zinc-600 truncate">{session?.user?.email}</div>
              </div>
              <button onClick={() => signOut()} className="text-zinc-600 hover:text-zinc-400 text-xs">↪</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab Bar */}
        <div className="border-b border-zinc-800/50 px-4 flex items-center gap-1 overflow-x-auto" style={{ background: '#0d0d14' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-purple-300 border-b-2 border-purple-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-500">ONLINE</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'execution' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">⚡ Task Execution</h2>
              
              {results.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="text-xl text-zinc-400 mb-2">Ready for Commands</h3>
                  <p className="text-zinc-600 max-w-md mx-auto">
                    Type a task below. NEXUS will route it to the right agent automatically.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {['List all Whop products', 'Create a social post', 'Generate revenue report', 'Design a template'].map(q => (
                      <button
                        key={q}
                        onClick={() => setTaskInput(q)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:bg-zinc-700/50 hover:text-zinc-200 transition-colors border border-zinc-800"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300">{r.agent}</span>
                        <span className="text-xs text-zinc-600">{r.timestamp}</span>
                      </div>
                      <div className="text-sm text-zinc-400 mb-1">Task: {r.task}</div>
                      <pre className="text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-lg overflow-x-auto mt-2">
                        {JSON.stringify(r.result, null, 2).slice(0, 500)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">🤖 Agent Fleet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENTS.map(agent => (
                  <div key={agent.id} className="p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/20 hover:border-purple-800/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{agent.icon}</span>
                      <div>
                        <h3 className="font-bold text-zinc-200">{agent.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-400 uppercase">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500">{agent.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'canva' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">🎨 Canva Integration</h2>
              <div className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/20 text-center">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="text-lg font-bold text-zinc-300 mb-2">Connect Canva</h3>
                <p className="text-zinc-500 text-sm mb-4">Link your Canva account to automate design creation</p>
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
                  Connect Canva Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'whop' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">🏪 Whop Dashboard</h2>
              <button
                onClick={fetchWhopProducts}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors mb-4"
              >
                Load Products
              </button>
              {whopProducts.length > 0 && (
                <div className="space-y-2">
                  {whopProducts.slice(0, 20).map((p: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-300 truncate">{p.name || p.title || `Product ${i+1}`}</div>
                        <div className="text-xs text-zinc-600">{p.id}</div>
                      </div>
                      <div className="text-xs text-zinc-500">{p.visibility || 'visible'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">📱 Social Publishing</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'YouTube', icon: '▶️', connected: true },
                  { name: 'Instagram', icon: '📸', connected: true },
                  { name: 'LinkedIn', icon: '💼', connected: true },
                  { name: 'TikTok', icon: '🎵', connected: false },
                  { name: 'X/Twitter', icon: '🐦', connected: false },
                  { name: 'Facebook', icon: '📘', connected: false },
                  { name: 'Pinterest', icon: '📌', connected: false },
                  { name: 'Dev.to', icon: '👩‍💻', connected: true },
                ].map(p => (
                  <div key={p.name} className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 text-center">
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <div className="text-sm text-zinc-300">{p.name}</div>
                    <div className={`text-xs mt-1 ${p.connected ? 'text-green-400' : 'text-zinc-600'}`}>
                      {p.connected ? '● Connected' : '○ Not linked'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-200 mb-4">📋 Activity Logs</h2>
              <div className="space-y-1 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-10">No activity yet. Execute a task to see logs.</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`p-2 rounded ${
                      log.type === 'error' ? 'text-red-400 bg-red-900/10' :
                      log.type === 'success' ? 'text-green-400 bg-green-900/10' :
                      log.type === 'warn' ? 'text-yellow-400 bg-yellow-900/10' :
                      'text-zinc-500'
                    }`}>
                      <span className="text-zinc-600">[{log.time}]</span>
                      <span className="text-purple-400 ml-2">[{log.agent}]</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Task Input Bar */}
        <div className="border-t border-zinc-800/50 p-4" style={{ background: '#0d0d14' }}>
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeTask()}
              placeholder="Enter a task... (e.g., 'List all Whop products', 'Create social post for Sacred Cycles')"
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none transition-colors"
              disabled={isProcessing}
            />
            <button
              onClick={executeTask}
              disabled={isProcessing || !taskInput.trim()}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                isProcessing
                  ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500'
              }`}
            >
              {isProcessing ? '⏳' : '⚡'} Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
