import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'
import type { Service } from '@/types/service'

interface ServiceCardProps {
  service: Service
  selected: boolean
  onSelect: () => void
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border-2 p-4 text-left transition-all cursor-pointer',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm',
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{service.name}</h3>
          {service.description && (
            <p className="mt-0.5 text-sm text-gray-500">{service.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-primary-600">{formatCurrency(service.price)}</p>
          <p className="text-xs text-gray-500">{service.duration} min</p>
        </div>
      </div>
    </button>
  )
}
