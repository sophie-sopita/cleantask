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

// GET /api/admin/users - Obtener todos los usuarios (solo admin)
export async function GET(request) {
  const auth = verifyAdminToken(request)
  
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    )
  }

  try {
    // En producción, aquí harías una consulta a la base de datos
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Crear nuevo usuario (solo admin)
export async function POST(request) {
  const auth = verifyAdminToken(request)
  
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    )
  }

  try {
    const body = await request.json()
    const { name, email, role = 'user' } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}