'use client'

import { useTasks } from '@/features/tasks/api/useTasks'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

interface ChartProps {
  className?: string
}

export default function Chart({ className = '' }: ChartProps) {
  const { tasks, loading, error } = useTasks()

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-gray-600">Error al cargar las gráficas</p>
        </div>
      </div>
    )
  }

  // Datos para gráfica de barras - Tareas por estado (datos reales)
  const statusBarData = [
    {
      name: 'Completadas',
      count: tasks.filter(task => task.status === 'done').length,
      color: '#10b981'
    },
    {
      name: 'Pendientes',
      count: tasks.filter(task => task.status === 'pending').length,
      color: '#f59e0b'
    }
  ]

  // Datos para gráfica circular - Estado de tareas
  const statusData = [
    {
      name: 'Completadas',
      value: tasks.filter(task => task.status === 'done').length,
      color: '#10b981'
    },
    {
      name: 'Pendientes',
      value: tasks.filter(task => task.status === 'pending').length,
      color: '#f59e0b'
    }
  ]

  // Datos para gráfica de línea - Tareas creadas por mes (últimos 6 meses) usando createdAt real
  const getMonthlyData = () => {
    const months: { name: string; tareas: number }[] = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthDate.toLocaleDateString('es-ES', { month: 'short' })
      const year = monthDate.getFullYear()
      
      const tasksInMonth = tasks.filter(task => {
        if (!task.createdAt) return false
        const created = new Date(task.createdAt)
        return created.getMonth() === monthDate.getMonth() && created.getFullYear() === monthDate.getFullYear()
      }).length

      months.push({ name: `${monthName} ${year}`, tareas: tasksInMonth })
    }
    
    return months
  }

  const monthlyData = getMonthlyData()



  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gráfica de Barras - Tareas por Estado */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📊 Tareas por Estado
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Tareas']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfica Circular - Estado de Tareas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🥧 Estado de Tareas
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Tareas']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Línea - Tendencia Mensual */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📈 Tendencia Mensual
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Tareas Creadas']}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                type="monotone" 
                dataKey="tareas" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen de Estadísticas */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">📋 Resumen de Productividad</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%
            </div>
            <div className="text-sm opacity-90">Tasa de Completitud</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm opacity-90">Tareas Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {tasks.filter(t => {
                if (!t.dueDate) return false
                const dueDate = new Date(t.dueDate)
                const today = new Date()
                const diffTime = dueDate.getTime() - today.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                return diffDays <= 7 && diffDays >= 0 && t.status === 'pending'
              }).length}
            </div>
            <div className="text-sm opacity-90">Vencen Esta Semana</div>
          </div>
        </div>
      </div>
    </div>
  )
}