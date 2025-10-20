'use client'

import React, { useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'usuario' | 'admin'
}

interface ConfirmDeleteUserModalProps {
  isOpen: boolean
  user: AdminUser | null
  onClose: () => void
  onDeleted?: () => void
}

export const ConfirmDeleteUserModal: React.FC<ConfirmDeleteUserModalProps> = ({ isOpen, user, onClose, onDeleted }) => {
  const { token } = useAuth()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!user) return
    setError(null)
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || 'Error al eliminar usuario'
        throw new Error(message)
      }
      onDeleted?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar usuario" size="sm">
      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
      )}
      <p className="text-sm text-gray-700">¿Seguro que deseas eliminar a <span className="font-medium">{user?.name}</span>? Esta acción no se puede deshacer.</p>
      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="secondary" onClick={onClose} disabled={deleting}>Cancelar</Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Eliminando…' : 'Eliminar'}</Button>
      </div>
    </Modal>
  )
}

export default ConfirmDeleteUserModal