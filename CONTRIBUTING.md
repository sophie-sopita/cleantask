# 🤝 Guía de Contribución - CleanTask

¡Gracias por tu interés en contribuir a CleanTask! Esta guía te ayudará a entender nuestro proceso de desarrollo y las convenciones que seguimos.

## 📋 Proceso de Desarrollo

### 1. 🎯 Azure DevOps Integration
- **Todas las tareas** deben estar creadas en Azure DevOps antes de comenzar el desarrollo
- **Cada commit** debe referenciar el Task ID correspondiente: `feat(#123): descripción del cambio`
- **Cada PR** debe incluir el Task ID en el título y descripción

### 2. 🌿 Branching Strategy
```
main                    # Rama principal (producción)
├── develop            # Rama de desarrollo (staging)
├── feature/HU-XXX-*   # Features (desde develop)
├── bugfix/BUG-XXX-*   # Bug fixes (desde develop o main)
└── hotfix/HOT-XXX-*   # Hotfixes críticos (desde main)
```

**Convención de nombres:**
- `feature/HU-003-register-ui`
- `bugfix/BUG-001-login-validation`
- `hotfix/HOT-001-security-patch`

### 3. 📝 Commit Messages
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(#task-id): <description>

feat(#153): implement user registration form with validation
fix(#154): resolve login redirect issue
docs(#155): update API documentation
style(#156): format code according to ESLint rules
refactor(#157): optimize database queries
test(#158): add unit tests for auth service
chore(#159): update dependencies
```

### 4. 🏗️ Arquitectura FSD (Feature-Sliced Design)
```
src/
├── app/           # Next.js App Router
├── pages/         # Páginas y layouts
├── widgets/       # Componentes de página completa
├── features/      # Funcionalidades de negocio
├── entities/      # Entidades de dominio
├── shared/        # Código compartido
└── assets/        # Recursos estáticos
```

## 🔧 Setup de Desarrollo

### Prerrequisitos
- Node.js 20.19.4+
- PNPM 10.18.3+
- Git 2.51.0+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/sophie-sopita/cleantask.git
cd cleantask

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

## 📋 Checklist de PR

### Antes de crear el PR:
- [ ] ✅ Task creada en Azure DevOps
- [ ] 🌿 Rama creada desde `develop`
- [ ] 📝 Commits siguen convención con Task ID
- [ ] 🧪 Tests añadidos/actualizados
- [ ] 🔍 ESLint sin errores: `pnpm lint`
- [ ] 🏗️ Build exitoso: `pnpm build`
- [ ] 📚 Documentación actualizada

### Template de PR:
```markdown
## 🎯 Azure DevOps
**Task ID:** #153
**Epic:** EPIC 2 - Entidades User y Task
**Link:** [Azure DevOps Task](https://dev.azure.com/...)

## 📋 Descripción
Implementación del formulario de registro con validaciones...

## 🧪 Testing
- [x] Tests unitarios añadidos
- [x] Tests manuales realizados
- [x] Build exitoso
```

## 🧪 Testing

### Ejecutar tests
```bash
# Tests unitarios
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests en modo watch
pnpm test:watch
```

### Escribir tests
- **Ubicación:** `__tests__/` o `*.test.ts` junto al archivo
- **Naming:** `ComponentName.test.tsx`
- **Coverage mínimo:** 80%

## 🎨 Estilo de Código

### ESLint + Prettier
```bash
# Verificar estilo
pnpm lint

# Corregir automáticamente
pnpm lint:fix

# Formatear código
pnpm format
```

### Convenciones TypeScript
- **Interfaces:** `PascalCase` con prefijo `I` → `IUser`
- **Types:** `PascalCase` → `UserRole`
- **Components:** `PascalCase` → `RegisterForm`
- **Functions:** `camelCase` → `validateEmail`
- **Constants:** `UPPER_SNAKE_CASE` → `API_BASE_URL`

## 🚀 Deployment

### Ambientes
- **Development:** `pnpm dev` (localhost:3000)
- **Staging:** Deploy automático desde `develop`
- **Production:** Deploy desde `main` con tag

### CI/CD Pipeline
1. **PR Creation:** Validación automática
2. **Tests:** Jest + Testing Library
3. **Build:** Next.js build verification
4. **Deploy:** Vercel/Netlify automático

## 📞 Soporte

### Contacto
- **Project Manager:** Laura Sofía Carrillo
- **Tech Lead:** [Tu nombre]
- **Azure DevOps:** [Link al proyecto]

### Recursos
- [Next.js Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Azure DevOps](https://dev.azure.com/)

---

¡Gracias por contribuir a CleanTask! 🎉