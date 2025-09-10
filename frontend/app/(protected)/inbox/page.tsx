"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

type Mail = {
  uid: number
  subject: string
  fromUser: { name: string; address: string }
  to: { name: string; address: string }[]
  date: string
  flags: Record<string, boolean>
  body: { text: string; html: string }
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

    apiFetch('/mail/fetch-inbox')
      .then((data) => {
        console.log('Fetched inbox data:', data)
        setMails(data.messages)
      })
      .catch((e: any) => setError(e?.message || 'Failed to load inbox'))
  }, [router])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {!mails && !error && <p>Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {mails && (
        <div className="border rounded shadow divide-y">
          {mails.map((m) => (
            <div
              key={m.uid}
              className={`flex justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                !m.flags.seen ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{m.fromUser.address}</span>
                  <span className="text-gray-400">to {m.to.map((t) => t.address).join(', ')}</span>
                </div>
                <div className="text-lg">{m.subject}</div>
                <div className="text-gray-500 text-sm line-clamp-1">{m.body.text}</div>
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(m.date).toLocaleString(undefined, {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
