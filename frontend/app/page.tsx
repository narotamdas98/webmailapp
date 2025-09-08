import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Webmail</h1>
      <div className="flex gap-3">
        <Link className="text-blue-600 underline" href="/signup">Go to Signup</Link>
        <Link className="text-blue-600 underline" href="/login">Go to Login</Link>
        <Link className="text-blue-600 underline" href="/inbox">Go to Inbox</Link>
      </div>
    </div>
  )
}


