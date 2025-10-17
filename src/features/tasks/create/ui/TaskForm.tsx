'use client'

import React, { useState } from 'react'
import { Button, Input } from '@/shared/ui'
import { CreateTaskPayload, TaskPriority } from '@/entities/task/model'

/**
 * Datos del formulario de creación de tarea
 */
export interface TaskFormData {
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
}

/**
 * Props del componente TaskForm
 */
export interface TaskFormProps {
  onSubmit: (data: CreateTaskPayload) => void
  isLoading?: boolean
  initialData?: Partial<TaskFormData>
}

/**
 * Componente de formulario para crear tareas
 * Incluye validación del lado del cliente y manejo de estados
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    dueDate: initialData.dueDate || '',
    priority: initialData.priority || 'medium'
  })

  const [errors, setErrors] = useState<Partial<TaskFormData>>({})

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Preparar datos para envío
    const taskData: CreateTaskPayload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate || undefined,
      priority: formData.priority,
      status: 'pending',
      userId: 'current-user' // TODO: Obtener del contexto de autenticación
    }

    onSubmit(taskData)
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Crear Nueva Tarea
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ingresa el título de la tarea"
            error={errors.title}
            disabled={isLoading}
            maxLength={100}
          />
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