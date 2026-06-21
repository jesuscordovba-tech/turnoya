import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useAppointments(businessId?: string, date?: string) {
  return useQuery({
    queryKey: ['appointments', businessId, date],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select('*, services(name, duration, price)')
        .eq('business_id', businessId)
        .order('start_time', { ascending: true })

      if (date) {
        const startOfDay = `${date}T00:00:00Z`
        const endOfDay = `${date}T23:59:59Z`
        query = query.gte('start_time', startOfDay).lte('start_time', endOfDay)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!businessId,
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useAvailableSlots(businessId?: string, date?: string, serviceId?: string) {
  return useQuery({
    queryKey: ['available-slots', businessId, date, serviceId],
    queryFn: async () => {
      const [appointmentsRes, hoursRes, serviceRes, businessRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('business_id', businessId)
          .gte('start_time', `${date}T00:00:00Z`)
          .lte('start_time', `${date}T23:59:59Z`)
          .not('status', 'in', '("cancelled","no_show")'),
        supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', businessId),
        supabase
          .from('services')
          .select('duration')
          .eq('id', serviceId)
          .single(),
        supabase
          .from('businesses')
          .select('slot_interval, padding_before, padding_after')
          .eq('id', businessId)
          .single(),
      ])

      if (appointmentsRes.error) throw appointmentsRes.error
      if (hoursRes.error) throw hoursRes.error

      return {
        appointments: appointmentsRes.data || [],
        hours: hoursRes.data || [],
        serviceDuration: serviceRes.data?.duration || 30,
        slotInterval: businessRes.data?.slot_interval || 30,
        paddingBefore: businessRes.data?.padding_before || 0,
        paddingAfter: businessRes.data?.padding_after || 0,
      }
    },
    enabled: !!businessId && !!date && !!serviceId,
  })
}
