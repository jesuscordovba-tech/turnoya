import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Sesión cerrada')
      navigate('/auth/login')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <h1 className="text-lg font-bold text-primary-700">TurnoYa</h1>
      </div>
      <div className="flex-1" />
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
