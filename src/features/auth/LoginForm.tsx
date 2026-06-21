import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/utils/validators'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      toast.success('Sesión iniciada')
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        label="Contraseña"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" loading={loading} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  )
}
