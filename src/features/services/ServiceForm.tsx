import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceFormData } from '@/lib/utils/validators'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Service } from '@/types/service'

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => void
  onCancel: () => void
  initialData?: Service | null
  loading?: boolean
}

export function ServiceForm({ onSubmit, onCancel, initialData, loading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    values: initialData ? {
      name: initialData.name,
      description: initialData.description ?? '',
      duration: initialData.duration,
      price: initialData.price,
    } : {
      name: '',
      description: '',
      duration: 30,
      price: 0,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Nombre del servicio"
        placeholder="Corte de cabello"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        id="description"
        label="Descripción (opcional)"
        placeholder="Corte con navaja y delineado"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="duration"
          label="Duración (minutos)"
          type="number"
          min={15}
          max={480}
          error={errors.duration?.message}
          {...register('duration', { valueAsNumber: true })}
        />
        <Input
          id="price"
          label="Precio ($)"
          type="number"
          step="0.01"
          min={0}
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Actualizar' : 'Crear servicio'}
        </Button>
      </div>
    </form>
  )
}
