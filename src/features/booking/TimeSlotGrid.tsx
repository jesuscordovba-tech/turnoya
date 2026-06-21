import { cn } from '@/lib/utils/cn'
import type { TimeSlot } from '@/lib/utils/time'

interface TimeSlotGridProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onSelect: (time: string) => void
  loading?: boolean
}

export function TimeSlotGrid({ slots, selectedTime, onSelect, loading }: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
        No hay horarios disponibles para esta fecha
      </div>
    )
  }

  const availableSlots = slots.filter((s) => s.available)
  if (availableSlots.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
        No hay espacios disponibles para esta fecha. Intenta con otro día.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          className={cn(
            'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all cursor-pointer',
            selectedTime === slot.time
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : slot.available
                ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed',
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  )
}
