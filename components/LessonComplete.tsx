'use client'

import { useEffect, useState } from 'react'

interface LessonCompleteProps {
  lessonTitle: string
  xpEarned: number
  accuracy: number
  starsEarned: number
  heartsRemaining: number
  onContinue: () => void
}

const CONFETTI_COLORS = ['#58CC02', '#FFD900', '#FF4B4B', '#1CB0F6', '#CE82FF', '#FF9600']

export default function LessonComplete({
  lessonTitle,
  xpEarned,
  accuracy,
  starsEarned,
  heartsRemaining,
  onContinue,
}: LessonCompleteProps) {
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([])

  const stars = starsEarned

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    const pieces = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      size: 8 + Math.random() * 8,
    }))
    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece absolute rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: '-20px',
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`
          bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center
          transition-all duration-500
          ${visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        {/* Trophy */}
        <div className="text-7xl mb-4 celebrate inline-block">🏆</div>

        <h1 className="text-3xl font-black text-duo-text mb-1">Lesson Complete!</h1>
        <p className="text-duo-gray-dark font-medium mb-6">{lessonTitle} — You did amazing!</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className="text-4xl transition-all duration-300"
              style={{
                filter: i < stars ? 'none' : 'grayscale(100%) opacity(0.3)',
                transform: i < stars ? 'scale(1)' : 'scale(0.8)',
                animationDelay: `${i * 0.2}s`,
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-yellow-50 rounded-2xl p-3 border-2 border-yellow-200">
            <div className="text-2xl font-black text-duo-yellow">+{xpEarned}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">XP</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-3 border-2 border-green-200">
            <div className="text-2xl font-black text-duo-green">{accuracy}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Accuracy</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-3 border-2 border-red-200">
            <div className="text-2xl font-black text-duo-red flex justify-center gap-0.5">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} style={{ filter: i < heartsRemaining ? 'none' : 'grayscale(100%) opacity(0.3)' }}>
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hearts</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-lg shadow-duo-button transition-all duration-200 active:translate-y-1 active:shadow-none duo-btn"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
