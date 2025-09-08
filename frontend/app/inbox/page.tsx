"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function InboxPage() {
  const router = useRouter()
  const [message, setMessage] = useState<string>('Loading…')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.replace('/login')
      return
    }
    apiFetch<{ message: string }>('/mail/inbox')
      .then((data) => setMessage(data?.message || 'Inbox (protected)'))
      .catch(() => setMessage('Inbox (protected)'))
  }, [router])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Inbox (protected)</h1>
      <p>{message}</p>
    </div>
  )
}


