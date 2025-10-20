import { NextRequest, NextResponse } from 'next/server'
import { TaskStatus } from '@/entities/task/model'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
interface JwtPayload { userId: number | string; role: string }

/**
 * Extrae y verifica el token JWT del header Authorization
 */
function verifyToken(request: NextRequest): { userId: number; role: string } | null {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
      return null
    }
    const token = authHeader.slice(7)
    const decoded = verify(token, JWT_SECRET) as JwtPayload
    const userId = typeof decoded.userId === 'number' ? decoded.userId : parseInt(String(decoded.userId), 10)
    if (!userId || Number.isNaN(userId)) return null
    return { userId, role: decoded.role }
  } catch {
    return null
  }
}

/**
 * Valida los datos de creación de tarea
 */
function validateTaskData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    errors.push('Los datos deben ser un objeto válido')
    return { isValid: false, errors }
  }

  const taskData = data as Record<string, unknown>

  // Validar título
  if (!taskData.title || typeof taskData.title !== 'string') {
    errors.push('El título es requerido y debe ser una cadena de texto')
  } else if (taskData.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres')
  } else if (taskData.title.trim().length > 100) {
    errors.push('El título no puede exceder 100 caracteres')
  }

  // Validar descripción (opcional)
  if (taskData.description && typeof taskData.description !== 'string') {
    errors.push('La descripción debe ser una cadena de texto')
  } else if (taskData.description && typeof taskData.description === 'string' && taskData.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres')
  }

  // Validar fecha de vencimiento (opcional)
  if (taskData.dueDate) {
    if (typeof taskData.dueDate !== 'string') {
      errors.push('La fecha de vencimiento debe ser una cadena de texto')
    } else {
      const date = new Date(taskData.dueDate)
      if (isNaN(date.getTime())) {
        errors.push('La fecha de vencimiento debe ser una fecha válida')
      }
    }
  }

  // Note: Priority validation removed as 'prioridad' field doesn't exist in schema

  // Validar estado (opcional, por defecto será 'pending')
  if (taskData.status) {
    const validStatuses = [TaskStatus.PENDING, TaskStatus.DONE]
    if (!validStatuses.includes(taskData.status as typeof TaskStatus[keyof typeof TaskStatus])) {
      errors.push('El estado debe ser: pending o done')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * GET /api/tasks
 * Obtiene todas las tareas del usuario actual
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Construir filtros para Prisma
    const where: Record<string, unknown> = {
      id_usuario: auth.userId
    }

    if (status) {
      where.estado = status
    }

    // Note: priority filtering removed as 'prioridad' field doesn't exist in schema
    // if (priority) {
    //   where.prioridad = priority
    // }

    // Obtener tareas de la base de datos
    const tasks = await prisma.tarea.findMany({
      where,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: [
        { estado: 'asc' }, // pendientes primero
        { createdAt: 'desc' } // más recientes primero
      ]
    })

    // Transformar datos para el frontend
    const transformedTasks = tasks.map(task => ({
      id: task.id_tarea.toString(),
      title: task.titulo,
      description: task.descripcion || '',
      dueDate: task.fecha_limite?.toISOString().split('T')[0] || null,
      status: task.estado,
      userId: task.id_usuario.toString(),
      createdAt: task.createdAt.toISOString(),
      user: {
        id: task.usuario.id_usuario.toString(),
        name: task.usuario.nombre,
        email: task.usuario.email
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        tasks: transformedTasks,
        total: transformedTasks.length,
        filters: {
          status,
          userId: auth.userId.toString()
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
 * POST /api/tasks
 * Crea una nueva tarea
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }

    // Parsear el cuerpo de la petición
    const body = await request.json()

    // Validar los datos
    const validation = validateTaskData(body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Datos de tarea inválidos',
        details: validation.errors
      }, { status: 400 })
    }

    // Crear la nueva tarea en la base de datos
    const newTask = await prisma.tarea.create({
      data: {
        titulo: body.title.trim(),
        descripcion: body.description?.trim() || null,
        fecha_limite: body.dueDate ? new Date(body.dueDate) : null,
        estado: body.status || 'pending',
        id_usuario: auth.userId
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            email: true
          }
        }
      }
    })

    // Transformar datos para el frontend
    const transformedTask = {
      id: newTask.id_tarea.toString(),
      title: newTask.titulo,
      description: newTask.descripcion || '',
      dueDate: newTask.fecha_limite?.toISOString().split('T')[0] || null,
      status: newTask.estado,
      userId: newTask.id_usuario.toString(),
      createdAt: newTask.createdAt.toISOString(),
      user: {
        id: newTask.usuario.id_usuario.toString(),
        name: newTask.usuario.nombre,
        email: newTask.usuario.email
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        task: transformedTask,
        message: 'Tarea creada exitosamente'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error al crear tarea:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        error: 'Formato de datos inválido. Se esperaba JSON válido.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al crear la tarea'
    }, { status: 500 })
  }
}

/**
 * PUT /api/tasks - Actualizar una tarea existente
 */
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar que se proporcione el ID de la tarea
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'ID de tarea es requerido'
      }, { status: 400 })
    }

    // Validar los datos de actualización
    const validation = validateTaskData(body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Datos de tarea inválidos',
        details: validation.errors
      }, { status: 400 })
    }

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await prisma.tarea.findFirst({
      where: {
        id_tarea: parseInt(body.id),
        id_usuario: auth.userId
      }
    })

    if (!existingTask) {
      return NextResponse.json({
        success: false,
        error: 'Tarea no encontrada o no tienes permisos para modificarla'
      }, { status: 404 })
    }

    // Actualizar la tarea
    const updatedTask = await prisma.tarea.update({
      where: {
        id_tarea: parseInt(body.id)
      },
      data: {
        titulo: body.title.trim(),
        descripcion: body.description?.trim() || null,
        fecha_limite: body.dueDate ? new Date(body.dueDate) : null,
        estado: body.status || existingTask.estado
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            email: true
          }
        }
      }
    })

    // Transformar datos para el frontend
    const transformedTask = {
      id: updatedTask.id_tarea.toString(),
      title: updatedTask.titulo,
      description: updatedTask.descripcion || '',
      dueDate: updatedTask.fecha_limite?.toISOString().split('T')[0] || null,
      status: updatedTask.estado,
      userId: updatedTask.id_usuario.toString(),
      createdAt: updatedTask.createdAt.toISOString(),
      user: {
        id: updatedTask.usuario.id_usuario.toString(),
        name: updatedTask.usuario.nombre,
        email: updatedTask.usuario.email
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        task: transformedTask,
        message: 'Tarea actualizada exitosamente'
      }
    })

  } catch (error) {
    console.error('Error al actualizar tarea:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        error: 'Formato de datos inválido. Se esperaba JSON válido.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al actualizar la tarea'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/tasks - Eliminar una tarea
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = verifyToken(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    
    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'ID de tarea es requerido'
      }, { status: 400 })
    }

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await prisma.tarea.findFirst({
      where: {
        id_tarea: parseInt(taskId),
        id_usuario: auth.userId
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            email: true
          }
        }
      }
    })

    if (!existingTask) {
      return NextResponse.json({
        success: false,
        error: 'Tarea no encontrada o no tienes permisos para eliminarla'
      }, { status: 404 })
    }

    // Eliminar la tarea
    await prisma.tarea.delete({
      where: {
        id_tarea: parseInt(taskId)
      }
    })

    // Transformar datos para el frontend
    const transformedTask = {
      id: existingTask.id_tarea.toString(),
      title: existingTask.titulo,
      description: existingTask.descripcion || '',
      dueDate: existingTask.fecha_limite?.toISOString().split('T')[0] || null,
      status: existingTask.estado,
      userId: existingTask.id_usuario.toString(),
      createdAt: existingTask.createdAt.toISOString(),
      user: {
        id: existingTask.usuario.id_usuario.toString(),
        name: existingTask.usuario.nombre,
        email: existingTask.usuario.email
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        task: transformedTask,
        message: 'Tarea eliminada exitosamente'
      }
    })

  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al eliminar la tarea'
    }, { status: 500 })
  }
}