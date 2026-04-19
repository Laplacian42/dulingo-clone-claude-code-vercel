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
    title: 'Begrüßungen',
    emoji: '👋',
    description: 'Learn basic greetings in English',
    color: '#58CC02',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „Hallo" auf Englisch?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 0,
      },
      {
        type: 'multiple-choice',
        prompt: 'Wie sagt man „Guten Morgen" auf Englisch?',
        options: ['Good morning', 'Good night', 'Good evening', 'Good afternoon'],
        correct: 0,
      },
      {
        type: 'translate',
        prompt: 'Übersetze ins Englische: „Mein Name ist Anna."',
        answer: 'My name is Anna',
      },
      {
        type: 'arrange',
        prompt: 'Forme den Satz: „Wie geht es dir heute?"',
        words: ['today', 'are', 'you', 'How'],
        answer: 'How are you today',
      },
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „Auf Wiedersehen" auf Englisch?',
        options: ['Hello', 'Please', 'Goodbye', 'Thank you'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'Zahlen',
    emoji: '🔢',
    description: 'Count from one to ten in English',
    color: '#1CB0F6',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: 'Was ist „eins" auf Englisch?',
        options: ['two', 'three', 'one', 'four'],
        correct: 2,
      },
      {
        type: 'multiple-choice',
        prompt: 'Wie sagt man „fünf" auf Englisch?',
        options: ['ten', 'five', 'six', 'seven'],
        correct: 1,
      },
      {
        type: 'arrange',
        prompt: 'Forme den Satz: „Ich habe drei Katzen."',
        words: ['have', 'three', 'I', 'cats'],
        answer: 'I have three cats',
      },
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „ten" auf Deutsch?',
        options: ['sechs', 'acht', 'neun', 'zehn'],
        correct: 3,
      },
      {
        type: 'translate',
        prompt: 'Übersetze ins Englische: „Zwei plus zwei ist vier."',
        answer: 'Two plus two is four',
      },
    ],
  },
  {
    id: 3,
    title: 'Farben',
    emoji: '🎨',
    description: 'Learn colors in English',
    color: '#CE82FF',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: 'Was ist „rot" auf Englisch?',
        options: ['blue', 'green', 'red', 'yellow'],
        correct: 2,
      },
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „blue" auf Deutsch?',
        options: ['lila', 'orange', 'blau', 'rosa'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Forme den Satz: „Der Himmel ist blau."',
        words: ['sky', 'The', 'is', 'blue'],
        answer: 'The sky is blue',
      },
      {
        type: 'multiple-choice',
        prompt: 'Was ist „grün" auf Englisch?',
        options: ['red', 'green', 'white', 'black'],
        correct: 1,
      },
      {
        type: 'translate',
        prompt: 'Übersetze ins Englische: „Ich mag die Farbe Gelb."',
        answer: 'I like the color yellow',
      },
    ],
  },
  {
    id: 4,
    title: 'Tiere',
    emoji: '🐾',
    description: 'Discover animal names in English',
    color: '#FF9600',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „Katze" auf Englisch?',
        options: ['dog', 'bird', 'fish', 'cat'],
        correct: 3,
      },
      {
        type: 'multiple-choice',
        prompt: 'Wie sagt man „Hund" auf Englisch?',
        options: ['cat', 'bird', 'dog', 'fish'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Forme den Satz: „Der Hund ist sehr groß."',
        words: ['very', 'dog', 'The', 'big', 'is'],
        answer: 'The dog is very big',
      },
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „bird" auf Deutsch?',
        options: ['Fisch', 'Pferd', 'Vogel', 'Hase'],
        correct: 2,
      },
      {
        type: 'translate',
        prompt: 'Übersetze ins Englische: „Ich habe eine Katze und einen Hund."',
        answer: 'I have a cat and a dog',
      },
    ],
  },
  {
    id: 5,
    title: 'Essen & Trinken',
    emoji: '🍎',
    description: 'Learn food and drink vocabulary in English',
    color: '#FF4B4B',
    xp: 20,
    questions: [
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „Brot" auf Englisch?',
        options: ['milk', 'bread', 'water', 'juice'],
        correct: 1,
      },
      {
        type: 'multiple-choice',
        prompt: 'Wie sagt man „Wasser" auf Englisch?',
        options: ['milk', 'juice', 'water', 'coffee'],
        correct: 2,
      },
      {
        type: 'arrange',
        prompt: 'Forme den Satz: „Ich möchte Pizza essen."',
        words: ['eat', 'I', 'want', 'to', 'pizza'],
        answer: 'I want to eat pizza',
      },
      {
        type: 'multiple-choice',
        prompt: 'Was bedeutet „apple" auf Deutsch?',
        options: ['Banane', 'Orange', 'Traube', 'Apfel'],
        correct: 3,
      },
      {
        type: 'translate',
        prompt: 'Übersetze ins Englische: „Ich habe Hunger und Durst."',
        answer: 'I am hungry and thirsty',
      },
    ],
  },
]
