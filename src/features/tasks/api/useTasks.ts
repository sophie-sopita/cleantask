import { useState, useEffect, useCallback } from 'react'
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus, TaskPriority } from '@/entities/task/model'

/**
 * Tipos para el hook useTasks
 */
export interface UseTasksOptions {
  userId?: string
  status?: typeof TaskStatus[keyof typeof TaskStatus]
  priority?: typeof TaskPriority[keyof typeof TaskPriority]
  autoFetch?: boolean
}

export interface UseTasksReturn {
  // Estado
  tasks: Task[]
  loading: boolean
  error: string | null
  
  // Estadísticas
  totalTasks: number
  pendingTasks: number
  completedTasks: number
  
  // Acciones CRUD
  fetchTasks: () => Promise<void>
  createTask: (taskData: CreateTaskPayload) => Promise<Task | null>
  updateTask: (taskId: string, taskData: UpdateTaskPayload) => Promise<Task | null>
  deleteTask: (taskId: string) => Promise<boolean>
  refreshTasks: () => Promise<void>
  
  // Utilidades
  clearError: () => void
  getTaskById: (id: string) => Task | undefined
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string[]
}

export interface TasksApiResponse {
  tasks: Task[]
  total: number
  filters: {
    userId?: string
    status?: string
    priority?: string
  }
}

export interface CreateTaskApiResponse {
  task: Task
  message: string
}

/**
 * Hook personalizado para gestión de tareas con operaciones CRUD
 * 
 * @param options - Opciones de configuración del hook
 * @returns Objeto con estado y funciones para gestionar tareas
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const {
    userId = 'user-1', // Mock user ID por defecto
    status,
    priority,
    autoFetch = true
  } = options

  // Estado del hook
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Construye la URL de la API con parámetros de consulta
   */
  const buildApiUrl = useCallback((baseUrl: string, params: Record<string, string | undefined>) => {
    const url = new URL(baseUrl, window.location.origin)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value)
      }
    })
    
    return url.toString()
  }, [])

  /**
   * Maneja errores de la API de forma consistente
   */
  const handleApiError = useCallback((error: unknown, defaultMessage: string) => {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      setError(error.message)
    } else if (typeof error === 'string') {
      setError(error)
    } else {
      setError(defaultMessage)
    }
  }, [])

  /**
   * Obtiene las tareas desde la API
   */
  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const apiUrl = buildApiUrl('/api/tasks', {
        userId,
        status,
        priority
      })

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const result: ApiResponse<TasksApiResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido al obtener las tareas')
      }

      if (result.data) {
        setTasks(result.data.tasks)
      } else {
        setTasks([])
      }

    } catch (error) {
      handleApiError(error, 'Error al cargar las tareas')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [userId, status, priority, buildApiUrl, handleApiError])

  /**
   * Crea una nueva tarea
   */
  const createTask = useCallback(async (taskData: CreateTaskPayload): Promise<Task | null> => {
    try {
      setLoading(true)
      setError(null)

      // Validación básica en el cliente
      if (!taskData.title?.trim()) {
        throw new Error('El título de la tarea es requerido')
      }

      if (!taskData.priority) {
        throw new Error('La prioridad de la tarea es requerida')
      }

      // Preparar datos para envío
      const payload = {
        ...taskData,
        userId,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || undefined
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const result: ApiResponse<CreateTaskApiResponse> = await response.json()

      if (!result.success) {
        const errorMessage = result.error || 'Error desconocido al crear la tarea'
        const details = result.details ? `\n${result.details.join('\n')}` : ''
        throw new Error(`${errorMessage}${details}`)
      }

      if (result.data) {
        // Actualizar la lista de tareas localmente
        setTasks(prevTasks => [result.data!.task, ...prevTasks])
        return result.data.task
      }

      return null

    } catch (error) {
      handleApiError(error, 'Error al crear la tarea')
      return null
    } finally {
      setLoading(false)
    }
  }, [userId, handleApiError])

  /**
   * Refresca las tareas (alias de fetchTasks para mayor claridad)
   */
  const refreshTasks = useCallback(async (): Promise<void> => {
    await fetchTasks()
  }, [fetchTasks])

  /**
   * Limpia el error actual
   */
  const clearError = useCallback((): void => {
    setError(null)
  }, [])

  /**
   * Obtiene una tarea por su ID
   */
  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find(task => task.id === id)
  }, [tasks])

  /**
   * Actualiza una tarea existente
   */
  const updateTask = useCallback(async (taskId: string, taskData: UpdateTaskPayload): Promise<Task | null> => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        id: taskId, // Include the task ID in the request body
        ...taskData,
        title: taskData.title?.trim(),
        description: taskData.description?.trim() || undefined
      }

      const response = await fetch(`/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: ApiResponse<{ task: Task }> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar la tarea')
      }

      // Actualizar la tarea en el estado local
      if (result.data?.task) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? result.data!.task : task
          )
        )
      }

      return result.data?.task || null

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Elimina una tarea
   */
  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: ApiResponse<{ task: Task }> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar la tarea')
      }

      // Remover la tarea del estado local
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      return true

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Estadísticas calculadas
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length

  // Efecto para cargar tareas automáticamente
  useEffect(() => {
    if (autoFetch) {
      fetchTasks()
    }
  }, [fetchTasks, autoFetch])

  return {
    // Estado
    tasks,
    loading,
    error,
    
    // Estadísticas
    totalTasks,
    pendingTasks,
    completedTasks,
    
    // Acciones CRUD
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    
    // Utilidades
    clearError,
    getTaskById,
  }
}

/**
 * Hook simplificado para crear tareas sin gestión de estado completo
 */
export function useCreateTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTask = useCallback(async (taskData: CreateTaskPayload): Promise<Task | null> => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        ...taskData,
        userId: 'user-1', // Mock user ID
        title: taskData.title.trim(),
        description: taskData.description?.trim() || undefined
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: ApiResponse<CreateTaskApiResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al crear la tarea')
      }

      return result.data?.task || null

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    createTask,
    loading,
    error,
    clearError
  }
}