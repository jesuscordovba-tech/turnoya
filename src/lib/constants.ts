export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TurnoYa'
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const PANAMA_COUNTRY_CODE = '+507'
export const PANAMA_PHONE_REGEX = /^\+507\d{8}$/

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_progress: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
}
