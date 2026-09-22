import { Outlet, Link, useLocation, useEffect } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Settings, LogOut, BarChart2, Users, ChevronRight } from 'lucide-react'

export default function AdminLayout() {
  const { user, isLoggedIn, loginAsDev, logout } = useAuth()
  const location = useLocation()

  // Auto-login as admin if not already logged in — no login page needed
  useEffect(() => {
    if (!isLoggedIn) {
      loginAsDev({ email: 'admin@ganeshchanda.com', name: 'Mogili Adieshwar Reddy', role: 'ADMIN' })
    }
  }, [isLoggedIn, loginAsDev])

  const navItems = [
    { to: '/admin/dashboard', icon: BarChart2, label: 'Dashboard' },
    { to: '/admin/donations', icon: Users, label: 'Donations' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-xl flex items-center justify-center text-lg">🐘</div>
            <div>
              <div className="text-white font-display font-bold text-sm">Ganesh Chanda</div>
              <div className="text-saffron-400 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive(to)
                  ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={17} />
              {label}
              {isActive(to) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-saffron-500/20 rounded-full flex items-center justify-center text-sm">
              🐘
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.name || 'Adieshwar Reddy'}</div>
              <div className="text-gold-400 text-xs">Admin</div>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-saffron-400 transition-colors w-full"
          >
            <LogOut size={15} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
