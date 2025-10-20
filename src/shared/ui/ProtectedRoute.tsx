'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { Loader } from './Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // Si requiere un rol específico y el usuario no lo tiene
      if (requiredRole && user?.role !== requiredRole) {
        // Redirigir a una página de acceso denegado o dashboard
        router.push('/tasks')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, redirectTo])

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (se está redirigiendo)
  if (!isAuthenticated) {
    return null
  }

  // Si requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => router.push('/tasks')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el contenido protegido
  return <>{children}</>
}