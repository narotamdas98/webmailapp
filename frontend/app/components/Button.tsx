"use client"
import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export default function Button({ loading, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}


