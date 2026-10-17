# 🤖 Usando ECC para Desarrollar Mi Despensa

Esta guía muestra cómo usar **todas las skills de ECC** para desarrollar la app Mi Despensa con la máxima calidad.

---

## 📋 Tabla de Contenidos

1. [Instalación de ECC](#instalación)
2. [Skills de React/TypeScript](#skills-react)
3. [Skills de Testing](#skills-testing)
4. [Skills de Seguridad](#skills-seguridad)
5. [Skills de Performance](#skills-performance)
6. [Skills de Code Review](#skills-review)
7. [Skills de Build](#skills-build)
8. [Skills de Accesibilidad](#skills-accesibilidad)
9. [Skills de Documentación](#skills-documentacion)
10. [Workflows Automatizados](#workflows)
11. [Checklist de Calidad](#checklist)

---

<a name="instalacion"></a>
## 🚀 1. Instalación de ECC

### Para Claude Code

```bash
# Instalar ECC
/plugin install ecc@ecc

# Verificar instalación
/plugin list
```

### Para Codex

```bash
npx ecc-universal install --harness codex
```

### Para Cursor

```bash
npx ecc-universal install --harness cursor
```

### Configuración del Proyecto

Crear `.claude/rules/mi-despensa.md`:

```markdown
# Mi Despensa - Reglas del Proyecto

## Stack Tecnológico
- React 18 + TypeScript
- Tailwind CSS 4
- Framer Motion (animaciones)
- Zustand (estado global)
- Supabase (backend)
- Vite (build tool)

## Convenciones de Código
- Componentes funcionales con TypeScript
- Hooks personalizados para lógica reutilizable
- Animaciones con Framer Motion (spring physics)
- Estilos con Tailwind CSS (utility-first)
- Estado global con Zustand
- Persistencia con localStorage

## Principios de Diseño
- Custom easing curves (no CSS defaults)
- Spring physics para interacciones naturales
- Scale 0.97 en botones (feedback táctil)
- Stagger animations (30-80ms entre items)
- Reduced motion support
- Solo animar transform y opacity
- Interruptible animations

## Seguridad
- Autenticación con Supabase Auth
- Row Level Security (RLS)
- Validación de todas las entradas
- Encriptación de datos sensibles
- Protección contra XSS, CSRF, SQL Injection

## Performance
- Lazy loading de rutas
- React.memo para componentes puros
- Optimización de imágenes
- Solo animar transform/opacity (GPU)
- Code splitting con dynamic imports

## Testing
- Tests unitarios con React Testing Library
- Tests de integración con Cypress
- Coverage mínimo: 80%
- TDD (Test-Driven Development)

## Accesibilidad
- ARIA labels en todos los componentes interactivos
- Navegación por teclado
- Contraste WCAG AA mínimo
- Reduced motion support
- Screen reader friendly
```

---

<a name="skills-react"></a>
## ⚛️ 2. Skills de React/TypeScript

### `/react-review` - Code Review de React

**Cuándo usar**: Antes de cada commit, después de crear/modificar componentes

```bash
# Revisar todo el proyecto
/react-review

# Revisar componente específico
/react-review src/components/Button.tsx

# Revisar página específica
/react-review src/pages/Dashboard.tsx
```

**Qué revisa**:
- ✅ Hooks de React (useEffect, useState, useMemo)
- ✅ Patrones de TypeScript (tipos, interfaces, generics)
- ✅ Renderizado condicional
- ✅ Manejo de estados
- ✅ Optimización de re-renders
- ✅ Limpieza de efectos
- ✅ Dependencias de hooks

**Ejemplo de uso**:

```bash
# Después de crear un nuevo componente
/react-review src/pages/ProductsPage.tsx

# ECC revisará:
# - ¿Están bien tipados los props?
# - ¿Hay memory leaks en useEffect?
# - ¿Se usan useMemo/useCallback correctamente?
# - ¿Hay renders innecesarios?
# - ¿Se limpian los event listeners?
```

### `/react-patterns` - Patrones de React

**Cuándo usar**: Al crear componentes nuevos o refactorizar

```bash
/react-patterns
```

**Patrones aplicados a Mi Despensa**:

```typescript
// ✅ Patrón: Componente con TypeScript estricto
interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete 
}) => {
  // Implementación
};

// ✅ Patrón: Custom Hook para lógica reutilizable
export const useProducts = (houseId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch products
  }, [houseId]);
  
  return { products, loading };
};

// ✅ Patrón: Componente con animaciones
export const AnimatedCard = motion(Card);

// ✅ Patrón: Estado global con Zustand
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Estado
    }),
    { name: 'mi-despensa-storage' }
  )
);
```

### `/typescript-review` - Revisión de TypeScript

```bash
/typescript-review
```

**Qué revisa**:
- Tipos estrictos vs `any`
- Interfaces vs Types
- Generics
- Utility Types
- Type Guards
- Discriminated Unions

**Ejemplos aplicados**:

```typescript
// ✅ Bien tipado
type ProductType = 'food' | 'medicine' | 'cleaning' | 'bathroom' | 'other';

interface Product {
  id: string;
  name: string;
  productType: ProductType;
  category: string;
  quantity: number;
  expirationDate?: string; // Optional
}

// ❌ Mal tipado (ECC lo detectará)
const product: any = { ... }; // Evitar 'any'
```

---

<a name="skills-testing"></a>
## 🧪 3. Skills de Testing

### `/react-test` - Generar Tests de React

**Cuándo usar**: Después de crear/modificar componentes

```bash
# Generar tests para componente
/react-test src/components/Button.tsx

# Generar tests para página
/react-test src/pages/Dashboard.tsx

# Generar tests para hook
/react-test src/hooks/useProducts.ts
```

**Qué genera**:
- ✅ Tests unitarios con React Testing Library
- ✅ Tests de interacción (clicks, inputs)
- ✅ Tests de accesibilidad
- ✅ Tests de estados (loading, error, success)
- ✅ Mocks de dependencias
- ✅ Coverage report

**Ejemplo de test generado**:

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('has correct accessibility attributes', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
  });
});
```

### `/test-review` - Revisar Tests

```bash
/test-review
```

**Qué revisa**:
- Coverage de tests
- Calidad de los tests
- Mocks innecesarios
- Tests frágiles
- Assertions faltantes

### `/tdd` - Test-Driven Development

```bash
/tdd
```

**Workflow TDD para Mi Despensa**:

```bash
# 1. Escribir test primero
# Crear src/pages/__tests__/ProductsPage.test.tsx

# 2. Ejecutar test (fallará)
npm test -- ProductsPage

# 3. Implementar código mínimo para pasar
# Crear src/pages/ProductsPage.tsx

# 4. Ejecutar test (pasará)
npm test -- ProductsPage

# 5. Refactorizar
/react-review src/pages/ProductsPage.tsx

# 6. Repetir
```

---

<a name="skills-seguridad"></a>
## 🔒 4. Skills de Seguridad

### `/security-scan` - Escanear Vulnerabilidades

**Cuándo usar**: Antes de cada deploy, después de cambios críticos

```bash
# Escanear todo el proyecto
/security-scan

# Escanear archivo específico
/security-scan src/pages/AuthPage.tsx
```

**Qué escanea**:
- ✅ XSS (Cross-Site Scripting)
- ✅ Inyecciones SQL
- ✅ Datos sensibles expuestos
- ✅ Dependencias vulnerables
- ✅ CSRF vulnerabilities
- ✅ Hardcoded secrets
- ✅ Insecure dependencies

**Ejemplo de vulnerabilidad detectada**:

```typescript
// ❌ VULNERABLE (ECC lo detectará)
const userInput = '<script>alert("xss")</script>';
element.innerHTML = userInput; // XSS vulnerability!

// ✅ SEGURO
const userInput = '<script>alert("xss")</script>';
element.textContent = userInput; // Safe
```

### `/security-review` - Revisión de Seguridad

```bash
/security-review
```

**Qué revisa**:
- Autenticación y autorización
- Validación de inputs
- Manejo de sesiones
- Encriptación de datos
- CORS configuration
- Content Security Policy

### `/ecc-guardrails` - Guardarrailes de Seguridad

```bash
/ecc-guardrails
```

**Aplicado a Mi Despensa**:

```typescript
// ✅ Validación de inputs
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Mínimo 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Debe tener mayúscula' };
  }
  // ... más validaciones
  return { valid: true, message: 'Contraseña válida' };
};

// ✅ Sanitización de datos
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Eliminar tags HTML
    .trim()
    .substring(0, 1000); // Limitar longitud
};
```

---

<a name="skills-performance"></a>
## ⚡ 5. Skills de Performance

### `/react-performance` - Optimizar Performance

**Cuándo usar**: Cuando la app se siente lenta, antes de deploy

```bash
/react-performance
```

**Qué optimiza**:
- ✅ Re-renders innecesarios
- ✅ Memoización (useMemo, useCallback, React.memo)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Virtualización de listas
- ✅ Optimización de imágenes
- ✅ Animaciones en GPU

**Ejemplos aplicados a Mi Despensa**:

```typescript
// ✅ Memoización de componentes pesados
const ProductList = React.memo(({ products }: { products: Product[] }) => {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

// ✅ useMemo para cálculos costosos
const expiringProducts = useMemo(() => {
  return products.filter(p => {
    const status = getExpirationStatus(p.expirationDate);
    return status === 'expired' || status === 'today' || status === 'soon';
  });
}, [products]);

// ✅ useCallback para funciones estables
const handleDelete = useCallback((id: string) => {
  deleteProduct(id);
}, [deleteProduct]);

// ✅ Lazy loading de rutas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));

// ✅ Animaciones en GPU (solo transform/opacity)
<motion.div
  animate={{ 
    opacity: 1, 
    y: 0,
    scale: 1 
  }}
  // ❌ Evitar: width, height, padding, margin
/>
```

### `/bundle-analyzer` - Analizar Bundle

```bash
/bundle-analyzer
```

**Qué analiza**:
- Tamaño del bundle
- Dependencias pesadas
- Code splitting opportunities
- Tree shaking effectiveness

---

<a name="skills-review"></a>
## 🔍 6. Skills de Code Review

### `/review` - Code Review General

```bash
/review
```

**Qué revisa**:
- Calidad del código
- Legibilidad
- Mantenibilidad
- DRY (Don't Repeat Yourself)
- SOLID principles
- Patrones de diseño

### `/ecc-conventions` - Convenciones de Código

```bash
/ecc-conventions
```

**Convenciones aplicadas a Mi Despensa**:

```typescript
// ✅ Naming conventions
// Componentes: PascalCase
const ProductCard = () => { ... };

// Funciones: camelCase
const handleDelete = () => { ... };

// Constantes: UPPER_SNAKE_CASE
const MAX_PRODUCTS = 1000;

// Types/Interfaces: PascalCase
interface Product { ... }
type ProductType = 'food' | 'medicine';

// ✅ File organization
src/
├── components/       // Componentes reutilizables
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── pages/           // Páginas de la app
│   ├── Dashboard.tsx
│   └── ProductsPage.tsx
├── lib/             // Utilidades y configuración
│   ├── supabase.ts
│   └── utils.ts
└── store/           // Estado global
    └── useStore.ts

// ✅ Comment style
/**
 * Componente de tarjeta de producto con animaciones
 * y feedback táctil (scale 0.97 en press)
 * 
 * @param product - Datos del producto
 * @param onEdit - Callback al editar
 * @param onDelete - Callback al eliminar
 */
const ProductCard = ({ product, onEdit, onDelete }: Props) => { ... };
```

---

<a name="skills-build"></a>
## 🏗️ 7. Skills de Build

### `/react-build` - Resolver Errores de Build

**Cuándo usar**: Cuando `npm run build` falla

```bash
/react-build
```

**Qué resuelve**:
- ✅ Errores de TypeScript
- ✅ Errores de imports
- ✅ Errores de dependencias
- ✅ Errores de configuración
- ✅ Errores de tipos

### `/build-review` - Revisar Build

```bash
/build-review
```

**Qué revisa**:
- Tamaño del bundle
- Tree shaking
- Code splitting
- Assets optimization
- Source maps

---

<a name="skills-accesibilidad"></a>
## ♿ 8. Skills de Accesibilidad

### `/a11y-review` - Revisión de Accesibilidad

```bash
/a11y-review
```

**Qué revisa**:
- ✅ ARIA labels
- ✅ Navegación por teclado
- ✅ Contraste de colores (WCAG AA)
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Reduced motion
- ✅ Semantic HTML

**Ejemplos aplicados a Mi Despensa**:

```typescript
// ✅ ARIA labels
<button 
  aria-label="Eliminar producto"
  onClick={handleDelete}
>
  <TrashIcon />
</button>

// ✅ Focus indicators
<button className="focus:outline-none focus:ring-2 focus:ring-emerald-500">
  Click me
</button>

// ✅ Reduced motion
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
}

// ✅ Semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard">Inicio</a></li>
  </ul>
</nav>

// ✅ Keyboard navigation
<button 
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

---

<a name="skills-documentacion"></a>
## 📚 9. Skills de Documentación

### `/doc-review` - Revisar Documentación

```bash
/doc-review
```

**Qué revisa**:
- README completo
- JSDoc comments
- Ejemplos de uso
- API documentation
- Changelog

### `/generate-docs` - Generar Documentación

```bash
/generate-docs
```

**Qué genera**:
- JSDoc para funciones
- README para componentes
- API documentation
- Ejemplos de uso

**Ejemplo aplicado**:

```typescript
/**
 * Genera recetas basadas en productos disponibles
 * 
 * @param products - Lista de productos disponibles
 * @param category - Categoría opcional para filtrar
 * @returns Promesa con array de recetas generadas
 * 
 * @example
 * ```typescript
 * const recipes = await generateRecipes(products, 'frutas');
 * console.log(recipes[0].title); // "Ensalada de frutas"
 * ```
 */
const generateRecipes = async (
  products: Product[],
  category?: string
): Promise<Recipe[]> => {
  // Implementación
};
```

---

<a name="workflows"></a>
## 🔄 10. Workflows Automatizados

### Workflow de Desarrollo Completo

```bash
# 1. Crear rama
git checkout -b feature/new-product-card

# 2. Implementar feature
# Escribir código...

# 3. Code review
/react-review src/components/ProductCard.tsx
/typescript-review src/components/ProductCard.tsx

# 4. Generar tests
/react-test src/components/ProductCard.tsx

# 5. Ejecutar tests
npm test

# 6. Security scan
/security-scan src/components/ProductCard.tsx

# 7. Performance check
/react-performance

# 8. Accessibility review
/a11y-review src/components/ProductCard.tsx

# 9. Build check
npm run build
/react-build

# 10. Commit
git add .
git commit -m "feat: add ProductCard component with animations"

# 11. Push
git push origin feature/new-product-card
```

### Workflow de Bug Fix

```bash
# 1. Crear rama
git checkout -b fix/product-deletion-bug

# 2. Reproducir bug
# Identificar problema...

# 3. Escribir test que falla
/react-test src/pages/ProductsPage.tsx

# 4. Implementar fix
# Corregir código...

# 5. Verificar test pasa
npm test

# 6. Code review
/react-review
/security-scan

# 7. Commit
git add .
git commit -m "fix: resolve product deletion bug"

# 8. Push
git push origin fix/product-deletion-bug
```

### Workflow de Refactor

```bash
# 1. Crear rama
git checkout -b refactor/product-list

# 2. Identificar áreas de mejora
/react-review
/react-performance

# 3. Refactorizar
# Mejorar código...

# 4. Verificar tests
npm test

# 5. Performance check
/react-performance

# 6. Bundle analysis
/bundle-analyzer

# 7. Commit
git add .
git commit -m "refactor: optimize ProductList with memoization"

# 8. Push
git push origin refactor/product-list
```

---

<a name="checklist"></a>
## ✅ 11. Checklist de Calidad con ECC

### Antes de Cada Commit

```bash
# Code review
/react-review
/typescript-review

# Tests
npm test

# Security
/security-scan

# Performance
/react-performance

# Accessibility
/a11y-review

# Build
npm run build
```

### Antes de Cada PR

```bash
# Full review
/review
/security-review
/test-review
/doc-review

# Performance
/react-performance
/bundle-analyzer

# Accessibility
/a11y-review

# Build
npm run build
/react-build
```

### Antes de Cada Deploy

```bash
# Security audit
/security-scan
/security-review

# Performance audit
/react-performance
/bundle-analyzer

# Accessibility audit
/a11y-review

# Final build
npm run build
/react-build

# Deploy
npm run deploy
```

---

## 📊 Resumen de Skills Aplicadas

| Skill | Comando | Cuándo Usar |
|-------|---------|-------------|
| React Review | `/react-review` | Antes de cada commit |
| TypeScript Review | `/typescript-review` | Después de crear tipos |
| React Test | `/react-test` | Después de crear componentes |
| Security Scan | `/security-scan` | Antes de cada PR |
| React Performance | `/react-performance` | Cuando la app se siente lenta |
| A11y Review | `/a11y-review` | Antes de cada PR |
| Build Review | `/react-build` | Cuando build falla |
| Code Review | `/review` | Antes de cada PR |
| Doc Review | `/doc-review` | Antes de cada release |

---

## 🎯 Beneficios de Usar ECC

### Para Desarrolladores

- ⚡ **50% más rápido** en code reviews
- 🛡️ **Seguridad automatizada** desde el inicio
- 🧪 **Tests generados automáticamente**
- 📚 **Documentación actualizada**
- 🎯 **Mejores prácticas** aplicadas automáticamente

### Para el Proyecto

- 🚀 **Mejor calidad de código**
- 🔒 **Menos vulnerabilidades**
- 📈 **Mejor rendimiento**
- ♿ **Mejor accesibilidad**
- 🎨 **UI/UX consistente**
- 🤝 **Colaboración mejorada**

---

## 🔗 Recursos

- **Repositorio ECC**: https://github.com/affaan-m/ECC
- **Sitio Web**: https://ecc.tools
- **Discord**: https://discord.gg/36yGMHGFbR
- **Documentación ECC**: Ver archivos en `/docs` del repositorio

---

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Estado**: ✅ Todas las skills de ECC aplicadas a Mi Despensa
