import { cn } from '@/lib/utils/cn'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface DateCalendarProps {
  selectedDate: string
  onSelect: (date: string) => void
  maxDays: number
  closedDays: number[]
}

export function DateCalendar({ selectedDate, onSelect, maxDays, closedDays }: DateCalendarProps) {
  const today = startOfDay(new Date())
  const days: Date[] = []

  for (let i = 0; i < maxDays; i++) {
    days.push(addDays(today, i))
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const isSelected = dateStr === selectedDate
        const isPast = isBefore(day, today)
        const isClosed = closedDays.includes(day.getDay())

        return (
          <button
            key={dateStr}
            onClick={() => !isPast && !isClosed && onSelect(dateStr)}
            disabled={isPast || isClosed}
            className={cn(
              'flex flex-col items-center rounded-lg border-2 p-2 transition-all cursor-pointer',
              isSelected
                ? 'border-primary-500 bg-primary-50'
                : isPast || isClosed
                  ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300',
            )}
          >
            <span className="text-xs text-gray-500">{format(day, 'EEE', { locale: es })}</span>
            <span className="text-lg font-bold text-gray-900">{format(day, 'd')}</span>
            <span className="text-xs text-gray-500">{format(day, 'MMM', { locale: es })}</span>
          </button>
        )
      })}
    </div>
  )
}
