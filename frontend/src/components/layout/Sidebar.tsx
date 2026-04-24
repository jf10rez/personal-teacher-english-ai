import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Brain, MessageCircle, Sparkles,
  Library, PenTool, Mic, Globe, Users, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react'

const modules = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/plan', icon: BookOpen, label: '30-Day Plan' },
  { to: '/coach', icon: Brain, label: 'Personal Coach' },
  { to: '/thinking', icon: Sparkles, label: 'Think in English' },
  { to: '/conversation', icon: MessageCircle, label: 'Conversation' },
  { to: '/naturalness', icon: PenTool, label: 'Naturalness' },
  { to: '/vocabulary', icon: Library, label: 'Vocabulary' },
  { to: '/grammar', icon: BookOpen, label: 'Grammar' },
  { to: '/pronunciation', icon: Mic, label: 'Pronunciation' },
  { to: '/immersion', icon: Globe, label: 'Immersion' },
  { to: '/simulation', icon: Users, label: 'Simulation' },
  { to: '/mistakes', icon: AlertTriangle, label: 'Mistakes' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 72 }}
      className="bg-dark-light border-r border-dark-lighter flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-dark-lighter">
        {isOpen && <h1 className="font-display font-bold text-xl text-primary">EnglishAI</h1>}
        <button onClick={onToggle} className="p-1 hover:bg-dark-lighter rounded">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {modules.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}
