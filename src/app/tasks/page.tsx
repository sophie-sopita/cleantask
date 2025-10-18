'use client'

import React, { useState } from 'react'
import { TaskForm } from '@/features/tasks/create'
import { TaskList } from '@/features/tasks/list'
import { TaskEditModal } from '@/features/tasks/edit'
import { DeleteConfirmationModal } from '@/features/tasks/delete'
import { useTasks } from '@/features/tasks/api'
import { Task } from '@/entities/task/model'

// Metadata se maneja en layout.tsx para client components
// export const metadata: Metadata = {
//   title: 'Tareas - CleanTask',
//   description: 'Gestiona tus tareas de manera eficiente con CleanTask.',
// }

/**
 * Página principal de gestión de tareas
 * Integra TaskForm y TaskList con el hook useTasks
 */
export default function TasksPage() {
  // Estado para controlar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false)
  
  // Estado para controlar los modales
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  // Hook para gestión de tareas
  const {
    tasks,
    loading,
    error,
    totalTasks,
    pendingTasks,
    completedTasks,
    updateTask,
    deleteTask,
    refreshTasks,
    clearError
  } = useTasks({
    userId: 'user-1', // Mock user ID
    autoFetch: true
  })

  /**
   * Maneja el éxito en la creación de una tarea
   */
  const handleTaskCreated = async (taskId: string) => {
    console.log('Tarea creada exitosamente:', taskId)
    
    // Ocultar formulario
    setShowForm(false)
    
    // Refrescar lista de tareas
    await refreshTasks()
  }

  /**
   * Maneja la cancelación del formulario
   */
  const handleFormCancel = () => {
    setShowForm(false)
  }

  /**
   * Maneja la edición de una tarea
   */
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  /**
   * Maneja el cambio de estado de una tarea
   */
  const handleToggleStatus = (taskId: string) => {
    console.log('Cambiar estado de tarea:', taskId)
    // TODO: Implementar en HU-006
  }

  /**
   * Maneja la eliminación de una tarea
   */
  const handleDeleteTask = (taskId: string) => {
    setDeletingTaskId(taskId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Tareas
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Organiza y gestiona tus tareas de manera eficiente
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showForm ? 'Cancelar' : 'Nueva Tarea'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {totalTasks}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Tareas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {pendingTasks}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pendientes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pendingTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {completedTasks}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {completedTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mostrar error global si existe */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar las tareas
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={refreshTasks}
                      className="bg-red-100 px-2 py-1 text-sm text-red-800 rounded hover:bg-red-200"
                    >
                      Reintentar
                    </button>
                    <button
                      onClick={clearError}
                      className="bg-red-100 px-2 py-1 text-sm text-red-800 rounded hover:bg-red-200"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de creación (condicional) */}
        {showForm && (
          <div className="mb-8">
            <TaskForm
              onSuccess={handleTaskCreated}
              onCancel={handleFormCancel}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

        {/* Lista de tareas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mis Tareas
            </h3>
            
            <TaskList
              tasks={tasks}
              isLoading={loading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              emptyMessage="No tienes tareas creadas. ¡Crea tu primera tarea!"
            />
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={async (taskData) => {
            const result = await updateTask(editingTask.id, taskData)
            if (result) {
              setEditingTask(null)
              await refreshTasks()
            }
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingTaskId && (
        <DeleteConfirmationModal
          task={tasks.find(t => t.id === deletingTaskId) || null}
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={async (taskId) => {
            const result = await deleteTask(taskId)
            if (result) {
              setDeletingTaskId(null)
              await refreshTasks()
            }
          }}
        />
      )}
    </div>
  )
}