'use client'

import React, { useState } from 'react'
import { TaskForm } from '@/features/tasks/create'
import { TaskList } from '@/features/tasks/list'
import { TaskEditModal } from '@/features/tasks/edit'
import { DeleteConfirmationModal } from '@/features/tasks/delete'
import { useTasks } from '@/features/tasks/api'
import { Task } from '@/entities/task/model'
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute'
import { useAuth } from '@/shared/hooks/useAuth'

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

  // Estado de autenticación
  const { isLoading: authLoading, isAuthenticated, user } = useAuth()

  // Hook para gestión de tareas (no autoFetch; esperar a auth)
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
    clearError,
    fetchTasks,
  } = useTasks({
    autoFetch: false,
    userId: user?.id,
  })

  // Cargar tareas cuando auth esté listo
  React.useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user?.id) return
    fetchTasks()
  }, [authLoading, isAuthenticated, user?.id, fetchTasks])

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
  const handleToggleStatus = async (taskId: string) => {
    try {
      // Encontrar la tarea actual
      const currentTask = tasks.find(task => task.id === taskId)
      if (!currentTask) {
        console.error('Tarea no encontrada:', taskId)
        return
      }

      // Cambiar el estado: si está pendiente -> completada, si está completada -> pendiente
      const newStatus = currentTask.status === 'pending' ? 'done' : 'pending'
      
      // Actualizar la tarea con todos los campos necesarios
      const result = await updateTask(taskId, { 
        title: currentTask.title,
        description: currentTask.description,
        dueDate: currentTask.dueDate,
        priority: currentTask.priority,
        status: newStatus 
      })
      
      if (result) {
        console.log(`Tarea ${taskId} marcada como ${newStatus}`)
        // La actualización del estado local se maneja automáticamente en updateTask
      } else {
        // Si updateTask retorna null, el error ya se maneja en el hook useTasks
        // No necesitamos mostrar un error adicional aquí
        console.log('La actualización no se completó, revisar el estado del error en useTasks')
      }
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error)
    }
  }

  /**
   * Maneja la eliminación de una tarea
   */
  const handleDeleteTask = (taskId: string) => {
    setDeletingTaskId(taskId)
  }

  React.useEffect(() => {
    const applyHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#new') {
        setShowForm(true)
      }
    }
    applyHash()
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', applyHash)
      return () => window.removeEventListener('hashchange', applyHash)
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          {/* Contenido principal */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 py-8">
          {/* Toggle formulario mejorado */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showForm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
              {showForm ? 'Cancelar' : 'Nueva Tarea'}
            </button>
          </div>

          {/* Estadísticas mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Total de Tareas
                    </dt>
                    <dd className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {totalTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Pendientes
                    </dt>
                    <dd className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {pendingTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Completadas
                    </dt>
                    <dd className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {completedTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Mostrar error global mejorado */}
          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-6 shadow-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Error al cargar las tareas
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={refreshTasks}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 text-sm text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Reintentar
                      </button>
                      <button
                        onClick={clearError}
                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm text-gray-800 rounded-lg font-medium transition-all duration-300"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de creación mejorado */}
          {showForm && (
            <div id="new" className="mb-8">
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Crear Nueva Tarea
                  </h3>
                </div>
                <TaskForm
                  onSuccess={handleTaskCreated}
                  onCancel={handleFormCancel}
                  className="max-w-2xl mx-auto"
                />
              </div>
            </div>
          )}

          {/* Lista de tareas mejorada */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="px-6 py-8 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Mis Tareas
                </h3>
              </div>
              
              <TaskList
                tasks={tasks}
                isLoading={loading}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
                onUpdateTask={updateTask}
                emptyMessage="No tienes tareas creadas. ¡Crea tu primera tarea!"
              />
            </div>
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
    </ProtectedRoute>
  )
}