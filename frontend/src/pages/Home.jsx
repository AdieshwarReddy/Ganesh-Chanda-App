import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Target, TrendingUp, ChevronDown, Smartphone, Shield, Star } from 'lucide-react'
import { campaignAPI, donationAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'
import { QRCodeSVG } from 'qrcode.react'
import { buildUpiLink } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function Home() {
  const [campaign, setCampaign] = useState(null)
  const [stats, setStats] = useState({ total: 0, donors: 0, target: 200000 })
  const [recentDonors, setRecentDonors] = useState([])

  useEffect(() => {
    campaignAPI.getCurrent().then(r => {
      setCampaign(r.data)
      if (r.data) setStats(s => ({ ...s, target: Number(r.data.target_amount) }))
    }).catch(() => {})

    donationAPI.getPublic({ limit: 5 }).then(r => {
      setRecentDonors(r.data || [])
      const total = r.data.reduce((s, d) => s + Number(d.amount), 0)
      setStats(s => ({ ...s, total, donors: r.data.length }))
    }).catch(() => {})
  }, [])

  const pct = Math.min(100, Math.round((stats.total / stats.target) * 100)) || 0
  const upiLink = campaign?.upi_id ? buildUpiLink(campaign.upi_id, campaign.upi_name || 'Ganesh Chanda', '') : ''

  const copyUpi = () => {
    if (campaign?.upi_id) {
      navigator.clipboard.writeText(campaign.upi_id)
      toast.success('UPI ID copied!')
    }
  }

  return (
    <div className="bg-gray-950">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-saffron-500/15 border border-saffron-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-saffron-400 text-sm font-medium">🎉 Ganesh Utsav 2026</span>
          </div>

          {/* Lord Ganesha Image */}
          <div className="relative mx-auto mb-8 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-saffron-500 via-gold-500 to-amber-400 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse-slow" />
            <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-br from-gold-400 via-saffron-500 to-amber-600 shadow-2xl shadow-saffron-500/30">
              <img
                src="/ganesha.jpg"
                alt="Lord Ganesha"
                className="w-full h-full object-cover rounded-full shadow-inner transform group-hover:scale-105 transition-transform duration-500 border-2 border-amber-300/40"
              />
            </div>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-tight mb-4">
            Ganesh{' '}
            <span className="text-gradient">Chanda</span>
            <br />2026
          </h1>

          <p className="text-gray-300 text-xl md:text-2xl font-light mb-2">
            Contribute. Celebrate. Together.
          </p>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-10">
            Join thousands of devotees in making this year's Ganesh Utsav unforgettable.
            Every rupee counts!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/donate" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              <Heart size={20} />
              Donate Now
            </Link>
            <Link to="/contributors" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
              <Users size={20} />
              View Contributors
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="animate-bounce text-gray-500">
            <ChevronDown size={24} />
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="card-glass">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[
                { icon: '💰', label: 'Total Collected', value: formatCurrency(stats.total), color: 'text-saffron-400' },
                { icon: '🎯', label: 'Target', value: formatCurrency(stats.target), color: 'text-gold-400' },
                { icon: '👥', label: 'Contributors', value: stats.donors, color: 'text-emerald-400' },
                { icon: '📊', label: 'Completed', value: `${pct}%`, color: 'text-blue-400' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl mb-1">{icon}</div>
                  <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Collection Progress</span>
                <span className="text-saffron-400 font-semibold">{pct}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full progress-bar rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Only verified donations counted</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title mb-3">How to Donate</h2>
          <p className="section-subtitle mb-12">Simple 3-step process</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Fill the Form', desc: 'Enter your name, amount, and payment details.' },
              { step: '02', icon: '📱', title: 'Pay via UPI', desc: 'Scan the QR code or use UPI ID to pay instantly.' },
              { step: '03', icon: '✅', title: 'Get Receipt', desc: 'Admin verifies and you receive a digital receipt.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="card group hover:scale-105 transition-all duration-300">
                <div className="text-xs font-bold text-saffron-500 mb-3 tracking-widest">STEP {step}</div>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UPI QR SECTION ─── */}
      {campaign?.upi_id && (
        <section id="payment" className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="section-title mb-3">Pay via UPI</h2>
            <p className="section-subtitle mb-8">Scan, pay, then submit your transaction ID</p>
            <div className="card">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* QR */}
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  <QRCodeSVG
                    value={upiLink}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#1a1a2e"
                    level="H"
                  />
                </div>
                {/* Details */}
                <div className="flex-1 text-left space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">UPI ID</div>
                    <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3">
                      <span className="text-white font-mono flex-1">{campaign.upi_id}</span>
                      <button onClick={copyUpi} className="text-saffron-400 hover:text-saffron-300 text-sm font-medium">
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Account Name</div>
                    <div className="text-white font-medium">{campaign.upi_name || 'Ganesh Utsav Committee'}</div>
                  </div>
                  <Link
                    to="/donate"
                    className="btn-primary w-full text-center block"
                  >
                    🙏 Donate Now &amp; Submit Receipt
                  </Link>
                  <p className="text-xs text-gray-500">
                    ⚠️ After paying, submit your transaction ID in the donation form for verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── RECENT DONORS ─── */}
      {recentDonors.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-3">Recent Contributors</h2>
            <p className="section-subtitle text-center mb-8">Join the growing family of devotees</p>
            <div className="space-y-3">
              {recentDonors.map((d, i) => (
                <div key={d.id} className="card flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-saffron-500/20 to-gold-500/20 rounded-full flex items-center justify-center text-sm font-bold text-saffron-400">
                      {d.is_anonymous ? '🙏' : d.donor_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{d.is_anonymous ? 'Anonymous' : d.donor_name}</div>
                      <div className="text-gray-500 text-xs">{d.payment_method}</div>
                    </div>
                  </div>
                  <div className="text-saffron-400 font-display font-bold">{formatCurrency(d.amount)}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/contributors" className="btn-secondary">
                View All Contributors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY DONATE ─── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-12">Why Contribute?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Smartphone size={28} className="text-saffron-400" />, title: 'Easy UPI Payment', desc: 'Pay instantly from any UPI app. Safe and convenient.' },
              { icon: <Shield size={28} className="text-emerald-400" />, title: 'Transparent Management', desc: 'All donations are recorded, verified, and tracked publicly.' },
              { icon: <Star size={28} className="text-gold-400" />, title: 'Digital Receipt', desc: 'Get a PDF receipt immediately after verification.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="flex justify-center mb-4">{icon}</div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-saffron-600 to-gold-500 p-10 text-center">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="text-5xl mb-4">🙏</div>
              <h2 className="font-display font-bold text-3xl text-white mb-3">
                Be Part of the Celebration
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Your donation, big or small, helps us make Ganesh Utsav a memorable celebration for everyone.
              </p>
              <Link to="/donate" className="bg-white text-saffron-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <Heart size={18} />
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
