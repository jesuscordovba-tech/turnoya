import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Business } from '@/types/business'

export function useBusiness(slug?: string) {
  return useQuery({
    queryKey: ['business', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data as Business
    },
    enabled: !!slug,
  })
}

export function useMyBusiness() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['my-business', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user!.id)
        .single()

      if (error) throw error
      return data as Business
    },
    enabled: !!user?.id,
  })
}
