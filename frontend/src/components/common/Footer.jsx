import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Linkedin, Github, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-xl flex items-center justify-center text-xl shadow-md shadow-saffron-500/20">
                🐘
              </div>
              <div>
                <div className="text-white font-display font-bold">Ganesh Chanda</div>
                <div className="text-saffron-400 text-sm">2026</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join us in celebrating Ganesh Utsav 2026. Your contribution brings joy to thousands and supports divine prasad and celebrations.
            </p>
            <p className="text-saffron-400 font-semibold mt-3 text-sm">🙏 Ganpati Bappa Morya!</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase text-gray-300">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/donate', label: 'Donate Now' },
                { to: '/contributors', label: 'Contributors List' },
                { to: '/login', label: 'Donor Login' },
                { to: '/admin/login', label: 'Admin Portal' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-sm text-gray-400 hover:text-saffron-400 transition-colors">
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Organizers */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase text-gray-300">Contact Organizers</h3>
            <div className="space-y-3">
              <a 
                href="tel:901411xxxx" 
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-saffron-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-saffron-500/10 flex items-center justify-center text-saffron-400 group-hover:bg-saffron-500/20">
                  <Phone size={14} />
                </div>
                <span>901411xxxx</span>
              </a>

              <a 
                href="mailto:mogiliadieshwarreddy5919@gmail.com" 
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-saffron-400 transition-colors group break-all"
              >
                <div className="w-7 h-7 rounded-lg bg-saffron-500/10 flex items-center justify-center text-saffron-400 group-hover:bg-saffron-500/20">
                  <Mail size={14} />
                </div>
                <span>mogiliadieshwarreddy5919@gmail.com</span>
              </a>

              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-saffron-500/10 flex items-center justify-center text-saffron-400">
                  <MapPin size={14} />
                </div>
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2 font-medium">Connect & Follow:</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/adieshwar-reddy-mogili-3b4b11332/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href="https://github.com/AdieshwarReddy/Ganesh-Chanda-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                >
                  <Github size={15} />
                </a>
                <a
                  href="https://www.youtube.com/@AdieshwarReddyMogili"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="mailto:mogiliadieshwarreddy5919@gmail.com"
                  aria-label="Send Email"
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-saffron-400 hover:border-saffron-500/40 hover:bg-saffron-500/10 transition-all"
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-gray-400 text-sm font-medium">
              Made with <Heart size={13} className="inline text-red-500 fill-red-500 mx-0.5" /> by{' '}
              <a
                href="https://www.linkedin.com/in/adieshwar-reddy-mogili-3b4b11332/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-400 hover:text-saffron-300 font-semibold underline decoration-saffron-500/40 hover:decoration-saffron-400 transition-all"
              >
                Mogili Adieshwar Reddy
              </a>
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Hyderabad, Telangana, India
            </p>
          </div>
          <p className="text-gray-500 text-xs">
            © 2026 Ganesh Chanda. All donations verified transparently.
          </p>
        </div>
      </div>
    </footer>
  )
}
