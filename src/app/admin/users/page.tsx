import { Metadata } from 'next'
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute'
import AdminUsersContent from '@/features/admin/users/AdminUsersContent'

export const metadata: Metadata = {
  title: 'Gestión de Usuarios - Admin',
  description: 'Gestión de usuarios del sistema CleanTask',
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminUsersContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}