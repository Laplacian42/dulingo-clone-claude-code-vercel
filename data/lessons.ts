export type QuestionType = 'multiple-choice' | 'translate' | 'arrange'

export interface MultipleChoiceQuestion {
  type: 'multiple-choice'
  prompt: string
  options: string[]
  correct: number
}

export interface TranslateQuestion {
  type: 'translate'
  prompt: string
  answer: string
}

export interface ArrangeQuestion {
  type: 'arrange'
  prompt: string
  words: string[]
  answer: string
}

export type Question = MultipleChoiceQuestion | TranslateQuestion | ArrangeQuestion

export interface Lesson {
  id: number
  title: string
  emoji: string
  description: string
  color: string
  xp: number
  questions: Question[]
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Greetings',
    emoji: '👋',
    description: 'Learn basic greetings and introductions',
    color: '#58CC02',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: "What does 'Hello' mean?",
        options: ['Hola', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 0,
      },
      {
        type: 'multiple-choice',
        prompt: "How do you say 'Good morning'?",
        options: ['Buenos días', 'Buenas noches', 'Buenas tardes', 'Hasta luego'],
        correct: 0,
      },
      {
        type: 'translate',
        prompt: "Translate: 'My name is John'",
        answer: 'Me llamo John',
      },
      {
        type: 'arrange',
        prompt: 'Arrange the words to form a sentence',
        words: ['today', 'are', 'you', 'How'],
        answer: 'How are you today',
      },
      {
        type: 'multiple-choice',
        prompt: "What does 'Goodbye' mean?",
        options: ['Hello', 'Please', 'Adiós', 'Thank you'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'Numbers',
    emoji: '🔢',
    description: 'Count from one to ten in Spanish',
    color: '#1CB0F6',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: "What is 'one' in Spanish?",
        options: ['dos', 'tres', 'uno', 'cuatro'],
        correct: 2,
      },
      {
        type: 'multiple-choice',
        prompt: "How do you say 'five'?",
        options: ['diez', 'cinco', 'seis', 'siete'],
        correct: 1,
      },
      {
        type: 'arrange',
        prompt: 'Arrange the words to form a sentence',
        words: ['have', 'three', 'I', 'cats'],
        answer: 'I have three cats',
      },
      {
        type: 'multiple-choice',
        prompt: "What does 'diez' mean?",
        options: ['six', 'eight', 'nine', 'ten'],
        correct: 3,
      },
      {
        type: 'translate',
        prompt: "Translate: 'Two plus two is four'",
        answer: 'Dos más dos es cuatro',
      },
    ],
  },
  {
    id: 3,
    title: 'Colors',
    emoji: '🎨',
    description: 'Learn colors in Spanish',
    color: '#CE82FF',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: "What color is 'rojo'?",
        options: ['Blue', 'Green', 'Red', 'Yellow'],
        correct: 2,
      },
      {
        type: 'multiple-choice',
        prompt: "'Azul' means?",
        options: ['Purple', 'Orange', 'Blue', 'Pink'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Arrange the words to form a sentence',
        words: ['sky', 'The', 'is', 'blue'],
        answer: 'The sky is blue',
      },
      {
        type: 'multiple-choice',
        prompt: "'Verde' means?",
        options: ['Red', 'Green', 'White', 'Black'],
        correct: 1,
      },
      {
        type: 'translate',
        prompt: "Translate: 'I like the color yellow'",
        answer: 'Me gusta el color amarillo',
      },
    ],
  },
  {
    id: 4,
    title: 'Animals',
    emoji: '🐾',
    description: 'Discover animal names in Spanish',
    color: '#FF9600',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: "'Gato' means?",
        options: ['Dog', 'Bird', 'Fish', 'Cat'],
        correct: 3,
      },
      {
        type: 'multiple-choice',
        prompt: "How do you say 'dog'?",
        options: ['gato', 'pájaro', 'perro', 'pez'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Arrange the words to form a sentence',
        words: ['very', 'dog', 'The', 'big', 'is'],
        answer: 'The dog is very big',
      },
      {
        type: 'multiple-choice',
        prompt: "'Pájaro' means?",
        options: ['Fish', 'Horse', 'Bird', 'Rabbit'],
        correct: 2,
      },
      {
        type: 'translate',
        prompt: "Translate: 'I have a cat and a dog'",
        answer: 'Tengo un gato y un perro',
      },
    ],
  },
  {
    id: 5,
    title: 'Food',
    emoji: '🍎',
    description: 'Learn food and drink vocabulary',
    color: '#FF4B4B',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: "'Pan' means?",
        options: ['Milk', 'Bread', 'Water', 'Juice'],
        correct: 1,
      },
      {
        type: 'multiple-choice',
        prompt: "How do you say 'water'?",
        options: ['leche', 'jugo', 'agua', 'café'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Arrange the words to form a sentence',
        words: ['eat', 'I', 'want', 'to', 'pizza'],
        answer: 'I want to eat pizza',
      },
      {
        type: 'multiple-choice',
        prompt: "'Manzana' means?",
        options: ['Banana', 'Orange', 'Grape', 'Apple'],
        correct: 3,
      },
      {
        type: 'translate',
        prompt: "Translate: 'I am hungry and thirsty'",
        answer: 'Tengo hambre y sed',
      },
    ],
  },
]
