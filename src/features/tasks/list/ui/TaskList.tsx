'use client'

import React from 'react'
import { Button, PriorityChip, OverdueChip, Input, Textarea } from '@/shared/ui'
import { Task, TaskStatus, UpdateTaskPayload } from '@/entities/task/model'

/**
 * Props del componente TaskList
 */
export interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onToggleStatus: (taskId: string) => void
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<Task | null>
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
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<Task | null>
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
  onUpdateTask,
  isLoading = false
}) => {
  const [expanded, setExpanded] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<{ title: string; description: string; dueDate: string }>({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  })




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

  const handleSaveEdit = async () => {
    const payload: UpdateTaskPayload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate || undefined
    }
    const result = await onUpdateTask(task.id, payload)
    if (result) {
      setIsEditing(false)
      setExpanded(true)
    }
  }

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
            
            <h3
              className={`text-lg font-semibold truncate ${
                isDone ? 'line-through text-gray-500' : 'text-gray-900'
              } cursor-pointer`}
              onClick={() => setExpanded(prev => !prev)}
              title="Ver detalles"
            >
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
            {/* Prioridad derivada por vencimiento */}
            {(() => {
              const computeDerivedPriority = (due?: string, status?: string): 'high' | 'medium' | 'low' | 'none' => {
                if (!due || status === TaskStatus.DONE) return 'none'
                const today = new Date()
                const dueDate = new Date(due)
                // normalizamos al inicio del día para evitar sesgos por hora
                const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                const startOfDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
                const diffTime = startOfDue.getTime() - startOfToday.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                if (diffDays <= 1) return 'high'
                if (diffDays <= 5) return 'medium'
                return 'low'
              }
              const effective = computeDerivedPriority(task.dueDate, task.status)
              return <PriorityChip priority={effective} />
            })()}

            {/* Chip de vencida */}
            {task.dueDate && (
              <OverdueChip dueDate={task.dueDate} status={task.status} />
            )}

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

          {/* Detalle expandido */}
          {expanded && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              <div className="text-sm text-gray-700">
                <strong>Descripción:</strong> {task.description || '—'}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Fecha de vencimiento:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Creada:</strong> {new Date(task.createdAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const computeDerivedPriority = (due?: string, status?: string): 'high' | 'medium' | 'low' | 'none' => {
                    if (!due || status === TaskStatus.DONE) return 'none'
                    const today = new Date()
                    const dueDate = new Date(due)
                    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    const startOfDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
                    const diffTime = startOfDue.getTime() - startOfToday.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    if (diffDays <= 1) return 'high'
                    if (diffDays <= 5) return 'medium'
                    return 'low'
                  }
                  const effective = computeDerivedPriority(task.dueDate, task.status)
                  return <PriorityChip priority={effective} />
                })()}
                {task.dueDate && (
                  <OverdueChip dueDate={task.dueDate} status={task.status} />
                )}
              </div>


              {isEditing && (
                <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); handleSaveEdit() }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <Input
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="submit" variant="primary" size="sm" className="bg-blue-600 text-white">Guardar cambios</Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => { setIsEditing(false); setExpanded(false) }}>Cancelar</Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExpanded(prev => !prev)}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-700"
            title="Ver/ocultar detalles"
          >
            👁️
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsEditing(prev => {
                const next = !prev
                if (next) {
                  setExpanded(true)
                } else {
                  setExpanded(false)
                }
                return next
              })
            }}
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
  onUpdateTask,
  isLoading = false,
  emptyMessage = 'No hay tareas disponibles'
}) => {
  /**
   * Ordena las tareas por vencimiento y estado
   */
  const sortedTasks = [...tasks].sort((a, b) => {
    // Primero por estado (pendientes primero)
    if (a.status !== b.status) {
      return a.status === TaskStatus.PENDING ? -1 : 1
    }

    // Luego por fecha de vencimiento (más próximas primero; las sin fecha al final)
    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
    return aDate - bDate
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
              onUpdateTask={onUpdateTask}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList