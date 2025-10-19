import { render, screen } from '@testing-library/react'
import ServerInfo from '../ServerInfo'

// Mock process object for consistent testing
const mockProcess = {
  version: 'v18.17.0',
  platform: 'linux',
  uptime: jest.fn(() => 3600), // 1 hour in seconds
}

// Mock the process global
Object.defineProperty(global, 'process', {
  value: mockProcess,
  writable: true,
})

describe('ServerInfo', () => {
  beforeEach(() => {
    // Reset the uptime mock before each test
    mockProcess.uptime.mockReturnValue(3600)
  })

  it('renders server component title', () => {
    render(<ServerInfo />)
    
    expect(screen.getByText('🖥️ Server Component - Información del Servidor')).toBeInTheDocument()
  })

  it('displays server information correctly', () => {
    render(<ServerInfo />)
    
    // Check for labels
    expect(screen.getByText('Timestamp:')).toBeInTheDocument()
    expect(screen.getByText('Node.js:')).toBeInTheDocument()
    expect(screen.getByText('Plataforma:')).toBeInTheDocument()
    expect(screen.getByText('Uptime:')).toBeInTheDocument()
    
    // Check for values
    expect(screen.getByText('v18.17.0')).toBeInTheDocument()
    expect(screen.getByText('linux')).toBeInTheDocument()
    expect(screen.getByText('3600s')).toBeInTheDocument()
  })

  it('displays timestamp in ISO format', () => {
    // Mock Date to return a specific timestamp
    const mockDate = new Date('2024-01-15T10:30:00.000Z')
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
    
    render(<ServerInfo />)
    
    expect(screen.getByText('2024-01-15T10:30:00.000Z')).toBeInTheDocument()
    
    // Restore Date
    jest.restoreAllMocks()
  })

  it('displays different uptime values correctly', () => {
    // Test with different uptime
    mockProcess.uptime.mockReturnValue(7200) // 2 hours
    
    render(<ServerInfo />)
    
    expect(screen.getByText('7200s')).toBeInTheDocument()
  })

  it('displays the explanatory note', () => {
    render(<ServerInfo />)
    
    expect(screen.getByText(/Este componente se renderiza en el servidor/)).toBeInTheDocument()
    expect(screen.getByText(/Los datos se procesan antes de enviar el HTML al cliente/)).toBeInTheDocument()
    expect(screen.getByText(/mejorando el SEO y rendimiento inicial/)).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<ServerInfo />)
    
    const container = screen.getByText('🖥️ Server Component - Información del Servidor').closest('div')
    expect(container).toHaveClass('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-6')
  })

  it('displays all server data fields', () => {
    render(<ServerInfo />)
    
    // Check that all expected data fields are present
    const dataFields = ['Timestamp:', 'Node.js:', 'Plataforma:', 'Uptime:']
    
    dataFields.forEach(field => {
      expect(screen.getByText(field)).toBeInTheDocument()
    })
  })

  it('formats values with monospace font', () => {
    render(<ServerInfo />)
    
    const nodeVersion = screen.getByText('v18.17.0')
    const platform = screen.getByText('linux')
    const uptime = screen.getByText('3600s')
    
    expect(nodeVersion).toHaveClass('font-mono')
    expect(platform).toHaveClass('font-mono')
    expect(uptime).toHaveClass('font-mono')
  })
})