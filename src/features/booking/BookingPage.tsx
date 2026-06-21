import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useBusiness } from '@/hooks/useBusiness'
import { useServices } from '@/hooks/useServices'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { useCreateAppointment } from '@/hooks/useCreateAppointment'
import { generateTimeSlots, type TimeSlot } from '@/lib/utils/time'
import { formatCurrency } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/Spinner'
import { ServiceCard } from './ServiceCard'
import { DateCalendar } from './DateCalendar'
import { TimeSlotGrid } from './TimeSlotGrid'
import { ClientForm } from './ClientForm'
import { BusinessHeader } from './BusinessHeader'
import { BookingConfirmation } from './BookingConfirmation'
import type { Service } from '@/types/service'
import type { ClientFormData } from '@/lib/utils/validators'
import { parseISO } from 'date-fns'
import { Button } from '@/components/ui/Button'

type Step = 'service' | 'datetime' | 'client' | 'confirm'

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: business, isLoading: loadingBusiness } = useBusiness(slug)
  const { data: services, isLoading: loadingServices } = useServices(business?.id)
  const { data: businessHours } = useBusinessHours(business?.id)
  const createAppointment = useCreateAppointment()

  const [step, setStep] = useState<Step>('service')
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.duration, 0)
  }, [selectedServices])

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + Number(s.price), 0)
  }, [selectedServices])

  const slots: TimeSlot[] = useMemo(() => {
    if (!businessHours || !selectedServices.length || !selectedDate) return []
    const dayOfWeek = parseISO(selectedDate).getDay()
    const dayHours = businessHours.find((h) => h.day_of_week === dayOfWeek)
    if (!dayHours || dayHours.is_closed) return []

    return generateTimeSlots({
      openTime: dayHours.open_time,
      closeTime: dayHours.close_time,
      serviceDuration: totalDuration,
      slotInterval: business?.slot_interval || 30,
      existingAppointments: [],
      paddingBefore: business?.padding_before || 0,
      paddingAfter: business?.padding_after || 0,
    })
  }, [businessHours, selectedServices, selectedDate, business, totalDuration])

  const closedDays = useMemo(() => {
    if (!businessHours) return []
    return businessHours.filter((h) => h.is_closed).map((h) => h.day_of_week)
  }, [businessHours])

  if (loadingBusiness) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Negocio no encontrado</h1>
          <p className="mt-2 text-gray-500">El enlace que buscas no existe.</p>
        </div>
      </div>
    )
  }

  function handleServiceToggle(service: Service) {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id)
      if (exists) {
        return prev.filter((s) => s.id !== service.id)
      }
      return [...prev, service]
    })
    setSelectedTime(null)
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time)
    setStep('client')
  }

  async function handleClientSubmit(data: ClientFormData) {
    if (!business || !selectedServices.length || !selectedDate || !selectedTime) return

    const startLocal = new Date(`${selectedDate}T${selectedTime}:00-05:00`)

    createAppointment.mutate(
      {
        business_id: business.id,
        services: selectedServices.map((s) => ({ id: s.id, duration: s.duration })),
        start_time: startLocal.toISOString(),
        client_name: data.name,
        client_phone: data.phone,
        client_email: data.email || undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          setStep('confirm')
        },
      },
    )
  }

  function goToDatetimeStep() {
    setSelectedTime(null)
    setStep('datetime')
  }

  const progress = ['service', 'datetime', 'client', 'confirm']
  const currentStepIndex = progress.indexOf(step)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BusinessHeader business={business} />

        <div className="mb-8 flex items-center justify-center gap-2">
          {progress.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i <= currentStepIndex
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              {i < progress.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${
                    i < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          {step === 'service' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Elige uno o más servicios</h2>
              {loadingServices ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : !services || services.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay servicios disponibles en este momento
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        selected={selectedServices.some((s) => s.id === service.id)}
                        onSelect={() => handleServiceToggle(service)}
                      />
                    ))}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}
                        </span>
                        <span className="font-medium text-gray-700">
                          {totalDuration} min &middot; {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={goToDatetimeStep}
                    disabled={selectedServices.length === 0}
                    className="w-full"
                  >
                    Continuar
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 'datetime' && selectedServices.length > 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Fecha</h2>
                <p className="text-sm text-gray-500">Selecciona un día disponible</p>
              </div>
              <DateCalendar
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                maxDays={business.max_advance_days}
                closedDays={closedDays}
              />

              {selectedDate && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Horario</h2>
                  <p className="text-sm text-gray-500">
                    Duración total: {totalDuration} min
                  </p>
                  <div className="mt-3">
                    {slots.length === 0 ? (
                      <p className="text-sm text-amber-600">
                        La duración total de los servicios seleccionados ({totalDuration} min) excede el horario disponible. Seleccioná menos servicios o intentá con otro día.
                      </p>
                    ) : (
                      <TimeSlotGrid
                        slots={slots}
                        selectedTime={selectedTime}
                        onSelect={handleTimeSelect}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'client' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tus datos</h2>
              <p className="text-sm text-gray-500">
                Te enviaremos la confirmación por WhatsApp
              </p>
              <ClientForm
                onSubmit={handleClientSubmit}
                loading={createAppointment.isPending}
              />
            </div>
          )}

          {step === 'confirm' && (
            <>
              <BookingConfirmation
                business={business}
                services={selectedServices}
                date={selectedDate}
                time={selectedTime!}
              />
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setSelectedServices([])
                    setSelectedDate('')
                    setSelectedTime(null)
                    setStep('service')
                  }}
                >
                  Hacer otra reserva
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}