# 🏗️ Arquitectura CleanTask

## 📋 Visión General

CleanTask es una aplicación de gestión de tareas construida con **Next.js 15** y **Feature-Sliced Design (FSD)**, integrada con **Azure DevOps** para el seguimiento de desarrollo.

## 🎯 Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.5.5 (App Router)
- **Styling:** Tailwind CSS v4
- **TypeScript:** 5.x
- **State Management:** Zustand / React Context
- **Forms:** React Hook Form + Zod
- **Testing:** Jest + Testing Library

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Validation:** Zod

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Project Management:** Azure DevOps
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel
- **Package Manager:** PNPM

## 🏛️ Feature-Sliced Design (FSD)

### Estructura de Capas
```
src/
├── app/                 # 🚀 App Layer - Next.js App Router
│   ├── (auth)/         # Route groups
│   ├── dashboard/      # Dashboard pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
│
├── pages/              # 📄 Pages Layer - Composición de páginas
│   ├── HomePage/       # Página principal
│   ├── DashboardPage/  # Panel de control
│   └── AuthPage/       # Páginas de autenticación
│
├── widgets/            # 🧩 Widgets Layer - Bloques de UI complejos
│   ├── Header/         # Cabecera de la aplicación
│   ├── Sidebar/        # Barra lateral
│   ├── TaskList/       # Lista de tareas
│   └── UserProfile/    # Perfil de usuario
│
├── features/           # ⚡ Features Layer - Lógica de negocio
│   ├── auth/           # Autenticación
│   │   ├── ui/         # Componentes UI
│   │   ├── model/      # Estado y lógica
│   │   ├── api/        # Llamadas API
│   │   └── index.ts    # Public API
│   │
│   ├── task-management/# Gestión de tareas
│   │   ├── ui/         # Formularios, modales
│   │   ├── model/      # Store de tareas
│   │   ├── api/        # CRUD operations
│   │   └── lib/        # Utilidades
│   │
│   └── user-profile/   # Perfil de usuario
│
├── entities/           # 🎯 Entities Layer - Entidades de dominio
│   ├── user/           # Entidad Usuario
│   │   ├── ui/         # Componentes de usuario
│   │   ├── model/      # Tipos y esquemas
│   │   ├── api/        # API de usuario
│   │   └── lib/        # Utilidades
│   │
│   ├── task/           # Entidad Tarea
│   │   ├── ui/         # TaskCard, TaskStatus
│   │   ├── model/      # Task types, schemas
│   │   ├── api/        # Task API calls
│   │   └── lib/        # Task utilities
│   │
│   └── project/        # Entidad Proyecto
│
└── shared/             # 🔧 Shared Layer - Código compartido
    ├── ui/             # Componentes UI base
    │   ├── Button/     # Botón reutilizable
    │   ├── Input/      # Input con validación
    │   ├── Modal/      # Modal base
    │   └── index.ts    # Barrel exports
    │
    ├── lib/            # Utilidades y helpers
    │   ├── utils.ts    # Funciones utilitarias
    │   ├── constants.ts# Constantes globales
    │   ├── validations.ts # Esquemas Zod
    │   └── api.ts      # Cliente API base
    │
    ├── config/         # Configuración
    │   ├── env.ts      # Variables de entorno
    │   ├── database.ts # Config de BD
    │   └── auth.ts     # Config de auth
    │
    └── types/          # Tipos TypeScript globales
        ├── api.ts      # Tipos de API
        ├── auth.ts     # Tipos de autenticación
        └── common.ts   # Tipos comunes
```

### Reglas de Importación FSD

```typescript
// ✅ Permitido - Capa superior puede importar de inferior
// features -> entities, shared
import { User } from '@/entities/user'
import { Button } from '@/shared/ui'

// ✅ Permitido - Mismo nivel (diferentes slices)
import { taskApi } from '@/features/task-management'

// ❌ Prohibido - Capa inferior no puede importar de superior
// entities -> features (NO)
// shared -> entities (NO)

// ✅ Permitido - Importación dentro del mismo slice
import { TaskCard } from './ui/TaskCard'
import { taskModel } from './model'
```

## 🎯 Integración Azure DevOps

### Estructura de Trabajo
```
Epic 1: Configuración inicial (#145-#149)
├── Task #145: Instalación y configuración del entorno
├── Task #146: Creación del proyecto Next.js
├── Task #147: Configuración del repositorio GitHub
├── Task #148: Implementación de FSD
└── Task #149: Documentación y scripts

Epic 2: Entidades User y Task (#150-#155)
├── Task #150: Entidad User - Modelo y tipos
├── Task #151: Entidad User - API y validaciones
├── Task #152: Entidad Task - Modelo y tipos
├── Task #153: Formulario de registro UI
├── Task #154: Entidad Task - API y CRUD
└── Task #155: Testing de entidades
```

### Convenciones de Commits
```bash
# Formato: <type>(#task-id): <description>
feat(#153): implement user registration form with validation
fix(#154): resolve task creation validation issue
docs(#155): update API documentation for task endpoints
test(#156): add unit tests for user entity
refactor(#157): optimize task query performance
```

## 🗄️ Modelo de Datos

### Entidades Principales

```typescript
// User Entity
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  tasks: Task[]
  projects: Project[]
}

// Task Entity
interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  assigneeId: string
  projectId?: string
  createdAt: Date
  updatedAt: Date
  assignee: User
  project?: Project
}

// Project Entity
interface Project {
  id: string
  name: string
  description?: string
  color: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
  owner: User
  tasks: Task[]
  members: User[]
}
```

### Enums y Tipos
```typescript
enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
User Input → Form Validation → API Call → NextAuth → Database → Session
```

### 2. Gestión de Tareas
```
User Action → Feature Component → API Layer → Database → State Update → UI Refresh
```

### 3. Estado Global
```typescript
// Zustand Store Structure
interface AppStore {
  // User state
  user: User | null
  setUser: (user: User) => void
  
  // Tasks state
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
}
```

## 🧪 Testing Strategy

### Estructura de Tests
```
__tests__/
├── components/         # Component tests
├── features/          # Feature tests
├── entities/          # Entity tests
├── pages/             # Page tests
├── api/               # API tests
└── utils/             # Utility tests
```

### Tipos de Tests
- **Unit Tests:** Componentes, funciones, utilidades
- **Integration Tests:** Features completas, API endpoints
- **E2E Tests:** Flujos de usuario completos (Playwright)

## 🚀 Deployment & CI/CD

### Ambientes
- **Development:** `localhost:3000`
- **Staging:** `staging.cleantask.com` (desde `develop`)
- **Production:** `cleantask.com` (desde `main`)

### Pipeline CI/CD
```yaml
# .github/workflows/ci.yml
1. Code Quality Check (ESLint, Prettier)
2. Type Check (TypeScript)
3. Unit Tests (Jest)
4. Build Verification
5. E2E Tests (Playwright)
6. Deploy to Vercel
```

## 📊 Monitoreo y Analytics

### Métricas Clave
- **Performance:** Core Web Vitals
- **Errors:** Sentry integration
- **Usage:** Google Analytics
- **API:** Response times, error rates

### Logging
```typescript
// Structured logging
logger.info('Task created', {
  taskId: task.id,
  userId: user.id,
  timestamp: new Date().toISOString()
})
```

## 🔒 Seguridad

### Medidas Implementadas
- **Authentication:** NextAuth.js con JWT
- **Authorization:** Role-based access control
- **Validation:** Zod schemas en frontend y backend
- **CORS:** Configuración restrictiva
- **Rate Limiting:** API protection
- **Environment Variables:** Secrets management

---

Esta arquitectura garantiza escalabilidad, mantenibilidad y una excelente experiencia de desarrollo siguiendo las mejores prácticas de la industria.