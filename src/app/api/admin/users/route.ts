import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
interface JwtPayload { userId: number; role: string }

// Middleware para verificar token y rol de admin
function verifyAdminToken(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    const decoded = verify(token, JWT_SECRET) as JwtPayload

    if (!decoded || decoded.role !== 'admin') {
      return { error: 'Acceso denegado. Se requieren permisos de administrador', status: 403 }
    }

    return { userId: decoded.userId, role: decoded.role }
  } catch {
    return { error: 'Token inválido', status: 401 }
  }
}

/**
 * GET /api/admin/users - Obtener todos los usuarios (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminToken(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    // Construir filtros
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.rol = role
    }

    // Obtener usuarios con paginación
    const [users, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          rol: true,
          createdAt: true,
          _count: {
            select: { tareas: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.usuario.count({ where })
    ])

    // Transformar datos para el frontend
    const transformedUsers = users.map(user => ({
      id: user.id_usuario.toString(),
      name: user.nombre,
      email: user.email,
      role: user.rol,
      createdAt: user.createdAt.toISOString(),
      tasksCount: user._count.tareas
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users - Crear nuevo usuario (solo admin)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminToken(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { name, email, password, role = 'usuario' } = body

    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (!['usuario', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser "usuario" o "admin"' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 409 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear nuevo usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre: name,
        email,
        contraseña: hashedPassword,
        rol: role
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    })

    // Transformar datos para el frontend
    const transformedUser = {
      id: newUser.id_usuario.toString(),
      name: newUser.nombre,
      email: newUser.email,
      role: newUser.rol,
      createdAt: newUser.createdAt.toISOString(),
      tasksCount: 0
    }

    return NextResponse.json({
      success: true,
      data: {
        user: transformedUser,
        message: 'Usuario creado exitosamente'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}