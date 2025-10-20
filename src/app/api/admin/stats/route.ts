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
      return { error: 'No autorizado', status: 403 }
    }
    return { userId: decoded.userId }
  } catch {
    return { error: 'Token inválido', status: 401 }
  }
}

/**
 * GET /api/admin/stats - Obtener estadísticas del sistema (solo admin)
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

    // Obtener fechas para filtros temporales
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

    // Estadísticas generales de usuarios
    const [
      totalUsers,
      adminUsers,
      newUsersThisMonth,
      newUsersThisWeek
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: { rol: 'admin' } }),
      prisma.usuario.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.usuario.count({ where: { createdAt: { gte: startOfWeek } } })
    ])

    // Estadísticas generales de tareas
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      newTasksThisMonth,
      newTasksThisWeek
    ] = await Promise.all([
      prisma.tarea.count(),
      prisma.tarea.count({ where: { estado: 'completada' } }),
      prisma.tarea.count({ where: { estado: 'pendiente' } }),
      prisma.tarea.count({ where: { estado: 'en_progreso' } }),
      prisma.tarea.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.tarea.count({ where: { createdAt: { gte: startOfWeek } } })
    ])

    // Estadísticas por estado (ya que no hay campo prioridad en el schema)
    const tasksByStatus = await prisma.tarea.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      }
    })

    const statusStats = tasksByStatus.reduce((acc, item) => {
      acc[item.estado] = item._count.estado || 0
      return acc
    }, {} as Record<string, number>)

    // Usuarios más activos (con más tareas)
    const topUsers = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        _count: {
          select: { tareas: true }
        }
      },
      orderBy: {
        tareas: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Tareas creadas por día en los últimos 7 días
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const tasksPerDay = await Promise.all(
      last7Days.map(async (date) => {
        const startOfDay = new Date(date + 'T00:00:00.000Z')
        const endOfDay = new Date(date + 'T23:59:59.999Z')
        
        const count = await prisma.tarea.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
        
        return { date, count }
      })
    )

    // Usuarios registrados por día en los últimos 7 días
    const usersPerDay = await Promise.all(
      last7Days.map(async (date) => {
        const startOfDay = new Date(date + 'T00:00:00.000Z')
        const endOfDay = new Date(date + 'T23:59:59.999Z')
        
        const count = await prisma.usuario.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
        
        return { date, count }
      })
    )

    // Tareas vencidas
    const overdueTasks = await prisma.tarea.count({
      where: {
        fecha_limite: {
          lt: new Date()
        },
        estado: {
          not: 'completada'
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: totalUsers - adminUsers,
          newThisMonth: newUsersThisMonth,
          newThisWeek: newUsersThisWeek,
          topUsers: topUsers.map(user => ({
            id: user.id_usuario.toString(),
            name: user.nombre,
            email: user.email,
            role: user.rol,
            tasksCount: user._count.tareas
          }))
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          overdue: overdueTasks,
          newThisMonth: newTasksThisMonth,
          newThisWeek: newTasksThisWeek,
          byPriority: statusStats,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        },
        charts: {
          tasksPerDay,
          usersPerDay
        },
        summary: {
          activeUsers: totalUsers - adminUsers,
          taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          averageTasksPerUser: totalUsers > 0 ? Math.round(totalTasks / totalUsers) : 0
        }
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}