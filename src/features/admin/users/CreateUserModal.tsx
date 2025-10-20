'use client'

import React, { useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'
import { validateEmail } from '@/shared/lib/utils'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'usuario' | 'admin'>('usuario')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!validateEmail(email)) newErrors.email = 'Formato de email inválido'
    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria'
    else if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    else if (!/[A-Z]/.test(password) || !/\d/.test(password)) newErrors.password = 'Incluye una mayúscula y un número'

    setErrors(Object.keys(newErrors).length ? newErrors : null)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || 'Error al crear usuario'
        throw new Error(message)
      }
      onCreated?.()
      onClose()
      setName('')
      setEmail('')
      setPassword('')
      setRole('usuario')
      setErrors(null)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al crear usuario')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear nuevo usuario" size="md">
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
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          {errors?.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres, 1 mayúscula y 1 número.</p>
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
          <Button type="submit" disabled={submitting}>{submitting ? 'Creando…' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateUserModal