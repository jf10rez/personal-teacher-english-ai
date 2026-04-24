import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Grammar() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [weakPoints, setWeakPoints] = useState<string[]>([])
  const { user } = useAuthStore()

  const handleGenerate = async () => {
    setLoading(true)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setWeakPoints([])
    try {
      const data = await modulesService.grammar(topic, user?.level || 'beginner')
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!result?.exercises) return
    let correct = 0
    const weak: string[] = []
    result.exercises.forEach((ex: any, i: number) => {
      if (answers[i]?.toLowerCase().trim() === ex.answer.toLowerCase().trim()) {
        correct++
      } else {
        weak.push(ex.question)
      }
    })
    setScore(correct)
    setWeakPoints(weak)
    setSubmitted(true)
  }

  const handleFollowUp = async () => {
    setLoading(true)
    try {
      const data = await modulesService.grammarFollowUp(topic, user?.level || 'beginner', weakPoints)
      setResult(data)
      setAnswers({})
      setSubmitted(false)
      setScore(0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Grammar Quick Fix</h2>
      <p className="text-gray-400">Get clear explanations, examples, and exercises for any grammar topic.</p>

      <div className="card max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Grammar Topic</label>
          <input value={topic} onChange={e => setTopic(e.target.value)} className="input-field" placeholder="e.g., present perfect, conditionals, passive voice" />
        </div>
        <button onClick={handleGenerate} className="btn-primary w-full" disabled={!topic || loading}>
          {loading ? 'Generating...' : 'Generate Lesson'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {result.rule && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-2">Rule</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{result.rule}</p>
            </div>
          )}

          {result.examples && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Examples</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {result.examples.map((ex: string, i: number) => (
                  <div key={i} className="bg-dark-lighter rounded p-2 text-sm">{ex}</div>
                ))}
              </div>
            </div>
          )}

          {result.commonMistakes && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Common Mistakes</h3>
              {result.commonMistakes.map((m: any, i: number) => (
                <div key={i} className="bg-dark-lighter rounded p-3 mb-2">
                  <p className="text-red-400 line-through">{m.wrong}</p>
                  <p className="text-accent">{m.correct}</p>
                  <p className="text-sm text-gray-400 mt-1">{m.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {result.exercises && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Exercises</h3>
              {result.exercises.map((ex: any, i: number) => (
                <div key={i} className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded mr-2 ${
                      ex.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      ex.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{ex.difficulty}</span>
                    {ex.question}
                  </p>
                  <input
                    value={answers[i] || ''}
                    onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
                    className="input-field"
                    placeholder="Your answer..."
                    disabled={submitted}
                  />
                  {submitted && (
                    <p className={`text-sm mt-1 ${answers[i]?.toLowerCase().trim() === ex.answer.toLowerCase().trim() ? 'text-accent' : 'text-red-400'}`}>
                      {answers[i]?.toLowerCase().trim() === ex.answer.toLowerCase().trim() ? 'Correct!' : `Answer: ${ex.answer}`}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                {!submitted ? (
                  <button onClick={handleSubmit} className="btn-primary">Submit Answers</button>
                ) : (
                  <>
                    <p className="text-lg font-semibold">Score: {score}/{result.exercises.length}</p>
                    {weakPoints.length > 0 && (
                      <button onClick={handleFollowUp} className="btn-secondary">Practice Weak Points</button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
