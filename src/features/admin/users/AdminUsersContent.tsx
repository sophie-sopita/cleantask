'use client'

import React, { useEffect, useMemo, useState } from 'react'
import UsersTable from './UsersTable'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { CreateUserModal } from './CreateUserModal'
import { EditUserModal, AdminUser as AdminUserType } from './EditUserModal'
import { ConfirmDeleteUserModal } from './ConfirmDeleteUserModal'
import { debounce } from '@/shared/lib'
import { useAuth } from '@/shared/hooks/useAuth'

export default function AdminUsersContent() {
  const { token } = useAuth()
  const [showCreate, setShowCreate] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUserType | null>(null)
  const [deletingUser, setDeletingUser] = useState<AdminUserType | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'' | 'usuario' | 'admin'>('')
  const [page, setPage] = useState(1)
const [limit] = useState(10)

  const [total, setTotal] = useState<number>(0)
  const [adminsCount, setAdminsCount] = useState<number>(0)
  const [usuariosCount, setUsuariosCount] = useState<number>(0)

  const debouncedSearch = useMemo(() => debounce((val: string) => setQuery(val), 400), [])

  useEffect(() => {
    setPage(1)
    debouncedSearch(searchTerm.trim())
  }, [searchTerm, role])

  useEffect(() => {
    if (!token) return
    const fetchCounts = async () => {
      try {
        const commonHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
        const baseUrl = '/api/admin/users'
        const resTotal = await fetch(`${baseUrl}?limit=1&page=1`, { headers: commonHeaders })
        const jsonTotal = await resTotal.json().catch(() => null)
        setTotal(jsonTotal?.data?.pagination?.total ?? 0)

        const resAdmins = await fetch(`${baseUrl}?role=admin&limit=1&page=1`, { headers: commonHeaders })
        const jsonAdmins = await resAdmins.json().catch(() => null)
        setAdminsCount(jsonAdmins?.data?.pagination?.total ?? 0)

        const resUsuarios = await fetch(`${baseUrl}?role=usuario&limit=1&page=1`, { headers: commonHeaders })
        const jsonUsuarios = await resUsuarios.json().catch(() => null)
        setUsuariosCount(jsonUsuarios?.data?.pagination?.total ?? 0)
      } catch {
        // Silenciar errores en conteos para no bloquear la UI
      }
    }
    fetchCounts()
  }, [token, refreshKey])

  const onChangePage = (dir: 'prev' | 'next') => {
    setPage((p) => Math.max(1, dir === 'prev' ? p - 1 : p + 1))
  }

  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="mt-2 text-gray-600">Administra los usuarios registrados en el sistema</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>+ Nuevo Usuario</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm">⚙️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-2xl font-semibold text-gray-900">{adminsCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{usuariosCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm">🔎</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Coincidencias</p>
              <p className="text-2xl font-semibold text-gray-900">—</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={role}
                onChange={(e) => setRole((e.target.value || '') as '' | 'usuario' | 'admin')}
              >
                <option value="">Todos los roles</option>
                <option value="usuario">Usuarios</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar nombre o email…"
              />
              <Button variant="secondary" onClick={() => refresh()}>Actualizar</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <UsersTable
            search={query}
            role={role}
            page={page}
            limit={limit}
            refreshKey={refreshKey}
            onEditRequest={(u) => setEditingUser(u)}
            onDeleteRequest={(u) => setDeletingUser(u)}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">Página <span className="font-medium">{page}</span></p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => onChangePage('prev')}
              >
                Anterior
              </button>
              <button
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => onChangePage('next')}
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          refresh()
        }}
      />
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={() => {
          refresh()
        }}
      />
      <ConfirmDeleteUserModal
        isOpen={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onDeleted={() => {
          refresh()
        }}
      />
    </div>
  )
}