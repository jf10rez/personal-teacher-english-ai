import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { progressService } from '../services/progress.service'
import { learningPlanService } from '../services/learningPlan.service'
import { ProgressSummary, LearningPlan } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { BookOpen, Clock, TrendingUp, Target } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function Dashboard() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [plan, setPlan] = useState<LearningPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([progressService.getSummary(), learningPlanService.getActive()])
      .then(([s, p]) => { setSummary(s); setPlan(p) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const totalCompleted = plan?.days?.reduce((acc, day) =>
    acc + day.tasks.filter(t => t.completed).length, 0) || 0
  const totalTasks = plan?.days?.reduce((acc, day) => acc + day.tasks.length, 0) || 0
  const progressPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

  const chartData = summary ? Object.entries(summary.byModule).map(([module, data]) => ({
    name: module.charAt(0).toUpperCase() + module.slice(1),
    score: data.avgScore,
    time: data.totalTime,
  })) : []

  const pieData = chartData.map(d => ({ name: d.name, value: d.time }))

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Plan Progress', value: `${progressPercent}%`, color: 'text-primary' },
          { icon: Clock, label: 'Total Study Time', value: `${summary ? Object.values(summary.byModule).reduce((a, b) => a + b.totalTime, 0) : 0}m`, color: 'text-accent' },
          { icon: TrendingUp, label: 'Avg Score', value: summary ? `${Math.round(Object.values(summary.byModule).reduce((a, b) => a + b.avgScore, 0) / Object.keys(summary.byModule).length)}%` : '0%', color: 'text-yellow-400' },
          { icon: Target, label: 'Modules Done', value: `${Object.keys(summary?.byModule || {}).length}`, color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <Icon className={color} size={28} />
            <p className="text-gray-400 text-sm mt-2">{label}</p>
            <p className="font-display font-bold text-2xl mt-1">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Scores by Module</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">No data yet. Start learning!</p>
          )}
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Time Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">No data yet. Start learning!</p>
          )}
        </div>
      </div>

      {plan && (
        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Current Plan Progress</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {plan.days.slice(0, 10).map((day) => {
              const done = day.tasks.filter(t => t.completed).length
              const total = day.tasks.length
              return (
                <div key={day.dayNumber} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-16">Day {day.dayNumber}</span>
                  <div className="flex-1 bg-dark-lighter rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{done}/{total}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
