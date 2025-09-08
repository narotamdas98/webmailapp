"use client"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'

type SignupForm = {
  name: string
  email: string
  password: string
}

const schema = yup.object({
  name: yup.string().required('Name is required').min(2).max(100),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
})

export default function SignupPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: yupResolver(schema),
  })

  async function onSubmit(values: SignupForm) {
    await apiFetch('/auth/signup', { method: 'POST', body: values })
    router.push('/login')
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-6 border rounded">
      <h1 className="text-2xl font-semibold text-center">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" placeholder="Your name" {...register('name')} error={errors.name} />
        <Input type="email" label="Email" placeholder="you@example.com" {...register('email')} error={errors.email} />
        <Input type="password" label="Password" placeholder="••••••••" {...register('password')} error={errors.password} />
        <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
      </form>
      <p className="text-center text-sm">Already have an account? <a className="text-blue-600 underline" href="/login">Log in</a></p>
    </div>
  )
}


