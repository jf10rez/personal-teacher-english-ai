import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Pronunciation() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [mode, setMode] = useState<'general' | 'text'>('general')
  const { user } = useAuthStore()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = await modulesService.pronunciation(
        user?.level || 'beginner',
        mode === 'text' ? text : undefined
      )
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Pronunciation Coach</h2>
      <p className="text-gray-400">Improve your pronunciation with targeted exercises and tips.</p>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode('general'); setResult(null) }} className={`btn-secondary ${mode === 'general' ? 'bg-primary/20 border-primary' : ''}`}>General Guide</button>
        <button onClick={() => { setMode('text'); setResult(null) }} className={`btn-secondary ${mode === 'text' ? 'bg-primary/20 border-primary' : ''}`}>Analyze Text</button>
      </div>

      {mode === 'text' && (
        <div className="card max-w-lg space-y-4">
          <textarea value={text} onChange={e => setText(e.target.value)} className="input-field h-24 resize-none" placeholder="Paste a phrase to analyze..." />
          <button onClick={handleGenerate} className="btn-primary w-full" disabled={!text || loading}>
            {loading ? 'Analyzing...' : 'Analyze Pronunciation'}
          </button>
        </div>
      )}

      {mode === 'general' && (
        <button onClick={handleGenerate} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Get Pronunciation Guide'}
        </button>
      )}

      {loading && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {result.topErrors && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Top Pronunciation Errors</h3>
              {result.topErrors.map((err: any, i: number) => (
                <div key={i} className="bg-dark-lighter rounded p-3 mb-2">
                  <p className="font-semibold">{err.sound}</p>
                  <p className="text-red-400 text-sm">Common error: {err.mistake}</p>
                  <p className="text-accent text-sm">Tip: {err.tip}</p>
                </div>
              ))}
            </div>
          )}

          {result.minimalPairs && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Minimal Pairs</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.minimalPairs.map((pair: any, i: number) => (
                  <div key={i} className="bg-dark-lighter rounded p-3">
                    <p className="font-semibold text-primary">{pair.pair[0]}</p>
                    <p className="font-semibold text-accent">{pair.pair[1]}</p>
                    <p className="text-sm text-gray-400 mt-1">{pair.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.syllables && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Syllable Breakdown</h3>
              <div className="flex flex-wrap gap-2">
                {result.syllables.map((s: string, i: number) => (
                  <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">{s}</span>
                ))}
              </div>
              {result.stress && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400">Stress: {result.stress.join(', ')}</p>
                </div>
              )}
              {result.pauses && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400">Pauses: {result.pauses.join(' | ')}</p>
                </div>
              )}
            </div>
          )}

          {result.dailyExercises && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Daily Exercises</h3>
              <ul className="space-y-2">
                {result.dailyExercises.map((ex: string, i: number) => (
                  <li key={i} className="bg-dark-lighter rounded p-3 text-sm">{ex}</li>
                ))}
              </ul>
            </div>
          )}

          {result.shadowingPhrases && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Shadowing Phrases</h3>
              {result.shadowingPhrases.map((phrase: string, i: number) => (
                <p key={i} className="bg-dark-lighter rounded p-3 text-sm mb-2">{phrase}</p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
