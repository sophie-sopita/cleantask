import { RegisterForm } from '@/features/auth/register'

export const metadata = {
  title: 'Registro - CleanTask',
  description: 'Crea tu cuenta en CleanTask para comenzar a organizar tus tareas.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}