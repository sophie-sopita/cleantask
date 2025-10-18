'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useTasks } from '@/features/tasks/api/useTasks'
import { Task } from '@/entities/task/model'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { tasks = [], loading } = useTasks()

  // Filtrar tareas por fecha seleccionada
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task: Task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Obtener fechas que tienen tareas
  const getDatesWithTasks = () => {
    const datesWithTasks = new Set<string>()
    tasks.forEach((task: Task) => {
      if (task.dueDate) {
        const date = new Date(task.dueDate)
        datesWithTasks.add(date.toDateString())
      }
    })
    return datesWithTasks
  }

  const tasksForSelectedDate = getTasksForDate(selectedDate)
  const datesWithTasks = getDatesWithTasks()

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    }
  }

  // Función para agregar clases personalizadas a las fechas
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (datesWithTasks.has(date.toDateString())) {
        return 'has-tasks'
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📅 Calendario de Tareas
          </h1>
          <p className="text-gray-600">
            Visualiza y gestiona tus tareas por fecha. Las fechas con tareas aparecen resaltadas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selecciona una fecha
            </h2>
            <div className="calendar-container">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileClassName={tileClassName}
                className="custom-calendar"
                locale="es-ES"
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
              />
            </div>
            
            {/* Leyenda */}
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-gray-600">Fechas con tareas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Fecha seleccionada</span>
              </div>
            </div>
          </div>

          {/* Tareas del día seleccionado */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tareas para {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>

            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-500 mb-2">No hay tareas para esta fecha</p>
                <p className="text-sm text-gray-400">
                  Selecciona otra fecha o crea una nueva tarea
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task: Task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      task.status === 'done'
                        ? 'bg-green-50 border-green-400'
                        : task.priority === 'high'
                        ? 'bg-red-50 border-red-400'
                        : task.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority === 'high' ? 'Alta' : 
                             task.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                      </div>
                      <div className={`ml-4 ${
                        task.status === 'done' ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {task.status === 'done' ? '✅' : '⏳'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estadísticas del día */}
            {tasksForSelectedDate.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {tasksForSelectedDate.length}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {tasksForSelectedDate.filter((t: Task) => t.status === 'done').length}
                    </div>
                    <div className="text-xs text-gray-500">Completadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {tasksForSelectedDate.filter((t: Task) => t.status === 'pending').length}
                    </div>
                    <div className="text-xs text-gray-500">Pendientes</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen mensual */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Resumen del mes
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total de tareas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t: Task) => t.status === 'done').length}
              </div>
              <div className="text-sm text-gray-600">Completadas</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {tasks.filter((t: Task) => t.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {datesWithTasks.size}
              </div>
              <div className="text-sm text-gray-600">Días con tareas</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .custom-calendar .react-calendar__tile {
          position: relative;
          padding: 0.75em 0.5em;
          background: none;
          border: none;
          font-size: 0.9em;
        }
        
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #e0f2fe;
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: #1976d2 !important;
          color: white;
        }
        
        .custom-calendar .react-calendar__tile.has-tasks {
          background-color: #e3f2fd;
          border: 1px solid #90caf9;
          font-weight: 600;
        }
        
        .custom-calendar .react-calendar__tile.has-tasks:enabled:hover {
          background-color: #bbdefb;
        }
        
        .custom-calendar .react-calendar__navigation button {
          color: #1976d2;
          font-weight: 600;
          font-size: 1em;
        }
        
        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #e3f2fd;
        }
      `}</style>
    </div>
  )
}