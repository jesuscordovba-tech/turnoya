import { formatCurrency, formatPhone } from '@/lib/utils/format'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Business } from '@/types/business'
import type { Service } from '@/types/service'

interface BookingConfirmationProps {
  business: Business
  service: Service
  date: string
  time: string
}

export function BookingConfirmation({ business, service, date, time }: BookingConfirmationProps) {
  const dateObj = parseISO(date)

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">¡Reserva confirmada!</h2>
        <p className="mt-1 text-gray-500">
          Te enviaremos un recordatorio por WhatsApp
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4 text-left">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Negocio</span>
            <span className="font-medium text-gray-900">{business.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Servicio</span>
            <span className="font-medium text-gray-900">{service.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha</span>
            <span className="font-medium text-gray-900">
              {format(dateObj, "EEEE d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Hora</span>
            <span className="font-medium text-gray-900">{time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duración</span>
            <span className="font-medium text-gray-900">{service.duration} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Precio</span>
            <span className="font-bold text-primary-600">{formatCurrency(service.price)}</span>
          </div>
        </div>
      </div>

      {business.address && (
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-700">Dirección</p>
          <p>{business.address}</p>
        </div>
      )}

      {business.phone && (
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-700">Contacto</p>
          <p>{formatPhone(business.phone)}</p>
        </div>
      )}
    </div>
  )
}
