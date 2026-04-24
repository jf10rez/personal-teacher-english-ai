import { useAuthStore } from '../../store/authStore'
import { LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-dark-light border-b border-dark-lighter px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-display font-semibold text-white">
        Welcome back, {user?.name?.split(' ')[0]}
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-300">
          <User size={20} />
          <span className="text-sm">{user?.email}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </nav>
  )
}
