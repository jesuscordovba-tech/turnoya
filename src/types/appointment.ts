export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  business_id: string
  service_id: string
  client_id: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  client_name: string
  client_phone: string
  client_email: string | null
  notes: string | null
  cancellation_reason: string | null
  confirmation_sent: boolean
  created_at: string
  updated_at: string
}

export interface AppointmentWithService extends Appointment {
  services: {
    name: string
    duration: number
    price: number
  }
}
