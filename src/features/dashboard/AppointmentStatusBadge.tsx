import { cn } from '@/lib/utils/cn'
import type { AppointmentStatus } from '@/types/appointment'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-700',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_progress: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
}

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status] || 'bg-gray-100 text-gray-700',
      )}
    >
      {statusLabels[status] || status}
    </span>
  )
}
