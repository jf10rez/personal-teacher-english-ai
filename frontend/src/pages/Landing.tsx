import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'
import { BookOpen, Brain, MessageCircle, Sparkles, Mic, Globe } from 'lucide-react'

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        const data = await authService.login(email, password)
        setAuth(data.user, data.accessToken, data.refreshToken)
      } else {
        const data = await authService.register({ name, email, password })
        setAuth(data.user, data.accessToken, data.refreshToken)
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Brain, title: 'Personal Coach', desc: 'AI-generated 30-day learning plans' },
    { icon: Sparkles, title: 'Think in English', desc: 'Stop translating in your head' },
    { icon: MessageCircle, title: 'Real Conversations', desc: 'Practice with AI native speakers' },
    { icon: BookOpen, title: 'Vocabulary', desc: 'Words that actually stick' },
    { icon: Mic, title: 'Pronunciation', desc: 'Sound less robotic' },
    { icon: Globe, title: 'Immersion', desc: 'Personalized content recommendations' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <nav className="border-b border-dark-lighter px-6 py-4 flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-primary">EnglishAI</h1>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="btn-primary"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display font-bold text-5xl mb-4">
              Learn English <span className="text-primary">10x Faster</span> with AI
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Personalized learning plans, real-time conversation practice, and smart mistake analysis. 
              Your AI-powered English coach available 24/7.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card">
                  <Icon className="text-primary mb-2" size={24} />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card max-w-md mx-auto">
              <h3 className="font-display font-bold text-2xl mb-6">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Your name"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>
              <p className="text-center text-gray-400 mt-4 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
