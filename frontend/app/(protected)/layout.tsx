'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.replace('/login')
    } else {
      setIsAuthed(true)
    }
  }, [router, pathname])

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    router.replace('/login')
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-4">
        <div className="text-xl font-bold">MyWebMailApp</div>
        <nav className="flex flex-col gap-2 text-blue-600">
          <Link href="/inbox">Inbox</Link>
          <Link href="/sent">Sent</Link>
          <Link href="/compose">Compose</Link>
        </nav>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </aside>
      <section className="p-6">{children}</section>
    </div>
  )
}


