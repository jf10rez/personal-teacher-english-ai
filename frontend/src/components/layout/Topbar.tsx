import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { Sun, Moon, LogOut, Menu } from 'lucide-react'

interface TopbarProps {
  onToggleSidebar: () => void
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <header className="bg-dark-light border-b border-dark-lighter px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-1 hover:bg-dark-lighter rounded lg:hidden">
          <Menu size={20} />
        </button>
        <h2 className="font-display font-semibold text-lg">Welcome, {user?.name}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={logout}
          className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
