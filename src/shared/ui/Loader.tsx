import React from 'react'
import { cn } from '../lib'

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
  className?: string
}

const loaderSizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const loaderColors = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
}

const SpinnerLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <svg
    className={cn('animate-spin', size, color)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const DotsLoader: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          'w-2 h-2 rounded-full animate-pulse',
          color === 'primary' ? 'bg-blue-600' : 
          color === 'secondary' ? 'bg-gray-600' : 'bg-white'
        )}
        style={{
          animationDelay: `${i * 0.2}s`,
          animationDuration: '1s',
        }}
      />
    ))}
  </div>
)

const PulseLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div
    className={cn(
      'rounded-full animate-pulse',
      size,
      color === 'primary' ? 'bg-blue-600' : 
      color === 'secondary' ? 'bg-gray-600' : 'bg-white'
    )}
  />
)

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  className,
}) => {
  const sizeClass = loaderSizes[size]
  const colorClass = loaderColors[color]

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader color={color} />
      case 'pulse':
        return <PulseLoader size={sizeClass} color={color} />
      default:
        return <SpinnerLoader size={sizeClass} color={colorClass} />
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {renderLoader()}
      {text && (
        <p className={cn('mt-2 text-sm', colorClass)}>
          {text}
        </p>
      )}
    </div>
  )
}

export default Loader