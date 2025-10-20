import '@testing-library/jest-dom'
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
    
    fireEvent.click(plusButton)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
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
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Esto es un Client Component que se ejecuta en el navegador. Puede usar hooks como useState y manejar eventos del usuario.'
    })).toBeInTheDocument()
  })

  it('has proper button styling classes', () => {
    render(<ClientCounter />)
    
    const minusButton = screen.getByRole('button', { name: '-' })
    const plusButton = screen.getByRole('button', { name: '+' })
    
    expect(minusButton).toHaveClass('bg-red-500')
    expect(minusButton).toHaveClass('hover:bg-red-600')
    expect(minusButton).toHaveClass('text-white')
    
    expect(plusButton).toHaveClass('bg-green-500')
    expect(plusButton).toHaveClass('hover:bg-green-600')
    expect(plusButton).toHaveClass('text-white')
  })
})