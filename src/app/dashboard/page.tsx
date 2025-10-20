"use client"

import Overview from '@/widgets/dashboard/Overview'
import Chart from '@/widgets/dashboard/Chart'
import { useAuth } from '@/shared/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 sm:from-orange-50 sm:via-red-50 sm:to-pink-50 md:from-purple-50 md:via-indigo-50 md:to-blue-50 lg:from-green-50 lg:via-teal-50 lg:to-cyan-50 relative overflow-hidden">
      {/* Efectos de fondo animados responsive */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 sm:from-orange-100/20 sm:via-red-100/20 sm:to-pink-100/20 md:from-purple-100/20 md:via-indigo-100/20 md:to-blue-100/20 lg:from-green-100/20 lg:via-teal-100/20 lg:to-cyan-100/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 sm:from-orange-400/10 sm:to-red-400/10 md:from-purple-400/10 md:to-indigo-400/10 lg:from-green-400/10 lg:to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 sm:from-red-400/10 sm:to-pink-400/10 md:from-indigo-400/10 md:to-blue-400/10 lg:from-teal-400/10 lg:to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Tarjeta de bienvenida mejorada con colores responsive */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Efectos decorativos responsive */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sm:from-orange-500 sm:via-red-500 sm:to-pink-500 md:from-purple-500 md:via-indigo-500 md:to-blue-500 lg:from-green-500 lg:via-teal-500 lg:to-cyan-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 sm:from-orange-400/20 sm:to-red-400/20 md:from-purple-400/20 md:to-indigo-400/20 lg:from-green-400/20 lg:to-teal-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 sm:from-red-400/20 sm:to-pink-400/20 md:from-indigo-400/20 md:to-blue-400/20 lg:from-teal-400/20 lg:to-cyan-400/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Avatar con gradiente responsive */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 sm:from-orange-500 sm:via-red-500 sm:to-pink-500 md:from-purple-500 md:via-indigo-500 md:to-blue-500 lg:from-green-500 lg:via-teal-500 lg:to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 sm:from-orange-600 sm:via-red-600 sm:to-pink-600 md:from-purple-600 md:via-indigo-600 md:to-blue-600 lg:from-green-600 lg:via-teal-600 lg:to-cyan-600 bg-clip-text text-transparent">
                    ¡Hola, {user?.name || 'Usuario'}!
                  </h2>
                  <p className="text-gray-600 font-medium mt-1">
                    Revisa tus métricas de hoy y mantente productivo
                  </p>
                </div>
              </div>
              

            </div>
          </div>

          <div className="space-y-8">
            {/* Sección de estadísticas con colores responsive */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sm:from-orange-500 sm:via-red-500 sm:to-pink-500 md:from-purple-500 md:via-indigo-500 md:to-blue-500 lg:from-green-500 lg:via-teal-500 lg:to-cyan-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 sm:from-orange-500 sm:to-red-500 md:from-purple-500 md:to-indigo-500 lg:from-green-500 lg:to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 sm:from-orange-600 sm:to-red-600 md:from-purple-600 md:to-indigo-600 lg:from-green-600 lg:to-teal-600 bg-clip-text text-transparent">
                    Estadísticas Generales
                  </h3>
                </div>
                <Overview />
              </div>
            </div>

            {/* Gráficas con colores responsive */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sm:from-orange-500 sm:via-red-500 sm:to-pink-500 md:from-purple-500 md:via-indigo-500 md:to-blue-500 lg:from-green-500 lg:via-teal-500 lg:to-cyan-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 sm:from-orange-500 sm:to-red-500 md:from-purple-500 md:to-indigo-500 lg:from-green-500 lg:to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 sm:from-orange-600 sm:to-red-600 md:from-purple-600 md:to-indigo-600 lg:from-green-600 lg:to-teal-600 bg-clip-text text-transparent">
                    Análisis y Tendencias
                  </h3>
                </div>
                <Chart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}