import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    // Buscar usuario en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { email: body.email },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        contraseña: true,
        rol: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(body.password, user.contraseña)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar JWT token
    const token = sign(
      { 
        userId: user.id_usuario,
        email: user.email,
        role: user.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Respuesta exitosa
    return NextResponse.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id_usuario,
        name: user.nombre,
        email: user.email,
        role: user.rol
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