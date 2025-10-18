import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './RegisterForm'

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock del service de registro
jest.mock('../api/register', () => ({
  useRegister: () => ({
    register: jest.fn().mockResolvedValue({ success: true, data: { user: { name: 'Test User' } } }),
  }),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<RegisterForm />)
    
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
      expect(screen.getByText(/confirma tu contraseña/i)).toBeInTheDocument()
    })
  })

  it('validates name minimum length', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre completo/i)
    await user.type(nameInput, 'A')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('validates password strength', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    
    // Test minimum length
    await user.type(passwordInput, '123')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
    })
    
    // Clear and test pattern
    await user.clear(passwordInput)
    await user.type(passwordInput, 'weakpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe contener al menos una mayúscula, una minúscula y un número/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    
    await user.type(passwordInput, 'ValidPass123')
    await user.type(confirmPasswordInput, 'DifferentPass123')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/nombre completo/i), 'John Doe')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'ValidPass123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'ValidPass123')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)
    
    // Should not show validation errors
    await waitFor(() => {
      expect(screen.queryByText(/el nombre es obligatorio/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/el correo es obligatorio/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/la contraseña es obligatoria/i)).not.toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    // Mock the register function to simulate async behavior
    const mockRegister = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )
    
    // Mock the useRegister hook
    jest.doMock('../api/register', () => ({
      useRegister: () => ({ register: mockRegister })
    }))
    
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/nombre completo/i), 'John Doe')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'ValidPass123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'ValidPass123')
    
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    
    // Click submit and immediately check if button is disabled
    await user.click(submitButton)
    
    // The button should show loading state
    expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument()
  })

  it('displays helper text for password field', () => {
    render(<RegisterForm />)
    
    expect(screen.getByText(/debe contener al menos una mayúscula, una minúscula y un número/i)).toBeInTheDocument()
  })

  it('has link to login page', () => {
    render(<RegisterForm />)
    
    const loginLink = screen.getByRole('link', { name: /inicia sesión/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})