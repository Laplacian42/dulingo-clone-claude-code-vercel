import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaLearn - English Learning App',
  description: 'Learn English the fun way with LinguaLearn - a Duolingo-style language learning app',
  keywords: 'English learning, language app, learn English, vocabulary, grammar',
  authors: [{ name: 'LinguaLearn' }],
  openGraph: {
    title: 'LinguaLearn - English Learning App',
    description: 'Learn English the fun way with LinguaLearn',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
