import { useState } from 'react'
import { motion } from 'framer-motion'
import { modulesService } from '../services/modules.service'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Naturalness() {
  const [text, setText] = useState('')
  const [tone, setTone] = useState('casual')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const data = await modulesService.naturalness(text, tone)
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Sound More Natural</h2>
      <p className="text-gray-400">Paste your English text and get suggestions to sound more like a native speaker.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your Text</label>
            <textarea value={text} onChange={e => setText(e.target.value)} className="input-field h-40 resize-none" placeholder="Paste your English text here..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="input-field">
              <option value="casual">Casual</option>
              <option value="polite">Polite</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <button onClick={handleAnalyze} className="btn-primary w-full" disabled={!text || loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="lg:col-span-2">
          {loading && <LoadingSpinner />}

          {result?.sentences && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {result.sentences.map((sentence: any, i: number) => (
                <div key={i} className="card">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Your version:</p>
                      <p className="text-red-400">{sentence.userVersion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Natural version:</p>
                      <p className="text-accent">{sentence.naturalVersion}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dark-lighter">
                    <p className="text-sm text-gray-300">{sentence.explanation}</p>
                    <p className="text-xs text-gray-500 mt-1">{sentence.whenToUse}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
