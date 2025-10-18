'use client'

import React from 'react'
import { Button } from '@/shared/ui'
import { Task, TaskStatus, TaskPriority } from '@/entities/task/model'

/**
 * Props del componente TaskList
 */
export interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onToggleStatus: (taskId: string) => void
  isLoading?: boolean
  emptyMessage?: string
}

/**
 * Props del componente TaskItem
 */
interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onToggleStatus: (taskId: string) => void
  isLoading?: boolean
}

/**
 * Componente individual de tarea
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false
}) => {
  /**
   * Obtiene el color de la prioridad
   */
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800 border-red-200'
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  /**
   * Obtiene el texto de la prioridad
   */
  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'Alta'
      case TaskPriority.MEDIUM:
        return 'Media'
      case TaskPriority.LOW:
        return 'Baja'
      default:
        return 'Sin definir'
    }
  }

  /**
   * Formatea la fecha de vencimiento
   */
  const formatDueDate = (dueDate?: string): string => {
    if (!dueDate) return ''
    
    const date = new Date(dueDate)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Vencida hace ${Math.abs(diffDays)} día(s)`
    } else if (diffDays === 0) {
      return 'Vence hoy'
    } else if (diffDays === 1) {
      return 'Vence mañana'
    } else {
      return `Vence en ${diffDays} día(s)`
    }
  }

  /**
   * Determina si la tarea está vencida
   */
  const isOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false
    const date = new Date(dueDate)
    const today = new Date()
    return date < today && task.status === TaskStatus.PENDING
  }

  const isDone = task.status === TaskStatus.DONE
  const overdue = isOverdue(task.dueDate)

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
      isDone ? 'border-green-200 bg-green-50' : overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Título y Estado */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggleStatus(task.id)}
              disabled={isLoading}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isDone
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
            >
              {isDone && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <h3 className={`text-lg font-semibold truncate ${
              isDone ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </div>

          {/* Descripción */}
          {task.description && (
            <p className={`text-sm mb-3 ${isDone ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          {/* Metadatos */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Prioridad */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
              {getPriorityText(task.priority)}
            </span>

            {/* Estado */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isDone 
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {isDone ? 'Completada' : 'Pendiente'}
            </span>

            {/* Fecha de vencimiento */}
            {task.dueDate && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                overdue 
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                📅 {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700"
            title="Editar tarea"
          >
            ✏️
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700"
            title="Eliminar tarea"
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente principal de lista de tareas
 * Muestra todas las tareas con opciones de edición y eliminación
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
  emptyMessage = 'No hay tareas disponibles'
}) => {
  /**
   * Ordena las tareas por prioridad y estado
   */
  const sortedTasks = [...tasks].sort((a, b) => {
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

  /**
   * Estadísticas de tareas
   */
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === TaskStatus.DONE).length,
    pending: tasks.filter(task => task.status === TaskStatus.PENDING).length,
    overdue: tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.DONE) return false
      return new Date(task.dueDate) < new Date()
    }).length
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Encabezado con estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Lista de Tareas
        </h2>
        
        {tasks.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Total: {stats.total}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Completadas: {stats.completed}
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Pendientes: {stats.pending}
            </span>
            {stats.overdue > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                Vencidas: {stats.overdue}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lista de tareas */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500">
            Crea tu primera tarea para comenzar a organizar tu trabajo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList