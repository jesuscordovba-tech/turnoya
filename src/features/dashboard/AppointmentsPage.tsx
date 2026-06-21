import { useState } from 'react'
import { useMyBusiness } from '@/hooks/useBusiness'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatTime, formatCurrency } from '@/lib/utils/format'
import { AppointmentStatusBadge } from './AppointmentStatusBadge'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export function AppointmentsPage() {
  const { data: business } = useMyBusiness()
  const [dateFilter, setDateFilter] = useState('')
  const { data: appointments, isLoading } = useAppointments(business?.id, dateFilter || undefined)
  const updateStatus = useUpdateAppointmentStatus()

  function handleStatusChange(appointmentId: string, status: string) {
    updateStatus.mutate(
      { id: appointmentId, status },
      {
        onSuccess: () => toast.success('Estado actualizado'),
        onError: () => toast.error('Error al actualizar estado'),
      },
    )
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
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">Todas</option>
            <option value={format(new Date(), 'yyyy-MM-dd')}>Hoy</option>
          </select>
        </div>
      </div>

      {!appointments || appointments.length === 0 ? (
        <EmptyState
          title="No hay citas"
          description="Las citas aparecerán aquí cuando los clientes reserven."
        />
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Cliente</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Servicio</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Estado</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{apt.client_name}</p>
                      <p className="text-xs text-gray-500">{apt.client_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{apt.services?.name}</td>
                    <td className="px-4 py-3 text-gray-900">{formatTime(apt.start_time)}</td>
                    <td className="px-4 py-3">
                      <AppointmentStatusBadge status={apt.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(Number(apt.services?.price || 0))}
                    </td>
                    <td className="px-4 py-3">
                      {apt.status === 'confirmed' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(apt.id, 'completed')}
                          >
                            Completar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
