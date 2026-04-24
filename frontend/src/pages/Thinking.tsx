import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import FlipCard from '../components/ui/FlipCard'

export default function Thinking() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const { user } = useAuthStore()
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await modulesService.thinking(user?.level || 'beginner')
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    if (!data?.situations) return
    const allPhrases = data.situations.flatMap((s: any) => s.phrases)
    const random = allPhrases[Math.floor(Math.random() * allPhrases.length)]
    setCurrentQuiz(random)
    setShowAnswer(false)
    setQuizMode(true)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Think in English</h2>
      <p className="text-gray-400">Learn to think directly in English without translating in your head.</p>

      <div className="flex gap-4">
        <button onClick={handleGenerate} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Phrases'}
        </button>
        {data && <button onClick={startQuiz} className="btn-secondary">Start Quiz</button>}
      </div>

      {loading && <LoadingSpinner />}

      {quizMode && currentQuiz && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-lg mx-auto">
          <h3 className="font-display font-semibold text-lg mb-4">Quiz Mode</h3>
          <FlipCard
            front={<p className="text-xl text-center">{currentQuiz.phrase}</p>}
            back={
              <div className="text-center space-y-2">
                <p className="text-accent">{currentQuiz.meaning}</p>
                <p className="text-sm text-gray-400">Pronunciation: {currentQuiz.pronunciation}</p>
                <p className="text-sm text-gray-400">Native: {currentQuiz.nativeVariation}</p>
              </div>
            }
          />
          <div className="flex gap-2 mt-4 justify-center">
            <button onClick={() => setShowAnswer(!showAnswer)} className="btn-secondary">
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button onClick={startQuiz} className="btn-primary">Next</button>
          </div>
        </motion.div>
      )}

      {data?.situations && !quizMode && (
        <div className="space-y-6">
          {data.situations.map((situation: any, idx: number) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h3 className="font-display font-semibold text-xl mb-4 capitalize">{situation.name}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {situation.phrases.map((phrase: any, i: number) => (
                  <div key={i} className="bg-dark-lighter rounded-lg p-4">
                    <p className="font-semibold text-primary">{phrase.phrase}</p>
                    <p className="text-sm text-gray-400 mt-1">{phrase.meaning}</p>
                    <p className="text-xs text-gray-500 mt-1">{phrase.pronunciation}</p>
                    <p className="text-xs text-accent mt-1">Native: {phrase.nativeVariation}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
