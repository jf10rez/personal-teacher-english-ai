import { useState } from 'react'
import { motion } from 'framer-motion'
import { learningPlanService } from '../services/learningPlan.service'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Coach() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { user } = useAuthStore()
  const [weeks, setWeeks] = useState(4)

  const handleGenerate = async () => {
    if (!user) return
    setLoading(true)
    try {
      const plan = await learningPlanService.generate({
        level: user.level,
        goal: user.goal || 'General English',
        dailyMinutes: user.dailyMinutes,
        weeks,
      })
      setResult(plan)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Personal Coach</h2>
      <p className="text-gray-400">Generate a personalized learning plan based on your goals and level.</p>

      <div className="card max-w-md">
        <label className="block text-sm text-gray-400 mb-2">Plan Duration (weeks)</label>
        <input type="number" value={weeks} onChange={e => setWeeks(Number(e.target.value))} className="input-field" min={1} max={12} />
        <button onClick={handleGenerate} className="btn-primary w-full mt-4" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="font-display font-semibold text-xl mb-4">Your {weeks}-Week Plan</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.days?.slice(0, 7).map((day: any) => (
              <div key={day.dayNumber} className="bg-dark-lighter rounded-lg p-4">
                <h4 className="font-semibold text-primary">Day {day.dayNumber}</h4>
                <ul className="mt-2 space-y-1">
                  {day.tasks?.map((task: any, i: number) => (
                    <li key={i} className="text-sm text-gray-300">
                      <span className="text-xs text-accent uppercase mr-2">[{task.type}]</span>
                      {task.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
