import { useState, useEffect, useContext, createContext } from 'react'

// Contexto de autenticación
const AuthContext = createContext()

// Provider de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    hasRole,
    getAuthHeaders
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
}

// Hook para proteger componentes que requieren autenticación
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      window.location.href = redirectTo
    }
  }, [isAuthenticated, loading, redirectTo])
  
  return { isAuthenticated: isAuthenticated(), loading }
}

// Hook para proteger componentes que requieren rol de admin
export function useRequireAdmin(redirectTo = '/') {
  const { isAdmin, loading, isAuthenticated } = useAuth()
  
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        window.location.href = '/login'
      } else if (!isAdmin()) {
        window.location.href = redirectTo
      }
    }
  }, [isAdmin, loading, isAuthenticated, redirectTo])
  
  return { isAdmin: isAdmin(), loading }
}

// Hook para hacer peticiones autenticadas
export function useAuthenticatedFetch() {
  const { getAuthHeaders, logout } = useAuth()
  
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    // Si el token es inválido, hacer logout automático
    if (response.status === 401) {
      logout()
      window.location.href = '/login'
      return null
    }
    
    return response
  }
  
  return authenticatedFetch
}