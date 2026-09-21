export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-3 border-gray-700 border-t-saffron-500 rounded-full animate-spin`}
        style={{ borderWidth: 3 }} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-float">🐘</div>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    </div>
  )
}
