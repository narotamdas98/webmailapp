"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Mail = {
  id: string
  subject: string
  body: string
  createdAt: string
  fromUser?: { email: string }
}

export default function InboxPage() {
  const router = useRouter()
  const [mails, setMails] = useState<Mail[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.replace('/login')
      return
    }
    apiFetch<Mail[]>('/mail/inbox')
      .then((data) => setMails(data))
      .catch((e: any) => setError(e?.message || 'Failed to load inbox'))
  }, [router])

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
     
      <h1 className="text-xl font-semibold">Inbox</h1>
      {!mails && !error && <p>Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {mails && (
        <ul className="divide-y border rounded">
          {mails.map((m) => (
            <li key={m.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.subject}</div>
                <div className="text-sm text-gray-600">From: {m.fromUser?.email}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


