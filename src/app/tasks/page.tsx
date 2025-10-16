import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tareas - CleanTask',
  description: 'Gestiona tus tareas de manera eficiente con CleanTask.',
}

// Este es un React Server Component por defecto
export default function TasksPage() {
  // Simulamos algunas tareas para demostrar la funcionalidad
  const tasks = [
    { id: 1, title: 'Configurar proyecto Next.js', completed: true, priority: 'alta' },
    { id: 2, title: 'Implementar App Router', completed: true, priority: 'alta' },
    { id: 3, title: 'Crear componentes de ejemplo', completed: false, priority: 'media' },
    { id: 4, title: 'Añadir funcionalidad de tareas', completed: false, priority: 'alta' },
    { id: 5, title: 'Implementar autenticación', completed: false, priority: 'baja' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baja': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Mis Tareas
            </h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              + Nueva Tarea
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  task.completed 
                    ? 'bg-gray-50 border-gray-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`text-lg ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Esta página utiliza React Server Components para renderizado optimizado del lado del servidor.
              Los datos se procesan en el servidor antes de enviar el HTML al cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}