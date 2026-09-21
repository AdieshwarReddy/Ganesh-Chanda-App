import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Sparkles, LogIn, ArrowRight } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const { loginAsDev, isLoggedIn, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [adminEmail, setAdminEmail] = useState('mogiliadieshwarreddy5919@gmail.com')
  const [adminName, setAdminName] = useState('Mogili Adieshwar Reddy (Admin)')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoggedIn && isAdmin) navigate('/admin/dashboard')
    else if (isLoggedIn && !isAdmin) {
      toast.error('You do not have admin access.')
    }
  }, [isLoggedIn, isAdmin, navigate])

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    try {
      const userData = await loginAsDev({
        email: adminEmail || 'admin@example.com',
        name: adminName || 'Organizer Admin',
        role: 'ADMIN',
      })
      if (userData?.role === 'ADMIN') {
        navigate('/admin/dashboard')
      }
    } catch {
      // handled in context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card text-center relative overflow-hidden">
          {/* Header */}
          <div className="w-16 h-16 bg-saffron-500/20 border border-saffron-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-saffron-500/10">
            <Shield size={32} className="text-saffron-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Organizer & Admin Portal</h1>
          <p className="text-gray-400 text-sm mb-6">
            Manage donations, approve transactions, view live analytics, and export contributor spreadsheets.
          </p>

          {loading || isSubmitting ? (
            <div className="py-8">
              <LoadingSpinner text="Accessing Admin Dashboard..." />
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                  Organizer / Admin Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  placeholder="Organizer Admin"
                  className="w-full bg-gray-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full bg-gray-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-2"
              >
                <Sparkles size={18} className="text-amber-200" />
                <span>Enter Admin Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
            <Link to="/" className="hover:text-saffron-400 transition-colors">
              ← Back to Homepage
            </Link>
            <span>Ganesh Utsav 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
