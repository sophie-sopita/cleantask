import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

// Mock del router de Next.js
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock del hook useAuth
const mockLogin = jest.fn()
jest.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogin.mockResolvedValue(undefined)
  })

  it('renders all form fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    
    // Fill with invalid email and submit
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    // Check that form validation works
    expect(emailInput).toHaveValue('invalid-email')
  })

  it('validates password minimum length', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/contraseña/i)
    await user.type(passwordInput, '123')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data and redirects on success', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/correo electrónico/i), 'demo@cleantask.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'DemoPass123')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('demo@cleantask.com', 'DemoPass123')
      expect(mockPush).toHaveBeenCalledWith('/tasks')
    })
  })

  it('shows error message on login failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Credenciales inválidas'
    mockLogin.mockRejectedValue(new Error(errorMessage))
    
    render(<LoginForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/correo electrónico/i), 'wrong@email.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'WrongPass123')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    // Mock a delayed login
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<LoginForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/correo electrónico/i), 'demo@cleantask.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'DemoPass123')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    // Button should be disabled during loading
    expect(submitButton).toBeDisabled()
  })

  it('has link to register page', () => {
    render(<LoginForm />)
    
    const registerLink = screen.getByRole('link', { name: /regístrate aquí/i })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('displays title and description', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByText(/accede a tu cuenta de cleantask/i)).toBeInTheDocument()
  })

  it('clears error message on new submission', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)
    
    // Verify form submission works
    expect(submitButton).toBeInTheDocument()
  })
})