'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { lessons } from '@/data/lessons'
import ProgressBar from '@/components/ProgressBar'
import Hearts from '@/components/Hearts'
import MultipleChoice from '@/components/MultipleChoice'
import WordArrange from '@/components/WordArrange'
import TranslateInput from '@/components/TranslateInput'
import LessonComplete from '@/components/LessonComplete'

interface UserProgress {
  totalXP: number
  streak: number
  lessons: Record<number, {
    completed: boolean
    xpEarned: number
    stars: number
    accuracy: number
  }>
  dailyGoalProgress: number
  lastActiveDate: string
}

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = parseInt(params.id as string, 10)

  const lesson = lessons.find((l) => l.id === lessonId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [correctCount, setCorrectCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [questionKey, setQuestionKey] = useState(0)

  useEffect(() => {
    if (!lesson) {
      router.push('/')
    }
  }, [lesson, router])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">😕</div>
          <p className="text-gray-500 font-medium">Lesson not found</p>
        </div>
      </div>
    )
  }

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const totalQuestions = lesson.questions.length
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const starsEarned = hearts === 3 ? 3 : hearts >= 2 ? 2 : 1
  const xpEarned = lesson.xp

  const handleAnswer = (isCorrect: boolean) => {
    const newHearts = isCorrect ? hearts : Math.max(0, hearts - 1)
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount

    if (isCorrect) {
      setCorrectCount(newCorrectCount)
    } else {
      setHearts(newHearts)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        // Lesson complete - save progress
        saveProgress(newCorrectCount, newHearts)
        setIsComplete(true)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
        setQuestionKey((prev) => prev + 1)
      }
    }, 1600)
  }

  const saveProgress = (finalCorrectCount: number, finalHearts: number) => {
    try {
      const stored = localStorage.getItem('lingualearn-progress')
      const progress: UserProgress = stored
        ? JSON.parse(stored)
        : {
            totalXP: 0,
            streak: 1,
            lessons: {},
            dailyGoalProgress: 0,
            lastActiveDate: new Date().toDateString(),
          }

      const finalAccuracy = Math.round((finalCorrectCount / totalQuestions) * 100)
      const finalStars = finalHearts === 3 ? 3 : finalHearts >= 2 ? 2 : 1

      // Only add XP if not previously completed (or improve)
      const prevLesson = progress.lessons[lessonId]
      const isFirstTime = !prevLesson?.completed
      if (isFirstTime) {
        progress.totalXP += xpEarned
        progress.dailyGoalProgress = (progress.dailyGoalProgress || 0) + xpEarned
      }

      // Update lesson progress
      progress.lessons[lessonId] = {
        completed: true,
        xpEarned: isFirstTime ? xpEarned : (prevLesson?.xpEarned ?? xpEarned),
        stars: Math.max(finalStars, prevLesson?.stars ?? 0),
        accuracy: Math.max(finalAccuracy, prevLesson?.accuracy ?? 0),
      }

      // Update streak if new day
      const today = new Date().toDateString()
      if (progress.lastActiveDate !== today) {
        progress.streak = (progress.streak || 0) + 1
        progress.lastActiveDate = today
        progress.dailyGoalProgress = xpEarned
      }

      localStorage.setItem('lingualearn-progress', JSON.stringify(progress))
    } catch {
      // localStorage not available
    }
  }

  const handleClose = () => {
    router.push('/')
  }

  const handleContinue = () => {
    router.push('/')
  }

  if (isComplete) {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        xpEarned={xpEarned}
        accuracy={accuracy}
        starsEarned={starsEarned}
        heartsRemaining={hearts}
        onContinue={handleContinue}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <ProgressBar
              current={currentQuestionIndex}
              total={totalQuestions}
              onClose={handleClose}
            />
            <Hearts count={hearts} />
          </div>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
            style={{ backgroundColor: `${lesson.color}20` }}
          >
            {lesson.emoji}
          </div>
          <div>
            <h1 className="font-black text-duo-text text-base leading-none">{lesson.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="ml-auto text-xs font-bold text-duo-yellow bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100 flex items-center gap-1">
            <span>⚡</span>
            <span>+{xpEarned} XP</span>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div key={questionKey} className="pop-in">
          {currentQuestion.type === 'multiple-choice' && (
            <MultipleChoice
              question={currentQuestion}
              onAnswer={handleAnswer}
              questionNumber={questionKey}
            />
          )}
          {currentQuestion.type === 'arrange' && (
            <WordArrange
              question={currentQuestion}
              onAnswer={handleAnswer}
              questionNumber={questionKey}
            />
          )}
          {currentQuestion.type === 'translate' && (
            <TranslateInput
              question={currentQuestion}
              onAnswer={handleAnswer}
              questionNumber={questionKey}
            />
          )}
        </div>
      </main>

      {/* Bottom decorative bar */}
      <div className="h-1 bg-gradient-to-r from-duo-green via-duo-yellow to-duo-blue" />
    </div>
  )
}
