import { cn } from '@/lib/utils/cn'
import { formatDisplayPhone } from '@/lib/utils/phone'
import type { InputHTMLAttributes } from 'react'

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

export function PhoneInput({ className, label, error, id, value, onChange, ...props }: PhoneInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d+]/g, '')
    const hasPlus = raw.startsWith('+')
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    const formatted = hasPlus ? `+${digits}` : digits
    onChange?.(formatted)
  }

  const displayValue = value ? formatDisplayPhone(value as string) : ''

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="6000-0000"
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
