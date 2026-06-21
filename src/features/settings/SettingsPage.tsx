import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessSchema, type BusinessFormData } from '@/lib/utils/validators'
import { useMyBusiness } from '@/hooks/useBusiness'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { generateUniqueSlug } from '@/lib/utils/slug'

export function SettingsPage() {
  const { data: business, isLoading } = useMyBusiness()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  })

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        description: business.description || '',
        phone: business.phone,
        email: business.email || '',
        address: business.address || '',
      })
    }
  }, [business, reset])

  async function onSubmit(data: BusinessFormData) {
    if (!business) return
    setSaving(true)

    try {
      const slug = await generateUniqueSlug(data.name, business.id)

      const { error } = await supabase
        .from('businesses')
        .update({
          name: data.name,
          description: data.description || null,
          phone: data.phone,
          email: data.email || null,
          address: data.address || null,
          slug,
        })
        .eq('id', business.id)

      if (error) throw error
      toast.success('Información actualizada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Información de tu negocio.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="name"
            label="Nombre del negocio"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            id="description"
            label="Descripción (opcional)"
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            id="phone"
            label="Teléfono"
            placeholder="+507XXXXXXXX"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            id="email"
            label="Email (opcional)"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="address"
            label="Dirección (opcional)"
            error={errors.address?.message}
            {...register('address')}
          />
          <Button type="submit" loading={saving}>
            Guardar cambios
          </Button>
        </form>
      </div>

      {business && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 max-w-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Tu página pública</h2>
          <p className="text-sm text-gray-500 mb-4">
            Comparte este enlace para que tus clientes reserven:
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={`${window.location.origin}/${business.slug}`}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${business.slug}`)
                toast.success('Enlace copiado')
              }}
            >
              Copiar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
