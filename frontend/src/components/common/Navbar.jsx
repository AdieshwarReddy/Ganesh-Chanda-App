import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Heart, LogOut, User, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, isLoggedIn, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/donate', label: 'Donate' },
    { to: '/contributors', label: 'Contributors' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-saffron-500/50 shadow-lg shadow-saffron-500/20 group-hover:scale-110 transition-transform bg-gray-900">
              <img src="/ganesha.jpg" alt="Ganesh" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-display font-bold text-base leading-tight">Ganesh Chanda</div>
              <div className="text-saffron-400 text-xs font-medium">2026</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link text-sm ${isActive(item.to) ? 'text-saffron-400 font-semibold' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/my-donations"
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <User size={15} />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
            )}
            <Link to="/donate" className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
              <Heart size={14} />
              Donate Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10 py-4 px-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${isActive(item.to) ? 'text-saffron-400' : 'text-gray-300'}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 space-y-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm text-gold-400 font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/my-donations" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-300">
                  My Donations
                </Link>
                <button onClick={handleLogout} className="block py-2 text-sm text-red-400 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-300">
                Login
              </Link>
            )}
            <Link to="/donate" onClick={() => setOpen(false)} className="btn-primary py-2 px-4 text-sm w-full text-center block">
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
