import Link from 'next/link'

// Este es un React Server Component por defecto
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:from-purple-50 sm:to-pink-100 md:from-green-50 md:to-teal-100 lg:from-orange-50 lg:to-red-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex justify-center mb-6 sm:mb-8">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">🧹</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-4 sm:mb-6 px-4">
            Bienvenido a <span className="text-blue-600 sm:text-purple-600 md:text-green-600 lg:text-orange-600">CleanTask</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 max-w-2xl mx-auto mb-8 sm:mb-12 px-4 leading-relaxed">
            Una aplicación moderna de gestión de tareas construida con las últimas tecnologías web.
            Organiza tu trabajo de manera eficiente y mantén todo bajo control.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">⚡</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-2 px-2">
              Rápido y Moderno
            </h3>
            <p className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 px-2 leading-relaxed">
              Construido con Next.js 15, React Server Components y Turbopack para máximo rendimiento.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🔧</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-2 px-2">
              TypeScript Nativo
            </h3>
            <p className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 px-2 leading-relaxed">
              Desarrollo robusto con tipado estricto y mejor experiencia de desarrollo.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🎨</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-2 px-2">
              Diseño Responsivo
            </h3>
            <p className="text-sm sm:text-base text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700 px-2 leading-relaxed">
              Interfaz moderna con Tailwind CSS que se adapta a cualquier dispositivo.
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:text-purple-900 md:text-green-900 lg:text-orange-900 mb-4 sm:mb-6 text-center px-4">
            Tecnologías Implementadas
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="px-2 sm:px-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 px-2">Frontend</h3>
              <ul className="space-y-2 text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700">
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">Next.js 15 con App Router</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">React 19 con Server Components</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">TypeScript para tipado estricto</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-blue-500 sm:bg-purple-500 md:bg-green-500 lg:bg-orange-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">Tailwind CSS para estilos</span>
                </li>
              </ul>
            </div>
            <div className="px-2 sm:px-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 sm:text-purple-800 md:text-green-800 lg:text-orange-800 mb-3 px-2">Herramientas</h3>
              <ul className="space-y-2 text-gray-600 sm:text-purple-700 md:text-green-700 lg:text-orange-700">
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">PNPM como gestor de paquetes</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">ESLint para calidad de código</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">Turbopack para builds rápidos</span>
                </li>
                <li className="flex items-center px-2">
                  <span className="w-2 h-2 bg-green-500 sm:bg-pink-500 md:bg-teal-500 lg:bg-red-500 rounded-full mr-3"></span>
                  <span className="text-sm sm:text-base">Estructura basada en carpetas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
