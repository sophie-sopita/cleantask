import { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/register/ui/RegisterForm'

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crear cuenta en CleanTask',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 sm:from-blue-50 sm:via-indigo-50 sm:to-purple-50 md:from-green-50 md:via-emerald-50 md:to-teal-50 lg:from-orange-50 lg:via-red-50 lg:to-pink-50 relative overflow-hidden">
      {/* Efectos de fondo animados responsivos */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/30 to-orange-100/30 sm:from-blue-100/30 sm:via-indigo-100/30 sm:to-purple-100/30 md:from-green-100/30 md:via-emerald-100/30 md:to-teal-100/30 lg:from-orange-100/30 lg:via-red-100/30 lg:to-pink-100/30"></div>
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 sm:from-blue-400/20 sm:to-indigo-400/20 md:from-green-400/20 md:to-emerald-400/20 lg:from-orange-400/20 lg:to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-orange-400/20 to-red-400/20 sm:from-purple-400/20 sm:to-pink-400/20 md:from-teal-400/20 md:to-cyan-400/20 lg:from-pink-400/20 lg:to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-pink-300/10 to-orange-300/10 sm:from-indigo-300/10 sm:to-blue-300/10 md:from-emerald-300/10 md:to-green-300/10 lg:from-red-300/10 lg:to-orange-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
        <div className="w-full max-w-md">
          {/* Header con logo responsivo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-pink-500 sm:from-blue-500 sm:to-indigo-500 md:from-green-500 md:to-emerald-500 lg:from-orange-500 lg:to-red-500 rounded-2xl shadow-lg mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 sm:from-blue-600 sm:to-indigo-600 md:from-green-600 md:to-emerald-600 lg:from-orange-600 lg:to-red-600 bg-clip-text text-transparent mb-2">
              CleanTask
            </h1>
            <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 text-sm sm:text-base md:text-lg px-2">
              Únete a la plataforma de gestión de tareas más eficiente
            </p>
          </div>

          {/* Formulario de registro */}
          <div className="bg-white/80 sm:bg-blue-50/80 md:bg-green-50/80 lg:bg-orange-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 md:p-10">
            <RegisterForm />
          </div>

          {/* Footer responsivo */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 sm:text-blue-500 md:text-green-500 lg:text-orange-500 px-2">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 sm:from-blue-600 sm:to-indigo-600 md:from-green-600 md:to-emerald-600 lg:from-orange-600 lg:to-red-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 sm:hover:from-blue-700 sm:hover:to-indigo-700 md:hover:from-green-700 md:hover:to-emerald-700 lg:hover:from-orange-700 lg:hover:to-red-700 transition-all duration-300">
                términos y condiciones
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}