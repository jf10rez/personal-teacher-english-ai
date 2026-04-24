import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Send } from 'lucide-react'

export default function Simulation() {
  const [situation, setSituation] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startSimulation = async () => {
    setLoading(true)
    try {
      const session = await modulesService.simulationStart(situation, difficulty)
      setSessionId(session._id)
      setMessages(session.messages || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return
    const userMsg = { role: 'user', content: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const response = await modulesService.simulationMessage(sessionId, input)
      setMessages(prev => [...prev, response.message])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const endSimulation = async () => {
    if (sessionId) {
      await modulesService.simulationEnd(sessionId)
    }
    setSessionId(null)
    setMessages([])
  }

  if (!sessionId) {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-3xl">Real-Life Simulation</h2>
        <p className="text-gray-400">Practice real-life scenarios with AI role-play.</p>

        <div className="card max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Situation</label>
            <select value={situation} onChange={e => setSituation(e.target.value)} className="input-field">
              <option value="">Select a situation</option>
              <option value="ordering food">Ordering Food</option>
              <option value="job interview">Job Interview</option>
              <option value="hotel check-in">Hotel Check-in</option>
              <option value="sales call">Sales Call</option>
              <option value="doctor visit">Doctor Visit</option>
              <option value="networking event">Networking Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Difficulty (1-5)</label>
            <input type="range" min={1} max={5} value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Easy</span><span>Hard</span>
            </div>
          </div>
          <button onClick={startSimulation} className="btn-primary w-full" disabled={!situation || loading}>
            {loading ? 'Starting...' : 'Start Simulation'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">Simulation: {situation}</h2>
        <button onClick={endSimulation} className="btn-secondary">End Simulation</button>
      </div>

      <div className="flex-1 overflow-y-auto card space-y-4">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-dark-lighter'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.corrections && msg.corrections.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  {msg.corrections.map((c: any, j: number) => (
                    <p key={j} className="text-sm text-yellow-400">
                      Correction: "{c.original}" → "{c.corrected}" ({c.explanation})
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-lighter rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="input-field flex-1"
          placeholder="Type your response..."
          disabled={loading}
        />
        <button onClick={sendMessage} className="btn-primary" disabled={loading || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
