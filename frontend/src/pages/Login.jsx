import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { UserCheck, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { loginWithGoogle, loginAsDev, isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()
  const [donorEmail, setDonorEmail] = useState('donor@example.com')
  const [donorName, setDonorName] = useState('Bhakt Devotee')
  const [showCustom, setShowCustom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/my-donations')
  }, [isLoggedIn, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate('/my-donations')
    } catch {}
  }

  const handleQuickDonorLogin = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    try {
      await loginAsDev({
        email: donorEmail || 'donor@example.com',
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
      <div className="max-w-sm w-full">
        <div className="card text-center">
          <div className="text-5xl mb-3 animate-bounce-subtle">🐘</div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Welcome Devotee</h1>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to track your donations, download official receipts, and receive blessings.
          </p>

          {loading || isSubmitting ? (
            <div className="py-6">
              <LoadingSpinner text="Signing in..." />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick Donor Login Button */}
              <button
                type="button"
                onClick={handleQuickDonorLogin}
                className="w-full py-3 px-4 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-medium rounded-xl shadow-lg shadow-saffron-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
              >
                <Sparkles size={18} className="text-amber-200" />
                <span>Quick Sign-In (Demo/Dev)</span>
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gray-900 px-3 text-gray-500">Or continue with Google</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google login failed (Client ID required)')}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  text="signin_with"
                />
              </div>

              {/* Custom login details */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustom(!showCustom)}
                  className="text-xs text-gray-400 hover:text-saffron-400 underline"
                >
                  {showCustom ? 'Hide custom fields' : 'Sign in with specific email/name'}
                </button>
              </div>

              {showCustom && (
                <form onSubmit={handleQuickDonorLogin} className="space-y-3 pt-3 text-left border-t border-white/10">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-gray-800/80 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                      placeholder="e.g. ramesh@example.com"
                      className="w-full bg-gray-800/80 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 border border-white/20 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserCheck size={16} />
                    Sign In
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs">
              You can also{' '}
              <a href="/donate" className="text-saffron-400 hover:text-saffron-300 underline font-medium">
                donate without logging in
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
