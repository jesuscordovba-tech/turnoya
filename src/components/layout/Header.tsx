import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { useNavigate, NavLink } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { to: '/dashboard', label: 'Inicio' },
  { to: '/dashboard/appointments', label: 'Citas' },
  { to: '/dashboard/services', label: 'Servicios' },
  { to: '/dashboard/schedule', label: 'Horarios' },
  { to: '/dashboard/settings', label: 'Configuración' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="rounded-lg p-1 text-gray-600 hover:text-gray-900 lg:hidden cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-bold text-primary-700 lg:hidden">TurnoYa</h1>
      </div>

      {mobileNavOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-gray-200 bg-white shadow-lg lg:hidden">
          <nav className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

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
