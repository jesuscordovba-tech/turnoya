import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useBusySlots(businessId?: string, date?: string) {
  return useQuery({
    queryKey: ['busy-slots', businessId, date],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_busy_slots', {
        p_business_id: businessId,
        p_date: date,
      })

      if (error) throw error
      return (data || []).map((a: { start_time: string; end_time: string }) => ({
        start: a.start_time,
        end: a.end_time,
      }))
    },
    enabled: !!businessId && !!date,
  })
}