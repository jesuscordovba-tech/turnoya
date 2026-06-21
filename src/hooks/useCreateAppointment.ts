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

async function phoneToUuid(phone: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(phone)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return `${hashHex.slice(0, 8)}-${hashHex.slice(8, 12)}-${hashHex.slice(12, 16)}-${hashHex.slice(16, 20)}-${hashHex.slice(20, 32)}`
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (input: CreateAppointmentInput) => {
      const clientId = await phoneToUuid(input.client_phone)

      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          id: clientId,
          phone: input.client_phone,
          name: input.client_name,
          email: input.client_email || null,
        })

      if (clientError && clientError.code !== '23505') {
        throw clientError
      }

      const { error: aptError } = await supabase
        .from('appointments')
        .insert({
          status: 'pending',
          business_id: input.business_id,
          service_id: input.service_id,
          client_id: clientId,
          start_time: input.start_time,
          end_time: input.end_time,
          client_name: input.client_name,
          client_phone: input.client_phone,
          client_email: input.client_email || null,
          notes: input.notes || null,
        })

      if (aptError) throw aptError
    },
    onError: (error) => {
      const msg =
        (error as { message?: string })?.message ||
        (error as { error_description?: string })?.error_description ||
        'Error al crear la cita'
      toast.error(msg)
    },
  })
}
