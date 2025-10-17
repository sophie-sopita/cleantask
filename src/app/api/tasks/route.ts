import { NextRequest, NextResponse } from 'next/server'
import { CreateTaskPayload, Task, TaskStatus, TaskPriority } from '@/entities/task/model'

/**
 * Base de datos mock en memoria para tareas
 * En producción, esto sería reemplazado por una base de datos real
 */
let mockTasks: Task[] = [
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
function validateTaskData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validar título
  if (!data.title || typeof data.title !== 'string') {
    errors.push('El título es requerido y debe ser una cadena de texto')
  } else if (data.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres')
  } else if (data.title.trim().length > 100) {
    errors.push('El título no puede exceder 100 caracteres')
  }

  // Validar descripción (opcional)
  if (data.description && typeof data.description !== 'string') {
    errors.push('La descripción debe ser una cadena de texto')
  } else if (data.description && data.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres')
  }

  // Validar fecha de vencimiento (opcional)
  if (data.dueDate) {
    if (typeof data.dueDate !== 'string') {
      errors.push('La fecha de vencimiento debe ser una cadena de texto')
    } else {
      const date = new Date(data.dueDate)
      if (isNaN(date.getTime())) {
        errors.push('La fecha de vencimiento debe ser una fecha válida')
      }
    }
  }

  // Validar prioridad
  const validPriorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.push('La prioridad debe ser: low, medium o high')
  }

  // Validar estado (opcional, por defecto será 'pending')
  if (data.status) {
    const validStatuses = [TaskStatus.PENDING, TaskStatus.DONE]
    if (!validStatuses.includes(data.status)) {
      errors.push('El estado debe ser: pending o done')
    }
  }

  // Validar userId
  if (!data.userId || typeof data.userId !== 'string') {
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

/**
 * Función auxiliar para obtener todas las tareas (para testing)
 */
export function getAllMockTasks(): Task[] {
  return [...mockTasks]
}

/**
 * Función auxiliar para limpiar las tareas mock (para testing)
 */
export function clearMockTasks(): void {
  mockTasks = []
}