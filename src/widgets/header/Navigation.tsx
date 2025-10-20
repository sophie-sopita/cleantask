'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Navegación para usuarios no registrados
  const publicNavItems = [
    { href: '/', label: 'Inicio', icon: '🏠', color: 'from-blue-500 to-purple-600' },
    { href: '/about', label: 'Acerca de', icon: 'ℹ️', color: 'from-green-500 to-teal-600' },
  ]

  // Navegación para usuarios registrados
  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-orange-500 to-red-600' },
    { href: '/tasks', label: 'Tareas', icon: '✅', color: 'from-green-500 to-emerald-600' },
    { href: '/calendar', label: 'Calendario', icon: '📅', color: 'from-purple-500 to-pink-600' },
    { href: '/profile', label: 'Perfil', icon: '👤', color: 'from-cyan-500 to-blue-600' },
  ]

  // Navegación adicional para administradores
  const adminNavItems = [
    { href: '/admin', label: 'Admin Panel', icon: '⚙️', color: 'from-red-500 to-pink-600' },
    { href: '/admin/users', label: 'Usuarios', icon: '👥', color: 'from-indigo-500 to-purple-600' },
  ]

  // Determinar qué elementos mostrar según el rol del usuario
  const getNavItems = () => {
    if (!user) return publicNavItems
    
    const baseItems = userNavItems
    
    // Si es administrador, agregar elementos adicionales
    if (user.role === 'admin') {
      return [...baseItems, ...adminNavItems]
    }
    
    return baseItems
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 shadow-2xl relative overflow-hidden z-50">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <span className="text-4xl relative z-10 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">🧹</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">CleanTask</span>
              <span className="text-xs text-white/80 font-medium">Gestión Inteligente</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 group overflow-hidden ${
                    isActive
                      ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-white/90 hover:text-white hover:bg-white/15 hover:backdrop-blur-sm'
                  }`}
                >
                  {/* Efecto de hover animado */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}></div>
                  
                  <span className="text-xl relative z-10 transform group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="relative z-10 text-sm">{item.label}</span>
                  
                  {/* Indicador activo */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {!user ? (
              <>
                <Link 
                  href="/login" 
                  prefetch={false}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    pathname === '/login' 
                      ? 'bg-white text-purple-600 shadow-lg' 
                      : 'text-white/90 hover:text-white hover:bg-white/15 backdrop-blur-sm'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register" 
                  prefetch={false}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transform ${
                    pathname === '/register' ? 'scale-105 shadow-xl' : ''
                  }`}
                >
                  Registro
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.name}
                    </span>
                    {user.role === 'admin' && (
                      <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium shadow-sm">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 relative z-50"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden fixed top-20 left-0 right-0 bg-gradient-to-b from-purple-600 to-pink-600 shadow-2xl border-t border-white/20 backdrop-blur-lg z-[9999] transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}>
          <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-white/25 text-white shadow-lg'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-base">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/20">
                {!user ? (
                  <div className="space-y-3">
                    <Link 
                      href="/login"
                      prefetch={false}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-white/15 text-white hover:bg-white/25 transition-colors duration-300"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      href="/register"
                      prefetch={false}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Registro
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/15 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-base">{user.name}</div>
                        {user.role === 'admin' && (
                          <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors duration-300 border border-white/20"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </nav>
  )
}