import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()

  console.log('🧹 Datos existentes eliminados')

  // Crear usuarios de prueba
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // Nota: Se crea una cuenta admin por defecto para acceso al panel.
  // Email: admin@cleantask.com, Password: admin123
  // Cambia estas credenciales para ambientes productivos.
  const adminUser = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@cleantask.com',
      contraseña: adminPassword,
      rol: 'admin'
    }
  })

  const regularUser = await prisma.usuario.create({
    data: {
      nombre: 'Usuario Demo',
      email: 'user@cleantask.com',
      contraseña: userPassword,
      rol: 'usuario'
    }
  })

  const testUser = await prisma.usuario.create({
    data: {
      nombre: 'María García',
      email: 'maria@example.com',
      contraseña: userPassword,
      rol: 'usuario'
    }
  })

  console.log('👥 Usuarios creados:')
  console.log(`   - Admin: ${adminUser.email} (password: admin123)`)
  console.log(`   - Usuario: ${regularUser.email} (password: user123)`)
  console.log(`   - Test User: ${testUser.email} (password: user123)`)

  // Crear tareas de prueba
  const tasks = [
    {
      titulo: 'Configurar entorno de desarrollo',
      descripcion: 'Instalar y configurar todas las herramientas necesarias para el desarrollo',
      estado: 'completada',
      fecha_limite: new Date('2024-01-15'),
      id_usuario: regularUser.id_usuario
    },
    {
      titulo: 'Diseñar interfaz de usuario',
      descripcion: 'Crear mockups y prototipos de la interfaz principal',
      estado: 'pendiente',
      fecha_limite: new Date('2024-02-01'),
      id_usuario: regularUser.id_usuario
    },
    {
      titulo: 'Implementar autenticación',
      descripcion: 'Desarrollar sistema de login y registro de usuarios',
      estado: 'pendiente',
      fecha_limite: new Date('2024-02-15'),
      id_usuario: regularUser.id_usuario
    },
    {
      titulo: 'Escribir documentación',
      descripcion: 'Documentar APIs y guías de usuario',
      estado: 'pendiente',
      fecha_limite: new Date('2024-03-01'),
      id_usuario: testUser.id_usuario
    },
    {
      titulo: 'Optimizar rendimiento',
      descripcion: 'Mejorar tiempos de carga y optimizar consultas',
      estado: 'pendiente',
      fecha_limite: new Date('2024-02-20'),
      id_usuario: testUser.id_usuario
    },
    {
      titulo: 'Configurar CI/CD',
      descripcion: 'Implementar pipeline de integración y despliegue continuo',
      estado: 'pendiente',
      fecha_limite: new Date('2024-01-30'),
      id_usuario: adminUser.id_usuario
    }
  ]

  for (const taskData of tasks) {
    await prisma.tarea.create({
      data: taskData
    })
  }

  console.log(`📋 ${tasks.length} tareas de prueba creadas`)

  // Mostrar estadísticas
  const userCount = await prisma.usuario.count()
  const taskCount = await prisma.tarea.count()
  const completedTasks = await prisma.tarea.count({ where: { estado: 'completada' } })

  console.log('\n📊 Estadísticas de la base de datos:')
  console.log(`   - Usuarios: ${userCount}`)
  console.log(`   - Tareas: ${taskCount}`)
  console.log(`   - Tareas completadas: ${completedTasks}`)
  console.log(`   - Tasa de completitud: ${Math.round((completedTasks / taskCount) * 100)}%`)

  console.log('\n✅ Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })