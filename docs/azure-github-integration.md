# Azure DevOps + GitHub Integration Guide

## Resumen
Guía completa para integrar Azure DevOps Boards con GitHub para trazabilidad completa de Work Items y commits.

## Configuración Inicial

### 1. Conectar GitHub a Azure Boards

#### En Azure DevOps:
1. Navegar a **Project Settings** → **GitHub connections**
2. Hacer clic en **Connect your GitHub account**
3. Autorizar Azure DevOps en GitHub
4. Seleccionar el repositorio `cleantask`
5. Confirmar la conexión

#### Verificación:
- Los commits con `#<WorkItemID>` aparecerán automáticamente en Azure Boards
- Los Work Items mostrarán enlaces a commits y PRs relacionados

### 2. Configuración de Work Items

#### Formato de Commits:
```bash
git commit -m "feat(auth): add login form (#401)"
git commit -m "fix(ui): resolve button alignment issue (#402)"
git commit -m "docs: update API documentation (#403)"
```

#### Formato de Pull Requests:
```
Title: [#401] Crear formulario de login

Body:
Implementa el formulario de login con validaciones.

Azure Work Item: #401
Closes #401

How to test:
1. npm run dev
2. Open /login
3. Try valid and invalid credentials
```

### 3. Estados de Work Items

#### Flujo Automático:
- **New** → Cuando se crea el Work Item
- **Active** → Cuando se hace el primer commit con `#<ID>`
- **Resolved** → Cuando se mergea el PR
- **Closed** → Cuando se verifica en producción

#### Transiciones Manuales:
- Usar **Board view** para arrastrar Work Items entre columnas
- Actualizar **State** en la vista detallada del Work Item

## Mejores Prácticas

### Nomenclatura de Branches:
```bash
feature/login-form-HU-401
bugfix/button-alignment-HU-402
hotfix/security-patch-HU-403
epic/8-azure-cicd-integration
```

### Estructura de Commits:
```bash
type(scope): description (#WorkItemID)

Types: feat, fix, docs, style, refactor, test, chore
Scopes: auth, ui, api, db, config, ci
```

### Trazabilidad Completa:
1. **Work Item** → **Branch** → **Commits** → **PR** → **Deployment**
2. Cada commit debe referenciar un Work Item
3. Cada PR debe cerrar al menos un Work Item
4. Usar labels en GitHub que coincidan con Azure tags

## Automatización

### GitHub Actions + Azure Boards:
- Los commits automáticamente actualizan Work Items
- Los PRs mergeados cambian estado a "Resolved"
- Los deployments exitosos pueden cerrar Work Items

### Webhooks Configurados:
- **Push events** → Actualizar Work Items
- **PR events** → Cambiar estados
- **Release events** → Cerrar Work Items

## Comandos Útiles

### Crear Feature Branch:
```bash
git checkout main
git pull
git checkout -b feature/task-name-HU-<ID>
```

### Commit con Referencia:
```bash
git add .
git commit -m "feat(scope): description (#<WorkItemID>)"
git push -u origin feature/task-name-HU-<ID>
```

### Crear PR con Azure Link:
```bash
# En GitHub PR description:
Azure Work Item: https://dev.azure.com/org/project/_workitems/edit/<ID>
Closes #<ID>
```

## Troubleshooting

### Conexión No Funciona:
1. Verificar permisos en GitHub
2. Re-autorizar en Azure DevOps
3. Comprobar que el repositorio esté seleccionado

### Work Items No Se Actualizan:
1. Verificar formato de commit: `(#<ID>)`
2. Comprobar que el Work Item existe
3. Verificar que el usuario tiene permisos

### PRs No Cierran Work Items:
1. Usar `Closes #<ID>` en PR description
2. Verificar que el PR se mergea (no se cierra)
3. Comprobar configuración de webhooks

## Métricas y Reportes

### Azure DevOps Analytics:
- **Velocity**: Work Items completados por sprint
- **Burndown**: Progreso del sprint actual
- **Lead Time**: Tiempo desde creación hasta cierre
- **Cycle Time**: Tiempo desde inicio hasta completado

### GitHub Insights:
- **Code frequency**: Commits por semana
- **Contributors**: Actividad por desarrollador
- **Pulse**: Resumen de actividad del repositorio

## Checklist de Integración

- [ ] Azure DevOps project creado
- [ ] GitHub repository conectado
- [ ] Webhooks configurados
- [ ] Work Items template definido
- [ ] Branch naming convention establecida
- [ ] Commit message format definido
- [ ] PR template creado
- [ ] Team permissions configurados
- [ ] Automation rules activadas
- [ ] Reporting dashboards configurados

## Enlaces Útiles

- [Azure DevOps GitHub Integration](https://docs.microsoft.com/en-us/azure/devops/boards/github/)
- [GitHub Azure Boards App](https://github.com/marketplace/azure-boards)
- [Work Item Linking](https://docs.microsoft.com/en-us/azure/devops/boards/github/link-to-from-github)

---

**Fecha de creación**: $(Get-Date -Format "yyyy-MM-dd")
**Epic**: #8 - Azure + GitHub + CI/CD Integration
**Estado**: ✅ IMPLEMENTADO