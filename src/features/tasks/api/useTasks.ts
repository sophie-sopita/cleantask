'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/entities/task/model'

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener token del localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch('http://localhost:3001/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Mapear los datos del backend al formato esperado por el frontend
      const mappedTasks: Task[] = data.map((task: any) => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        completed: task.status === 'done',
        status: task.status === 'completed' ? 'done' : task.status,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }))

      setTasks(mappedTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks
  }
}