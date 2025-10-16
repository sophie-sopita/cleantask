'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/tasks', label: 'Tareas', icon: '✅' },
    { href: '/about', label: 'Acerca de', icon: 'ℹ️' },
  ]

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧹</span>
            <span className="text-xl font-bold text-gray-800">CleanTask</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <Link 
              href="/register" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/register' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Registro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}