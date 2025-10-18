import { NextRequest, NextResponse } from 'next/server'
import { Task, TaskStatus, TaskPriority } from '@/entities/task/model'

/**
 * Base de datos mock en memoria para tareas
 * En producción, esto sería reemplazado por una base de datos real
 */
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar proyecto Next.js',
    description: 'Instalar y configurar Next.js 15 con TypeScript y Tailwind CSS',
    dueDate: '2024-12-30',
    priority: 'high',
    status: 'done',
    userId: 'user-1'
  },
  {
    id: '2',
    title: 'Implementar autenticación',
    description: 'Configurar NextAuth.js para manejo de sesiones de usuario',
    dueDate: '2024-12-28',
    priority: 'medium',
    status: 'pending',
    userId: 'user-1'
  },
  {
    id: '3',
    title: 'Crear componentes de UI',
    description: 'Desarrollar componentes reutilizables siguiendo el patrón FSD',
    priority: 'low',
    status: 'pending',
    userId: 'user-1'
  }
]

/**
 * Genera un ID único para nuevas tareas
 */
function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Valida los datos de creación de tarea
 */
function validateTaskData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Type guard to ensure data is an object
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

  // Validar prioridad
  const validPriorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]
  if (!taskData.priority || !validPriorities.includes(taskData.priority as typeof TaskPriority[keyof typeof TaskPriority])) {
    errors.push('La prioridad debe ser: low, medium o high')
  }

  // Validar estado (opcional, por defecto será 'pending')
  if (taskData.status) {
    const validStatuses = [TaskStatus.PENDING, TaskStatus.DONE]
    if (!validStatuses.includes(taskData.status as typeof TaskStatus[keyof typeof TaskStatus])) {
      errors.push('El estado debe ser: pending o done')
    }
  }

  // Validar userId
  if (!taskData.userId || typeof taskData.userId !== 'string') {
    errors.push('El ID de usuario es requerido')
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
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user-1' // Mock user ID
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    // Filtrar tareas por usuario
    let userTasks = mockTasks.filter(task => task.userId === userId)

    // Aplicar filtros adicionales si se proporcionan
    if (status) {
      userTasks = userTasks.filter(task => task.status === status)
    }

    if (priority) {
      userTasks = userTasks.filter(task => task.priority === priority)
    }

    // Ordenar tareas por prioridad y estado
    userTasks.sort((a, b) => {
      // Primero por estado (pendientes primero)
      if (a.status !== b.status) {
        return a.status === TaskStatus.PENDING ? -1 : 1
      }

      // Luego por prioridad
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      
      return bPriority - aPriority
    })

    return NextResponse.json({
      success: true,
      data: {
        tasks: userTasks,
        total: userTasks.length,
        filters: { userId, status, priority }
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error al obtener tareas:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al obtener las tareas'
    }, { status: 500 })
  }
}

/**
 * PUT /api/tasks - Actualizar una tarea existente
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar que se proporcione el ID de la tarea
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'ID de tarea es requerido'
      }, { status: 400 })
    }

    // Buscar la tarea existente
    const taskIndex = mockTasks.findIndex(task => task.id === body.id)
    if (taskIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Tarea no encontrada'
      }, { status: 404 })
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

    // Actualizar la tarea
    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      title: body.title,
      description: body.description || '',
      dueDate: body.dueDate || null,
      priority: body.priority,
      status: body.status || mockTasks[taskIndex].status
    }

    mockTasks[taskIndex] = updatedTask

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      data: {
        task: updatedTask,
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
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    
    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'ID de tarea es requerido'
      }, { status: 400 })
    }

    // Buscar la tarea
    const taskIndex = mockTasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Tarea no encontrada'
      }, { status: 404 })
    }

    // Eliminar la tarea
    const deletedTask = mockTasks.splice(taskIndex, 1)[0]

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      data: {
        task: deletedTask,
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

/**
 * POST /api/tasks
 * Crea una nueva tarea
 */
export async function POST(request: NextRequest) {
  try {
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

    // Crear la nueva tarea
    const newTask: Task = {
      id: generateTaskId(),
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
      dueDate: body.dueDate || undefined,
      priority: body.priority,
      status: body.status || TaskStatus.PENDING,
      userId: body.userId
    }

    // Agregar a la base de datos mock
    mockTasks.push(newTask)

    // Simular delay de red (opcional)
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      data: {
        task: newTask,
        message: 'Tarea creada exitosamente'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error al crear tarea:', error)
    
    // Manejar errores de parsing JSON
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