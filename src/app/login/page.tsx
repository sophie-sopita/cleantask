import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login/ui/LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Acceso al sistema CleanTask',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 sm:from-blue-50 sm:via-indigo-50 sm:to-purple-50 md:from-green-50 md:via-emerald-50 md:to-teal-50 lg:from-orange-50 lg:via-red-50 lg:to-pink-50 relative overflow-hidden">
      {/* Efectos de fondo animados responsivos */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/30 to-orange-100/30 sm:from-blue-100/30 sm:via-indigo-100/30 sm:to-purple-100/30 md:from-green-100/30 md:via-emerald-100/30 md:to-teal-100/30 lg:from-orange-100/30 lg:via-red-100/30 lg:to-pink-100/30"></div>
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 sm:from-blue-400/20 sm:to-indigo-400/20 md:from-green-400/20 md:to-emerald-400/20 lg:from-orange-400/20 lg:to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-orange-400/20 to-red-400/20 sm:from-purple-400/20 sm:to-pink-400/20 md:from-teal-400/20 md:to-cyan-400/20 lg:from-pink-400/20 lg:to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-pink-400/10 to-purple-400/10 sm:from-indigo-400/10 sm:to-blue-400/10 md:from-emerald-400/10 md:to-green-400/10 lg:from-red-400/10 lg:to-orange-400/10 rounded-full blur-2xl animate-bounce"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
        <div className="w-full max-w-md">
          {/* Header con logo responsivo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 sm:from-blue-500 sm:via-indigo-500 sm:to-purple-500 md:from-green-500 md:via-emerald-500 md:to-teal-500 lg:from-orange-500 lg:via-red-500 lg:to-pink-500 rounded-2xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl sm:text-3xl">🧹</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 sm:from-blue-600 sm:via-indigo-600 sm:to-purple-600 md:from-green-600 md:via-emerald-600 md:to-teal-600 lg:from-orange-600 lg:via-red-600 lg:to-pink-600 bg-clip-text text-transparent mb-2">
              CleanTask
            </h1>
            <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 font-medium text-sm sm:text-base px-2">
              Gestión Inteligente de Tareas
            </p>
          </div>

          {/* Formulario de login responsivo */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Efectos decorativos responsivos en el formulario */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 sm:from-blue-500 sm:via-indigo-500 sm:to-purple-500 md:from-green-500 md:via-emerald-500 md:to-teal-500 lg:from-orange-500 lg:via-red-500 lg:to-pink-500"></div>
            <div className="absolute -top-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400/20 to-orange-400/20 sm:from-indigo-400/20 sm:to-blue-400/20 md:from-emerald-400/20 md:to-green-400/20 lg:from-red-400/20 lg:to-orange-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 sm:from-blue-400/20 sm:to-indigo-400/20 md:from-green-400/20 md:to-emerald-400/20 lg:from-orange-400/20 lg:to-red-400/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 sm:text-blue-900 md:text-green-900 lg:text-orange-900 mb-2">
                  Bienvenido de vuelta
                </h2>
                <p className="text-gray-600 sm:text-blue-600 md:text-green-600 lg:text-orange-600 text-sm sm:text-base px-2">
                  Inicia sesión para continuar con tus tareas
                </p>
              </div>
              
              <LoginForm />
            </div>
          </div>

          {/* Footer responsivo */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 sm:text-blue-500 md:text-green-500 lg:text-orange-500 px-2">
              © 2024 CleanTask. Diseñado con ❤️ para la productividad
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}