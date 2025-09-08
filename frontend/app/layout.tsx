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
        <header className="border-b">
          <div className="max-w-5xl mx-auto p-4 flex gap-4 text-blue-600">
            <a href="/inbox">Inbox</a>
            <a href="/sent">Sent</a>
            <a href="/compose">Compose</a>
          </div>
        </header>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}


