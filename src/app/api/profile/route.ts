import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Usamos el mismo secreto que en el login
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface JwtPayload {
  userId: number | string
  email: string
  role: string
}

function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

function verifyToken(request: NextRequest): { userId: number } | null {
  try {
    const token = getTokenFromHeader(request)
    if (!token) return null
    const decoded = verify(token, JWT_SECRET) as JwtPayload
    const userId = typeof decoded.userId === 'number' ? decoded.userId : parseInt(String(decoded.userId), 10)
    if (!userId || Number.isNaN(userId)) return null
    return { userId }
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: auth.userId },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id_usuario,
      name: user.nombre,
      email: user.email,
      role: user.rol,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error('Error en GET /api/profile:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: { name?: string; password?: string } = await request.json()
    const updates: { nombre?: string; contraseña?: string } = {}

    // Validar y aplicar nombre
    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (name.length < 2) {
        return NextResponse.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
      }
      if (name.length > 100) {
        return NextResponse.json({ error: 'El nombre no puede exceder 100 caracteres' }, { status: 400 })
      }
      updates.nombre = name
    }

    // Validar y aplicar contraseña
    if (typeof body.password === 'string' && body.password.trim().length > 0) {
      const password = body.password.trim()
      if (password.length < 6) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
      }
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)
      updates.contraseña = hashed
    }

    if (!updates.nombre && !updates.contraseña) {
      return NextResponse.json({ error: 'No hay cambios para actualizar' }, { status: 400 })
    }

    const updated = await prisma.usuario.update({
      where: { id_usuario: auth.userId },
      data: updates,
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Perfil actualizado',
      user: {
        id: updated.id_usuario,
        name: updated.nombre,
        email: updated.email,
        role: updated.rol,
      },
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error('Error en PATCH /api/profile:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}