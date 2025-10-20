import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

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
 * GET /api/admin/tasks - Obtener todas las tareas del sistema (solo admin)
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const userId = searchParams.get('userId')
    const search = searchParams.get('search') || ''

    // Construir filtros
    const where: Record<string, unknown> = {}
    
    if (status) {
      where.estado = status
    }

    if (priority) {
      // Como no hay campo prioridad en el schema, podemos filtrar por estado
      // o comentar esta línea si no se necesita
      // where.prioridad = priority
    }

    if (userId) {
      where.id_usuario = parseInt(userId)
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener tareas con paginación
    const [tasks, total] = await Promise.all([
      prisma.tarea.findMany({
        where,
        include: {
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
              email: true,
              rol: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { estado: 'asc' }, // pendientes primero
          { createdAt: 'desc' } // más recientes primero
        ]
      }),
      prisma.tarea.count({ where })
    ])

    // Transformar datos para el frontend
    const transformedTasks = tasks.map(task => ({
      id: task.id_tarea.toString(),
      title: task.titulo,
      description: task.descripcion || '',
      dueDate: task.fecha_limite?.toISOString().split('T')[0] || null,
      status: task.estado,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      user: {
        id: task.usuario.id_usuario.toString(),
        name: task.usuario.nombre,
        email: task.usuario.email,
        role: task.usuario.rol
      }
    }))

    // Obtener estadísticas adicionales
    const stats = await prisma.tarea.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      }
    })

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat.estado] = stat._count.estado || 0
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: {
        tasks: transformedTasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total,
          byStatus: statusStats
        }
      }
    })

  } catch (error) {
    console.error('Error al obtener tareas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/tasks - Eliminar múltiples tareas (solo admin)
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAdminToken(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { taskIds } = body

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de IDs de tareas' },
        { status: 400 }
      )
    }

    // Convertir IDs a números
    const numericIds = taskIds.map(id => parseInt(id)).filter(id => !isNaN(id))

    if (numericIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de tareas inválidos' },
        { status: 400 }
      )
    }

    // Obtener tareas antes de eliminar para el log
    const tasksToDelete = await prisma.tarea.findMany({
      where: {
        id_tarea: { in: numericIds }
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        }
      }
    })

    // Eliminar tareas
    const deleteResult = await prisma.tarea.deleteMany({
      where: {
        id_tarea: { in: numericIds }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: deleteResult.count,
        deletedTasks: tasksToDelete.map(task => ({
          id: task.id_tarea.toString(),
          title: task.titulo,
          user: task.usuario.nombre
        })),
        message: `${deleteResult.count} tarea(s) eliminada(s) exitosamente`
      }
    })

  } catch (error) {
    console.error('Error al eliminar tareas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}