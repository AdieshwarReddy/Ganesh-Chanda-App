import { useState, useEffect } from 'react'
import { donationAPI } from '../services/api'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Search } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Contributors() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    donationAPI.getPublic({ limit: 100 }).then(r => {
      setDonations(r.data || [])
      const sum = r.data.reduce((s, d) => s + Number(d.amount), 0)
      setTotal(sum)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = donations.filter(d => {
    if (!search) return true
    const name = d.is_anonymous ? 'anonymous' : d.donor_name.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="section-title">Our Contributors</h1>
          <p className="text-gray-400 mt-2">
            {donations.length} generous donors · {formatCurrency(total)} collected
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="input-field pl-11"
          />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner size="lg" text="Loading contributors..." /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🙏</div>
            <p className="text-gray-400">No contributors yet. Be the first to donate!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d, i) => (
              <div key={d.id} className="card flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${i === 0 ? 'bg-gold-500/30 text-gold-400 border border-gold-500/50' :
                      i === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                      i === 2 ? 'bg-amber-700/30 text-amber-600 border border-amber-700/30' :
                      'bg-saffron-500/10 text-saffron-400 border border-saffron-500/20'}`}
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (d.is_anonymous ? '🙏' : d.donor_name[0]?.toUpperCase())}
                  </div>
                  <div>
                    <div className="text-white font-medium">{d.is_anonymous ? 'Anonymous Donor' : d.donor_name}</div>
                    <div className="text-gray-500 text-xs">{d.payment_method} · {formatDate(d.created_at)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-saffron-400 font-display font-bold text-lg">{formatCurrency(d.amount)}</div>
                  <div className="text-xs text-emerald-400">✓ Verified</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
