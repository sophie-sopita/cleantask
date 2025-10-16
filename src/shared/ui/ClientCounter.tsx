'use client'

import { useState } from 'react'

export default function ClientCounter() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        🖱️ Client Component - Contador Interactivo
      </h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          -
        </button>
        <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-yellow-700 text-sm mt-4">
        <strong>Nota:</strong> Este componente usa <code className="bg-yellow-100 px-1 rounded">'use client'</code> 
        para habilitar interactividad del lado del cliente. El estado se mantiene en el navegador.
      </p>
    </div>
  )
}