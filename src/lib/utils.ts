import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: es });
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return 'Hoy';
  if (isTomorrow(d)) return 'Mañana';
  
  const days = differenceInDays(d, new Date());
  if (days < 0) return `Caducó hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`;
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days <= 7) return `En ${days} días`;
  if (days <= 30) return `En ${Math.floor(days / 7)} semana${Math.floor(days / 7) !== 1 ? 's' : ''}`;
  return formatDate(date);
}

export function getExpirationStatus(date?: string): 'expired' | 'today' | 'soon' | 'warning' | 'ok' | 'none' {
  if (!date) return 'none';
  const d = new Date(date);
  if (isPast(d)) return 'expired';
  if (isToday(d)) return 'today';
  const days = differenceInDays(d, new Date());
  if (days <= 3) return 'soon';
  if (days <= 7) return 'warning';
  return 'ok';
}

export function getExpirationColor(status: ReturnType<typeof getExpirationStatus>): string {
  switch (status) {
    case 'expired': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'today': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'soon': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'ok': return 'text-green-400 bg-green-400/10 border-green-400/20';
    default: return 'text-[#525252] bg-[#1a1a1a] border-[#262626]';
  }
}

export function getExpirationLabel(status: ReturnType<typeof getExpirationStatus>): string {
  switch (status) {
    case 'expired': return 'Caducado';
    case 'today': return 'Caduca hoy';
    case 'soon': return 'Próximo a caducar';
    case 'warning': return 'Aviso';
    case 'ok': return 'Vigente';
    default: return 'Sin fecha';
  }
}

export const CATEGORIES = [
  { id: 'frutas', name: 'Frutas y Verduras', icon: '🥬' },
  { id: 'lacteos', name: 'Lácteos', icon: '🥛' },
  { id: 'carnes', name: 'Carnes y Pescados', icon: '🥩' },
  { id: 'panaderia', name: 'Panadería', icon: '🍞' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'congelados', name: 'Congelados', icon: '🧊' },
  { id: 'conservas', name: 'Conservas', icon: '🥫' },
  { id: 'limpieza', name: 'Limpieza', icon: '🧹' },
  { id: 'higiene', name: 'Higiene', icon: '🧴' },
  { id: 'medicamentos', name: 'Medicamentos', icon: '💊' },
  { id: 'otros', name: 'Otros', icon: '📦' },
];

export const UNITS = [
  { id: 'ud', name: 'Unidad(es)' },
  { id: 'kg', name: 'Kg' },
  { id: 'g', name: 'g' },
  { id: 'l', name: 'L' },
  { id: 'ml', name: 'ml' },
  { id: 'pack', name: 'Pack' },
];

export const LOCATION_ICONS = [
  '🏠', '🍳', '🧊', '🗄️', '🚪', '🛋️', '🛏️', '🚿',
  '🧺', '🏪', '📦', '🗃️', '🍽️', '🥘', '☕', '🍷',
  '💊', '🧴', '🧹', '🔧', '📚', '🎮', '👕', '👟'
];

// NFC utilities
export function generateNfcUrl(locationId: string, baseUrl?: string): string {
  const base = baseUrl || window.location.origin;
  return `${base}/location/${locationId}`;
}

export function parseNfcUrl(url: string): string | null {
  try {
    const match = url.match(/\/location\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// AI Recipe helper
export function generateRecipePrompt(products: { name: string; category: string }[]): string {
  const productList = products.map(p => `- ${p.name} (${p.category})`).join('\n');
  return `Basándote en estos ingredientes disponibles en mi despensa:

${productList}

Genera 3 recetas diferentes que pueda preparar. Para cada receta incluye:
1. Nombre de la receta
2. Ingredientes necesarios (marcando cuáles ya tengo)
3. Instrucciones paso a paso
4. Tiempo estimado de preparación
5. Número de porciones

Prioriza recetas que usen ingredientes próximos a caducar.`;
}
