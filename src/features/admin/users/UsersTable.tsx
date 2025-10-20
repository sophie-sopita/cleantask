'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'usuario' | 'admin'
  createdAt?: string
  tasksCount?: number
}

interface ApiListResponse {
  success: boolean
  data?: {
    users: AdminUser[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
}

interface ApiRoleResponse {
  success: boolean
  data?: {
    user: AdminUser
    message?: string
  }
  error?: string
}

export interface UsersTableProps {
  search?: string
  role?: 'usuario' | 'admin' | ''
  page?: number
  limit?: number
  refreshKey?: number
  onEditRequest?: (user: AdminUser) => void
  onDeleteRequest?: (user: AdminUser) => void
}

export default function UsersTable({ search = '', role = '', page = 1, limit = 10, refreshKey = 0, onEditRequest, onDeleteRequest }: UsersTableProps) {
  const { token } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (role) params.set('role', role)
        if (page) params.set('page', String(page))
        if (limit) params.set('limit', String(limit))
        const url = `/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
        const json: ApiListResponse = await res.json()
        if (!json.success || !json.data) throw new Error(json.error || 'Error al obtener usuarios')
        setUsers(json.data.users || [])
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error desconocido'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [token, search, role, page, limit, refreshKey])

  const updateUserRole = async (userId: string, newRole: 'admin' | 'usuario') => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
      const json: ApiRoleResponse = await res.json()
      if (!json.success || !json.data) throw new Error(json.error || 'Error al actualizar rol')
      const updated = json.data.user
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setError(msg)
    }
  }

  if (!token) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Debes iniciar sesión para ver usuarios de administración.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded mb-4">{error}</div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tareas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>Cargando usuarios...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>No hay usuarios</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user.name?.charAt(0) ?? '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.tasksCount ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value === 'admin' ? 'admin' : 'usuario')}
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => onEditRequest?.(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteRequest?.(user)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}