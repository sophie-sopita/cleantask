import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
 * GET /api/admin/users/[id] - Obtener usuario específico (solo admin)
 */
export async function GET(
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

    // Obtener usuario con sus tareas
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
        tareas: {
          select: {
            id_tarea: true,
            titulo: true,
            estado: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Últimas 10 tareas
        },
        _count: {
          select: { tareas: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Transformar datos para el frontend
    const transformedUser = {
      id: user.id_usuario.toString(),
      name: user.nombre,
      email: user.email,
      role: user.rol,
      createdAt: user.createdAt.toISOString(),
      tasksCount: user._count.tareas,
      recentTasks: user.tareas.map((task: any) => ({
        id: task.id_tarea.toString(),
        title: task.titulo,
        status: task.estado,
        createdAt: task.createdAt.toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      data: { user: transformedUser }
    })

  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id] - Actualizar usuario (solo admin)
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
    const { name, email, password, role } = body

    // Verificar que el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id_usuario: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Validar rol si se proporciona
    if (role && !['usuario', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser "usuario" o "admin"' },
        { status: 400 }
      )
    }

    // Prevenir que el admin se quite sus propios permisos
    if (userId === auth.userId && role === 'usuario') {
      return NextResponse.json(
        { error: 'No puedes cambiar tu propio rol de administrador' },
        { status: 403 }
      )
    }

    // Verificar email único si se está actualizando
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.usuario.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Ya existe un usuario con este email' },
          { status: 409 }
        )
      }
    }

    // Preparar datos de actualización
    const updateData: any = {}
    
    if (name) updateData.nombre = name
    if (email) updateData.email = email
    if (role) updateData.rol = role
    
    // Hash de nueva contraseña si se proporciona
    if (password) {
      updateData.contraseña = await bcrypt.hash(password, 12)
    }

    // Actualizar usuario
    const updatedUser = await prisma.usuario.update({
      where: { id_usuario: userId },
      data: updateData,
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
        message: 'Usuario actualizado exitosamente'
      }
    })

  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id] - Eliminar usuario (solo admin)
 */
export async function DELETE(
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

    // Prevenir que el admin se elimine a sí mismo
    if (userId === auth.userId) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta de administrador' },
        { status: 403 }
      )
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        _count: {
          select: { tareas: true }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar usuario (las tareas se eliminarán en cascada según el schema)
    await prisma.usuario.delete({
      where: { id_usuario: userId }
    })

    // Transformar datos para el frontend
    const transformedUser = {
      id: existingUser.id_usuario.toString(),
      name: existingUser.nombre,
      email: existingUser.email,
      role: existingUser.rol,
      tasksCount: existingUser._count.tareas
    }

    return NextResponse.json({
      success: true,
      data: {
        user: transformedUser,
        message: `Usuario ${existingUser.nombre} eliminado exitosamente`
      }
    })

  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}