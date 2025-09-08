"use client"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'

type LoginForm = {
  email: string
  password: string
}

const schema: yup.SchemaOf<LoginForm> = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required'),
})

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  })

  async function onSubmit(values: LoginForm) {
    const res = await apiFetch<{ access_token: string }>('/auth/login', { method: 'POST', body: values })
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.access_token)
    }
    router.push('/inbox')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input type="email" label="Email" placeholder="you@example.com" {...register('email')} error={errors.email} />
        <Input type="password" label="Password" placeholder="••••••••" {...register('password')} error={errors.password} />
        <Button type="submit" loading={isSubmitting}>Log in</Button>
      </form>
    </div>
  )
}


