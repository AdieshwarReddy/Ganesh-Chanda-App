import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gc_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const loginWithGoogle = useCallback(async (googleToken) => {
    setLoading(true)
    try {
      const res = await authAPI.googleLogin(googleToken)
      const { access_token, user: userData } = res.data
      localStorage.setItem('gc_token', access_token)
      localStorage.setItem('gc_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome, ${userData.name}! 🙏`)
      return userData
    } catch (err) {
      const msg = err.response?.data?.detail || 'Google login failed'
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const loginAsDev = useCallback(async ({ email = 'admin@example.com', name = 'Organizer Admin', role = 'ADMIN' } = {}) => {
    setLoading(true)
    try {
      const res = await authAPI.devLogin({ email, name, role })
      const { access_token, user: userData } = res.data
      localStorage.setItem('gc_token', access_token)
      localStorage.setItem('gc_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome, ${userData.name}! 🙏`)
      return userData
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('gc_token')
    localStorage.removeItem('gc_user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('gc_token')
    if (!token) return
    try {
      const res = await authAPI.getMe()
      const userData = res.data
      localStorage.setItem('gc_user', JSON.stringify(userData))
      setUser(userData)
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    if (localStorage.getItem('gc_token')) refreshUser()
  }, [refreshUser])

  const isAdmin = user?.role === 'ADMIN'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isLoggedIn, loginWithGoogle, loginAsDev, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
