import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-float">🐘</div>
        <h1 className="font-display font-black text-6xl text-gradient mb-4">404</h1>
        <h2 className="text-white font-bold text-2xl mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Bappa couldn't find this page. It may have been moved or doesn't exist.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home size={17} />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
