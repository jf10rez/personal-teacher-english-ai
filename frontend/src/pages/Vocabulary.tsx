import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import FlipCard from '../components/ui/FlipCard'

export default function Vocabulary() {
  const [count, setCount] = useState(30)
  const [context, setContext] = useState('travel')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [testMode, setTestMode] = useState(false)
  const [currentWord, setCurrentWord] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const { user } = useAuthStore()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = await modulesService.vocabulary({ count, context, level: user?.level || 'beginner' })
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const startTest = () => {
    if (!result?.words) return
    const random = result.words[Math.floor(Math.random() * result.words.length)]
    setCurrentWord(random)
    setUserAnswer('')
    setFeedback('')
    setTestMode(true)
  }

  const checkAnswer = () => {
    if (!currentWord) return
    if (userAnswer.toLowerCase().includes(currentWord.word.toLowerCase().split(' ')[0])) {
      setFeedback('Correct! Great job!')
    } else {
      setFeedback(`Not quite. The word was: ${currentWord.word}`)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Vocabulary Builder</h2>
      <p className="text-gray-400">Learn vocabulary that actually sticks with context, examples, and memory tricks.</p>

      <div className="card max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Word Count</label>
            <select value={count} onChange={e => setCount(Number(e.target.value))} className="input-field">
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Context</label>
            <select value={context} onChange={e => setContext(e.target.value)} className="input-field">
              <option value="travel">Travel</option>
              <option value="business">Business</option>
              <option value="daily life">Daily Life</option>
              <option value="job interview">Job Interview</option>
              <option value="customer service">Customer Service</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} className="btn-primary w-full" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Vocabulary'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {result?.words && (
        <>
          <div className="flex gap-4">
            <button onClick={startTest} className="btn-secondary">Start Test</button>
          </div>

          {testMode && currentWord && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-lg mx-auto">
              <h3 className="font-display font-semibold text-lg mb-4">Vocabulary Test</h3>
              <p className="text-gray-400 mb-2">Meaning: {currentWord.meaning}</p>
              <p className="text-sm text-gray-500 mb-4">Example: {currentWord.example}</p>
              <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)} className="input-field mb-2" placeholder="Type the word..." />
              <button onClick={checkAnswer} className="btn-primary w-full">Check Answer</button>
              {feedback && <p className={`mt-2 text-center ${feedback.includes('Correct') ? 'text-accent' : 'text-red-400'}`}>{feedback}</p>}
              <button onClick={startTest} className="btn-secondary w-full mt-2">Next Word</button>
            </motion.div>
          )}

          {!testMode && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.words.map((word: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                  <FlipCard
                    front={
                      <div className="text-center">
                        <p className="font-display font-bold text-xl text-primary">{word.word}</p>
                        <p className="text-sm text-gray-400 mt-1">{word.pronunciation}</p>
                      </div>
                    }
                    back={
                      <div className="text-center space-y-1 text-sm">
                        <p className="text-accent">{word.meaning}</p>
                        <p className="text-gray-400">{word.example}</p>
                        <p className="text-gray-500">Collocation: {word.collocation}</p>
                        <p className="text-yellow-400 text-xs">{word.memoryTrick}</p>
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
