'use client'

import { useEffect, useState } from 'react'

interface HeartsProps {
  count: number
  maxHearts?: number
}

export default function Hearts({ count, maxHearts = 3 }: HeartsProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [prevCount, setPrevCount] = useState(count)

  useEffect(() => {
    if (count < prevCount) {
      // A heart was just lost - animate it
      setAnimatingIndex(count)
      const timer = setTimeout(() => setAnimatingIndex(null), 400)
      setPrevCount(count)
      return () => clearTimeout(timer)
    }
    setPrevCount(count)
  }, [count, prevCount])

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }, (_, i) => {
        const isAlive = i < count
        const isAnimating = animatingIndex === i

        return (
          <span
            key={i}
            className={`text-xl transition-all duration-300 ${isAnimating ? 'heart-beat' : ''}`}
            style={{
              filter: isAlive ? 'none' : 'grayscale(100%) opacity(0.4)',
              transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
            }}
            aria-label={isAlive ? 'Heart (alive)' : 'Heart (lost)'}
          >
            ❤️
          </span>
        )
      })}
    </div>
  )
}
