'use client'

import React, { useState } from 'react'
import { Button, Input, Textarea } from '@/shared/ui'
import { CreateTaskPayload } from '@/entities/task/model'
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
}

export interface TaskFormErrors {
  title?: string
  description?: string
  dueDate?: string
}

export function TaskForm({ onSubmit, onSuccess, onCancel, className = '' }: TaskFormProps) {
  // Hook para crear tareas
  const { createTask, loading: apiLoading, error: apiError, clearError } = useCreateTask()

  // Estado del formulario
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
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
      dueDate: ''
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
          <Input
            id="title"
            name="title"
            type="text"
            label="Título *"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ingresa el título de la tarea"
            className={`w-full ${errors.title ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            error={errors.title}
          />
        </div>

        {/* Campo Descripción */}
        <div>
          <Textarea
            id="description"
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe los detalles de la tarea (opcional)"
            disabled={isLoading}
            maxLength={500}
            showCharacterCount={true}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            }
            error={errors.description}
          />
        </div>

        {/* Campo Fecha de Vencimiento */}
        <div>
          <Input
            id="dueDate"
            type="date"
            label="Fecha de Vencimiento"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
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