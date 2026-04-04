'use client'

interface QuestionCardProps {
  children: React.ReactNode
  animationState?: 'idle' | 'correct' | 'wrong'
}

export default function QuestionCard({ children, animationState = 'idle' }: QuestionCardProps) {
  const getAnimationClass = () => {
    if (animationState === 'correct') return 'correct-flash'
    if (animationState === 'wrong') return 'shake wrong-flash'
    return ''
  }

  const getBorderColor = () => {
    if (animationState === 'correct') return 'border-duo-green'
    if (animationState === 'wrong') return 'border-duo-red'
    return 'border-transparent'
  }

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-duo-card border-2 p-6 md:p-8
        transition-all duration-300
        ${getBorderColor()}
        ${getAnimationClass()}
      `}
    >
      {children}
    </div>
  )
}
