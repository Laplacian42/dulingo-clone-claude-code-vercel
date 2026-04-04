'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { lessons } from '@/data/lessons'

interface LessonProgress {
  completed: boolean
  xpEarned: number
  stars: number
  accuracy: number
}

interface UserProgress {
  totalXP: number
  streak: number
  lessons: Record<number, LessonProgress>
  dailyGoalProgress: number
  lastActiveDate: string
}

const defaultProgress: UserProgress = {
  totalXP: 0,
  streak: 1,
  lessons: {},
  dailyGoalProgress: 0,
  lastActiveDate: new Date().toDateString(),
}

function getLessonStatusColor(lessonId: number, lessonColor: string) {
  return lessonColor
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= stars ? 'text-duo-yellow' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('lingualearn-progress')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProgress
        // Check if streak should reset (missed a day)
        const lastActive = new Date(parsed.lastActiveDate)
        const today = new Date()
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays > 1) {
          parsed.streak = 0
        }
        setProgress(parsed)
      } catch {
        setProgress(defaultProgress)
      }
    }
  }, [])

  const totalXP = progress.totalXP
  const dailyGoal = 50
  const dailyProgress = Math.min((progress.dailyGoalProgress / dailyGoal) * 100, 100)
  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-duo-green text-4xl animate-bounce">🦉</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-float">🦉</span>
              <div>
                <h1 className="text-xl font-black text-duo-green leading-none">LinguaLearn</h1>
                <p className="text-xs text-gray-400 font-medium">Spanish · English</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              {/* Streak */}
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <span className="text-lg">🔥</span>
                <span className="font-black text-orange-500 text-sm">{progress.streak}</span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                <span className="text-lg">⚡</span>
                <span className="font-black text-duo-yellow text-sm">{totalXP}</span>
              </div>

              {/* Gems */}
              <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <span className="text-lg">💎</span>
                <span className="font-black text-duo-blue text-sm">{completedCount * 5}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Daily Goal Card */}
        <div className="bg-white rounded-2xl shadow-duo-card p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-duo-yellow/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <h2 className="font-bold text-duo-text text-sm">Daily Goal</h2>
                <p className="text-xs text-gray-400">{progress.dailyGoalProgress} / {dailyGoal} XP</p>
              </div>
            </div>
            <span className="text-xs font-bold text-duo-green bg-green-50 px-2 py-1 rounded-full">
              {dailyProgress >= 100 ? '🎉 Complete!' : `${Math.round(dailyProgress)}%`}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${dailyProgress}%`,
                background: 'linear-gradient(90deg, #FFD900, #FF9600)',
              }}
            />
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow-duo-card p-4 text-center border border-gray-100">
            <div className="text-2xl font-black text-duo-green">{completedCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Lessons Done</div>
          </div>
          <div className="bg-white rounded-2xl shadow-duo-card p-4 text-center border border-gray-100">
            <div className="text-2xl font-black text-duo-yellow">{totalXP}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Total XP</div>
          </div>
          <div className="bg-white rounded-2xl shadow-duo-card p-4 text-center border border-gray-100">
            <div className="text-2xl font-black text-orange-500">{progress.streak}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Day Streak</div>
          </div>
        </div>

        {/* Lessons Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-duo-text">Lessons</h2>
            <span className="text-xs text-gray-400 font-medium">{completedCount}/{lessons.length} complete</span>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const lessonProgress = progress.lessons[lesson.id]
              const isCompleted = lessonProgress?.completed ?? false
              const isLocked = index > 0 && !progress.lessons[lessons[index - 1].id]?.completed
              const stars = lessonProgress?.stars ?? 0
              const xpEarned = lessonProgress?.xpEarned ?? 0

              return (
                <Link
                  key={lesson.id}
                  href={isLocked ? '#' : `/lesson/${lesson.id}`}
                  className={`block ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => isLocked && e.preventDefault()}
                >
                  <div
                    className={`
                      relative bg-white rounded-2xl shadow-duo-card border-2 p-4
                      transition-all duration-200
                      ${isLocked
                        ? 'border-gray-100 opacity-60'
                        : isCompleted
                          ? 'border-green-200 hover:border-duo-green hover:shadow-lg hover:-translate-y-0.5'
                          : 'border-gray-100 hover:border-duo-blue hover:shadow-lg hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Lesson Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: `${lesson.color}20` }}
                      >
                        {isLocked ? '🔒' : lesson.emoji}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-duo-text text-base">{lesson.title}</h3>
                          {isCompleted && (
                            <span className="text-xs font-bold text-duo-green bg-green-50 px-2 py-0.5 rounded-full">
                              ✓ Done
                            </span>
                          )}
                          {!isLocked && !isCompleted && index === completedCount && (
                            <span className="text-xs font-bold text-duo-blue bg-blue-50 px-2 py-0.5 rounded-full pulse-glow">
                              ▶ Start
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 font-medium mt-0.5 truncate">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {isCompleted ? (
                            <>
                              <StarRating stars={stars} />
                              <span className="text-xs font-bold text-duo-yellow">+{xpEarned} XP earned</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">
                              {isLocked ? 'Complete previous lesson to unlock' : `+${lesson.xp} XP available`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right arrow / lock */}
                      <div className="flex-shrink-0">
                        {isLocked ? (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AFAFAF" strokeWidth="2.5">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          </div>
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${lesson.color}20` }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={lesson.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress dots for active lesson */}
                    {!isLocked && !isCompleted && index === completedCount && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                        {lesson.questions.map((_, qIdx) => (
                          <div
                            key={qIdx}
                            className="h-1.5 flex-1 rounded-full bg-gray-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer motivational section */}
        <div className="bg-gradient-to-br from-duo-green to-duo-green-dark rounded-2xl p-6 text-white text-center">
          <div className="text-3xl mb-2">🦉</div>
          <h3 className="font-black text-lg mb-1">Keep it up!</h3>
          <p className="text-green-100 text-sm">
            {completedCount === 0
              ? 'Start your first lesson to begin learning!'
              : completedCount === lessons.length
                ? 'Amazing! You completed all lessons! 🎉'
                : `You're ${Math.round((completedCount / lessons.length) * 100)}% through the course!`}
          </p>
          {completedCount > 0 && completedCount < lessons.length && (
            <Link
              href={`/lesson/${lessons[completedCount].id}`}
              className="inline-block mt-3 bg-white text-duo-green font-black px-5 py-2 rounded-xl text-sm hover:bg-green-50 transition-colors duo-btn shadow-sm"
            >
              Continue Learning →
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
