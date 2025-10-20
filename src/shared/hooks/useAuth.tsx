'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    // Verificar que estamos en el cliente antes de acceder a localStorage
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        setTokenState(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const setToken = (newToken: string) => {
    setTokenState(newToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      let data: any = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        const message = (data && typeof data.error === 'string' && data.error) || (response.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión')
        throw new Error(message)
      }

      const { token: authToken, user: authUser } = data

      setToken(authToken)
      setUser(authUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(authUser))
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error instanceof Error ? error : new Error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setTokenState(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    setToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    // Fallback seguro: evitar crash si el hook se usa fuera del Provider
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useAuth usado fuera de AuthProvider; devolviendo valores por defecto.')
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      logout: () => {},
      setToken: () => {},
    }
  }
  
  return context
}

export default useAuth