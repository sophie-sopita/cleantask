import { Metadata } from 'next'
import { ClientCounter, ServerInfo } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Acerca de CleanTask',
  description: 'Conoce más sobre CleanTask y las tecnologías modernas que utiliza.',
}

// Este es un React Server Component por defecto
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:from-purple-50 sm:to-pink-100 md:from-green-50 md:to-teal-100 lg:from-orange-50 lg:to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-4 sm:mb-6 px-2">
            Acerca de CleanTask
          </h1>
          <p className="text-base sm:text-lg text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-6 sm:mb-8 px-2 leading-relaxed">
            CleanTask es una aplicación moderna de gestión de tareas construida con las últimas tecnologías web.
            Este proyecto demuestra el uso de Next.js 15, React Server Components, TypeScript y más.
          </p>
          <p className="text-base sm:text-lg text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-6 sm:mb-8 px-2 leading-relaxed">
            Nuestra misión es hacer que la gestión de tareas sea simple, intuitiva y efectiva. 
            Creemos que las mejores herramientas son aquellas que se adaptan a tu flujo de trabajo, 
            no al revés.
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="px-2 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 sm:mb-4 px-2">🚀 Tecnologías Principales</h2>
              <ul className="space-y-3">
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>Next.js 15:</strong> Framework React con App Router y soporte para React Server Components
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>React 19:</strong> Biblioteca UI con Server Components para renderizado optimizado
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>TypeScript:</strong> Tipado estricto para desarrollo robusto y mantenible
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>Tailwind CSS:</strong> Framework de utilidades CSS para diseño rápido y responsivo
                  </div>
                </li>
              </ul>
            </div>

            <div className="px-2 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 sm:mb-4 px-2">🛠️ Herramientas de Desarrollo</h2>
              <ul className="space-y-3">
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>PNPM:</strong> Gestor de paquetes eficiente y rápido
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>ESLint:</strong> Linter para mantener calidad y consistencia del código
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>Turbopack:</strong> Bundler ultra-rápido para desarrollo
                  </div>
                </li>
                <li className="flex items-start px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 leading-relaxed">
                    <strong>App Router:</strong> Estructura basada en carpetas para rutas
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 sm:from-purple-50 sm:to-pink-50 md:from-green-50 md:to-teal-50 lg:from-orange-50 lg:to-red-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 sm:mb-4 px-2">📁 Metodología del Proyecto</h2>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="px-2">
                <h3 className="font-semibold text-gray-700 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-2 text-sm sm:text-base">Estructura Basada en Carpetas</h3>
                <p className="text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 text-xs sm:text-sm leading-relaxed">
                  El App Router usa la carpeta <code className="bg-gray-200 sm:bg-purple-200 md:bg-green-200 lg:bg-orange-200 px-1 rounded text-xs">app/</code> para definir rutas 
                  mediante carpetas con archivos <code className="bg-gray-200 sm:bg-purple-200 md:bg-green-200 lg:bg-orange-200 px-1 rounded text-xs">page.tsx</code>.
                </p>
              </div>
              <div className="px-2">
                <h3 className="font-semibold text-gray-700 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-2 text-sm sm:text-base">Server Components por Defecto</h3>
                <p className="text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 text-xs sm:text-sm leading-relaxed">
                  Los componentes se renderizan en el servidor automáticamente, optimizando el rendimiento inicial.
                </p>
              </div>
              <div className="px-2">
                <h3 className="font-semibold text-gray-700 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-2 text-sm sm:text-base">TypeScript desde el Inicio</h3>
                <p className="text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 text-xs sm:text-sm leading-relaxed">
                  Tipado estricto para prevenir errores y mejorar la experiencia de desarrollo.
                </p>
              </div>
              <div className="px-2">
                <h3 className="font-semibold text-gray-700 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-2 text-sm sm:text-base">Desarrollo Incremental</h3>
                <p className="text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 text-xs sm:text-sm leading-relaxed">
                  Construcción progresiva con páginas simples, agregando funcionalidad paso a paso.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ServerInfo />
          <ClientCounter />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 sm:mb-4 px-2">
            🔄 Server vs Client Components
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="px-2 sm:px-4">
              <h3 className="font-semibold text-blue-700 sm:text-purple-700 md:text-green-700 lg:text-orange-700 mb-2 text-sm sm:text-base">Server Components</h3>
              <ul className="text-xs sm:text-sm text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 space-y-1 px-2 leading-relaxed">
                <li>• Se ejecutan en el servidor</li>
                <li>• Mejor SEO y rendimiento inicial</li>
                <li>• Acceso directo a bases de datos</li>
                <li>• No pueden usar hooks de React</li>
                <li>• Por defecto en Next.js 13+</li>
              </ul>
            </div>
            <div className="px-2 sm:px-4">
              <h3 className="font-semibold text-yellow-700 sm:text-pink-700 md:text-teal-700 lg:text-red-700 mb-2 text-sm sm:text-base">Client Components</h3>
              <ul className="text-xs sm:text-sm text-gray-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600 space-y-1 px-2 leading-relaxed">
                <li>• Se ejecutan en el navegador</li>
                <li>• Permiten interactividad</li>
                <li>• Pueden usar hooks y estado</li>
                <li>• Requieren directiva &apos;use client&apos;</li>
                <li>• Ideales para UI interactiva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}