'use client'

import { useState, useEffect } from 'react'
import QuestionCard from './QuestionCard'
import type { ArrangeQuestion } from '@/data/lessons'

interface WordArrangeProps {
  question: ArrangeQuestion
  onAnswer: (isCorrect: boolean) => void
  questionNumber: number
}

export default function WordArrange({ question, onAnswer, questionNumber }: WordArrangeProps) {
  const [available, setAvailable] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'correct' | 'wrong'>('idle')

  useEffect(() => {
    const shuffled = [...question.words].sort(() => Math.random() - 0.5)
    setAvailable(shuffled)
    setSelected([])
    setSubmitted(false)
    setIsCorrect(false)
    setAnimationState('idle')
  }, [questionNumber, question.words])

  const addWord = (word: string, index: number) => {
    if (submitted) return
    const newAvailable = [...available]
    newAvailable.splice(index, 1)
    setAvailable(newAvailable)
    setSelected([...selected, word])
  }

  const removeWord = (word: string, index: number) => {
    if (submitted) return
    const newSelected = [...selected]
    newSelected.splice(index, 1)
    setSelected(newSelected)
    setAvailable([...available, word])
  }

  const handleCheck = () => {
    if (selected.length === 0 || submitted) return

    const answer = selected.join(' ')
    const correct = answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
    setIsCorrect(correct)
    setSubmitted(true)
    setAnimationState(correct ? 'correct' : 'wrong')

    setTimeout(() => {
      onAnswer(correct)
    }, 1800)
  }

  return (
    <QuestionCard animationState={animationState}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-duo-orange uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full">
            Arrange Words
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-duo-text leading-snug">
          {question.prompt}
        </h2>
      </div>

      {/* Answer area */}
      <div
        className={`
          min-h-[60px] p-3 rounded-xl border-2 mb-4 flex flex-wrap gap-2 items-center
          transition-all duration-200
          ${submitted
            ? isCorrect ? 'border-duo-green bg-green-50' : 'border-duo-red bg-red-50'
            : 'border-dashed border-gray-300 bg-gray-50'
          }
        `}
      >
        {selected.length === 0 && !submitted && (
          <span className="text-duo-gray-dark text-sm font-medium">Tap words below to build your sentence</span>
        )}
        {selected.map((word, index) => (
          <button
            key={`${word}-${index}`}
            onClick={() => removeWord(word, index)}
            disabled={submitted}
            className={`
              word-tile px-3 py-1.5 rounded-lg border-2 font-semibold text-sm
              transition-all duration-150
              ${submitted
                ? isCorrect
                  ? 'border-duo-green text-duo-green-dark bg-white cursor-default'
                  : 'border-duo-red text-duo-red bg-white cursor-default'
                : 'border-duo-blue text-duo-blue bg-white hover:bg-blue-50 shadow-sm cursor-pointer'
              }
            `}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[48px]">
        {available.map((word, index) => (
          <button
            key={`${word}-${index}`}
            onClick={() => addWord(word, index)}
            disabled={submitted}
            className="word-tile px-3 py-1.5 rounded-lg border-2 border-gray-300 bg-white text-duo-text font-semibold text-sm hover:border-duo-blue hover:bg-blue-50 shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            {word}
          </button>
        ))}
      </div>

      {submitted && (
        <div className={`p-3 rounded-xl text-sm font-semibold pop-in mb-4 ${
          isCorrect
            ? 'bg-green-50 text-duo-green-dark border border-green-200'
            : 'bg-red-50 text-duo-red border border-red-200'
        }`}>
          {isCorrect ? (
            <span className="flex items-center gap-2">✓ Perfect sentence!</span>
          ) : (
            <span>✗ Correct sentence: <strong>{question.answer}</strong></span>
          )}
        </div>
      )}

      <button
        onClick={handleCheck}
        disabled={selected.length === 0 || submitted}
        className={`
          w-full py-3 rounded-xl font-bold text-white text-base
          transition-all duration-200
          ${selected.length === 0 || submitted
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-duo-green hover:bg-duo-green-dark shadow-duo-button active:translate-y-1 active:shadow-none duo-btn'
          }
        `}
      >
        Check
      </button>
    </QuestionCard>
  )
}
