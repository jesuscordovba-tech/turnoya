import type { Business } from '@/types/business'

interface BusinessHeaderProps {
  business: Business
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <div className="mb-6 text-center">
      {business.logo_url && (
        <img
          src={business.logo_url}
          alt={business.name}
          className="mx-auto mb-3 h-20 w-20 rounded-full object-cover"
        />
      )}
      <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
      {business.description && (
        <p className="mt-1 text-gray-500">{business.description}</p>
      )}
      {business.address && (
        <p className="mt-1 text-sm text-gray-400">{business.address}</p>
      )}
    </div>
  )
}
