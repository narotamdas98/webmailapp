import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Webmail App',
  description: 'Simple webmail frontend with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}


