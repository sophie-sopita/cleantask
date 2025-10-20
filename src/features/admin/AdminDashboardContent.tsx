'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/shared/hooks/useAuth'
import { Loader } from '@/shared/ui/Loader'

interface AdminStats {
  users: {
    total: number
    admins: number
    regular: number
    newThisMonth: number
    newThisWeek: number
  }
  tasks: {
    total: number
    completed: number
    pending: number
    inProgress: number
    overdue: number
    completionRate: number
  }
}

export default function AdminDashboardContent() {
  const { token } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.success) {
          const message = (data && (data.error || data.message)) || `Error HTTP ${res.status}`
          throw new Error(message)
        }
        setStats(data.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar estadísticas')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [token])

  if (!token) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Debes iniciar sesión como administrador.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {/* Stats Cards */}
      {error ? (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded mb-6">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.users.total ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tareas Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.tasks.completed ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tareas Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.tasks.pending ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Productividad</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.tasks.completionRate ?? '—'}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link href="/admin/users" prefetch={false} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                    <p className="text-sm text-gray-500">Ver, editar y eliminar usuarios</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/tasks" prefetch={false} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Revisar Tareas</p>
                    <p className="text-sm text-gray-500">Monitorear todas las tareas del sistema</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/settings" prefetch={false} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚙️</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Configuración</p>
                    <p className="text-sm text-gray-500">Ajustes del sistema y aplicación</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/reports" prefetch={false} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Reportes</p>
                    <p className="text-sm text-gray-500">Generar reportes de actividad</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-500">Próximamente…</div>
          </div>
        </div>
      </div>
    </>
  )
}