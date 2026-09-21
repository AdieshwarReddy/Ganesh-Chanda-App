import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import { Shield, Sparkles, LogIn } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const { loginWithGoogle, loginAsDev, isLoggedIn, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [customEmail, setCustomEmail] = useState('admin@example.com')
  const [customName, setCustomName] = useState('Organizer Admin')
  const [showCustom, setShowCustom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoggedIn && isAdmin) navigate('/admin/dashboard')
    else if (isLoggedIn && !isAdmin) {
      toast.error('You do not have admin access.')
    }
  }, [isLoggedIn, isAdmin, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const userData = await loginWithGoogle(credentialResponse.credential)
      if (userData?.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        toast.error('Access denied. This account is not an admin.')
      }
    } catch {}
  }

  const handleQuickDevLogin = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    try {
      const userData = await loginAsDev({
        email: customEmail || 'admin@example.com',
        name: customName || 'Organizer Admin',
        role: 'ADMIN',
      })
      if (userData?.role === 'ADMIN') {
        navigate('/admin/dashboard')
      }
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
          {/* Header */}
          <div className="w-16 h-16 bg-saffron-500/20 border border-saffron-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-saffron-500/10">
            <Shield size={32} className="text-saffron-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm mb-6">
            Restricted to authorized Utsav organizers and committee members.
          </p>

          {loading || isSubmitting ? (
            <div className="py-8">
              <LoadingSpinner text="Authenticating..." />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick Dev/Demo Admin Access Button */}
              <button
                type="button"
                onClick={handleQuickDevLogin}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
              >
                <Sparkles size={18} className="text-amber-200" />
                <span>Instant Admin Login</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gray-900 px-3 text-gray-500">Or sign in with Google</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google login failed (Check Google Client ID)')}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                />
              </div>

              {/* Toggle Custom Email option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustom(!showCustom)}
                  className="text-xs text-gray-400 hover:text-saffron-400 transition-colors underline"
                >
                  {showCustom ? 'Hide custom login fields' : 'Login with custom email / credentials'}
                </button>
              </div>

              {showCustom && (
                <form onSubmit={handleQuickDevLogin} className="space-y-3 pt-3 text-left border-t border-white/10">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Admin Email</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      required
                      placeholder="admin@example.com"
                      className="w-full bg-gray-800/80 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      required
                      placeholder="Organizer Admin"
                      className="w-full bg-gray-800/80 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 border border-white/20 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn size={16} />
                    Sign In with This Account
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-gray-500 text-xs">
              Need assistance? Contact the Ganesh Chanda Committee head.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
