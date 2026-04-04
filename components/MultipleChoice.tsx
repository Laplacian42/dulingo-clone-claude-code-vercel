'use client'

import { useState, useEffect } from 'react'
import QuestionCard from './QuestionCard'
import type { MultipleChoiceQuestion } from '@/data/lessons'

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion
  onAnswer: (isCorrect: boolean) => void
  questionNumber: number
}

export default function MultipleChoice({ question, onAnswer, questionNumber }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    setSelected(null)
    setAnimationState('idle')
    setIsLocked(false)
  }, [questionNumber])

  const handleSelect = (index: number) => {
    if (isLocked) return

    setSelected(index)
    setIsLocked(true)

    const correct = index === question.correct
    setAnimationState(correct ? 'correct' : 'wrong')

    setTimeout(() => {
      onAnswer(correct)
    }, 1500)
  }

  const getButtonStyle = (index: number) => {
    if (selected === null) {
      return 'bg-white border-2 border-gray-200 hover:border-duo-blue hover:bg-blue-50 text-duo-text cursor-pointer shadow-sm hover:shadow-md'
    }

    if (index === question.correct) {
      return 'bg-green-50 border-2 border-duo-green text-duo-green-dark font-bold cursor-default shadow-sm'
    }

    if (index === selected && index !== question.correct) {
      return 'bg-red-50 border-2 border-duo-red text-duo-red cursor-default shadow-sm shake'
    }

    return 'bg-white border-2 border-gray-200 text-gray-400 cursor-default opacity-60'
  }

  const getIcon = (index: number) => {
    if (selected === null) return null
    if (index === question.correct) {
      return (
        <span className="ml-auto flex-shrink-0 w-6 h-6 bg-duo-green rounded-full flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )
    }
    if (index === selected && index !== question.correct) {
      return (
        <span className="ml-auto flex-shrink-0 w-6 h-6 bg-duo-red rounded-full flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )
    }
    return null
  }

  return (
    <QuestionCard animationState={animationState}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-duo-blue uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
            Multiple Choice
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-duo-text leading-snug">
          {question.prompt}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={isLocked}
            className={`
              flex items-center gap-3 w-full p-4 rounded-xl text-left
              transition-all duration-200 font-semibold text-base
              ${getButtonStyle(index)}
            `}
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-lg border-2 border-current opacity-60 flex items-center justify-center text-sm font-bold">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option}</span>
            {getIcon(index)}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={`mt-4 p-3 rounded-xl text-sm font-semibold pop-in ${
          selected === question.correct
            ? 'bg-green-50 text-duo-green-dark border border-green-200'
            : 'bg-red-50 text-duo-red border border-red-200'
        }`}>
          {selected === question.correct ? (
            <span className="flex items-center gap-2">
              <span>✓</span> Great job! That&apos;s correct!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>✗</span> Not quite! The correct answer is: <strong>{question.options[question.correct]}</strong>
            </span>
          )}
        </div>
      )}
    </QuestionCard>
  )
}
