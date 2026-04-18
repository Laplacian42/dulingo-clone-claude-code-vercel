import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DJMAX - Browser DJ Simulator',
  description: 'Mix music like a real DJ in your browser',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}
