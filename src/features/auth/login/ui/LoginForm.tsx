'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!validateForm()) {
      return
    }

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Credenciales inválidas'
      setSubmitError(message)
      console.error('Error en login:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:text-blue-900 md:text-green-900 lg:text-orange-900 mb-2">
          Iniciar sesión
        </h1>
        <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 text-sm sm:text-base px-2">
          Accede a tu cuenta de CleanTask
        </p>
        {submitError && (
          <div role="alert" className="mt-4 px-4 py-3 rounded-xl border bg-red-50 text-red-700 text-sm font-medium shadow-sm">
            {submitError}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-purple-500 sm:focus:border-blue-500 md:focus:border-green-500 lg:focus:border-orange-500 focus:ring-4 focus:ring-purple-200/50 sm:focus:ring-blue-200/50 md:focus:ring-green-200/50 lg:focus:ring-orange-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 sm:text-blue-700 md:text-green-700 lg:text-orange-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 sm:text-blue-400 md:text-green-400 lg:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 sm:bg-blue-50/90 md:bg-green-50/90 lg:bg-orange-50/90 backdrop-blur-sm border-2 border-gray-300 sm:border-blue-300 md:border-green-300 lg:border-orange-300 focus:border-pink-500 sm:focus:border-indigo-500 md:focus:border-emerald-500 lg:focus:border-red-500 focus:ring-4 focus:ring-pink-200/50 sm:focus:ring-indigo-200/50 md:focus:ring-emerald-200/50 lg:focus:ring-red-200/50 rounded-xl transition-all duration-300 text-gray-900 text-sm sm:text-base font-medium placeholder:text-gray-500 shadow-sm hover:shadow-md ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-200/50 bg-red-50/90' : ''}`}
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center px-1">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>
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
                <span className="text-sm sm:text-base">Iniciando sesión...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm sm:text-base">Iniciar sesión</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      {submitError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700">Error de inicio de sesión</h3>
            </div>
            <p className="mt-3 text-sm text-red-600">{submitError}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSubmitError(null)} className="px-4 py-2">Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 px-2">
          ¿No tienes cuenta?{' '}
          <a 
            href="/register" 
            className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 sm:from-blue-600 sm:to-indigo-600 md:from-green-600 md:to-emerald-600 lg:from-orange-600 lg:to-red-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 sm:hover:from-blue-700 sm:hover:to-indigo-700 md:hover:from-green-700 md:hover:to-emerald-700 lg:hover:from-orange-700 lg:hover:to-red-700 transition-all duration-300"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  )
}