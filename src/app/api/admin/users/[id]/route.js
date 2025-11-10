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

// GET /api/admin/users/[id] - Obtener usuario específico (solo admin)
export async function GET(request, { params }) {
  const auth = verifyAdminToken(request)
  
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    )
  }

  try {
    const userId = parseInt(params.id)
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Actualizar usuario (solo admin)
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
    const { name, email, role } = body

    // Actualizar solo los campos proporcionados
    if (name !== undefined) users[userIndex].name = name
    if (email !== undefined) {
      // Verificar si el nuevo email ya existe en otro usuario
      const existingUser = users.find(u => u.email === email && u.id !== userId)
      if (existingUser) {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        )
      }
      users[userIndex].email = email
    }
    if (role !== undefined) users[userIndex].role = role

    users[userIndex].updatedAt = new Date().toISOString()

    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Eliminar usuario (solo admin)
export async function DELETE(request, { params }) {
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

    // Prevenir que el admin se elimine a sí mismo
    if (users[userIndex].id === auth.user.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      )
    }

    const deletedUser = users.splice(userIndex, 1)[0]

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente',
      user: deletedUser
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}