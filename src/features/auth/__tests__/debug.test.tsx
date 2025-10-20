import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../login/ui/LoginForm'

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

describe('Debug LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogin.mockResolvedValue(undefined)
  })

  it('debug form submission with fireEvent', async () => {
    const user = userEvent.setup()
    
    const { container } = render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    const form = container.querySelector('form')
    
    console.log('Form element:', form)
    console.log('Submit button:', submitButton)
    console.log('Submit button type:', submitButton.getAttribute('type'))
    
    // Type invalid email
    await user.type(emailInput, 'invalid-email')
    console.log('Email input value:', emailInput.value)
    
    // Try submitting with fireEvent instead of userEvent
    console.log('About to submit form with fireEvent')
    if (form) {
      fireEvent.submit(form)
    }
    console.log('Submitted form with fireEvent')
    
    // Wait a moment for any async operations
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Check DOM after submission attempt
    console.log('DOM after submit:', container.innerHTML)
    
    expect(true).toBe(true)
  })

  it('debug form validation behavior', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i }) as HTMLButtonElement
    
    console.log('Initial form state:')
    console.log('Email value:', emailInput.value)
    console.log('Password value:', passwordInput.value)
    console.log('Submit button disabled:', submitButton.disabled)
    
    // Try submitting empty form
    await user.click(submitButton)
    
    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('After empty form submission:')
    console.log('Email validation state:', emailInput.validity)
    console.log('Password validation state:', passwordInput.validity)
    
    // Check for validation messages
    const validationMessages = screen.queryAllByText(/obligatorio/i)
    console.log('Validation messages found:', validationMessages.length)
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('debug form interaction with valid data', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    // Fill with valid data
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    console.log('After filling valid data:')
    console.log('Email value:', emailInput.value)
    console.log('Password value:', passwordInput.value)
    console.log('Form validity:', emailInput.form?.checkValidity())
    
    // Submit form
    await user.click(submitButton)
    
    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('After form submission:')
    console.log('Login function called:', mockLogin.mock.calls.length)
    console.log('Login function args:', mockLogin.mock.calls)
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })
})