import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', {
      name: /bienvenido a cleantask/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<HomePage />)
    
    const tasksLink = screen.getByRole('link', { name: /ver mis tareas/i })
    const aboutLink = screen.getByRole('link', { name: /conocer más/i })
    
    expect(tasksLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
    expect(tasksLink).toHaveAttribute('href', '/tasks')
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('displays the CleanTask emoji', () => {
    render(<HomePage />)
    
    const emoji = screen.getByText('🧹')
    expect(emoji).toBeInTheDocument()
  })

  it('shows technology features', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/next\.js 15/i)).toBeInTheDocument()
    expect(screen.getByText(/react server components/i)).toBeInTheDocument()
    expect(screen.getByText(/typescript/i)).toBeInTheDocument()
    expect(screen.getByText(/tailwind css/i)).toBeInTheDocument()
  })
})