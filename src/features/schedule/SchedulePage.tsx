import { WeeklyScheduleEditor } from './WeeklyScheduleEditor'

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Horarios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configura los días y horas en que tu negocio está abierto.
        </p>
      </div>
      <WeeklyScheduleEditor />
    </div>
  )
}
