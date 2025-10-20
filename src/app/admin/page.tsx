import { Metadata } from 'next'
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute'
import AdminDashboardContent from '@/features/admin/AdminDashboardContent'

export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Panel de control para administradores de CleanTask',
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-2 text-gray-600">Gestiona usuarios, tareas y configuraciones del sistema</p>
          </div>
          <AdminDashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}