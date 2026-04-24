import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { conversationService } from '../services/conversation.service'
import { conversationSocket } from '../socket/conversationSocket'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Send, Mic, StopCircle } from 'lucide-react'

export default function Conversation() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('B1')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentChunk, setCurrentChunk] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentChunk])

  useEffect(() => {
    conversationSocket.onSessionStarted((data) => {
      setSessionId(data.sessionId)
      setMessages(data.messages || [])
    })

    conversationSocket.onMessageChunk((data) => {
      setCurrentChunk(prev => prev + data.chunk)
    })

    conversationSocket.onMessageComplete((data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, timestamp: new Date().toISOString() }])
      setCurrentChunk('')
      setStreaming(false)
    })

    return () => { conversationSocket.offAll() }
  }, [])

  const startSession = async () => {
    setLoading(true)
    try {
      conversationSocket.connect()
      conversationSocket.joinSession({ userId: user?.id || '', topic, level })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return
    setMessages(prev => [...prev, { role: 'user', content: input, timestamp: new Date().toISOString() }])
    conversationSocket.sendMessage(input)
    setStreaming(true)
    setInput('')
  }

  const endSession = () => {
    conversationSocket.endSession()
    setSessionId(null)
    setMessages([])
  }

  if (!sessionId) {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-3xl">Conversation Practice</h2>
        <p className="text-gray-400">Practice real-time conversations with an AI native speaker.</p>

        <div className="card max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} className="input-field">
              <option value="">Select a topic</option>
              <option value="restaurant">Restaurant</option>
              <option value="airport">Airport</option>
              <option value="job interview">Job Interview</option>
              <option value="first date">First Date</option>
              <option value="office">Office</option>
              <option value="friends">Friends</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Level</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="input-field">
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
          </div>
          <button onClick={startSession} className="btn-primary w-full" disabled={!topic || loading}>
            {loading ? 'Starting...' : 'Start Conversation'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">Conversation: {topic}</h2>
        <button onClick={endSession} className="btn-secondary">End Session</button>
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
        {streaming && currentChunk && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg p-3 bg-dark-lighter">
              <p className="whitespace-pre-wrap">{currentChunk}</p>
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
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="btn-primary" disabled={streaming}>
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
