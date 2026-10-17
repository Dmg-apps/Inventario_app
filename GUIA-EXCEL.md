# 📊 Guía de Importación Excel

## Cómo preparar tu archivo Excel

Tu archivo Excel debe tener **3 hojas** con el siguiente formato:

---

## 📋 HOJA 1: Casas

| nombre | direccion |
|--------|-----------|
| Mi Casa | Calle Principal 123, Madrid |
| Piso Playa | Av. del Mar 456, Barcelona |
| Casa Pueblo | Calle Sol 78, Valencia |

**Columnas:**
- `nombre` **(obligatorio)** - Nombre de la casa
- `direccion` (opcional) - Dirección completa

---

## 📋 HOJA 2: Lugares

| casa | nombre | icono | descripcion |
|------|--------|-------|-------------|
| Mi Casa | Nevera | 🧊 | Electrodoméstico principal |
| Mi Casa | Despensa | 🗄️ | Armario de alimentos |
| Mi Casa | Baño | 🚿 | Productos de higiene |
| Mi Casa | Botiquín | 💊 | Medicamentos |
| Piso Playa | Cocina | 🍳 | Cocina del piso |

**Columnas:**
- `casa` **(obligatorio)** - Debe coincidir con el nombre de una casa de la hoja 1
- `nombre` **(obligatorio)** - Nombre del lugar
- `icono` (opcional) - Emoji (🧊 🗄️ 🚿 💊 🍳 🧺 📦 etc.)
- `descripcion` (opcional) - Descripción del lugar

---

## 📋 HOJA 3: Productos

| casa | lugar | nombre | tipo | categoria | cantidad | unidad | fecha_caducidad | fecha_apertura | dosis | frecuencia | nivel | notas |
|------|-------|--------|------|-----------|----------|--------|-----------------|----------------|-------|------------|-------|-------|
| Mi Casa | Nevera | Leche | food | lacteos | 2 | ud | 2024-02-15 | | | | | Marca entera |
| Mi Casa | Nevera | Yogur | food | lacteos | 6 | ud | 2024-02-10 | | | | | Natural |
| Mi Casa | Despensa | Arroz | food | conservas | 1 | kg | 2025-12-31 | | | | | Integral |
| Mi Casa | Despensa | Aceite | food | especias | 1 | l | 2025-06-30 | 2024-01-15 | | | | Oliva virgen |
| Mi Casa | Botiquín | Ibuprofeno | medicine | medicamentos | 1 | pack | 2025-03-31 | | 600mg | Cada 8h | | Para dolor |
| Mi Casa | Botiquín | Paracetamol | medicine | medicamentos | 1 | pack | 2025-04-30 | | 500mg | Cada 6h | | |
| Mi Casa | Baño | Champú | bathroom | cuidado_cabello | 1 | ud | | | | | medium | |
| Mi Casa | Baño | Gel | bathroom | higiene_personal | 1 | ud | | | | | low | |
| Mi Casa | Baño | Papel | bathroom | papel_higienico | 4 | ud | | | | | full | |
| Mi Casa | Cocina | Lavavajillas | cleaning | limpieza_cocina | 1 | ud | | | | | medium | |
| Piso Playa | Cocina | Sal | food | especias | 1 | ud | 2026-12-31 | | | | | |

**Columnas:**
- `casa` **(obligatorio)** - Debe coincidir con el nombre de una casa
- `lugar` **(obligatorio)** - Debe coincidir con el nombre de un lugar de esa casa
- `nombre` **(obligatorio)** - Nombre del producto
- `tipo` (opcional) - food, medicine, cleaning, bathroom, other
- `categoria` (opcional) - Ver lista abajo
- `cantidad` (opcional) - Número (por defecto: 1)
- `unidad` (opcional) - ud, kg, g, l, ml, pack (por defecto: ud)
- `fecha_caducidad` (opcional) - Formato YYYY-MM-DD (ej: 2024-02-15)
- `fecha_apertura` (opcional) - Formato YYYY-MM-DD
- `dosis` (opcional) - Solo medicamentos (ej: 600mg, 1 comprimido)
- `frecuencia` (opcional) - Solo medicamentos (ej: Cada 8h, 2 veces/día)
- `nivel` (opcional) - Solo limpieza/baño: full, medium, low, empty
- `notas` (opcional) - Notas adicionales

---

## 🏷️ Tipos de Producto

| Tipo | Descripción |
|------|-------------|
| `food` | Alimentos |
| `medicine` | Medicamentos |
| `cleaning` | Productos de limpieza |
| `bathroom` | Productos de baño e higiene |
| `other` | Otros |

---

## 📂 Categorías

### Alimentos (food)
- `frutas` - Frutas y Verduras
- `lacteos` - Lácteos
- `carnes` - Carnes y Pescados
- `panaderia` - Panadería
- `bebidas` - Bebidas
- `congelados` - Congelados
- `conservas` - Conservas y Despensa
- `snacks` - Snacks y Dulces
- `especias` - Especias y Salsas

### Medicamentos (medicine)
- `medicamentos` - Medicamentos
- `vitaminas` - Vitaminas y Suplementos
- `primeros_auxilios` - Primeros Auxilios

### Limpieza (cleaning)
- `limpieza_cocina` - Limpieza Cocina
- `limpieza_bano` - Limpieza Baño
- `limpieza_general` - Limpieza General
- `lavanderia` - Lavandería

### Baño (bathroom)
- `higiene_personal` - Higiene Personal
- `cuidado_cabello` - Cuidado Cabello
- `cuidado_piel` - Cuidado Piel
- `higiene_bucal` - Higiene Bucal
- `papel_higienico` - Papel y Toallas

### Otros (other)
- `mascotas` - Mascotas
- `bebe` - Bebé
- `otros` - Otros

---

## 📏 Unidades

| Unidad | Descripción |
|--------|-------------|
| `ud` | Unidad |
| `kg` | Kilogramo |
| `g` | Gramo |
| `l` | Litro |
| `ml` | Mililitro |
| `pack` | Pack |

---

## 📊 Niveles (solo limpieza y baño)

| Nivel | Descripción |
|-------|-------------|
| `full` | Lleno |
| `medium` | Medio |
| `low` | Bajo |
| `empty` | Vacío |

---

## 📅 Formato de Fechas

**Formato obligatorio:** `YYYY-MM-DD`

**Ejemplos:**
- ✅ `2024-02-15` (15 de febrero de 2024)
- ✅ `2025-12-31` (31 de diciembre de 2025)
- ❌ `15/02/2024` (formato incorrecto)
- ❌ `2024-2-15` (falta el cero)

---

## 💡 Consejos

1. **Descarga la plantilla** desde la app (botón "Descargar plantilla")
2. **Copia tus datos** a la plantilla
3. **Respeta los nombres** - Los nombres de casas y lugares deben coincidir exactamente
4. **Deja vacío** las columnas opcionales si no aplican
5. **Usa minúsculas** para tipo, categoría, unidad y nivel
6. **Revisa las fechas** - Deben estar en formato YYYY-MM-DD

---

## ❌ Errores Comunes

| Error | Solución |
|-------|----------|
| Casa no existe | Verifica que el nombre coincide exactamente con la hoja Casas |
| Lugar no existe | Verifica que el lugar existe en esa casa específica |
| Fecha incorrecta | Usa formato YYYY-MM-DD |
| Tipo incorrecto | Usa: food, medicine, cleaning, bathroom, other |
| Categoría incorrecta | Consulta la lista de categorías válidas |

---

## 🚀 Pasos para Importar

1. **Descarga la plantilla** desde la app (botón "Descargar plantilla")
2. **Rellena el Excel** con tus datos siguiendo el formato
3. **Guarda el archivo** como .xlsx o .xls
4. **Ve a la app** → botón "Importar" en la barra superior
5. **Sube el archivo** Excel
6. **Revisa la vista previa** de los datos
7. **Confirma la importación**

¡Listo! Tu inventario estará importado en segundos. 🎉
