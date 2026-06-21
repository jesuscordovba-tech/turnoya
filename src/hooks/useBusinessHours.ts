import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { BusinessHour } from '@/types/schedule'
import toast from 'react-hot-toast'

export function useBusinessHours(businessId?: string) {
  return useQuery({
    queryKey: ['business-hours', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businessId)
        .order('day_of_week')

      if (error) throw error
      return data as BusinessHour[]
    },
    enabled: !!businessId,
  })
}

export function useUpsertBusinessHours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (hours: Omit<BusinessHour, 'id' | 'created_at'>[]) => {
      const { error } = await supabase.from('business_hours').upsert(hours, {
        onConflict: 'business_id,day_of_week',
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-hours'] })
      toast.success('Horarios guardados')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar horarios')
    },
  })
}
