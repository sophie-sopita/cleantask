'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useRegister } from '../api/register'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'user' // Default role for registration
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()
  const { register: registerUser } = useRegister()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      // Add default role for registration
      const registrationData = {
        ...data,
        role: 'user' as const
      }
      
      const result = await registerUser(registrationData)
      
      if (result.success) {
        // Mostrar mensaje de éxito
        alert(`¡Cuenta creada exitosamente! Bienvenido ${result.data?.user?.name || 'Usuario'}`)
        // Redirigir al login
        router.push('/login')
      } else {
        setApiError(result.error || 'Error desconocido')
      }
    } catch (error) {
      setApiError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600">
          Únete a CleanTask y organiza tus tareas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {apiError}
          </div>
        )}
        
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre completo"
          error={errors.name?.message}
          {...register('name', {
            required: 'El nombre es obligatorio',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres'
            }
          })}
        />

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
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          helperText="Debe contener al menos una mayúscula, una minúscula y un número"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres'
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            }
          })}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirma tu contraseña',
            validate: value =>
              value === password || 'Las contraseñas no coinciden'
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          Crear cuenta
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}