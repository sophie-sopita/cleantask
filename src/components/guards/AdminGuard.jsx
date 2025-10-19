import { useRequireAdmin } from '@/hooks/useAuth'

/**
 * Componente guard que protege rutas de administración
 * Solo permite acceso a usuarios con rol de admin
 */
export default function AdminGuard({ children, fallback = null, redirectTo = '/' }) {
  const { isAdmin, loading } = useRequireAdmin(redirectTo)
  
  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Si no es admin, mostrar fallback o redirigir
  if (!isAdmin) {
    if (fallback) {
      return fallback
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }
  
  // Si es admin, renderizar los children
  return children
}

/**
 * HOC (Higher Order Component) para proteger componentes con AdminGuard
 */
export function withAdminGuard(Component, options = {}) {
  return function AdminProtectedComponent(props) {
    return (
      <AdminGuard {...options}>
        <Component {...props} />
      </AdminGuard>
    )
  }
}