import { useState, useEffect, useCallback, useRef } from 'react'
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus, TaskPriority } from '@/entities/task/model'
import { useAuth } from '@/shared/hooks/useAuth'

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
    userId: providedUserId,
    status,
    priority,
    autoFetch = true
  } = options

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { token, user } = useAuth()
  const userId = providedUserId || user?.id

  // BroadcastChannel para sincronización en tiempo real entre pestañas
  const channelRef = useRef<BroadcastChannel | null>(null)

  const buildApiUrl = useCallback((baseUrl: string, params: Record<string, string | undefined>) => {
    const url = new URL(baseUrl, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, value)
    })
    return url.toString()
  }, [])

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

  const fetchTasks = useCallback(async (): Promise<void> => {
    // No llamar a la API hasta que haya autenticación lista
    if (!userId || !token) {
      return
    }
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
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const result: ApiResponse<TasksApiResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido al obtener las tareas')
      }

      setTasks(result.data ? result.data.tasks : [])

    } catch (error) {
      handleApiError(error, 'Error al cargar las tareas')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [userId, status, priority, buildApiUrl, handleApiError, token])

  const createTask = useCallback(async (taskData: CreateTaskPayload): Promise<Task | null> => {
    try {
      setLoading(true)
      setError(null)

      if (!taskData.title?.trim()) {
        throw new Error('El título de la tarea es requerido')
      }

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
          ...(token && { 'Authorization': `Bearer ${token}` }),
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
        setTasks(prevTasks => [result.data!.task, ...prevTasks])
        // Notificar a otras pestañas
        channelRef.current?.postMessage({ type: 'TASKS_CHANGED', userId })
        return result.data.task
      }

      return null

    } catch (error) {
      handleApiError(error, 'Error al crear la tarea')
      return null
    } finally {
      setLoading(false)
    }
  }, [userId, handleApiError, token])

  const refreshTasks = useCallback(async (): Promise<void> => {
    await fetchTasks()
  }, [fetchTasks])

  const clearError = useCallback((): void => {
    setError(null)
  }, [])

  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find(task => task.id === id)
  }, [tasks])

  const updateTask = useCallback(async (taskId: string, taskData: UpdateTaskPayload): Promise<Task | null> => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        id: taskId,
        ...taskData,
        title: taskData.title?.trim(),
        description: taskData.description?.trim() || undefined
      }

      const response = await fetch(`/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
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

      if (result.data?.task) {
        setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? result.data!.task : task))
        // Notificar a otras pestañas
        channelRef.current?.postMessage({ type: 'TASKS_CHANGED', userId })
      }

      return result.data?.task || null

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [token, userId])

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: ApiResponse<{ task: Task }> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar la tarea')
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      // Notificar a otras pestañas
      channelRef.current?.postMessage({ type: 'TASKS_CHANGED', userId })

      return true

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [token, userId])

  // Estadísticas calculadas
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length

  // Inicializar canal y reaccionar a cambios desde otras pestañas
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel('tasks-sync')
    channelRef.current = channel

    const onMessage = (event: MessageEvent) => {
      const msg = event.data
      if (msg?.type === 'TASKS_CHANGED' && msg.userId === userId) {
        fetchTasks()
      }
    }

    channel.addEventListener('message', onMessage as any)
    return () => {
      channel.removeEventListener('message', onMessage as any)
      channel.close()
    }
  }, [userId, fetchTasks])

  // Efecto para cargar tareas automáticamente sólo cuando haya token y usuario
  useEffect(() => {
    if (autoFetch && userId && token) {
      fetchTasks()
    }
  }, [fetchTasks, autoFetch, userId, token])

  return {
    tasks,
    loading,
    error,
    totalTasks,
    pendingTasks,
    completedTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
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
  
  // Hook de autenticación
  const { token, user } = useAuth()

  const createTask = useCallback(async (taskData: CreateTaskPayload): Promise<Task | null> => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        ...taskData,
        userId: user?.id || 'user-1', // Use authenticated user ID or fallback
        title: taskData.title.trim(),
        description: taskData.description?.trim() || undefined
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
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
  }, [token, user])

  const clearError = useCallback(() => setError(null), [])

  return {
    createTask,
    loading,
    error,
    clearError
  }
}