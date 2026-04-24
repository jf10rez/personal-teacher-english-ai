import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { learningPlanService } from '../services/learningPlan.service'
import { useAuthStore } from '../store/authStore'
import { LearningPlan } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { CheckCircle, Circle } from 'lucide-react'

export default function Plan() {
  const [plan, setPlan] = useState<LearningPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { user } = useAuthStore()

  const [level, setLevel] = useState(user?.level || 'beginner')
  const [goal, setGoal] = useState(user?.goal || '')
  const [dailyMinutes, setDailyMinutes] = useState(user?.dailyMinutes || 30)
  const [weeks, setWeeks] = useState(4)

  useEffect(() => {
    learningPlanService.getActive().then(setPlan).finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const newPlan = await learningPlanService.generate({ level, goal, dailyMinutes, weeks })
      setPlan(newPlan)
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const handleCompleteDay = async (dayNumber: number) => {
    const updated = await learningPlanService.completeDay(dayNumber)
    setPlan(updated)
  }

  if (loading) return <LoadingSpinner />

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="font-display font-bold text-3xl">Create Your Learning Plan</h2>
        <div className="card space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Level</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="input-field">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Goal</label>
            <input value={goal} onChange={e => setGoal(e.target.value)} className="input-field" placeholder="e.g., Travel, Exam, Work" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Minutes per day</label>
            <input type="number" value={dailyMinutes} onChange={e => setDailyMinutes(Number(e.target.value))} className="input-field" min={5} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Weeks</label>
            <input type="number" value={weeks} onChange={e => setWeeks(Number(e.target.value))} className="input-field" min={1} max={12} />
          </div>
          <button onClick={handleGenerate} className="btn-primary w-full" disabled={generating}>
            {generating ? 'Generating with AI...' : 'Generate Plan'}
          </button>
        </div>
      </div>
    )
  }

  const totalCompleted = plan.days.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0)
  const totalTasks = plan.days.reduce((acc, day) => acc + day.tasks.length, 0)
  const progressPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-3xl">Your {weeks}-Week Plan</h2>
        <div className="text-right">
          <p className="text-gray-400">Overall Progress</p>
          <p className="font-display font-bold text-2xl text-primary">{progressPercent}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {plan.days.map((day, idx) => (
          <motion.div
            key={day.dayNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">Day {day.dayNumber}</h3>
              <button onClick={() => handleCompleteDay(day.dayNumber)} className="text-accent hover:text-accent-dark">
                {day.tasks.every(t => t.completed) ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
            </div>
            <div className="space-y-2">
              {day.tasks.map((task, i) => (
                <div key={i} className={`text-sm p-2 rounded ${task.completed ? 'bg-accent/10 text-accent line-through' : 'bg-dark-lighter'}`}>
                  <span className="text-xs text-gray-500 uppercase">{task.type}</span>
                  <p>{task.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
