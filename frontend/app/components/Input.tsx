"use client"
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: FieldError
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        ref={ref}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
})

export default Input


