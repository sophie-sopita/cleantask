import { NextRequest, NextResponse } from 'next/server'
import { RegisterUserPayload } from '@/entities/user/model'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
    const existingUser = await prisma.usuario.findUnique({
      where: { email: body.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 409 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Crear nuevo usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre: body.name,
        email: body.email,
        contraseña: hashedPassword,
        rol: 'usuario' // Por defecto es usuario estándar
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: newUser
    }, { status: 201 })

  } catch (error) {
    console.error('Error en /api/register:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para obtener usuarios registrados (solo para desarrollo/admin)
export async function GET() {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
        _count: {
          select: { tareas: true }
        }
      }
    })

    return NextResponse.json({
      users,
      total: users.length
    })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}