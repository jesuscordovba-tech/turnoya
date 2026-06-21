import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { BookingPage } from '@/features/booking/BookingPage'
import { DashboardHome } from '@/features/dashboard/DashboardHome'
import { AppointmentsPage } from '@/features/dashboard/AppointmentsPage'
import { ServicesPage } from '@/features/services/ServicesPage'
import { SchedulePage } from '@/features/schedule/SchedulePage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/:slug" element={<BookingPage />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px' },
        }}
      />
    </QueryClientProvider>
  )
}
