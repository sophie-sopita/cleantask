import { RegisterUserPayload } from '@/entities/user/model'

export interface RegisterRequest extends RegisterUserPayload {
  confirmPassword: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: string
    name: string
    email: string
    createdAt: string
  }
}

export interface RegisterError {
  error: string
}

/**
 * Registra un nuevo usuario en el sistema
 * @param userData - Datos del usuario a registrar
 * @returns Promise con la respuesta del servidor
 */
export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario')
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
 * Hook personalizado para el registro de usuarios
 */
export function useRegister() {
  const register = async (userData: RegisterRequest) => {
    try {
      const result = await registerUser(userData)
      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: undefined
      }
    }
  }

  return { register }
}