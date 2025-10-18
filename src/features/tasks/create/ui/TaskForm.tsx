'use client'

import React, { useState } from 'react'
import { Button, Input } from '@/shared/ui'
import { CreateTaskPayload, TaskPriority } from '@/entities/task/model'
import { useCreateTask } from '@/features/tasks/api'

export interface TaskFormProps {
  onSubmit?: (task: CreateTaskPayload) => void
  onSuccess?: (taskId: string) => void
  onCancel?: () => void
  className?: string
}

export interface TaskFormData {
  title: string
  description: string
  dueDate: string
  priority: typeof TaskPriority[keyof typeof TaskPriority]
}

export interface TaskFormErrors {
  title?: string
  description?: string
  dueDate?: string
  priority?: string
}

export function TaskForm({ onSubmit, onSuccess, onCancel, className = '' }: TaskFormProps) {
  // Hook para crear tareas
  const { createTask, loading: apiLoading, error: apiError, clearError } = useCreateTask()

  // Estado del formulario
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.MEDIUM
  })

  // Estado de errores
  const [errors, setErrors] = useState<TaskFormErrors>({})

  // Estado de carga (combinando validación local y API)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Valida los datos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {}

    // Validar título (requerido)
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres'
    }

    // Validar descripción (opcional pero con límite)
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres'
    }

    // Validar fecha de vencimiento (opcional pero debe ser futura)
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.dueDate = 'La fecha de vencimiento debe ser futura'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Limpiar errores previos
    setErrors({})
    clearError()
    
    // Validar formulario
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar datos para la API
      const taskPayload: CreateTaskPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        status: 'pending',
        userId: 'current-user' // TODO: Obtener del contexto de autenticación
      }

      // Llamar al callback onSubmit si existe (para casos especiales)
      if (onSubmit) {
        onSubmit(taskPayload)
      }

      // Crear tarea usando la API
      const createdTask = await createTask(taskPayload)
      
      if (createdTask) {
        // Resetear formulario en caso de éxito
        handleReset()
        
        // Llamar callback de éxito si existe
        if (onSuccess) {
          onSuccess(createdTask.id)
        }
      }
      // Si hay error, se mostrará automáticamente desde el hook
      
    } catch (error) {
      console.error('Error inesperado al crear tarea:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Resetea el formulario
   */
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })
    setErrors({})
  }

  // Determinar si el formulario está cargando
  const isLoading = isSubmitting || apiLoading

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Tarea</h2>
      
      {/* Mostrar error de API si existe */}
      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{apiError}</p>
          <button
            type="button"
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ingresa el título de la tarea"
            className={`w-full ${errors.title ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Campo Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe los detalles de la tarea (opcional)"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px] ${
              errors.description 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/500 caracteres
          </p>
        </div>

        {/* Campo Fecha de Vencimiento */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Vencimiento
          </label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Campo Prioridad */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isLoading ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <option value={TaskPriority.LOW}>Baja</option>
            <option value={TaskPriority.MEDIUM}>Media</option>
            <option value={TaskPriority.HIGH}>Alta</option>
          </select>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? 'Creando...' : 'Crear Tarea'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Limpiar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm