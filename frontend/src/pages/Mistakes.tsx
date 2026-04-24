import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Mistakes() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [myMistakes, setMyMistakes] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    modulesService.myMistakes().then(setMyMistakes).catch(console.error)
    modulesService.mistakesProgress().then(setProgress).catch(console.error)
  }, [])

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const data = await modulesService.mistakes(text, user?.level || 'beginner')
      setResult(data)
      const updated = await modulesService.myMistakes()
      setMyMistakes(updated)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Mistake Analyzer</h2>
      <p className="text-gray-400">Analyze your English texts to find recurring error patterns and improve.</p>

      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-gray-400 text-sm">Error Patterns Found</p>
            <p className="font-display font-bold text-2xl text-primary">{progress.totalPatterns}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Total Errors</p>
            <p className="font-display font-bold text-2xl text-red-400">{progress.totalErrors}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Focus for Next Session</p>
            <p className="text-sm text-accent">{progress.mostFrequent?.[0]?.pattern || 'None yet'}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <label className="block text-sm text-gray-400 mb-1">Your English Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)} className="input-field h-40 resize-none" placeholder="Paste your English writing here..." />
          <button onClick={handleAnalyze} className="btn-primary w-full" disabled={!text || loading}>
            {loading ? 'Analyzing...' : 'Analyze Mistakes'}
          </button>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-3">Your Recurring Mistakes</h3>
          {myMistakes.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {myMistakes.map((m: any, i: number) => (
                <div key={i} className="bg-dark-lighter rounded p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{m.pattern}</p>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">{m.frequency}x</span>
                  </div>
                  {m.examples?.slice(0, 2).map((ex: any, j: number) => (
                    <div key={j} className="mt-1 text-xs">
                      <span className="text-red-400 line-through">{ex.wrong}</span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-accent">{ex.correct}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No mistakes recorded yet.</p>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {result.errorPatterns && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Error Patterns Found</h3>
              {result.errorPatterns.map((pattern: any, i: number) => (
                <div key={i} className="bg-dark-lighter rounded p-4 mb-3">
                  <h4 className="font-semibold text-primary">{pattern.pattern}</h4>
                  <p className="text-sm text-gray-400 mt-1">{pattern.why}</p>
                  {pattern.examples?.map((ex: any, j: number) => (
                    <div key={j} className="mt-2 text-sm">
                      <span className="text-red-400">{ex.wrong}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-accent">{ex.correct}</span>
                    </div>
                  ))}
                  {pattern.drill && (
                    <div className="mt-2 p-2 bg-primary/10 rounded text-sm">
                      <span className="text-primary font-semibold">Drill: </span>{pattern.drill}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.doThisNotThat && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-3">Do This / Not That</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.doThisNotThat.map((item: any, i: number) => (
                  <div key={i} className="bg-dark-lighter rounded p-3">
                    <p className="text-red-400 text-sm line-through">Not that: {item.notThat}</p>
                    <p className="text-accent text-sm font-semibold">Do this: {item.do}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.rewrittenVersion && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-2">Rewritten Version</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{result.rewrittenVersion}</p>
            </div>
          )}

          {result.focusForNextSession && (
            <div className="card bg-accent/10 border-accent/30">
              <h3 className="font-display font-semibold text-lg mb-2 text-accent">Focus for Next Session</h3>
              <p className="text-gray-300">{result.focusForNextSession}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
