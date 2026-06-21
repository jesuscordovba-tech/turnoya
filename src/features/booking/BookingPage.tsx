import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBusiness } from '@/hooks/useBusiness'
import { useServices } from '@/hooks/useServices'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { useCreateAppointment } from '@/hooks/useCreateAppointment'
import { generateTimeSlots, type TimeSlot } from '@/lib/utils/time'
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
import { useMemo } from 'react'

type Step = 'service' | 'datetime' | 'client' | 'confirm'

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: business, isLoading: loadingBusiness } = useBusiness(slug)
  const { data: services, isLoading: loadingServices } = useServices(business?.id)
  const { data: businessHours } = useBusinessHours(business?.id)
  const createAppointment = useCreateAppointment()

  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const slots: TimeSlot[] = useMemo(() => {
    if (!businessHours || !selectedService || !selectedDate) return []
    const dayOfWeek = parseISO(selectedDate).getDay()
    const dayHours = businessHours.find((h) => h.day_of_week === dayOfWeek)
    if (!dayHours || dayHours.is_closed) return []

    return generateTimeSlots({
      openTime: dayHours.open_time,
      closeTime: dayHours.close_time,
      serviceDuration: selectedService.duration,
      slotInterval: business?.slot_interval || 30,
      existingAppointments: [],
      paddingBefore: business?.padding_before || 0,
      paddingAfter: business?.padding_after || 0,
    })
  }, [businessHours, selectedService, selectedDate, business])

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

  function handleServiceSelect(service: Service) {
    setSelectedService(service)
    setStep('datetime')
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
    if (!business || !selectedService || !selectedDate || !selectedTime) return

    // Convert local time (Panama UTC-5) to UTC for storage
    const startLocal = new Date(`${selectedDate}T${selectedTime}:00-05:00`)
    const endMinutes = selectedTime.split(':').map(Number)[0] * 60 +
      selectedTime.split(':').map(Number)[1] + selectedService.duration
    const endHour = Math.floor(endMinutes / 60)
    const endMin = endMinutes % 60
    const endLocal = new Date(`${selectedDate}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00-05:00`)

    createAppointment.mutate(
      {
        business_id: business.id,
        service_id: selectedService.id,
        start_time: startLocal.toISOString(),
        end_time: endLocal.toISOString(),
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

  const progress = ['service', 'datetime', 'client', 'confirm']
  const currentStepIndex = progress.indexOf(step)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BusinessHeader business={business} />

        {/* Progress bar */}
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
              <h2 className="text-lg font-semibold text-gray-900">Elige un servicio</h2>
              {loadingServices ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : !services || services.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay servicios disponibles en este momento
                </p>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService?.id === service.id}
                      onSelect={() => handleServiceSelect(service)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'datetime' && selectedService && (
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
                    Duración: {selectedService.duration} min
                  </p>
                  <div className="mt-3">
                    <TimeSlotGrid
                      slots={slots}
                      selectedTime={selectedTime}
                      onSelect={handleTimeSelect}
                    />
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
            <BookingConfirmation
              business={business}
              service={selectedService!}
              date={selectedDate}
              time={selectedTime!}
            />
          )}
        </div>
      </div>
    </div>
  )
}
