import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Service } from '@/types/service'

export function useServices(businessId?: string) {
  return useQuery({
    queryKey: ['services', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      return data as Service[]
    },
    enabled: !!businessId,
  })
}

export function useAllServices(businessId?: string) {
  return useQuery({
    queryKey: ['services-all', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('sort_order')

      if (error) throw error
      return data as Service[]
    },
    enabled: !!businessId,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('services').insert(service).select().single()
      if (error) throw error
      return data as Service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Service> & { id: string }) => {
      const { error } = await supabase.from('services').update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
