import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

// Mock database - en producción esto sería una base de datos real
// Para el mock, usamos usuarios predefinidos
const mockUsers = [
  {
    id: '1',
    name: 'Usuario Demo',
    email: 'demo@cleantask.com',
    password: 'DemoPass123', // En producción esto estaría hasheado
    role: 'user' as const
  },
  {
    id: '2',
    name: 'Admin Demo',
    email: 'admin@cleantask.com',
    password: 'AdminPass123', // En producción esto estaría hasheado
    role: 'admin' as const
  }
]

// Secret para JWT - en producción esto vendría de variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body: { email: string; password: string } = await request.json()
    
    // Validación básica
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios' },
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

    // Buscar usuario en mock database
    const user = mockUsers.find(u => u.email === body.email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña (en producción usaríamos bcrypt)
    if (user.password !== body.password) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Respuesta exitosa
    return NextResponse.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}