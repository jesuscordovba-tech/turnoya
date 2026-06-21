import { PANAMA_COUNTRY_CODE, PANAMA_PHONE_REGEX } from '@/lib/constants'

export function formatPanamaPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.length <= 4) return `+507 ${digits}`
  if (digits.length <= 8) return `+507 ${digits.slice(0, 4)}-${digits.slice(4)}`
  return `+507 ${digits.slice(0, 4)}-${digits.slice(4, 8)}`
}

export function isValidPanamaPhone(phone: string): boolean {
  return PANAMA_PHONE_REGEX.test(phone)
}

export function cleanPhone(value: string): string {
  return PANAMA_COUNTRY_CODE + value.replace(/\D/g, '').slice(-8)
}
