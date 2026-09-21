import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { UserCheck, Sparkles, ArrowRight } from 'lucide-react'

export default function Login() {
  const { loginAsDev, isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()
  const [donorEmail, setDonorEmail] = useState('devotee@example.com')
  const [donorName, setDonorName] = useState('Bhakt Devotee')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/my-donations')
  }, [isLoggedIn, navigate])

  const handleQuickLogin = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    try {
      await loginAsDev({
        email: donorEmail || 'devotee@example.com',
        name: donorName || 'Bhakt Devotee',
        role: 'USER',
      })
      navigate('/my-donations')
    } catch {
      // toast error handled in context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card text-center relative overflow-hidden">
          <div className="text-5xl mb-3">🐘</div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Devotee Portal</h1>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to view your donation receipts, transaction history, and receive digital blessings.
          </p>

          {loading || isSubmitting ? (
            <div className="py-6">
              <LoadingSpinner text="Logging in..." />
            </div>
          ) : (
            <form onSubmit={handleQuickLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-gray-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                  placeholder="e.g. ramesh@example.com"
                  className="w-full bg-gray-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-2"
              >
                <Sparkles size={18} className="text-amber-200" />
                <span>Sign In & View My Donations</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-gray-400 text-xs">
              Want to make a new donation?{' '}
              <Link to="/donate" className="text-saffron-400 hover:text-saffron-300 font-semibold underline">
                Donate Directly
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
