import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface CreateAppointmentInput {
  business_id: string
  service_id: string
  start_time: string
  end_time: string
  client_name: string
  client_phone: string
  client_email?: string
  notes?: string
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (input: CreateAppointmentInput) => {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .upsert(
          { phone: input.client_phone, name: input.client_name, email: input.client_email || null },
          { onConflict: 'phone' },
        )
        .select()
        .single()

      if (clientError) throw clientError

      const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .insert({
          business_id: input.business_id,
          service_id: input.service_id,
          client_id: client.id,
          start_time: input.start_time,
          end_time: input.end_time,
          client_name: input.client_name,
          client_phone: input.client_phone,
          client_email: input.client_email || null,
          notes: input.notes || null,
        })
        .select()
        .single()

      if (aptError) throw aptError

      return appointment
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cita')
    },
  })
}
