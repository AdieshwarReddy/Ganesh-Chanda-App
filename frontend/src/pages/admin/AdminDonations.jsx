import { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import { formatCurrency, formatDate, statusConfig, paymentMethodLabel } from '../../utils/formatters'
import { downloadReceipt } from '../../utils/receipt'
import { Search, Filter, CheckCircle, XCircle, Trash2, Eye, Download, X, ChevronLeft, ChevronRight } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const PAGE_SIZE = 20

function DonationModal({ donation, onClose, onVerify, onReject }) {
  const [notes, setNotes] = useState('')
  const [acting, setActing] = useState(false)

  const act = async (fn) => {
    setActing(true)
    try { await fn(notes) } finally { setActing(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Donation Detail</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-white" /></button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            ['Receipt No', donation.receipt_number || donation.id],
            ['Donor', donation.is_anonymous ? 'Anonymous' : donation.donor_name],
            ['Phone', donation.phone],
            ['Email', donation.email || '—'],
            ['Address', donation.address || '—'],
            ['Amount', formatCurrency(donation.amount)],
            ['Method', paymentMethodLabel(donation.payment_method)],
            ['Transaction ID', donation.transaction_id || '—'],
            ['Status', donation.payment_status],
            ['Date', formatDate(donation.created_at)],
            ['Message', donation.message || '—'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-gray-400 text-sm shrink-0">{label}</span>
              <span className="text-white text-sm text-right">{val}</span>
            </div>
          ))}
        </div>

        {donation.payment_screenshot_url && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Payment Screenshot</p>
            <a href={donation.payment_screenshot_url} target="_blank" rel="noreferrer">
              <img src={donation.payment_screenshot_url} alt="screenshot" className="w-full rounded-xl border border-white/10 hover:opacity-80 transition-opacity" />
            </a>
          </div>
        )}

        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Admin notes (optional)..."
          rows={2}
          className="input-field resize-none mb-4 text-sm"
        />

        {donation.payment_status === 'PENDING' && (
          <div className="flex gap-3">
            <button
              onClick={() => act(() => onVerify(donation.id, notes))}
              disabled={acting}
              className="flex-1 btn-success flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              {acting ? 'Processing...' : 'Verify Payment'}
            </button>
            <button
              onClick={() => act(() => onReject(donation.id, notes))}
              disabled={acting}
              className="flex-1 btn-danger flex items-center justify-center gap-2"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}

        {donation.payment_status === 'VERIFIED' && (
          <button
            onClick={() => downloadReceipt(donation)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Download size={15} /> Download Receipt
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({ search: '', status: '', method: '', sort: 'newest' })

  const load = useCallback(() => {
    setLoading(true)
    adminAPI.listDonations({
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      search: filters.search || undefined,
      status: filters.status || undefined,
      method: filters.method || undefined,
      sort: filters.sort,
    }).then(r => setDonations(r.data || []))
      .catch(() => toast.error('Failed to load donations'))
      .finally(() => setLoading(false))
  }, [page, filters])

  useEffect(() => { load() }, [load])

  const handleVerify = async (id, notes) => {
    await adminAPI.verify(id, notes)
    toast.success('Payment verified! ✅')
    setSelected(null)
    load()
  }

  const handleReject = async (id, notes) => {
    await adminAPI.reject(id, notes)
    toast.success('Payment rejected')
    setSelected(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this donation? This cannot be undone.')) return
    await adminAPI.delete(id)
    toast.success('Deleted')
    load()
  }

  const setFilter = (key, val) => { setPage(0); setFilters(f => ({ ...f, [key]: val })) }

  return (
    <div className="p-6">
      {selected && (
        <DonationModal
          donation={selected}
          onClose={() => setSelected(null)}
          onVerify={handleVerify}
          onReject={handleReject}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Donations</h1>
          <p className="text-gray-400 text-sm">Manage and verify all donations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              placeholder="Search name, phone, TXN..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <select
            value={filters.status}
            onChange={e => setFilter('status', e.target.value)}
            className="input-field py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            value={filters.method}
            onChange={e => setFilter('method', e.target.value)}
            className="input-field py-2 text-sm"
          >
            <option value="">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="OTHER">Other</option>
          </select>
          <select
            value={filters.sort}
            onChange={e => setFilter('sort', e.target.value)}
            className="input-field py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>
      ) : donations.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-400">No donations found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80">
                  {['Donor', 'Phone', 'Amount', 'Method', 'Transaction ID', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {donations.map(d => {
                  const sc = statusConfig[d.payment_status] || {}
                  return (
                    <tr key={d.id} className="bg-gray-900/40 hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-white text-sm font-medium">{d.is_anonymous ? 'Anonymous' : d.donor_name}</div>
                        <div className="text-gray-500 text-xs">{d.email || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{d.phone}</td>
                      <td className="px-4 py-3 text-saffron-400 font-bold text-sm">{formatCurrency(d.amount)}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{d.payment_method}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs font-mono">{d.transaction_id || '—'}</td>
                      <td className="px-4 py-3"><span className={sc.className}>{sc.label}</span></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(d.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(d)} title="View" className="p-1.5 text-gray-400 hover:text-white transition-colors">
                            <Eye size={15} />
                          </button>
                          {d.payment_status === 'PENDING' && (
                            <>
                              <button onClick={() => handleVerify(d.id)} title="Verify" className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors">
                                <CheckCircle size={15} />
                              </button>
                              <button onClick={() => handleReject(d.id)} title="Reject" className="p-1.5 text-crimson-400 hover:text-crimson-300 transition-colors">
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDelete(d.id)} title="Delete" className="p-1.5 text-gray-500 hover:text-crimson-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-500 text-sm">Page {page + 1}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary py-2 px-3 text-sm disabled:opacity-40">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={donations.length < PAGE_SIZE} className="btn-secondary py-2 px-3 text-sm disabled:opacity-40">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
