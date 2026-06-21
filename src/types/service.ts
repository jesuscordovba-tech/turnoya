export interface Service {
  id: string
  business_id: string
  name: string
  description: string | null
  duration: number
  price: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
