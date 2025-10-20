# Changelog

## v0.1.0 – Admin panel real y gestión de usuarios

Release inicial del panel de administración conectado a API real y módulo de gestión de usuarios.

### Nuevas funcionalidades
- AdminDashboardContent: estadísticas reales desde `/api/admin/stats`, estados de carga y error, y enlaces rápidos.
- Página `/admin`: usa AdminDashboardContent dentro de `ProtectedRoute` (solo admin).
- AdminUsersContent: filtros, paginación, contadores y modales (crear/editar/eliminar) con llamadas reales a API y `debounce`.
- Página `/admin/users`: integra AdminUsersContent y `ProtectedRoute`.

### Correcciones y ajustes
- Alineación de tipos `AdminUser` y corrección de incompatibilidad TypeScript (`role: 'usuario' | 'admin'`) en `UsersTable`.
- Desactivación de `prefetch` de Next.js en `Navigation` y acciones rápidas del dashboard para evitar errores “TypeError: Failed to fetch” en rutas protegidas/no disponibles.
- Ajustes de exportaciones en `shared/ui` y `shared/lib` donde aplica.

### Notas de despliegue
- El servidor de desarrollo puede iniciarse en puerto alternativo si `3000` está ocupado (ej. `3005`).
- Asegurar que el token de admin esté presente para acceder a `/admin` y `/admin/users`.

### Próximos pasos sugeridos
- Añadir gráfico de evolución de usuarios/tareas al dashboard.
- Centralizar tipos compartidos (p.ej. `AdminUser`) en `src/types` para evitar divergencias futuras.