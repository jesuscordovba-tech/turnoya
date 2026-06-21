import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFormSchema, type ClientFormData } from '@/lib/utils/validators'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void
  loading?: boolean
}

export function ClientForm({ onSubmit, loading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
  })

  const phoneValue = watch('phone')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Tu nombre"
        placeholder="Ej: Juan Pérez"
        error={errors.name?.message}
        {...register('name')}
      />
      <PhoneInput
        id="phone"
        label="Teléfono (WhatsApp)"
        value={phoneValue}
        error={errors.phone?.message}
        onChange={(value) => setValue('phone', value, { shouldValidate: true })}
      />
      <Input
        id="email"
        label="Email (opcional)"
        type="email"
        placeholder="juan@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="notes"
        label="Notas (opcional)"
        placeholder="Alguna indicación especial"
        error={errors.notes?.message}
        {...register('notes')}
      />
      <Button type="submit" loading={loading} className="w-full">
        Confirmar reserva
      </Button>
    </form>
  )
}
