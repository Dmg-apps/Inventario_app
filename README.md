# 🏠 Mi Despensa - Inventario Inteligente del Hogar

Aplicación web para gestionar el inventario de tu hogar con alertas de caducidad, recetas con IA y soporte NFC.

**✨ Con Skills de Diseño Engineering de Emil Kowalski aplicadas**

## ✨ Características

- 🏠 **Múltiples casas**: Gestiona diferentes hogares desde una sola cuenta
- 📍 **Ubicaciones personalizadas**: Organiza productos por lugares (nevera, despensa, baño...)
- 📦 **Inventario completo**: 5 tipos de productos con campos específicos
  - 🍽️ **Alimentos**: Fecha de caducidad y fecha de apertura
  - 💊 **Medicamentos**: Dosis, frecuencia, caducidad
  - 🧹 **Limpieza**: Nivel de llenado (lleno/medio/bajo/vacío)
  - 🧴 **Baño e Higiene**: Nivel de llenado
  - 📦 **Otros**: Productos generales
- ⏰ **Alertas de caducidad**: Notificaciones de productos próximos a caducar
- 🤖 **Recetas con IA**: Genera recetas basadas en tus ingredientes disponibles
- 📱 **Soporte NFC**: Asocia tags NFC a ubicaciones para acceso rápido
- 👥 **Multi-usuario**: Comparte el inventario con miembros de tu hogar

## 🎨 Diseño User-Friendly

Este proyecto implementa un diseño moderno, amigable y accesible:

### Paleta de Colores
✅ **Fondos suaves** - `#0f0f10` en lugar de negro puro  
✅ **Acentos cálidos** - Gradientes blue/cyan más amigables  
✅ **Colores semánticos** - Success, error, warning, info bien definidos  
✅ **Alto contraste** - WCAG AA compliance  

### Animaciones
✅ **Custom easing curves** - Curvas personalizadas más naturales  
✅ **Spring physics** - Interacciones con física real  
✅ **Scale 0.97 en botones** - Feedback táctil instantáneo  
✅ **Stagger animations** - Animaciones escalonadas (30-80ms)  
✅ **Reduced motion support** - Respeta preferencias de accesibilidad  
✅ **Solo animar transform/opacity** - Performance optimizada en GPU  

### Accesibilidad
✅ **Focus states visibles** - Ring azul en todos los inputs  
✅ **ARIA labels** - En todos los componentes interactivos  
✅ **Navegación por teclado** - Completa y funcional  
✅ **Contraste WCAG AA** - Mínimo 4.5:1  

Ver [`REDISENO-COLORES.md`](./REDISENO-COLORES.md) y [`SKILLS-DISENO.md`](./SKILLS-DISENO.md) para detalles completos.

## 📊 Importar desde Excel

Puedes importar tu inventario completo desde un archivo Excel. La app incluye una plantilla descargable con ejemplos.

### Formato del Excel

El archivo debe tener 3 hojas:

**Hoja 1: Casas**
- `nombre` (obligatorio)
- `direccion` (opcional)

**Hoja 2: Lugares**
- `casa` (obligatorio) - nombre de la casa
- `nombre` (obligatorio) - nombre del lugar
- `icono` (opcional) - emoji
- `descripcion` (opcional)

**Hoja 3: Productos**
- `casa` (obligatorio)
- `lugar` (obligatorio)
- `nombre` (obligatorio)
- `tipo` (opcional) - food, medicine, cleaning, bathroom, other
- `categoria` (opcional)
- `cantidad` (opcional)
- `unidad` (opcional) - ud, kg, g, l, ml, pack
- `fecha_caducidad` (opcional) - formato YYYY-MM-DD
- `fecha_apertura` (opcional) - formato YYYY-MM-DD
- `dosis` (opcional) - solo medicamentos
- `frecuencia` (opcional) - solo medicamentos
- `nivel` (opcional) - full, medium, low, empty (solo limpieza/baño)
- `notas` (opcional)

## 🚀 Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Estado**: Zustand con persistencia local
- **Backend**: Supabase (próximamente)
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔧 Configuración de Supabase

Actualmente la app funciona con almacenamiento local. Para habilitar sincronización en la nube:

1. Crea un proyecto en [Supabase](https://supabase.com)

2. Ejecuta el SQL para crear las tablas:

```sql
-- Profiles
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Houses
create table houses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- House members
create table house_members (
  id uuid primary key default uuid_generate_v4(),
  house_id uuid references houses(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text check (role in ('admin', 'member', 'viewer')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(house_id, user_id)
);

-- Locations
create table locations (
  id uuid primary key default uuid_generate_v4(),
  house_id uuid references houses(id) on delete cascade,
  name text not null,
  description text,
  nfc_url text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references locations(id) on delete cascade,
  name text not null,
  category text,
  quantity numeric not null default 1,
  unit text,
  expiration_date date,
  barcode text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table houses enable row level security;
alter table house_members enable row level security;
alter table locations enable row level security;
alter table products enable row level security;

-- Policies (ejemplo básico)
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Members can view their houses" on houses
  for select using (
    id in (select house_id from house_members where user_id = auth.uid())
  );

-- Añade más policies según necesites
```

3. Configura las variables de entorno:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Actualiza `src/lib/supabase.ts` para usar las credenciales reales

## 🤖 Configuración de IA para recetas

Para habilitar la generación de recetas con IA:

1. Obtén una API key de OpenAI o Anthropic
2. Añádela en la página de Ajustes
3. La app generará recetas basadas en tus productos disponibles

## 📱 Soporte NFC

La app genera URLs únicas para cada ubicación que puedes escribir en tags NFC:

1. Ve a la página de Lugares
2. Haz clic en "NFC" en la ubicación deseada
3. Copia la URL generada
4. Usa una app como "NFC Tools" para escribir la URL en un tag NFC
5. Al escanear el tag, se abrirá directamente esa ubicación

## 🎨 Características de diseño

- **Animaciones suaves**: Transiciones con easing curves personalizados
- **Feedback táctil**: Botones con escala 0.97 al presionar
- **Modo oscuro**: Diseño optimizado para lectura prolongada
- **Responsive**: Funciona en móvil, tablet y desktop
- **Accesibilidad**: Respeta preferencias de movimiento reducido

## 📋 Próximas mejoras

- [ ] Integración completa con Supabase
- [ ] Escáner de códigos de barras
- [ ] Notificaciones push
- [ ] Exportar/importar datos
- [ ] Estadísticas y gráficos
- [ ] Lista de compra automática
- [ ] Compartir ubicaciones con QR

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes, abre primero un issue para discutir qué te gustaría cambiar.

## 📄 Licencia

MIT
