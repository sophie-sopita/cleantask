# 🧹 CleanTask

Una aplicación moderna de gestión de tareas construida con las últimas tecnologías web para demostrar las mejores prácticas de desarrollo con Next.js 15, React Server Components y TypeScript.

## 🚀 Tecnologías Implementadas

### Frontend
- **Next.js 15**: Framework React con App Router y soporte completo para React Server Components
- **React 19**: Biblioteca UI con Server Components para renderizado optimizado
- **TypeScript**: Lenguaje tipado estricto para desarrollo robusto y mantenible
- **Tailwind CSS**: Framework de utilidades CSS para diseño rápido y responsivo

### Herramientas de Desarrollo
- **PNPM**: Gestor de paquetes JavaScript eficiente y rápido
- **ESLint**: Linter configurado para mantener calidad y consistencia del código
- **Turbopack**: Bundler ultra-rápido para desarrollo (incluido en Next.js)
- **Node.js**: Plataforma de ejecución para el servidor de Next.js

## 📁 Estructura del Proyecto

```
cleantask/
├── src/
│   └── app/                    # App Router de Next.js
│       ├── components/         # Componentes reutilizables
│       │   ├── Navigation.tsx  # Navegación (Client Component)
│       │   ├── ClientCounter.tsx # Ejemplo de Client Component
│       │   └── ServerInfo.tsx  # Ejemplo de Server Component
│       ├── tasks/              # Ruta /tasks
│       │   └── page.tsx        # Página de tareas
│       ├── about/              # Ruta /about
│       │   └── page.tsx        # Página acerca de
│       ├── layout.tsx          # Layout raíz con metadata
│       ├── page.tsx            # Página de inicio
│       └── globals.css         # Estilos globales con Tailwind
├── package.json                # Configuración del proyecto con PNPM
├── pnpm-lock.yaml             # Lockfile de PNPM
├── tailwind.config.ts         # Configuración de Tailwind CSS
├── tsconfig.json              # Configuración de TypeScript
├── eslint.config.mjs          # Configuración optimizada de ESLint
└── next.config.ts             # Configuración de Next.js con Turbopack
```

## 🛠️ Metodología del Proyecto

### 1. Estructura Basada en Carpetas para Rutas
El App Router de Next.js utiliza la carpeta `app/` para definir rutas y subrutas mediante la creación de carpetas con archivos específicos (`page.tsx`). Esto promueve una organización clara y declarativa:

- `/` → `app/page.tsx`
- `/tasks` → `app/tasks/page.tsx`
- `/about` → `app/about/page.tsx`

### 2. React Server Components por Defecto
Las páginas y componentes creados en la carpeta `app/` son Server Components automáticamente, optimizando el renderizado del lado servidor:

- **Server Components**: Se ejecutan en el servidor, mejoran SEO y rendimiento inicial
- **Client Components**: Requieren `'use client'` para interactividad del lado cliente

### 3. Uso de TypeScript desde el Inicio
TypeScript está configurado para definir aplicaciones robustas:
- Tipado estricto para prevenir errores
- Mejor experiencia de desarrollo con autocompletado
- Interfaces y tipos personalizados para mayor seguridad

### 4. Incorporación de Tailwind CSS
Aprovecha la integración automática de Tailwind:
- Clases CSS aplicadas directamente en componentes
- Diseño responsivo con utilidades móvil-first
- Configuración optimizada para Next.js

### 5. Desarrollo Incremental
El proceso sigue una metodología paso a paso:
1. Configuración inicial con Next.js y PNPM
2. Configuración de ESLint y Tailwind CSS
3. Creación de páginas simples con Server Components
4. Adición progresiva de rutas y componentes
5. Implementación de Client Components cuando se requiere interactividad

## 🏃‍♂️ Comandos de Desarrollo

### Instalación
```bash
# Instalar dependencias con PNPM
pnpm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo con Turbopack
pnpm dev
```

### Construcción
```bash
# Construir para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Linting
```bash
# Ejecutar ESLint
pnpm lint
```

## 🔄 Server vs Client Components

### Server Components
- ✅ Se ejecutan en el servidor
- ✅ Mejor SEO y rendimiento inicial
- ✅ Acceso directo a bases de datos y APIs
- ✅ Menor bundle size del cliente
- ❌ No pueden usar hooks de React
- ❌ No tienen acceso a APIs del navegador

### Client Components
- ✅ Se ejecutan en el navegador
- ✅ Permiten interactividad completa
- ✅ Pueden usar hooks y estado de React
- ✅ Acceso a APIs del navegador
- ❌ Requieren directiva `'use client'`
- ❌ Aumentan el bundle size del cliente

## 🌟 Características Implementadas

- **Navegación**: Sistema de navegación con indicador de página activa
- **Páginas de ejemplo**: Inicio, Tareas y Acerca de
- **Componentes demostrativos**: Ejemplos de Server y Client Components
- **Diseño responsivo**: Interfaz adaptable a diferentes dispositivos
- **Metadata optimizada**: SEO mejorado con metadata dinámica
- **Tipado completo**: TypeScript en toda la aplicación

## 📚 Recursos y Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PNPM Documentation](https://pnpm.io/motivation)

## 🤝 Contribución

Este proyecto sirve como ejemplo de implementación de tecnologías modernas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 🚢 Releases

- Notas internas del release `v0.1.0`: [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md)
- Página de Releases en GitHub: https://github.com/sophie-sopita/cleantask/releases

## 🔐 Cuenta admin por defecto (seed)

Al ejecutar el seed (`pnpm prisma db seed`), se crea una cuenta administradora por defecto para acceder al panel `/admin`:

- Email: `admin@cleantask.com`
- Password: `admin123`

Advertencia: estas credenciales son solo para ambiente local/desarrollo. Para producción, elimina o modifica estos datos y utiliza un proceso de provisioning seguro.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**CleanTask** - Demostrando las mejores prácticas con Next.js 15, React Server Components y TypeScript 🚀
