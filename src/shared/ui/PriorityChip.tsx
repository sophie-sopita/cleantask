import React from 'react'

export type Priority = 'low' | 'medium' | 'high' | 'none'

interface PriorityChipProps {
  priority: Priority
  className?: string
}

const priorityConfig: Record<Priority, { label: string; icon: string; bgColor: string; textColor: string; borderColor: string }> = {
  low: {
    label: 'Baja',
    icon: '🟢',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  medium: {
    label: 'Media',
    icon: '🟡',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  high: {
    label: 'Alta',
    icon: '🔴',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  },
  none: {
    label: 'Sin prioridad',
    icon: '⚪',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200'
  }
}

export const PriorityChip: React.FC<PriorityChipProps> = ({ 
  priority, 
  className = '' 
}) => {
  const config = priorityConfig[priority]
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      title={priority === 'none' ? 'Prioridad no asignada' : `Prioridad ${config.label}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}

export default PriorityChip