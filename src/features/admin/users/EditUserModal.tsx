'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'
import { validateEmail } from '@/shared/lib/utils'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'usuario' | 'admin'
}

interface EditUserModalProps {
  isOpen: boolean
  user: AdminUser | null
  onClose: () => void
  onUpdated?: () => void
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onUpdated }) => {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'usuario' | 'admin'>('usuario')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'usuario')
      setPassword('')
      setErrors(null)
      setSubmitError(null)
    }
  }, [user])

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!validateEmail(email)) newErrors.email = 'Formato de email inválido'
    if (password && password.length > 0) {
      if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      else if (!/[A-Z]/.test(password) || !/\d/.test(password)) newErrors.password = 'Incluye una mayúscula y un número'
    }
    setErrors(Object.keys(newErrors).length ? newErrors : null)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate() || !user) return
    setSubmitting(true)
    try {
      const payload: any = { name: name.trim(), email: email.trim(), role }
      if (password) payload.password = password
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || 'Error al actualizar usuario'
        throw new Error(message)
      }
      onUpdated?.()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al actualizar usuario')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar usuario`} size="md">
      {submitError && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{submitError}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" />
          {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@dominio.com" />
          {errors?.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nueva contraseña (opcional)</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          {errors?.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          <p className="mt-1 text-xs text-gray-500">Si se ingresa, debe cumplir requisitos mínimos.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value as 'usuario' | 'admin')}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Guardando…' : 'Guardar cambios'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditUserModal