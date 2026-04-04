'use client'

interface ProgressBarProps {
  current: number
  total: number
  onClose?: () => void
}

export default function ProgressBar({ current, total, onClose }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100)

  return (
    <div className="flex items-center gap-3 w-full">
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-duo-gray-dark hover:text-duo-text transition-colors rounded-full hover:bg-gray-100"
          aria-label="Close lesson"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div className="flex-1 relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #58CC02, #89E219)',
          }}
        >
          {percentage > 5 && (
            <div className="absolute right-0 top-0 h-full w-2 bg-white/30 rounded-full" />
          )}
        </div>
      </div>

      <span className="flex-shrink-0 text-sm font-bold text-duo-gray-dark min-w-[40px] text-right">
        {current}/{total}
      </span>
    </div>
  )
}
