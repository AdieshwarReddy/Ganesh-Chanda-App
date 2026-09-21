import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { donationAPI } from '../services/api'
import { formatCurrency, formatDate, statusConfig } from '../utils/formatters'
import { downloadReceipt } from '../utils/receipt'
import { Download } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function MyDonations() {
  const { isLoggedIn, user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return
    donationAPI.getMy().then(r => setDonations(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [isLoggedIn])

  if (!isLoggedIn) return <Navigate to="/login" replace />

  const totalVerified = donations.filter(d => d.payment_status === 'VERIFIED').reduce((s, d) => s + Number(d.amount), 0)

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="card-glass flex items-center gap-4 mb-8">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt="avatar" className="w-14 h-14 rounded-full ring-2 ring-saffron-500/40" />
          ) : (
            <div className="w-14 h-14 bg-saffron-500/20 rounded-full flex items-center justify-center text-xl font-bold text-saffron-400">
              {user?.name?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-white font-display font-bold text-xl">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-saffron-400 font-display font-bold text-xl">{formatCurrency(totalVerified)}</div>
            <div className="text-gray-500 text-xs">Total Verified Contributions</div>
          </div>
        </div>

        <h2 className="text-white font-semibold text-lg mb-4">My Donations ({donations.length})</h2>

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner size="lg" text="Loading your donations..." /></div>
        ) : donations.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🙏</div>
            <p className="text-gray-400 mb-4">You haven't made any donations yet.</p>
            <Link to="/donate" className="btn-primary inline-block">Donate Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map(d => {
              const sc = statusConfig[d.payment_status] || {}
              return (
                <div key={d.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-saffron-400 font-display font-bold text-xl">{formatCurrency(d.amount)}</div>
                      <div className="text-gray-400 text-sm">{d.payment_method} · {formatDate(d.created_at)}</div>
                    </div>
                    <span className={sc.className}>{sc.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-3">Receipt: {d.receipt_number || d.id}</div>
                  {d.transaction_id && (
                    <div className="text-xs text-gray-500">TXN: {d.transaction_id}</div>
                  )}
                  {d.message && (
                    <p className="text-gray-400 text-sm italic mt-2">"{d.message}"</p>
                  )}
                  {d.payment_status === 'VERIFIED' && (
                    <button
                      onClick={() => downloadReceipt(d)}
                      className="mt-3 flex items-center gap-1.5 text-sm text-saffron-400 hover:text-saffron-300 transition-colors"
                    >
                      <Download size={14} /> Download Receipt
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
