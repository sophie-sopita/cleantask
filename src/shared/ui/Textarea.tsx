import React, { useId } from 'react'
import { cn } from '../lib'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showCharacterCount?: boolean
  maxLength?: number
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showCharacterCount = false,
  maxLength,
  className,
  id,
  value = '',
  ...props
}) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const characterCount = typeof value === 'string' ? value.length : 0

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute top-3 left-3 flex items-start pointer-events-none z-10">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <textarea
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm resize-vertical',
            'text-gray-900 placeholder-gray-600',
            'focus:border-blue-500 focus:ring-blue-500 focus:ring-2',
            'disabled:bg-gray-50 disabled:text-gray-600',
            'transition-colors duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            'min-h-[100px]',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute top-3 right-3 flex items-start pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div>
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          
          {helperText && !error && (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
        
        {showCharacterCount && maxLength && (
          <p className={cn(
            "text-sm",
            characterCount > maxLength * 0.9 ? "text-orange-600" : "text-gray-500",
            characterCount >= maxLength ? "text-red-600" : ""
          )}>
            {characterCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

export default Textarea