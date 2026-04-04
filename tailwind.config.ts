import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'duo-green': '#58CC02',
        'duo-green-dark': '#46A302',
        'duo-green-light': '#89E219',
        'duo-yellow': '#FFD900',
        'duo-red': '#FF4B4B',
        'duo-blue': '#1CB0F6',
        'duo-purple': '#CE82FF',
        'duo-orange': '#FF9600',
        'duo-gray': '#E5E5E5',
        'duo-gray-dark': '#AFAFAF',
        'duo-text': '#3C3C3C',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      boxShadow: {
        'duo': '0 4px 0 0 rgba(0,0,0,0.15)',
        'duo-button': '0 4px 0 0 #46A302',
        'duo-button-yellow': '0 4px 0 0 #D4B000',
        'duo-button-red': '0 4px 0 0 #CC0000',
        'duo-card': '0 2px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'bounce-once': 'bounceOnce 0.5s ease',
        'shake': 'shake 0.5s ease',
        'correct-flash': 'correctFlash 0.6s ease',
        'wrong-flash': 'wrongFlash 0.6s ease',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
        'celebrate': 'celebrate 0.5s ease',
      },
      keyframes: {
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-8px)' },
          '30%, 70%': { transform: 'translateX(8px)' },
        },
        correctFlash: {
          '0%': { backgroundColor: 'transparent' },
          '30%': { backgroundColor: 'rgba(88, 204, 2, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        },
        wrongFlash: {
          '0%': { backgroundColor: 'transparent' },
          '30%': { backgroundColor: 'rgba(255, 75, 75, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
