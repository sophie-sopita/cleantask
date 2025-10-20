'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useTasks } from '@/features/tasks/api/useTasks'
import { Task } from '@/entities/task/model'
import { PriorityChip, OverdueChip } from '@/shared/ui'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
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

  // Tareas vencidas del mes actual
  const overdueTasksInMonth = tasks.filter((t: Task) => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    const now = new Date()
    return (
      d.getMonth() === currentMonth.getMonth() &&
      d.getFullYear() === currentMonth.getFullYear() &&
      d < now &&
      t.status !== 'done'
    )
  })

  // NUEVO: próxima tarea y navegación a su fecha
  const nextUpcomingTask: Task | undefined = tasks
    .filter((t: Task) => t.dueDate && new Date(t.dueDate) >= new Date() && t.status !== 'done')
    .sort((a: Task, b: Task) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0]

  const goToTaskDate = (due: string) => {
    const date = new Date(due)
    setSelectedDate(date)
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-pink-100/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 pt-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-indigo-500 to-purple-500 border-t-transparent"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-pink-100/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 pt-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendario mejorado */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Selecciona una fecha
                </h2>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                  {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="calendar-container">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  activeStartDate={currentMonth}
                  tileClassName={tileClassName}
                  onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setCurrentMonth(activeStartDate as Date)}
                  className="custom-calendar"
                  locale="es-ES"
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                />
              </div>
              
              {/* Leyenda mejorada */}
              <div className="mt-6 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full shadow-lg"></div>
                  <span className="text-gray-700 font-medium">Fechas con tareas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-700 font-medium">Fecha seleccionada</span>
                </div>
              </div>

              {/* Sección inferior: fecha de la próxima tarea */}
              <div className="mt-6">
                {nextUpcomingTask ? (
                  <button
                    onClick={() => goToTaskDate(nextUpcomingTask.dueDate!)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition"
                  >
                    <span className="text-sm font-medium text-indigo-700">Ir a la fecha de la próxima tarea</span>
                    <span className="text-sm text-gray-700">
                      {new Date(nextUpcomingTask.dueDate!).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </button>
                ) : (
                  <div className="text-sm text-gray-500 px-4 py-3">
                    No hay próximas tareas con fecha.
                  </div>
                )}
              </div>
            </div>
            {/* Tareas del día seleccionado mejoradas */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Tareas del día
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📝</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No hay tareas para esta fecha</p>
                  <p className="text-sm text-gray-500">
                    Selecciona otra fecha o crea una nueva tarea
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task: Task) => (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                        task.status === 'done'
                          ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-400'
                          : (task.dueDate && new Date(task.dueDate) < new Date())
                          ? 'bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-400'
                          : (task.dueDate && (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2)
                          ? 'bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-yellow-400'
                          : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                              task.status === 'done'
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700'
                                : (task.dueDate && new Date(task.dueDate) < new Date())
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                : (task.dueDate && (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2)
                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700'
                                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                            }`}>
                              {task.status === 'done' ? '✅ Completada' : (task.dueDate && new Date(task.dueDate) < new Date()) ? '⏰ Vencida' : (task.dueDate && (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2) ? '⚠️ Próxima' : '📌 Pendiente'}
                            </span>
                            
                            {/* Chips de prioridad y vencimiento */}
                            <div className="flex items-center space-x-2">
                              {(() => {
                                const computeDerivedPriority = (due?: string, status?: string): 'high' | 'medium' | 'low' | 'none' => {
                                  if (!due || status === 'done') return 'none'
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
                              {task.dueDate && <OverdueChip dueDate={task.dueDate} status={task.status} />}
                            </div>
                          </div>
                        </div>
                        <div className={`ml-4 text-2xl ${
                          task.status === 'done' ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {task.status === 'done' ? '✅' : '⏳'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Estadísticas del día mejoradas */}
              {tasksForSelectedDate.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {tasksForSelectedDate.length}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Total</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {tasksForSelectedDate.filter((t: Task) => t.status === 'done').length}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Completadas</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50/80 to-red-50/80 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {tasksForSelectedDate.filter((t: Task) => t.status === 'pending').length}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Pendientes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen mensual mejorado */}
          <div className="mt-8 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Resumen del mes
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-2xl shadow-lg border border-blue-100/50">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {tasks.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total de tareas</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl shadow-lg border border-green-100/50">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {tasks.filter((t: Task) => t.status === 'done').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completadas</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50/80 to-red-50/80 rounded-2xl shadow-lg border border-orange-100/50">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {tasks.filter((t: Task) => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Pendientes</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-2xl shadow-lg border border-purple-100/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {datesWithTasks.size}
                </div>
                <div className="text-sm text-gray-600 font-medium">Días con tareas</div>
              </div>
            </div>

            {/* Cuadro de tareas vencidas del mes */}
            <div className="mt-8 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Tareas vencidas del mes
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-red-50/80 to-orange-50/80 rounded-2xl shadow-lg border border-red-100/50">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    {overdueTasksInMonth.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total vencidas</div>
                </div>
                <div className="md:col-span-2">
                  {overdueTasksInMonth.length === 0 ? (
                    <p className="text-gray-600">No hay tareas vencidas en este mes.</p>
                  ) : (
                    <div className="space-y-3">
                      {overdueTasksInMonth.slice(0, 8).map((t: Task) => (
                        <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border bg-red-50/80 border-red-100/50">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-800">{t.title}</span>
                            {t.priority && <PriorityChip priority={t.priority} />}
                          </div>
                          {t.dueDate && <OverdueChip dueDate={t.dueDate} status={t.status} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }

        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 60px;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 0 1rem;
        }

        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
          margin: 0 4px;
        }

        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .custom-calendar .react-calendar__navigation button:disabled {
          background-color: transparent;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .custom-calendar .react-calendar__navigation__label {
          font-weight: bold;
          font-size: 20px;
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: #6366f1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 12px 0;
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .custom-calendar .react-calendar__tile {
          position: relative;
          height: 50px;
          border-radius: 12px;
          border: 2px solid transparent;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          color: #374151;
          font-weight: 500;
          transition: all 0.3s ease;
          margin: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          font-size: 0.9em;
        }

        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);
          border-color: #6366f1;
        }

        .custom-calendar .react-calendar__tile--neighboringMonth {
          color: #9ca3af;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .custom-calendar .react-calendar__tile--weekend {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #d97706;
        }

        .custom-calendar .react-calendar__tile--now {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
          border: 2px solid #065f46;
        }

        .custom-calendar .react-calendar__tile--now:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
        }

        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: white !important;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          border: 2px solid #4338ca;
        }

        .custom-calendar .react-calendar__tile--active:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }

        .custom-calendar .react-calendar__tile--hasActive {
          background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
          color: #5b21b6;
          font-weight: 600;
        }

        .custom-calendar .react-calendar__tile--hasActive:hover {
          background: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%);
        }

        .custom-calendar .react-calendar__tile.has-tasks {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
          color: #1e40af !important;
          font-weight: 600;
          position: relative;
          border: 2px solid #3b82f6;
        }

        .custom-calendar .react-calendar__tile.has-tasks::after {
          content: '';
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);
        }

        .custom-calendar .react-calendar__tile.has-tasks:enabled:hover {
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .custom-calendar .react-calendar__tile--active.has-tasks {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: white !important;
        }

        .custom-calendar .react-calendar__tile--active.has-tasks::after {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          box-shadow: 0 2px 4px rgba(255, 255, 255, 0.4);
        }

        .calendar-container {
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-radius: 20px;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  )
}