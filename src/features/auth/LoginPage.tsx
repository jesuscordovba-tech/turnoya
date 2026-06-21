import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { APP_NAME } from '@/lib/constants'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión en tu negocio</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <LoginForm onSuccess={() => navigate('/dashboard')} />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
