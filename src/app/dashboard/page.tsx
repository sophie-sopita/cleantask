import Overview from '@/widgets/dashboard/Overview'
import Chart from '@/widgets/dashboard/Chart'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏠 Dashboard
          </h1>
          <p className="text-gray-600">
            Visualiza el progreso de tus tareas y obtén insights sobre tu productividad.
          </p>
        </div>

        <div className="space-y-8">
          {/* Widget Overview con KPIs */}
          <Overview />
          
          {/* Gráficas con Recharts */}
          <Chart />
        </div>
      </div>
    </div>
  )
}