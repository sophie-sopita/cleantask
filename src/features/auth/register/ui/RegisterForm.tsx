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
        // Redirigir al dashboard después del registro exitoso
        router.push('/dashboard')
      } else {
        setApiError(result.error || 'Error desconocido')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setApiError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:text-blue-900 md:text-green-900 lg:text-orange-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 text-sm sm:text-base px-2">
          Únete a CleanTask y organiza tus tareas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
            {apiError}
          </div>
        )}
        
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Tu nombre completo"
              className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-purple-500 sm:focus:border-blue-500 md:focus:border-green-500 lg:focus:border-orange-500 focus:ring-4 focus:ring-purple-200/50 sm:focus:ring-blue-200/50 md:focus:ring-green-200/50 lg:focus:ring-orange-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <Input
              type="email"
              placeholder="tu@email.com"
              className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-pink-500 sm:focus:border-indigo-500 md:focus:border-emerald-500 lg:focus:border-red-500 focus:ring-4 focus:ring-pink-200/50 sm:focus:ring-indigo-200/50 md:focus:ring-emerald-200/50 lg:focus:ring-red-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <Input
              type="password"
              placeholder="Mínimo 8 caracteres"
              className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-orange-500 sm:focus:border-purple-500 md:focus:border-teal-500 lg:focus:border-yellow-500 focus:ring-4 focus:ring-orange-200/50 sm:focus:ring-purple-200/50 md:focus:ring-teal-200/50 lg:focus:ring-yellow-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
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
          </div>
          {errors.password && (
            <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
          <p className="mt-1 text-xs sm:text-sm text-gray-500 sm:text-blue-500 md:text-green-500 lg:text-orange-500 px-1">
            Debe contener al menos una mayúscula, una minúscula y un número
          </p>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Input
              type="password"
              placeholder="Repite tu contraseña"
              className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-red-500 sm:focus:border-cyan-500 md:focus:border-lime-500 lg:focus:border-rose-500 focus:ring-4 focus:ring-red-200/50 sm:focus:ring-cyan-200/50 md:focus:ring-lime-200/50 lg:focus:ring-rose-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: value =>
                  value === password || 'Las contraseñas no coinciden'
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-3 sm:pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 sm:from-blue-600 sm:via-indigo-600 sm:to-purple-600 md:from-green-600 md:via-emerald-600 md:to-teal-600 lg:from-orange-600 lg:via-red-600 lg:to-pink-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 sm:hover:from-blue-700 sm:hover:via-indigo-700 sm:hover:to-purple-700 md:hover:from-green-700 md:hover:via-emerald-700 md:hover:to-teal-700 lg:hover:from-orange-700 lg:hover:via-red-700 lg:hover:to-pink-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">Creando cuenta...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-sm sm:text-base">Crear cuenta</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 px-2">
          ¿Ya tienes cuenta?{' '}
          <a 
            href="/login" 
            className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 sm:from-blue-600 sm:to-indigo-600 md:from-green-600 md:to-emerald-600 lg:from-orange-600 lg:to-red-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 sm:hover:from-blue-700 sm:hover:to-indigo-700 md:hover:from-green-700 md:hover:to-emerald-700 lg:hover:from-orange-700 lg:hover:to-red-700 transition-all duration-300"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}