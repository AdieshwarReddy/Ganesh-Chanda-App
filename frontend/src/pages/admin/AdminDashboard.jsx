import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'
import { Users, CheckCircle, Clock, XCircle, TrendingUp, Download, ArrowRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { downloadBlob } from '../../utils/formatters'

const PIE_COLORS = ['#f97316', '#f59e0b', '#10b981', '#3b82f6']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [dailyData, setDailyData] = useState([])
  const [methodData, setMethodData] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getDailyStats(14),
      adminAPI.getMethodStats(),
    ]).then(([s, d, m]) => {
      setStats(s.data)
      setDailyData(d.data || [])
      setMethodData(m.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await adminAPI.exportCSV()
      downloadBlob(res.data, `donations_${new Date().toISOString().slice(0,10)}.csv`)
    } catch { } finally { setExporting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  )

  const statCards = stats ? [
    { label: 'Total Collection', value: formatCurrency(stats.total_collection), icon: '💰', color: 'text-saffron-400', sub: 'Verified only' },
    { label: "Today's Collection", value: formatCurrency(stats.today_collection), icon: '📅', color: 'text-gold-400', sub: 'Verified today' },
    { label: 'Total Donors', value: stats.total_donors, icon: <Users size={24} />, color: 'text-blue-400', sub: 'All submissions' },
    { label: 'Pending Payments', value: stats.pending_count, icon: <Clock size={24} />, color: 'text-yellow-400', sub: 'Awaiting review' },
    { label: 'Verified Payments', value: stats.verified_count, icon: <CheckCircle size={24} />, color: 'text-emerald-400', sub: 'Confirmed' },
    { label: 'Rejected Payments', value: stats.rejected_count, icon: <XCircle size={24} />, color: 'text-crimson-400', sub: 'Declined' },
  ] : []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">Ganesh Chanda 2026 Overview</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <Download size={15} />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Target Progress */}
      {stats && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-400 text-sm">Collection Progress</div>
              <div className="text-white font-display font-bold text-2xl mt-1">
                {formatCurrency(stats.total_collection)}
                <span className="text-gray-500 font-normal text-base"> / {formatCurrency(stats.target_amount)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-saffron-400 font-display font-bold text-3xl">{stats.percentage_completed}%</div>
              <div className="text-gray-500 text-xs">Completed</div>
            </div>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full progress-bar rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, stats.percentage_completed)}%` }} />
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon, color, sub }) => (
          <div key={label} className="stat-card">
            <div className={`text-2xl mb-2 ${typeof icon === 'string' ? '' : color}`}>
              {typeof icon === 'string' ? icon : icon}
            </div>
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
            <div className="text-white text-sm font-medium mt-0.5">{label}</div>
            <div className="text-gray-500 text-xs">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Daily Bar Chart */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">Daily Collection (14 days)</h2>
          {dailyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }}
                  formatter={(v) => [formatCurrency(v), 'Amount']}
                />
                <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">Payment Methods</h2>
          {methodData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={methodData} dataKey="total" nameKey="method" cx="50%" cy="50%" outerRadius={80} label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {methodData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8 }} formatter={v => [formatCurrency(v), 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick link */}
      <Link to="/admin/donations" className="card flex items-center justify-between hover:border-saffron-500/50 cursor-pointer group">
        <div>
          <div className="text-white font-semibold">Manage Donations</div>
          <div className="text-gray-400 text-sm">View, verify, reject and export donations</div>
        </div>
        <ArrowRight size={20} className="text-gray-500 group-hover:text-saffron-400 transition-colors" />
      </Link>
    </div>
  )
}
