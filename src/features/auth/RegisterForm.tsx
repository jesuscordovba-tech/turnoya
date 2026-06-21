import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { generateUniqueSlug } from '@/lib/utils/slug'

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setLoading(true)
    try {
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) throw signUpError

      if (authData.user) {
          const slug = await generateUniqueSlug(data.businessName)

          const { error: businessError } = await supabase.from('businesses').insert({
            name: data.businessName,
            slug,
            phone: '+50700000000',
            owner_id: authData.user.id,
          })

          if (businessError) throw businessError
        }

      toast.success('Cuenta creada. Revisa tu email para confirmar.')
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="businessName"
        label="Nombre del negocio"
        placeholder="Barbería El Clásico"
        error={errors.businessName?.message}
        {...register('businessName')}
      />
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
      <Input
        id="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" loading={loading} className="w-full">
        Crear cuenta
      </Button>
    </form>
  )
}
