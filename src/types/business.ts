export interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string
  email: string | null
  address: string | null
  logo_url: string | null
  cover_url: string | null
  timezone: string
  slot_interval: number
  padding_before: number
  padding_after: number
  max_advance_days: number
  allow_same_day: boolean
  is_active: boolean
  owner_id: string
  created_at: string
  updated_at: string
}
