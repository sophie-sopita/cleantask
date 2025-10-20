'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { useAuth } from '@/shared/hooks/useAuth'

export default function ProfilePage() {
  const { user, token, isAuthenticated, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mi Perfil</h1>
            <p className="text-gray-600">Debes iniciar sesión para acceder a tu perfil.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    setError(null)

    if (!token) {
      setError('No autorizado. Inicia sesión nuevamente.')
      return
    }

    if (!name.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    try {
      setSaving(true)
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), password: password.trim() || undefined }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'No se pudo actualizar el perfil')
      }

      const data = await res.json()
      const updatedUser = data?.user

      if (updatedUser) {
        // Actualizamos localStorage y recargamos para que AuthProvider tome los cambios
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        }
      }

      setFeedback('Perfil actualizado correctamente')

      // Limpiamos contraseña del formulario por seguridad
      setPassword('')

      // Forzar refresco del contexto para reflejar el nombre actualizado
      if (typeof window !== 'undefined') {
        setTimeout(() => window.location.reload(), 500)
      }
    } catch (err: any) {
      setError(err?.message || 'Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {feedback && (
              <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 text-green-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feedback}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="profile-name"
                    type="text"
                    label="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    disabled={saving || isLoading}
                    required
                  />
                </div>

                <div>
                  <Input
                    id="profile-email"
                    type="email"
                    label="Correo electrónico"
                    value={email}
                    onChange={() => {}}
                    placeholder="Tu email"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">El email no se puede modificar</p>
                </div>
              </div>

              <div className="max-w-md">
                <Input
                  id="profile-password"
                  type="password"
                  label="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Deja en blanco para mantener la actual"
                  disabled={saving || isLoading}
                />
                <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres. Opcional.</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Los cambios se aplicarán inmediatamente
                </div>
                <Button type="submit" variant="primary" disabled={saving || isLoading}>
                  {saving ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </div>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}