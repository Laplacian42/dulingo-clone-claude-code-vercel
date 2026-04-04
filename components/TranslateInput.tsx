'use client'

import { useState, useEffect, useRef } from 'react'
import QuestionCard from './QuestionCard'
import type { TranslateQuestion } from '@/data/lessons'

interface TranslateInputProps {
  question: TranslateQuestion
  onAnswer: (isCorrect: boolean) => void
  questionNumber: number
}

export default function TranslateInput({ question, onAnswer, questionNumber }: TranslateInputProps) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue('')
    setSubmitted(false)
    setIsCorrect(false)
    setAnimationState('idle')
    setShowHint(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [questionNumber])

  const handleCheck = () => {
    if (!value.trim() || submitted) return

    const correct = value.trim().toLowerCase() === question.answer.trim().toLowerCase()
    setIsCorrect(correct)
    setSubmitted(true)
    setAnimationState(correct ? 'correct' : 'wrong')

    setTimeout(() => {
      onAnswer(correct)
    }, 1800)
  }

  const hint = question.answer.slice(0, Math.ceil(question.answer.length * 0.3))

  return (
    <QuestionCard animationState={animationState}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-duo-purple uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-full">
            Translate
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-duo-text leading-snug">
          {question.prompt}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => !submitted && setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            disabled={submitted}
            placeholder="Type your answer here..."
            className={`
              w-full px-4 py-3 rounded-xl border-2 text-base font-medium
              transition-all duration-200 outline-none
              ${submitted
                ? isCorrect
                  ? 'border-duo-green bg-green-50 text-duo-green-dark'
                  : 'border-duo-red bg-red-50 text-duo-red'
                : 'border-gray-200 bg-white focus:border-duo-blue focus:ring-2 focus:ring-blue-100'
              }
            `}
          />
          {submitted && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
              {isCorrect ? '✓' : '✗'}
            </span>
          )}
        </div>

        {showHint && !submitted && (
          <p className="text-sm text-duo-blue font-medium pop-in">
            💡 Hint: <span className="font-bold">{hint}...</span>
          </p>
        )}

        {submitted && (
          <div className={`p-3 rounded-xl text-sm font-semibold pop-in ${
            isCorrect
              ? 'bg-green-50 text-duo-green-dark border border-green-200'
              : 'bg-red-50 text-duo-red border border-red-200'
          }`}>
            {isCorrect ? (
              <span className="flex items-center gap-2">✓ Excellent! You got it right!</span>
            ) : (
              <span>
                ✗ The correct answer is: <strong>{question.answer}</strong>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {!submitted && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-duo-gray-dark font-bold text-sm hover:border-duo-blue hover:text-duo-blue transition-all duration-200"
            >
              💡 Hint
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={!value.trim() || submitted}
            className={`
              flex-1 py-3 rounded-xl font-bold text-white text-base
              transition-all duration-200 shadow-duo-button
              ${!value.trim() || submitted
                ? 'bg-gray-300 shadow-none cursor-not-allowed'
                : 'bg-duo-green hover:bg-duo-green-dark active:translate-y-1 active:shadow-none duo-btn'
              }
            `}
          >
            Check
          </button>
        </div>
      </div>
    </QuestionCard>
  )
}
