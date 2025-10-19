import { render, screen, fireEvent } from '@testing-library/react'
import ClientCounter from '../ClientCounter'

describe('ClientCounter', () => {
  it('renders with initial count of 0', () => {
    render(<ClientCounter />)
    
    expect(screen.getByText('🖱️ Client Component - Contador Interactivo')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
  })

  it('increments count when plus button is clicked', () => {
    render(<ClientCounter />)
    
    const plusButton = screen.getByRole('button', { name: '+' })
    const countDisplay = screen.getByText('0')
    
    fireEvent.click(plusButton)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(countDisplay).not.toBeInTheDocument()
  })

  it('decrements count when minus button is clicked', () => {
    render(<ClientCounter />)
    
    const minusButton = screen.getByRole('button', { name: '-' })
    const plusButton = screen.getByRole('button', { name: '+' })
    
    // First increment to 1
    fireEvent.click(plusButton)
    expect(screen.getByText('1')).toBeInTheDocument()
    
    // Then decrement back to 0
    fireEvent.click(minusButton)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('handles multiple increments and decrements', () => {
    render(<ClientCounter />)
    
    const minusButton = screen.getByRole('button', { name: '-' })
    const plusButton = screen.getByRole('button', { name: '+' })
    
    // Increment 3 times
    fireEvent.click(plusButton)
    fireEvent.click(plusButton)
    fireEvent.click(plusButton)
    expect(screen.getByText('3')).toBeInTheDocument()
    
    // Decrement 2 times
    fireEvent.click(minusButton)
    fireEvent.click(minusButton)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('can go to negative numbers', () => {
    render(<ClientCounter />)
    
    const minusButton = screen.getByRole('button', { name: '-' })
    
    // Decrement from 0 to -1
    fireEvent.click(minusButton)
    expect(screen.getByText('-1')).toBeInTheDocument()
    
    // Decrement to -2
    fireEvent.click(minusButton)
    expect(screen.getByText('-2')).toBeInTheDocument()
  })

  it('displays the correct note about client component', () => {
    render(<ClientCounter />)
    
    expect(screen.getByText(/Este componente usa/)).toBeInTheDocument()
    expect(screen.getByText(/'use client'/)).toBeInTheDocument()
    expect(screen.getByText(/para habilitar interactividad del lado del cliente/)).toBeInTheDocument()
  })

  it('has proper button styling classes', () => {
    render(<ClientCounter />)
    
    const minusButton = screen.getByRole('button', { name: '-' })
    const plusButton = screen.getByRole('button', { name: '+' })
    
    expect(minusButton).toHaveClass('bg-red-500', 'hover:bg-red-600', 'text-white')
    expect(plusButton).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white')
  })
})