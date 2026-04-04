import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaLearn - Englisch lernen',
  description: 'Lerne Englisch auf spielerische Weise mit LinguaLearn – Deutsch zu Englisch',
  keywords: 'Englisch lernen, Sprachlern-App, Deutsch Englisch, Vokabeln, Grammatik',
  authors: [{ name: 'LinguaLearn' }],
  openGraph: {
    title: 'LinguaLearn - Englisch lernen',
    description: 'Lerne Englisch auf spielerische Weise mit LinguaLearn',
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
