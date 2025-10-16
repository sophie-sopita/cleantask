import { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/register/ui'

export const metadata: Metadata = {
  title: 'Registro - CleanTask',
  description: 'Crea tu cuenta en CleanTask para gestionar tus tareas de manera eficiente.',
}

export default function RegisterPage() {
  const handleRegister = async (userData: any) => {
    // TODO: Implementar integración con API
    console.log('Datos de registro:', userData)
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('¡Cuenta creada exitosamente! (Mock)')
  }

  return <RegisterForm onSubmit={handleRegister} />
}