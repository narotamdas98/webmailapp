'use client'
import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function ComposePage() {
  const [toEmail, setToEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await apiFetch('/mail/send-smtp', {
        method: 'POST',
        body: { toEmail, subject, body },
      })
      setStatus('Message sent')
      setToEmail('')
      setSubject('')
      setBody('')
    } catch (err: any) {
      setStatus(err.message || 'Failed to send')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
     
      <h1 className="text-xl font-semibold">Compose</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Recipient email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded p-2 min-h-[150px]"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  )
}


