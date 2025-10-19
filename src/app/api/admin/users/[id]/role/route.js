import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock users data - En producción esto vendría de la base de datos
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@cleantask.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: '2024-02-01T00:00:00.000Z'
  }
]

// Middleware para verificar token y rol de admin
function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token no proporcionado', status: 401 }
  }

  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')
    
    if (decoded.role !== 'admin') {
      return { error: 'Acceso denegado. Se requieren permisos de administrador', status: 403 }
    }
    
    return { user: decoded }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

// PATCH /api/admin/users/[id]/role - Actualizar rol de usuario (solo admin)
export async function PATCH(request, { params }) {
  const auth = verifyAdminToken(request)
  
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    )
  }

  try {
    const userId = parseInt(params.id)
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { role } = body

    if (!role) {
      return NextResponse.json(
        { error: 'El rol es requerido' },
        { status: 400 }
      )
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser "user" o "admin"' },
        { status: 400 }
      )
    }

    // Prevenir que el admin cambie su propio rol
    if (users[userIndex].id === auth.user.id && role !== 'admin') {
      return NextResponse.json(
        { error: 'No puedes cambiar tu propio rol de administrador' },
        { status: 400 }
      )
    }

    const oldRole = users[userIndex].role
    users[userIndex].role = role
    users[userIndex].updatedAt = new Date().toISOString()

    return NextResponse.json({
      message: `Rol actualizado de ${oldRole} a ${role}`,
      user: users[userIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}