import { useState } from 'react'
import { useMyBusiness } from '@/hooks/useBusiness'
import { useAllServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useServices'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils/format'
import { ServiceForm } from './ServiceForm'
import type { Service } from '@/types/service'
import type { ServiceFormData } from '@/lib/utils/validators'
import toast from 'react-hot-toast'

export function ServicesPage() {
  const { data: business } = useMyBusiness()
  const { data: services, isLoading } = useAllServices(business?.id)
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  function handleCreate(data: ServiceFormData) {
    if (!business) return

    createService.mutate(
      {
        business_id: business.id,
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price,
        is_active: true,
        sort_order: (services?.length || 0) + 1,
      },
      {
        onSuccess: () => {
          toast.success('Servicio creado')
          setShowModal(false)
        },
        onError: () => toast.error('Error al crear servicio'),
      },
    )
  }

  function handleUpdate(data: ServiceFormData) {
    if (!editingService) return

    updateService.mutate(
      {
        id: editingService.id,
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price,
      },
      {
        onSuccess: () => {
          toast.success('Servicio actualizado')
          setShowModal(false)
          setEditingService(null)
        },
        onError: () => toast.error('Error al actualizar servicio'),
      },
    )
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return

    deleteService.mutate(id, {
      onSuccess: () => toast.success('Servicio eliminado'),
      onError: () => toast.error('Error al eliminar servicio'),
    })
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
        <Button onClick={() => setShowModal(true)}>Nuevo servicio</Button>
      </div>

      {!services || services.length === 0 ? (
        <EmptyState
          title="No hay servicios"
          description="Crea tu primer servicio para que los clientes puedan reservar."
          action={<Button onClick={() => setShowModal(true)}>Crear servicio</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-white p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  )}
                </div>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(service.price)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">{service.duration} min</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingService(service)
                      setShowModal(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingService(null)
        }}
        title={editingService ? 'Editar servicio' : 'Nuevo servicio'}
      >
        <ServiceForm
          onSubmit={editingService ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowModal(false)
            setEditingService(null)
          }}
          initialData={editingService}
          loading={createService.isPending || updateService.isPending}
        />
      </Modal>
    </div>
  )
}
