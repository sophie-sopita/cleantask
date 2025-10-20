import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware para verificar token y rol de admin
function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token de autorización requerido', status: 401 }
    }

    const token = authHeader.substring(7)
    const decoded = verify(token, JWT_SECRET) as any

    if (!decoded || !decoded.userId) {
      return { error: 'Token inválido', status: 401 }
    }

    if (decoded.role !== 'admin') {
      return { error: 'Acceso denegado. Se requieren permisos de administrador', status: 403 }
    }

    return { userId: decoded.userId, role: decoded.role }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

/**
 * PATCH /api/admin/users/[id]/role - Actualizar rol de usuario (solo admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminToken(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validar rol
    if (!role || !['usuario', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser "usuario" o "admin"' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Prevenir que el admin cambie su propio rol a usuario
    if (userId === auth.userId && role === 'usuario') {
      return NextResponse.json(
        { error: 'No puedes cambiar tu propio rol de administrador' },
        { status: 403 }
      )
    }

    // Si el rol es el mismo, no hacer nada
    if (existingUser.rol === role) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: existingUser.id_usuario.toString(),
            name: existingUser.nombre,
            email: existingUser.email,
            role: existingUser.rol
          },
          message: `El usuario ya tiene el rol de ${role}`
        }
      })
    }

    // Actualizar rol del usuario
    const updatedUser = await prisma.usuario.update({
      where: { id_usuario: userId },
      data: { rol: role },
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

    // Transformar datos para el frontend
    const transformedUser = {
      id: updatedUser.id_usuario.toString(),
      name: updatedUser.nombre,
      email: updatedUser.email,
      role: updatedUser.rol,
      createdAt: updatedUser.createdAt.toISOString(),
      tasksCount: updatedUser._count.tareas
    }

    return NextResponse.json({
      success: true,
      data: {
        user: transformedUser,
        message: `Rol de ${updatedUser.nombre} actualizado a ${role} exitosamente`
      }
    })

  } catch (error) {
    console.error('Error al actualizar rol:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}