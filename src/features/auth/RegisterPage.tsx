import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'
import { APP_NAME } from '@/lib/constants'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-gray-500">Registra tu negocio</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <RegisterForm onSuccess={() => navigate('/auth/login')} />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
