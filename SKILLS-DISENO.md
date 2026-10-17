# 🎨 Skills de Diseño Aplicadas (Emil Kowalski)

Este documento describe las habilidades de diseño engineering aplicadas al proyecto, basadas en la filosofía de Emil Kowalski.

---

## 🎯 Filosofía Central

### 1. Los detalles invisibles se acumulan
La mayoría de los detalles que los usuarios nunca notan conscientemente. Ese es el punto. Cuando una característica funciona exactamente como alguien asume que debería, proceden sin pensar en ello. Ese es el objetivo.

> "Todos esos detalles invisibles se combinan para producir algo que es simplemente impresionante, como mil voces apenas audibles cantando afinadas." - Paul Graham

### 2. La belleza es ventaja
Las personas seleccionan herramientas basándose en la experiencia general, no solo en la funcionalidad. Buenos defaults y buenas animaciones son diferenciadores reales.

### 3. El gusto se entrena, no es innato
El buen gusto no es preferencia personal. Es un instinto entrenado: la capacidad de ver más allá de lo obvio y reconocer lo que eleva.

---

## 🎬 Framework de Decisión de Animaciones

### ¿Debería animar esto?

| Frecuencia | Decisión |
|------------|----------|
| 100+ veces/día (atajos de teclado, command palette) | ❌ Sin animación. Nunca. |
| Decenas de veces/día (hover effects, navegación de listas) | ⚠️ Remover o reducir drásticamente |
| Ocasional (modales, drawers, toasts) | ✅ Animación estándar |
| Raro/primera vez (onboarding, celebraciones) | 🎉 Puede añadir deleite |

**Nunca animar acciones iniciadas por teclado.** Estas acciones se repiten cientos de veces al día. La animación las hace sentir lentas y desconectadas.

### ¿Cuál es el propósito?

Cada animación debe tener una respuesta clara a "¿por qué esto anima?"

Propósitos válidos:
- ✅ **Consistencia espacial**: toast entra y sale desde la misma dirección
- ✅ **Indicación de estado**: botón de feedback morphing muestra cambio de estado
- ✅ **Feedback**: botón escala al presionar, confirmando que la interfaz escuchó
- ✅ **Prevenir cambios bruscos**: elementos apareciendo/desapareciendo sin transición se sienten rotos

Si el propósito es solo "se ve cool" y el usuario lo verá frecuentemente, no animar.

---

## 🎢 Curvas de Easing

### Regla crítica: usar curvas personalizadas
Las curvas CSS integradas son demasiado débiles. Les falta el punch que hace que las animaciones se sientan intencionales.

```css
/* Strong ease-out para interacciones UI */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Strong ease-in-out para movimiento en pantalla */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

/* iOS-like drawer curve */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

### ¿Qué easing usar?

¿El elemento está entrando o saliendo?
- Sí → `ease-out` (empieza rápido, se siente responsivo)

No →
¿Está moviéndose/morphing en pantalla?
- Sí → `ease-in-out` (aceleración/desaceleración natural)

No →
¿Es hover/cambio de color?
- Sí → `ease`

No →
¿Es movimiento constante (marquee, progress bar)?
- Sí → `linear`

Default → `ease-out`

**Nunca usar `ease-in` para animaciones UI.** Empieza lento, lo que hace que la interfaz se sienta perezosa y poco responsiva.

---

## ⚡ Duraciones

| Elemento | Duración |
|----------|----------|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Marketing/explanatory | Puede ser más largo |

**Regla: Las animaciones UI deben mantenerse bajo 300ms.** Un dropdown de 180ms se siente más responsivo que uno de 400ms.

---

## 🌀 Spring Animations

Los springs se sienten más naturales que las animaciones basadas en duración porque simulan física real. No tienen duraciones fijas: se asientan basándose en parámetros físicos.

### Cuándo usar springs

- Interacciones de drag con momentum
- Elementos que deben sentirse "vivos" (como Apple's Dynamic Island)
- Gestos que pueden ser interrumpidos mid-animación
- Interacciones decorativas de mouse-tracking

### Configuración de springs

**Apple's approach (recomendado):**
```javascript
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

**Traditional physics (más control):**
```javascript
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Mantener bounce sutil (0.1-0.3) cuando se use. Evitar bounce en la mayoría de contextos UI.

### Ventaja de interrupción
Los springs mantienen velocidad cuando son interrumpidos: las animaciones CSS y keyframes reinician desde cero. Esto hace que los springs sean ideales para gestos que los usuarios podrían cambiar mid-movimiento.

---

## 🔘 Principios de Componentes

### Los botones deben sentirse responsivos
Añadir `transform: scale(0.97)` en `:active`. Esto da feedback instantáneo, haciendo que la UI se sienta como si realmente estuviera escuchando al usuario.

```css
.button {
  transition: transform 160ms ease-out;
}

.button:active {
  transform: scale(0.97);
}
```

Esto aplica a cualquier elemento presionable. La escala debe ser sutil (0.95-0.98).

### Nunca animar desde scale(0)
Nada en el mundo real desaparece y reaparece completamente. Elementos animando desde `scale(0)` parecen venir de la nada.

Empezar desde `scale(0.9)` o superior, combinado con opacity. Incluso una barely-visible initial scale hace que la entrada se sienta más natural.

```css
/* ❌ Malo */
.modal {
  transform: scale(0);
}

/* ✅ Bueno */
.modal {
  transform: scale(0.95);
  opacity: 0;
}
```

### Transform-origin correcto
- **Popovers**: Deberían escalar desde su trigger
- **Modals**: Permanecen centrados (no usan transform-origin personalizado)

```css
/* Popover */
.popover {
  transform-origin: var(--popover-transform-origin);
}

/* Modal */
.modal {
  transform-origin: center;
}
```

---

## 🎭 Principios de Sonner (Construir Componentes Amados)

### 1. La experiencia del desarrollador es clave
Sin hooks, sin context, sin setup complejo. Insertar `<Toaster />` una vez, llamar `toast()` desde cualquier lugar. Menos fricción para adoptar = más personas lo usarán.

### 2. Buenos defaults importan más que opciones
Entregar hermoso out of the box. La mayoría de usuarios nunca personalizan. El easing, timing y diseño visual default deben ser excelentes.

### 3. El nombramiento crea identidad
"Sonner" (Francés para "tocar") se siente más elegante que "react-toast". Sacrificar descubribilidad por memorabilidad cuando sea apropiado.

### 4. Manejar edge cases invisiblemente
Pausar timers de toast cuando el tab está oculto. Rellenar gaps entre toasts apilados con pseudo-elements para mantener hover state. Capturar pointer events durante drag. Los usuarios nunca notan esto, y ese es exactamente el punto.

### 5. Usar transitions, no keyframes, para UI dinámica
Los toasts se añaden rápidamente. Los keyframes reinician desde cero en interrupción. Las transitions retarget suavemente.

---

## 🎬 Stagger Animations

Cuando múltiples elementos entran juntos, stagger su apariencia. Cada elemento anima con un pequeño delay después del anterior. Esto crea un efecto cascada que se siente más natural que todo apareciendo a la vez.

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeIn 300ms ease-out forwards;
}

.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Mantener stagger delays cortos (30-80ms entre items). Delays largos hacen que la interfaz se sienta lenta. Stagger es decorativo: nunca bloquear interacción mientras las animaciones stagger se reproducen.

---

## ♿ Accesibilidad

### prefers-reduced-motion
Las animaciones pueden causar motion sickness. Reduced motion significa menos y más gentiles animaciones, no cero. Mantener opacity y color transitions que ayudan a la comprensión. Remover movimiento y animaciones de posición.

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade 0.2s ease;
    /* Sin transform-based motion */
  }
}
```

### Touch device hover states
```css
@media (hover: hover) and (pointer: fine) {
  .element:hover {
    transform: scale(1.05);
  }
}
```

Los dispositivos touch trigger hover en tap, causando falsos positivos. Gate hover animations detrás de este media query.

---

## ⚡ Reglas de Performance

### Solo animar transform y opacity
Estas propiedades saltan layout y paint, corriendo en la GPU. Animar `padding`, `margin`, `height`, o `width` dispara los tres pasos de renderizado.

### CSS variables son inheritables
Cambiar una CSS variable en un padre recalcula estilos para todos los hijos. En un drawer con muchos items, actualizar `--swipe-amount` en el contenedor causa recálculo de estilo costoso. Actualizar `transform` directamente en el elemento en su lugar.

```javascript
// ❌ Malo: dispara recálculo en todos los hijos
element.style.setProperty('--swipe-amount', `${distance}px`);

// ✅ Bueno: solo afecta este elemento
element.style.transform = `translateY(${distance}px)`;
```

### CSS animations vencen JS bajo carga
Las animaciones CSS corren off the main thread. Cuando el navegador está ocupado cargando una nueva página, las animaciones de Framer Motion (usando `requestAnimationFrame`) dropean frames. Las animaciones CSS permanecen suaves. Usar CSS para animaciones predeterminadas; JS para dinámicas, interrumpibles.

---

## 📋 Checklist de Revisión

Cuando revisar código UI, verificar:

| Issue | Fix |
|-------|-----|
| `transition: all` | Especificar propiedades exactas: `transition: transform 200ms ease-out` |
| `scale(0)` entry animation | Empezar desde `scale(0.95)` con `opacity: 0` |
| `ease-in` en UI element | Cambiar a `ease-out` o custom curve |
| `transform-origin: center` en popover | Setear a trigger location |
| Animación en keyboard action | Remover animación completamente |
| Duración > 300ms en UI element | Reducir a 150-250ms |
| Hover animation sin media query | Añadir `@media (hover: hover) and (pointer: fine)` |
| Keyframes en elemento triggered rápidamente | Usar CSS transitions para interrumpibilidad |
| Framer Motion `x`/`y` props bajo carga | Usar `transform: "translateX()"` para hardware acceleration |
| Mismo enter/exit transition speed | Hacer exit más rápido que enter (ej: enter 2s, exit 200ms) |
| Elementos aparecen todos a la vez | Añadir stagger delay (30-80ms entre items) |

---

## 🎯 Aplicación en este Proyecto

### Componentes Implementados

1. **Button.tsx**
   - ✅ Scale 0.97 en tap (feedback táctil)
   - ✅ Spring animations para hover/tap
   - ✅ Ripple effect en click
   - ✅ Variantes con transiciones suaves

2. **Card.tsx**
   - ✅ Fade in up con stagger
   - ✅ Hover lift con transform
   - ✅ Card3D con tilt effect
   - ✅ Custom easing curves

3. **Input.tsx**
   - ✅ Focus animations con spring
   - ✅ Icon color transition
   - ✅ Error state animations
   - ✅ Smooth transitions

4. **ToastContainer.tsx**
   - ✅ Spring-based entry/exit
   - ✅ Layout animations
   - ✅ Progress bar
   - ✅ Interruptible animations

5. **Animations.tsx**
   - ✅ Custom easing curves
   - ✅ Stagger containers
   - ✅ Reusable variants
   - ✅ Performance optimized

### Principios Aplicados

- ✅ Solo animar transform y opacity
- ✅ Custom easing curves (no CSS defaults)
- ✅ Spring physics para interacciones naturales
- ✅ Stagger animations para listas
- ✅ Reduced motion support
- ✅ Hover states con media queries
- ✅ Button press feedback (scale 0.97)
- ✅ Never animate from scale(0)
- ✅ Correct transform-origin
- ✅ Asymmetric enter/exit timing
- ✅ Interruptible animations
- ✅ Performance optimized

---

## 📚 Recursos

- [Emil Kowalski's Skills](https://emilkowal.ski/skill)
- [Easing.dev](https://easing.dev/) - Custom easing curves
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Sonner](https://sonner.emilkowalski.com/) - Toast component

---

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Autor**: Basado en Emil Kowalski's Design Engineering Philosophy
