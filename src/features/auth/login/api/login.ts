export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  }
}

export interface LoginError {
  error: string
}

/**
 * Autentica un usuario en el sistema
 * @param credentials - Credenciales del usuario (email y password)
 * @returns Promise con la respuesta del servidor
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Error de conexión al servidor')
  }
}

/**
 * Hook personalizado para el login de usuarios
 */
export function useLogin() {
  const login = async (credentials: LoginRequest) => {
    try {
      const result = await loginUser(credentials)
      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: undefined
      }
    }
  }

  return { login }
}