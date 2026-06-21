export function formatDisplayPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function isValidPhone(phone: string): boolean {
  return /^\+?\d{7,15}$/.test(phone)
}
