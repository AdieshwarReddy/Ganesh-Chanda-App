import { useLocation, Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../utils/formatters'
import { downloadReceipt } from '../utils/receipt'
import { CheckCircle, Download, Home, Eye } from 'lucide-react'

export default function DonationSuccess() {
  const { state } = useLocation()
  const donation = state?.donation

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No donation data found.</p>
          <Link to="/donate" className="btn-primary">Donate Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Thank You! 🙏</h1>
          <p className="text-gray-400">Your donation has been submitted successfully.</p>
        </div>

        {/* Donation summary */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <span className="text-gray-400 text-sm">Receipt No</span>
            <span className="text-saffron-400 font-mono font-bold">{donation.receipt_number || donation.id}</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Donor', value: donation.is_anonymous ? 'Anonymous' : donation.donor_name },
              { label: 'Amount', value: formatCurrency(donation.amount), highlight: true },
              { label: 'Payment Method', value: donation.payment_method },
              { label: 'Status', value: donation.payment_status },
              { label: 'Date', value: formatDate(donation.created_at) },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className={`font-medium text-sm ${highlight ? 'text-saffron-400 text-lg font-bold' : 'text-white'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status info */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center mb-6">
          <div className="text-yellow-400 font-semibold mb-1">⏳ Pending Verification</div>
          <p className="text-gray-400 text-sm">An admin will verify your payment shortly. You'll receive a receipt once verified.</p>
        </div>

        <div className="space-y-3">
          {donation.payment_status === 'VERIFIED' && (
            <button
              onClick={() => downloadReceipt(donation)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={17} />
              Download Receipt
            </button>
          )}
          <Link to="/my-donations" className="btn-secondary w-full flex items-center justify-center gap-2">
            <Eye size={17} />
            Track My Donations
          </Link>
          <Link to="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <Home size={15} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
