import { Metadata } from 'next'
import { ClientCounter, ServerInfo } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Acerca de CleanTask',
  description: 'Conoce más sobre CleanTask y las tecnologías modernas que utiliza.',
}

// Este es un React Server Component por defecto
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Acerca de CleanTask
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            CleanTask es una aplicación moderna de gestión de tareas construida con las últimas tecnologías web.
            Este proyecto demuestra el uso de Next.js 15, React Server Components, TypeScript y más.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Nuestra misión es hacer que la gestión de tareas sea simple, intuitiva y efectiva. 
            Creemos que las mejores herramientas son aquellas que se adaptan a tu flujo de trabajo, 
            no al revés.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Tecnologías Principales</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Next.js 15:</strong> Framework React con App Router y soporte para React Server Components
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>React 19:</strong> Biblioteca UI con Server Components para renderizado optimizado
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>TypeScript:</strong> Tipado estricto para desarrollo robusto y mantenible
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Tailwind CSS:</strong> Framework de utilidades CSS para diseño rápido y responsivo
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛠️ Herramientas de Desarrollo</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>PNPM:</strong> Gestor de paquetes eficiente y rápido
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>ESLint:</strong> Linter para mantener calidad y consistencia del código
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Turbopack:</strong> Bundler ultra-rápido para desarrollo
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>App Router:</strong> Estructura basada en carpetas para rutas
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📁 Metodología del Proyecto</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Estructura Basada en Carpetas</h3>
                <p className="text-gray-600 text-sm">
                  El App Router usa la carpeta <code className="bg-gray-200 px-1 rounded">app/</code> para definir rutas 
                  mediante carpetas con archivos <code className="bg-gray-200 px-1 rounded">page.tsx</code>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Server Components por Defecto</h3>
                <p className="text-gray-600 text-sm">
                  Los componentes se renderizan en el servidor automáticamente, optimizando el rendimiento inicial.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">TypeScript desde el Inicio</h3>
                <p className="text-gray-600 text-sm">
                  Tipado estricto para prevenir errores y mejorar la experiencia de desarrollo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Desarrollo Incremental</h3>
                <p className="text-gray-600 text-sm">
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

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔄 Server vs Client Components
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Server Components</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Se ejecutan en el servidor</li>
                <li>• Mejor SEO y rendimiento inicial</li>
                <li>• Acceso directo a bases de datos</li>
                <li>• No pueden usar hooks de React</li>
                <li>• Por defecto en Next.js 13+</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-700 mb-2">Client Components</h3>
              <ul className="text-sm text-gray-600 space-y-1">
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