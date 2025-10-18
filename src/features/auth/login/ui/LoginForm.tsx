'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useAuth } from '@/shared/hooks/useAuth'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      await login(data.email, data.password)
      // Redirigir al dashboard después del login exitoso
      router.push('/tasks')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Error de autenticación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Iniciar sesión
        </h1>
        <p className="text-gray-600">
          Accede a tu cuenta de CleanTask
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido'
            }
          })}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          error={errors.password?.message}
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres'
            }
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  )
}