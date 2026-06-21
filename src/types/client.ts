export interface Client {
  id: string
  phone: string
  name: string
  email: string | null
  total_visits: number
  last_visit: string | null
  created_at: string
}
