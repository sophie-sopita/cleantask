'use client'

import { useTasks } from '@/features/tasks/api/useTasks'
import { Task } from '@/entities/task/model'

export default function Overview() {
  const { tasks, loading, error } = useTasks()

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>Error al cargar las estadísticas</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Calcular estadísticas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: Task) => task.status === 'done').length
  const pendingTasks = totalTasks - completedTasks
  const highPriorityTasks = tasks.filter((task: Task) => task.priority === 'high').length
  
  // Calcular porcentaje de completitud
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Tareas por prioridad
  const tasksByPriority = {
    high: tasks.filter((task: Task) => task.priority === 'high').length,
    medium: tasks.filter((task: Task) => task.priority === 'medium').length,
    low: tasks.filter((task: Task) => task.priority === 'low').length,
  }

  // Tareas con fecha de vencimiento próxima (próximos 7 días)
  const upcomingTasks = tasks.filter((task: Task) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return dueDate >= today && dueDate <= nextWeek && task.status === 'pending'
  }).length

  // Tareas vencidas
  const overdueTasks = tasks.filter((task: Task) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    return dueDate < today && task.status === 'pending'
  }).length

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Resumen General</h2>
        <div className="text-sm text-gray-500">
          Actualizado: {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {totalTasks}
          </div>
          <div className="text-sm text-gray-600">Total de Tareas</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {completedTasks}
          </div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {pendingTasks}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600">Completitud</div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso General</span>
          <span className="text-sm text-gray-500">{completedTasks} de {totalTasks} tareas</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Estadísticas Detalladas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tareas por Prioridad */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🎯 Por Prioridad</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Alta</span>
              </div>
              <span className="font-medium text-gray-800">{tasksByPriority.high}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Media</span>
              </div>
              <span className="font-medium text-gray-800">{tasksByPriority.medium}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Baja</span>
              </div>
              <span className="font-medium text-gray-800">{tasksByPriority.low}</span>
            </div>
          </div>
        </div>

        {/* Alertas y Notificaciones */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">⚠️ Alertas</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Vencidas</span>
              </div>
              <span className={`font-medium ${overdueTasks > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {overdueTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Próximas (7 días)</span>
              </div>
              <span className={`font-medium ${upcomingTasks > 0 ? 'text-yellow-600' : 'text-gray-800'}`}>
                {upcomingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Alta Prioridad</span>
              </div>
              <span className={`font-medium ${highPriorityTasks > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
                {highPriorityTasks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      {totalTasks > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-center">
            {completionRate === 100 ? (
              <p className="text-green-700 font-medium">
                🎉 ¡Excelente! Has completado todas tus tareas
              </p>
            ) : completionRate >= 75 ? (
              <p className="text-blue-700 font-medium">
                🚀 ¡Muy bien! Estás cerca de completar todas tus tareas
              </p>
            ) : completionRate >= 50 ? (
              <p className="text-yellow-700 font-medium">
                💪 ¡Buen progreso! Sigue así para completar más tareas
              </p>
            ) : (
              <p className="text-orange-700 font-medium">
                📝 ¡Comienza hoy! Cada tarea completada es un paso hacia el éxito
              </p>
            )}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {totalTasks === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            ¡Comienza a organizar tus tareas!
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera tarea para ver estadísticas detalladas aquí
          </p>
          <a 
            href="/tasks" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Primera Tarea
          </a>
        </div>
      )}
    </div>
  )
}