import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { donationAPI, campaignAPI } from '../services/api'
import { QRCodeSVG } from 'qrcode.react'
import { buildUpiLink } from '../utils/formatters'
import { Upload, X, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'

const AMOUNTS = [100, 251, 500, 1001, 2001, 5001]
const PAYMENT_METHODS = [
  { value: 'UPI', label: '📱 UPI' },
  { value: 'CASH', label: '💵 Cash' },
  { value: 'BANK_TRANSFER', label: '🏦 Bank Transfer' },
  { value: 'OTHER', label: '💳 Other' },
]

export default function Donate() {
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { payment_method: 'UPI', is_anonymous: false, amount: '' }
  })

  const paymentMethod = watch('payment_method')
  const amount = watch('amount')
  const upiLink = campaign?.upi_id
    ? buildUpiLink(campaign.upi_id, campaign.upi_name, amount || '')
    : ''

  useEffect(() => {
    campaignAPI.getCurrent().then(r => setCampaign(r.data)).catch(() => {})
  }, [])

  const handleAmountSelect = (val) => {
    setSelectedAmount(val)
    setValue('amount', val)
  }

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setScreenshot(file)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await donationAPI.uploadScreenshot(fd)
      setScreenshotUrl(res.data.url)
      toast.success('Screenshot uploaded!')
    } catch {
      toast.error('Upload failed — you can still submit without a screenshot')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        amount: Number(data.amount),
        campaign_id: campaign?.id || null,
        payment_screenshot_url: screenshotUrl || undefined,
        is_anonymous: data.is_anonymous === true || data.is_anonymous === 'true',
      }
      const res = await donationAPI.submit(payload)
      toast.success('Donation submitted! 🙏')
      navigate('/donation-success', { state: { donation: res.data } })
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        detail.forEach(e => toast.error(e.msg))
      } else {
        toast.error(detail || 'Submission failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-saffron-500 to-gold-400 shadow-xl shadow-saffron-500/20">
            <img src="/ganesha.jpg" alt="Lord Ganesha" className="w-full h-full object-cover rounded-full border border-amber-300/30" />
          </div>
          <h1 className="section-title">Make a Donation</h1>
          <p className="text-gray-400 mt-2">
            {campaign?.title || 'Ganesh Chanda 2026'} — Every contribution matters
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ─── AMOUNT ─── */}
          <div className="card">
            <h2 className="text-white font-semibold mb-4 text-lg">💰 Donation Amount</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`py-3 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                    selectedAmount === amt
                      ? 'bg-saffron-500 border-saffron-500 text-white shadow-lg shadow-saffron-500/25'
                      : 'bg-gray-800 border-white/10 text-gray-300 hover:border-saffron-500/50 hover:text-white'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div>
              <label className="input-label">Custom Amount (₹) *</label>
              <input
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 1, message: 'Amount must be at least ₹1' },
                  validate: v => Number(v) > 0 || 'Amount must be positive',
                })}
                type="number"
                placeholder="Enter custom amount"
                className="input-field"
                onChange={e => { setSelectedAmount(null); }}
              />
              {errors.amount && <p className="text-crimson-400 text-xs mt-1">{errors.amount.message}</p>}
            </div>
          </div>

          {/* ─── PERSONAL INFO ─── */}
          <div className="card">
            <h2 className="text-white font-semibold mb-4 text-lg">👤 Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Full Name *</label>
                <input
                  {...register('donor_name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                  placeholder="Your full name"
                  className="input-field"
                />
                {errors.donor_name && <p className="text-crimson-400 text-xs mt-1">{errors.donor_name.message}</p>}
              </div>
              <div>
                <label className="input-label">Phone Number *</label>
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                  })}
                  placeholder="10-digit mobile number"
                  className="input-field"
                  type="tel"
                  maxLength={10}
                />
                {errors.phone && <p className="text-crimson-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="input-label">Email (optional)</label>
                <input
                  {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                  placeholder="your@email.com"
                  className="input-field"
                  type="email"
                />
                {errors.email && <p className="text-crimson-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="input-label">Address / Area (optional)</label>
                <input
                  {...register('address')}
                  placeholder="Your locality or area"
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  {...register('is_anonymous')}
                  id="anon"
                  type="checkbox"
                  className="w-4 h-4 accent-saffron-500"
                />
                <label htmlFor="anon" className="text-gray-300 text-sm cursor-pointer">
                  Make this donation anonymous (your name won't be shown publicly)
                </label>
              </div>
            </div>
          </div>

          {/* ─── PAYMENT ─── */}
          <div className="card">
            <h2 className="text-white font-semibold mb-4 text-lg">💳 Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Payment Method *</label>
                <select {...register('payment_method', { required: true })} className="input-field">
                  {PAYMENT_METHODS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* UPI QR */}
              {paymentMethod === 'UPI' && campaign?.upi_id && (
                <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG value={upiLink} size={130} level="H" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-gray-300 text-sm mb-1">Scan to pay{amount ? ` ₹${Number(amount).toLocaleString('en-IN')}` : ''}</p>
                    <p className="text-white font-mono text-sm bg-gray-900 px-3 py-1.5 rounded-lg mb-2">{campaign.upi_id}</p>
                    <a href={upiLink} className="text-saffron-400 text-xs hover:text-saffron-300">
                      Open UPI App →
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="input-label">
                  Transaction / Reference ID {['UPI', 'BANK_TRANSFER'].includes(paymentMethod) ? '*' : '(optional)'}
                </label>
                <input
                  {...register('transaction_id', {
                    validate: v => {
                      if (['UPI', 'BANK_TRANSFER'].includes(paymentMethod) && !v?.trim()) {
                        return 'Transaction ID is required for UPI/Bank Transfer'
                      }
                      return true
                    }
                  })}
                  placeholder="e.g. 123456789012"
                  className="input-field"
                />
                {errors.transaction_id && <p className="text-crimson-400 text-xs mt-1">{errors.transaction_id.message}</p>}
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="input-label">Payment Screenshot (optional)</label>
                {screenshot ? (
                  <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                    <img src={URL.createObjectURL(screenshot)} alt="ss" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{screenshot.name}</p>
                      {uploading && <p className="text-saffron-400 text-xs">Uploading...</p>}
                      {screenshotUrl && <p className="text-emerald-400 text-xs">✓ Uploaded</p>}
                    </div>
                    <button type="button" onClick={() => { setScreenshot(null); setScreenshotUrl('') }}>
                      <X size={16} className="text-gray-400 hover:text-crimson-400" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-saffron-500/50 transition-colors">
                    <Upload size={20} className="text-gray-500 mb-1" />
                    <span className="text-gray-500 text-sm">Upload screenshot</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* ─── MESSAGE ─── */}
          <div className="card">
            <h2 className="text-white font-semibold mb-4 text-lg">💬 Message / Wishes</h2>
            <textarea
              {...register('message')}
              rows={3}
              placeholder="Share your wishes for Ganesh Utsav... (optional)"
              className="input-field resize-none"
            />
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>Your donation will be marked as <strong>Pending</strong> until an admin verifies your payment. You'll get a receipt once verified.</p>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn-primary w-full py-4 text-lg"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" /> Submitting...
              </span>
            ) : (
              '🙏 Submit Donation'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
