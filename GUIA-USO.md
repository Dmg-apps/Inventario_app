# Guía de Uso - Mi Despensa

## 📦 Tipos de Productos

La app gestiona 5 tipos de productos, cada uno con campos específicos:

### 🍽️ Alimentos
**Campos disponibles:**
- Nombre del producto
- Categoría (Frutas, Lácteos, Carnes, Panadería, Bebidas, Congelados, Conservas, Snacks, Especias)
- Cantidad y unidad
- Ubicación
- **Fecha de caducidad** ⚠️
- **Fecha de apertura** (para productos que se abren y duran X días)
- Notas

**Ejemplos:**
- Leche (Lácteos) - Caduca en 7 días
- Manzanas (Frutas) - Caduca en 5 días
- Atún en conserva (Conservas) - Caduca en 2 años
- Aceite de oliva (Especias) - Abierto hace 3 meses

### 💊 Medicamentos
**Campos disponibles:**
- Nombre del medicamento
- Categoría (Medicamentos, Vitaminas, Primeros Auxilios)
- Cantidad y unidad
- Ubicación
- **Fecha de caducidad** ⚠️
- **Fecha de apertura**
- **Dosis** (Ej: 500mg, 1 comprimido)
- **Frecuencia** (Ej: Cada 8h, 2 veces/día)
- Notas

**Ejemplos:**
- Ibuprofeno 600mg - Dosis: 1 comprimido, Frecuencia: Cada 8h
- Paracetamol - Dosis: 500mg, Frecuencia: Cada 6h
- Vitamina D - Dosis: 1 cápsula, Frecuencia: 1 vez/día
- Betadine - Primeros auxilios

### 🧹 Productos de Limpieza
**Campos disponibles:**
- Nombre del producto
- Categoría (Limpieza Cocina, Limpieza Baño, Limpieza General, Lavandería)
- Cantidad y unidad
- Ubicación
- **Nivel de llenado** (Lleno / Medio / Bajo / Vacío) 📊
- Notas

**Ejemplos:**
- Lavavajillas - Nivel: Medio
- Lejía - Nivel: Lleno
- Limpiacristales - Nivel: Bajo
- Detergente - Nivel: Lleno

### 🧴 Baño e Higiene
**Campos disponibles:**
- Nombre del producto
- Categoría (Higiene Personal, Cuidado Cabello, Cuidado Piel, Higiene Bucal, Papel y Toallas)
- Cantidad y unidad
- Ubicación
- **Nivel de llenado** (Lleno / Medio / Bajo / Vacío) 📊
- Notas

**Ejemplos:**
- Champú - Nivel: Medio
- Gel de baño - Nivel: Bajo
- Pasta de dientes - Nivel: Lleno
- Desodorante - Nivel: Medio
- Papel higiénico - Nivel: Lleno

### 📦 Otros
**Campos disponibles:**
- Nombre del producto
- Categoría (Mascotas, Bebé, Otros)
- Cantidad y unidad
- Ubicación
- Notas

**Ejemplos:**
- Comida de perro (Mascotas)
- Pañales (Bebé)
- Pilas (Otros)

---

## 🏠 Ubicaciones

Crea ubicaciones para organizar tus productos. Ejemplos:

### Cocina
- 🧊 Nevera
- 🗄️ Despensa
- 🍳 Armario cocina
- 🚪 Congelador

### Baño
- 🚿 Armario baño
- 🧺 Toallero
- 🚽 Detrás inodoro

### Lavadero
- 🧺 Lavadora
- 🗄️ Armario limpieza

### Dormitorio
- 🛏️ Mesita noche (medicamentos)
- 🗄️ Armario

### Otros
- 📦 Trastero
- 🚪 Entrada
- 🏪 Garaje

---

## 📱 NFC Tags

Asocia tags NFC a ubicaciones para acceso rápido:

1. Ve a **Lugares**
2. Haz clic en **NFC** en la ubicación deseada
3. Copia la URL generada
4. Usa una app como "NFC Tools" para escribir la URL en un tag NFC
5. Pega el tag en la nevera, armario, etc.
6. Al escanear con el móvil, se abrirá directamente esa ubicación

**Ejemplos de uso:**
- Tag NFC en la nevera → Abre ubicación "Nevera"
- Tag NFC en el armario de medicamentos → Abre ubicación "Medicamentos"
- Tag NFC en el armario de limpieza → Abre ubicación "Productos limpieza"

---

## ⏰ Alertas de Caducidad

La app te avisa automáticamente de:

- 🔴 **Caducados**: Productos que ya han pasado su fecha
- 🟠 **Caducan hoy**: Productos que caducan hoy
- 🟡 **Próximos a caducar**: Productos que caducan en 3 días
- 🟡 **Aviso**: Productos que caducan en 7 días

**Consejos:**
- Revisa las alertas diariamente
- Prioriza productos próximos a caducar en las recetas
- Actualiza el nivel de llenado cuando uses productos de limpieza/baño
- Marca la fecha de apertura en productos que duran X días después de abrir

---

## 🤖 Recetas con IA

Genera recetas basadas en tus ingredientes disponibles:

1. Ve a **Recetas IA**
2. (Opcional) Filtra por categoría específica
3. Haz clic en **Generar recetas**
4. La IA creará 3 recetas usando tus productos
5. Las recetas priorizan ingredientes próximos a caducar

**Nota:** Actualmente usa datos de ejemplo. Para usar IA real, configura tu API key en Ajustes.

---

## 💡 Consejos de Uso

### Para Alimentos
- Añade todos los productos perecederos con fecha de caducidad
- Marca la fecha de apertura en: leche abierta, embutidos, salsas, etc.
- Revisa las alertas cada mañana
- Usa las recetas para aprovechar productos próximos a caducar

### Para Medicamentos
- Añade todos los medicamentos con dosis y frecuencia
- Incluye fecha de caducidad (muy importante)
- Revisa periódicamente el botiquín
- Elimina medicamentos caducados (punto SIGRE en farmacias)

### Para Limpieza y Baño
- Actualiza el nivel de llenado cuando uses productos
- Cuando esté "Bajo", añádelo a la lista de compra
- Agrupa por ubicación (armario baño, armario limpieza)

### Para Mascotas y Bebé
- Crea ubicaciones específicas (comida perro, pañales)
- Añade fechas de caducidad en alimentos de mascotas
- Controla stock de pañales, toallitas, etc.

---

## 🔧 Configuración

### Supabase (Sincronización en la nube)
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el SQL de `supabase-schema.sql`
3. Copia las credenciales a `.env`
4. Reinicia la app

### API de IA (Recetas)
1. Obtén API key de OpenAI o Anthropic
2. Añádela en Ajustes
3. La app generará recetas reales con IA

---

## 📊 Estadísticas

El Dashboard muestra:
- Total de productos
- Total de ubicaciones
- Productos por caducar
- Productos caducados
- Distribución por tipo (Alimentos, Medicamentos, Limpieza, Baño)
- Productos añadidos recientemente

---

## 🎯 Flujo de Trabajo Recomendado

### Diario
1. Revisa alertas de caducidad
2. Actualiza niveles de llenado al usar productos
3. Añade productos nuevos que compres

### Semanal
1. Revisa productos próximos a caducar
2. Genera recetas para aprovechar ingredientes
3. Actualiza inventario después de compra semanal

### Mensual
1. Revisa medicamentos (caducidad, stock)
2. Revisa productos de limpieza (niveles bajos)
3. Elimina productos caducados
4. Ajusta ubicaciones si es necesario

---

## ❓ Preguntas Frecuentes

**¿Puedo usar la app sin internet?**
Sí, los datos se guardan localmente en tu navegador.

**¿Puedo compartir el inventario con mi familia?**
Sí, cuando configures Supabase podrás invitar miembros a tu casa.

**¿Qué pasa si caduca un medicamento?**
La app te avisará con alertas. Elimínalo correctamente en un punto SIGRE.

**¿Puedo escanear códigos de barras?**
Próximamente. Por ahora añade productos manualmente.

**¿Cómo actualizo el nivel de llenado?**
Edita el producto y selecciona el nuevo nivel (Lleno/Medio/Bajo/Vacío).

---

## 🚀 Próximas Funcionalidades

- Escáner de códigos de barras
- Lista de compra automática (cuando nivel = bajo)
- Notificaciones push
- Compartir casas con familiares
- Estadísticas de consumo
- Exportar/importar datos
- Modo offline completo

---

## 📞 Soporte

Si tienes dudas o sugerencias, abre un issue en GitHub.

**¡Disfruta organizando tu hogar!** 🏠✨
