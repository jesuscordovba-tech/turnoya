import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}
