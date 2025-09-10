'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  InboxIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

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

  const navItems: NavItem[] = [
    { label: 'Inbox', href: '/inbox', icon: <InboxIcon className="h-5 w-5" /> },
    { label: 'Sent', href: '/sent', icon: <PaperAirplaneIcon className="h-5 w-5" /> },
    // { label: 'Compose', href: '/compose', icon: <PencilSquareIcon className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div className="p-4 space-y-6">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-700">MyWebMailApp</div>

          {/* Compose button */}
          <Link
            href="/compose"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Compose
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col mt-4 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100 ${
                    isActive ? 'bg-gray-200 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 p-4 text-red-600 hover:bg-gray-100 font-medium"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  )
}
