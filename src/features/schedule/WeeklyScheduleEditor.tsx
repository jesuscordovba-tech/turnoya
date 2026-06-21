import { useState } from 'react'
import { useMyBusiness } from '@/hooks/useBusiness'
import { useBusinessHours, useUpsertBusinessHours } from '@/hooks/useBusinessHours'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DAY_NAMES } from '@/lib/constants'
import type { BusinessHour } from '@/types/schedule'

interface DaySchedule {
  day_of_week: number
  is_closed: boolean
  open_time: string
  close_time: string
}

const defaultHours: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  is_closed: i === 0,
  open_time: '09:00',
  close_time: '18:00',
}))

function buildInitialSchedule(
  existing: BusinessHour[] | undefined,
): DaySchedule[] {
  if (!existing || existing.length === 0) return defaultHours

  return defaultHours.map((defaultDay) => {
    const found = existing.find((h) => h.day_of_week === defaultDay.day_of_week)
    return found
      ? {
          day_of_week: found.day_of_week,
          is_closed: found.is_closed,
          open_time: found.open_time.slice(0, 5),
          close_time: found.close_time.slice(0, 5),
        }
      : defaultDay
  })
}

export function WeeklyScheduleEditor() {
  const { data: business } = useMyBusiness()
  const { data: existingHours, isLoading } = useBusinessHours(business?.id)
  const upsertHours = useUpsertBusinessHours()

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    () => buildInitialSchedule(existingHours),
  )

  function toggleDay(dayIndex: number) {
    setSchedule((prev) =>
      prev.map((d) => (d.day_of_week === dayIndex ? { ...d, is_closed: !d.is_closed } : d)),
    )
  }

  function updateTime(dayIndex: number, field: 'open_time' | 'close_time', value: string) {
    setSchedule((prev) =>
      prev.map((d) => (d.day_of_week === dayIndex ? { ...d, [field]: value } : d)),
    )
  }

  async function handleSave() {
    if (!business) return

    const hours = schedule.map((day) => ({
      business_id: business.id,
      day_of_week: day.day_of_week,
      is_closed: day.is_closed,
      open_time: day.open_time,
      close_time: day.close_time,
    }))

    upsertHours.mutate(hours)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-100">
          {schedule.map((day) => (
            <div key={day.day_of_week} className="flex items-center gap-4 px-6 py-3">
              <div className="w-8">
                <input
                  type="checkbox"
                  checked={!day.is_closed}
                  onChange={() => toggleDay(day.day_of_week)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <span
                className={`w-28 text-sm font-medium ${day.is_closed ? 'text-gray-400' : 'text-gray-900'}`}
              >
                {DAY_NAMES[day.day_of_week]}
              </span>
              {day.is_closed ? (
                <span className="text-sm text-gray-400">Cerrado</span>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.open_time}
                    onChange={(e) => updateTime(day.day_of_week, 'open_time', e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="time"
                    value={day.close_time}
                    onChange={(e) => updateTime(day.day_of_week, 'close_time', e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={upsertHours.isPending}>
          Guardar horarios
        </Button>
      </div>
    </div>
  )
}
