import { useMyBusiness } from '@/hooks/useBusiness'
import { useAppointments } from '@/hooks/useAppointments'
import { Spinner } from '@/components/ui/Spinner'
import { formatRelativeDate, formatTime, formatCurrency } from '@/lib/utils/format'
import { format } from 'date-fns'
import { EmptyState } from '@/components/ui/EmptyState'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function DashboardHome() {
  const { data: business, isLoading: loadingBusiness } = useMyBusiness()
  const { data: appointments, isLoading: loadingAppts } = useAppointments(business?.id)

  if (loadingBusiness || loadingAppts) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!business) {
    return (
      <EmptyState
        title="Configura tu negocio"
        description="Antes de empezar, completa la configuración de tu negocio."
        action={
          <Link to="/dashboard/settings">
            <Button>Ir a configuración</Button>
          </Link>
        }
      />
    )
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayAppts = (appointments || []).filter((a) => a.start_time.startsWith(today))
  const pending = todayAppts.filter((a) => a.status === 'confirmed' || a.status === 'pending')
  const completedToday = todayAppts.filter((a) => a.status === 'completed')
  const totalEarnings = completedToday.reduce((sum, a) => sum + Number(a.services?.price || 0), 0)
  const upcoming = (appointments || [])
    .filter((a) => a.status === 'confirmed' || a.status === 'pending')
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
        <p className="text-sm text-gray-500">
          {formatRelativeDate(new Date())} — {format(new Date(), 'd MMM yyyy')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Citas hoy</p>
          <p className="text-2xl font-bold text-gray-900">{todayAppts.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Ingresos hoy</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Próximas citas</h2>
          <Link
            to="/dashboard/appointments"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ver todas
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No hay citas pendientes
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {upcoming.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{apt.client_name}</p>
                  <p className="text-xs text-gray-500">{apt.services?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatTime(apt.start_time)}</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      apt.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : apt.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {apt.status === 'completed'
                      ? 'Completada'
                      : apt.status === 'cancelled'
                        ? 'Cancelada'
                        : 'Confirmada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
