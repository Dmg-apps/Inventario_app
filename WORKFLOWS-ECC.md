# 🔄 Workflows de ECC para Mi Despensa

Este documento define los workflows automatizados usando ECC para mantener la máxima calidad del código.

---

## 📋 Tabla de Contenidos

1. [Workflow de Desarrollo Diario](#workflow-diario)
2. [Workflow de Feature](#workflow-feature)
3. [Workflow de Bug Fix](#workflow-bugfix)
4. [Workflow de Refactor](#workflow-refactor)
5. [Workflow de Release](#workflow-release)
6. [Comandos Rápidos](#comandos-rapidos)

---

<a name="workflow-diario"></a>
## 🌅 1. Workflow de Desarrollo Diario

### Al Iniciar el Día

```bash
# 1. Actualizar rama principal
git checkout main
git pull origin main

# 2. Crear rama de trabajo
git checkout -b feature/nombre-feature

# 3. Instalar dependencias (si hay cambios)
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Durante el Desarrollo

```bash
# Cada vez que completes un componente
/react-review src/components/TuComponente.tsx
/typescript-review src/components/TuComponente.tsx

# Antes de hacer commit
npm test
/security-scan
/react-performance

# Commit
git add .
git commit -m "feat: descripción del cambio"
```

### Al Final del Día

```bash
# Push de cambios
git push origin feature/nombre-feature

# Crear PR en GitHub
# GitHub abrirá automáticamente:
# - Code review con ECC
# - Security scan
# - Performance check
```

---

<a name="workflow-feature"></a>
## ✨ 2. Workflow de Feature

### Paso 1: Planificación

```bash
# Crear rama
git checkout -b feature/nueva-funcionalidad

# Documentar en el commit inicial
git commit --allow-empty -m "chore: plan feature/nueva-funcionalidad

Objetivo: [descripción]
Archivos afectados: [lista]
Tests necesarios: [lista]
"
```

### Paso 2: Implementación con TDD

```bash
# 1. Escribir test primero
# Crear src/pages/__tests__/NuevaPagina.test.tsx

# 2. Ejecutar test (debe fallar)
npm test -- NuevaPagina

# 3. Implementar código mínimo
# Crear src/pages/NuevaPagina.tsx

# 4. Ejecutar test (debe pasar)
npm test -- NuevaPagina

# 5. Refactorizar
/react-review src/pages/NuevaPagina.tsx
/react-performance src/pages/NuevaPagina.tsx
```

### Paso 3: Code Review

```bash
# Revisar todo el código nuevo
/react-review
/typescript-review
/security-scan

# Revisar accesibilidad
/a11y-review

# Revisar performance
/react-performance
```

### Paso 4: Documentación

```bash
# Generar documentación
/generate-docs

# Revisar documentación
/doc-review
```

### Paso 5: Merge

```bash
# Actualizar rama principal
git checkout main
git pull origin main

# Merge de feature
git merge feature/nueva-funcionalidad

# Resolver conflictos si los hay
# Ejecutar tests nuevamente
npm test

# Push
git push origin main
```

---

<a name="workflow-bugfix"></a>
## 🐛 3. Workflow de Bug Fix

### Paso 1: Reproducir Bug

```bash
# Crear rama
git checkout -b fix/descripcion-bug

# Documentar bug
git commit --allow-empty -m "chore: document bug

Descripción: [qué pasa]
Pasos para reproducir: [pasos]
Comportamiento esperado: [qué debería pasar]
Comportamiento actual: [qué pasa]
"
```

### Paso 2: Escribir Test que Fallo

```bash
# Escribir test que reproduzca el bug
# Crear src/pages/__tests__/BugTest.test.tsx

# Ejecutar test (debe fallar)
npm test -- BugTest
```

### Paso 3: Implementar Fix

```bash
# Corregir el código
# Editar archivos afectados...

# Ejecutar test (debe pasar)
npm test -- BugTest
```

### Paso 4: Verificar No Romper Nada

```bash
# Ejecutar todos los tests
npm test

# Code review
/react-review
/security-scan

# Performance check
/react-performance
```

### Paso 5: Merge

```bash
# Commit
git add .
git commit -m "fix: descripción del fix

Fixes #[número-issue]
"

# Push y merge
git push origin fix/descripcion-bug
# Crear PR en GitHub
```

---

<a name="workflow-refactor"></a>
## 🔧 4. Workflow de Refactor

### Paso 1: Identificar Áreas de Mejora

```bash
# Code review general
/review

# Performance review
/react-performance

# Security review
/security-review

# Bundle analysis
/bundle-analyzer
```

### Paso 2: Crear Plan de Refactor

```bash
# Crear rama
git checkout -b refactor/descripcion

# Documentar plan
git commit --allow-empty -m "chore: refactor plan

Áreas a mejorar:
- [área 1]
- [área 2]

Beneficios esperados:
- [beneficio 1]
- [beneficio 2]
"
```

### Paso 3: Refactorizar Incrementalmente

```bash
# Refactorizar un componente a la vez
/react-review src/components/ComponenteA.tsx
npm test -- ComponenteA

# Refactorizar siguiente
/react-review src/components/ComponenteB.tsx
npm test -- ComponenteB

# Continuar hasta completar
```

### Paso 4: Verificar Performance

```bash
# Performance check
/react-performance

# Bundle analysis
/bundle-analyzer

# Comparar con antes
# (usar Lighthouse o WebPageTest)
```

### Paso 5: Merge

```bash
# Commit
git add .
git commit -m "refactor: descripción del refactor

Mejoras:
- [mejora 1]
- [mejora 2]
"

# Push y merge
git push origin refactor/descripcion
```

---

<a name="workflow-release"></a>
## 🚀 5. Workflow de Release

### Paso 1: Preparar Release

```bash
# Crear rama de release
git checkout -b release/v1.0.0

# Actualizar versión en package.json
npm version patch  # o minor, major

# Actualizar CHANGELOG
# Editar CHANGELOG.md
```

### Paso 2: QA Completo

```bash
# Todos los tests
npm test

# Code review completo
/review
/react-review
/typescript-review

# Security audit
/security-scan
/security-review

# Performance audit
/react-performance
/bundle-analyzer

# Accessibility audit
/a11y-review

# Build check
npm run build
/react-build
```

### Paso 3: Documentación Final

```bash
# Generar documentación
/generate-docs

# Revisar documentación
/doc-review

# Actualizar README si es necesario
```

### Paso 4: Deploy a Staging

```bash
# Deploy a staging
npm run deploy:staging

# Testing manual en staging
# Verificar todas las funcionalidades
```

### Paso 5: Deploy a Producción

```bash
# Merge a main
git checkout main
git merge release/v1.0.0

# Tag
git tag v1.0.0

# Push
git push origin main
git push origin v1.0.0

# Deploy a producción
npm run deploy:production
```

### Paso 6: Post-Release

```bash
# Monitorear errores
# Verificar logs
# Monitorear performance

# Crear release notes en GitHub
```

---

<a name="comandos-rapidos"></a>
## ⚡ 6. Comandos Rápidos

### Comandos Diarios

```bash
# Code review rápido
/react-review

# Test rápido
npm test

# Security scan rápido
/security-scan

# Performance check rápido
/react-performance
```

### Comandos Semanales

```bash
# Code review completo
/review

# Security review completo
/security-review

# Performance review completo
/react-performance

# Bundle analysis
/bundle-analyzer
```

### Comandos Mensuales

```bash
# Dependency audit
npm audit

# Update dependencies
npm update

# Full security scan
/security-scan --deep

# Full performance audit
/react-performance --deep
```

---

## 📊 Checklist de Calidad

### Antes de Cada Commit

- [ ] `/react-review` ejecutado
- [ ] `/typescript-review` ejecutado
- [ ] `npm test` pasa
- [ ] `/security-scan` ejecutado
- [ ] Commit message sigue convenciones

### Antes de Cada PR

- [ ] `/review` ejecutado
- [ ] `/react-performance` ejecutado
- [ ] `/a11y-review` ejecutado
- [ ] `/security-review` ejecutado
- [ ] Documentación actualizada
- [ ] Tests añadidos para nueva funcionalidad

### Antes de Cada Release

- [ ] Todos los tests pasan
- [ ] Code review completo
- [ ] Security audit completo
- [ ] Performance audit completo
- [ ] Accessibility audit completo
- [ ] Build funciona correctamente
- [ ] Documentación completa
- [ ] CHANGELOG actualizado
- [ ] Version bump en package.json

---

## 🎯 Métricas de Calidad

### Objetivos

- **Code Coverage**: >80%
- **TypeScript Strict**: 100%
- **Accessibility Score**: >90 (Lighthouse)
- **Performance Score**: >90 (Lighthouse)
- **Security Issues**: 0 críticos, <5 bajos

### Monitoreo

```bash
# Coverage report
npm test -- --coverage

# Lighthouse audit
npm run audit:lighthouse

# Security report
npm audit

# Bundle size
npm run build && ls -lh dist/
```

---

## 🔗 Recursos

- **ECC Documentation**: https://github.com/affaan-m/ECC
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React Best Practices**: https://react.dev/learn

---

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Mantenido por**: Equipo de Desarrollo con ECC
