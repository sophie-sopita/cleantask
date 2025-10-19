import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Navigation from '../Navigation'

// Mock Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Navigation', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockUsePathname.mockReturnValue('/')
  })

  it('renders the CleanTask logo and title', () => {
    render(<Navigation />)
    
    expect(screen.getByText('🧹')).toBeInTheDocument()
    expect(screen.getByText('CleanTask')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Tareas')).toBeInTheDocument()
    expect(screen.getByText('Acerca de')).toBeInTheDocument()
    
    // Check icons
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('✅')).toBeInTheDocument()
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
  })

  it('highlights the active navigation item', () => {
    mockUsePathname.mockReturnValue('/')
    
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    expect(homeLink).toHaveClass('bg-blue-100', 'text-blue-700')
    expect(tasksLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(aboutLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
  })

  it('highlights tasks page when active', () => {
    mockUsePathname.mockReturnValue('/tasks')
    
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    expect(homeLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(tasksLink).toHaveClass('bg-blue-100', 'text-blue-700')
    expect(aboutLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
  })

  it('highlights about page when active', () => {
    mockUsePathname.mockReturnValue('/about')
    
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    expect(homeLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(tasksLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(aboutLink).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('has correct href attributes for all links', () => {
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(tasksLink).toHaveAttribute('href', '/tasks')
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('has proper navigation structure and styling', () => {
    render(<Navigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-white', 'shadow-lg', 'border-b')
    
    const logo = screen.getByText('CleanTask')
    expect(logo).toHaveClass('text-xl', 'font-bold', 'text-gray-800')
  })

  it('displays navigation items with proper spacing and layout', () => {
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    // Check that all links have consistent styling
    [homeLink, tasksLink, aboutLink].forEach(link => {
      expect(link).toHaveClass('px-4', 'py-2', 'rounded-lg', 'font-medium', 'transition-colors')
    })
  })

  it('handles unknown pathname gracefully', () => {
    mockUsePathname.mockReturnValue('/unknown-page')
    
    render(<Navigation />)
    
    // All links should have inactive styling
    const homeLink = screen.getByRole('link', { name: /🏠 Inicio/ })
    const tasksLink = screen.getByRole('link', { name: /✅ Tareas/ })
    const aboutLink = screen.getByRole('link', { name: /ℹ️ Acerca de/ })
    
    expect(homeLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(tasksLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(aboutLink).toHaveClass('text-gray-600', 'hover:text-gray-900')
  })
})