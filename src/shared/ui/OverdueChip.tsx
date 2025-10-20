import React from 'react'

interface OverdueChipProps {
  dueDate: string
  status: 'pending' | 'done'
  className?: string
}

export const OverdueChip: React.FC<OverdueChipProps> = ({ 
  dueDate, 
  status,
  className = '' 
}) => {
  // No mostrar si la tarea está completada
  if (status === 'done') return null
  
  const date = new Date(dueDate)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Solo mostrar si está vencida
  if (diffDays >= 0) return null
  
  const daysPastDue = Math.abs(diffDays)
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200 animate-pulse ${className}`}
      title={`Vencida hace ${daysPastDue} día(s)`}
    >
      <span className="mr-1">⚠️</span>
      Vencida {daysPastDue}d
    </span>
  )
}

export default OverdueChip