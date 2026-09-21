import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-xl flex items-center justify-center text-xl">
                🐘
              </div>
              <div>
                <div className="text-white font-display font-bold">Ganesh Chanda</div>
                <div className="text-saffron-400 text-sm">2026</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join us in celebrating Ganesh Utsav 2026. Your contribution brings joy to thousands.
            </p>
            <p className="text-saffron-400 font-semibold mt-3 text-sm">🙏 Ganpati Bappa Morya!</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/donate', label: 'Donate Now' },
                { to: '/contributors', label: 'Contributors' },
                { to: '/login', label: 'Login' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-sm text-gray-400 hover:text-saffron-400 transition-colors">
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Organizers</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-saffron-400 shrink-0" />
                <span>9999999999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-saffron-400 shrink-0" />
                <span>contact@ganeshchanda.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-saffron-400 shrink-0" />
                <span>Your City, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © 2026 Ganesh Chanda. Made with <Heart size={12} className="inline text-crimson-400" /> for Bappa.
          </p>
          <p className="text-gray-600 text-xs">
            All donations handled transparently. Admin verified only.
          </p>
        </div>
      </div>
    </footer>
  )
}
