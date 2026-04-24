import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Immersion() {
  const [interest, setInterest] = useState('')
  const [minutesPerDay, setMinutesPerDay] = useState(30)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { user } = useAuthStore()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = await modulesService.immersion({
        interest,
        level: user?.level || 'beginner',
        minutesPerDay,
      })
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Immersion Plan</h2>
      <p className="text-gray-400">Get personalized content recommendations based on your interests.</p>

      <div className="card max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Your Interest</label>
          <select value={interest} onChange={e => setInterest(e.target.value)} className="input-field">
            <option value="">Select an interest</option>
            <option value="podcasts">Podcasts</option>
            <option value="YouTube">YouTube</option>
            <option value="movies">Movies</option>
            <option value="football">Football/Soccer</option>
            <option value="tech">Technology</option>
            <option value="gaming">Gaming</option>
            <option value="finance">Finance</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Minutes per day</label>
          <input type="number" value={minutesPerDay} onChange={e => setMinutesPerDay(Number(e.target.value))} className="input-field" min={5} />
        </div>
        <button onClick={handleGenerate} className="btn-primary w-full" disabled={!interest || loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {result.recommendations && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Recommended Content</h3>
              {result.recommendations.map((rec: any, i: number) => (
                <div key={i} className="bg-dark-lighter rounded p-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{rec.type}</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">{rec.level}</span>
                  </div>
                  <h4 className="font-semibold mt-2">{rec.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{rec.why}</p>
                </div>
              ))}
            </div>
          )}

          {result.vocabulary && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Words You'll Encounter</h3>
              <div className="flex flex-wrap gap-2">
                {result.vocabulary.map((word: string, i: number) => (
                  <span key={i} className="bg-dark-lighter px-3 py-1 rounded-full text-sm">{word}</span>
                ))}
              </div>
            </div>
          )}

          {result.speakingExercise && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-2">Speaking Exercise</h3>
              <p className="text-gray-300">{result.speakingExercise}</p>
            </div>
          )}

          {result.writingExercise && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-2">Writing Exercise</h3>
              <p className="text-gray-300">{result.writingExercise}</p>
            </div>
          )}

          {result.summaryTask && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-2">Summary Task</h3>
              <p className="text-gray-300">{result.summaryTask}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
