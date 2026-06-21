import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: Date | string, pattern: string = 'PPP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm', { locale: es })
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date

  if (isToday(d)) return 'Hoy'
  if (isTomorrow(d)) return 'Mañana'
  if (isYesterday(d)) return 'Ayer'

  return format(d, 'EEEE d MMM', { locale: es })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPhone(phone: string): string {
  if (phone.startsWith('+507') && phone.length === 12) {
    return `+507 ${phone.slice(4, 8)}-${phone.slice(8)}`
  }
  return phone
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}
