import { NextRequest, NextResponse } from 'next/server'
import { RegisterUserPayload } from '@/entities/user/model'

// Mock database - en producción esto sería una base de datos real
const users: Array<{ id: string; name: string; email: string; password: string; createdAt: string }> = []

export async function POST(request: NextRequest) {
  try {
    const body: RegisterUserPayload & { confirmPassword: string } = await request.json()
    
    // Validación básica
    if (!body.name || !body.email || !body.password || !body.confirmPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar contraseña
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(body.password)) {
      return NextResponse.json(
        { error: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' },
        { status: 400 }
      )
    }

    // Validar confirmación de contraseña
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === body.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 409 }
      )
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      password: body.password, // En producción esto debería estar hasheado
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))

    // Respuesta exitosa (sin incluir la contraseña)
    const { password, ...userResponse } = newUser
    
    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Error en /api/register:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para obtener usuarios registrados (solo para desarrollo)
export async function GET() {
  return NextResponse.json({
    users: users.map(({ password, ...user }) => user),
    total: users.length
  })
}