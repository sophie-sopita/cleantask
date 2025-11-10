import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

/**
 * Middleware para verificar autenticación JWT
 * @param {Request} request - Request object
 * @returns {Object} - { user, error, status }
 */
export function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token no proporcionado', status: 401 }
  }

  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')
    return { user: decoded }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

/**
 * Middleware para verificar rol de administrador
 * @param {Request} request - Request object
 * @returns {Object} - { user, error, status }
 */
export function verifyAdminRole(request) {
  const auth = verifyToken(request)
  
  if (auth.error) {
    return auth
  }
  
  if (auth.user.role !== 'admin') {
    return { 
      error: 'Acceso denegado. Se requieren permisos de administrador', 
      status: 403 
    }
  }
  
  return { user: auth.user }
}

/**
 * Higher-order function para proteger rutas con roles específicos
 * @param {Array} allowedRoles - Roles permitidos ['admin', 'user']
 * @returns {Function} - Middleware function
 */
export function requireRoles(allowedRoles = []) {
  return function(request) {
    const auth = verifyToken(request)
    
    if (auth.error) {
      return auth
    }
    
    if (!allowedRoles.includes(auth.user.role)) {
      return { 
        error: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`, 
        status: 403 
      }
    }
    
    return { user: auth.user }
  }
}

/**
 * Middleware para Next.js que protege rutas admin
 * @param {NextRequest} request - Next.js request
 * @returns {NextResponse} - Response or null to continue
 */
export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Proteger rutas de administración
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 401 }
      )
    }

    try {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Acceso denegado. Se requieren permisos de administrador' },
          { status: 403 }
        )
      }
      
      // Agregar información del usuario a los headers para uso posterior
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id.toString())
      requestHeaders.set('x-user-role', decoded.role)
      requestHeaders.set('x-user-email', decoded.email)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

// Configuración del middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}