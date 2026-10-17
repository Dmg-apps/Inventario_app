# 🚀 Guía Rápida: Subir a GitHub

## ⚡ Método Más Rápido (5 minutos)

### 1. Abre tu terminal y ejecuta:

```bash
# Ir a tu carpeta de proyectos
cd ~/Documents  # o donde prefieras

# Clonar tu repositorio
git clone https://github.com/Superprof94/Inventario.git
cd Inventario
```

### 2. Copia todos los archivos del proyecto a esta carpeta

Si tienes los archivos en otra ubicación:
```bash
# Copiar todo el contenido (ajusta la ruta)
cp -r /ruta/donde/estan/los/archivos/* .
cp /ruta/donde/estan/los/archivos/.gitignore .
cp /ruta/donde/estan/los/archivos/.env.example .
```

### 3. Subir a GitHub:

```bash
# Ver qué archivos se van a subir
git status

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "✨ Implementación completa de Mi Despensa

- Inventario inteligente multi-casa
- 5 tipos de productos con campos específicos
- Alertas de caducidad automáticas
- Recetas con IA
- Soporte NFC
- Seguridad empresarial con Supabase"

# Subir a GitHub
git push origin main
```

### 4. ¡Listo! Ve a https://github.com/Superprof94/Inventario y recarga la página

---

## 📁 Archivos Incluidos

### 📄 Documentación
- `README.md` - Descripción del proyecto
- `GUIA-USO.md` - Cómo usar la app
- `SEGURIDAD.md` - Detalles de seguridad
- `CONFIGURACION-SEGURIDAD.md` - Setup de Supabase
- `SUBIR-GITHUB.md` - Instrucciones detalladas

### 💻 Código Fuente
- `src/` - Todo el código React/TypeScript
- `src/App.tsx` - Componente principal
- `src/pages/` - Páginas de la app
- `src/components/` - Componentes reutilizables
- `src/lib/` - Utilidades y configuración
- `src/store/` - Estado global con Zustand

### ⚙️ Configuración
- `package.json` - Dependencias y scripts
- `tsconfig.json` - Configuración TypeScript
- `vite.config.js` - Configuración Vite
- `index.html` - HTML base
- `.gitignore` - Ignorar archivos sensibles
- `.env.example` - Plantilla de variables de entorno

### 🗄️ Base de Datos
- `supabase-schema.sql` - Schema completo para Supabase

### 🛠️ Scripts
- `setup.sh` - Script de configuración inicial

---

## 🔐 Seguridad

✅ **Archivos que NO se suben** (gracias a .gitignore):
- ❌ `node_modules/` - Dependencias (se instalan con `npm install`)
- ❌ `.env.local` - Tus credenciales reales
- ❌ `dist/` o `build/` - Archivos compilados
- ❌ `*.log` - Logs del sistema

✅ **Archivos que SÍ se suben**:
- ✅ Código fuente completo
- ✅ Documentación
- ✅ Configuración
- ✅ Schema de base de datos
- ✅ `.env.example` (plantilla sin datos reales)

---

## 🎯 Siguiente Paso: Configurar Supabase

Una vez subido a GitHub, configura la seguridad:

1. Lee `CONFIGURACION-SEGURIDAD.md`
2. Crea proyecto en https://supabase.com
3. Ejecuta `supabase-schema.sql`
4. Configura `.env.local` con tus credenciales
5. ¡Tu app está lista y segura!

---

## 🆘 ¿Problemas?

### "Permission denied"
```bash
# Configura tus credenciales de Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### "Updates were rejected"
```bash
# Haz pull primero
git pull origin main --rebase
git push origin main
```

### Archivos no se suben
```bash
# Verifica que .gitignore está correcto
cat .gitignore

# Fuerza la subida
git add -f .
git commit -m "Forzar subida de archivos"
git push origin main
```

---

## 📚 Más Información

- **Instrucciones detalladas**: Lee `SUBIR-GITHUB.md`
- **Guía de uso**: Lee `GUIA-USO.md`
- **Seguridad**: Lee `SEGURIDAD.md`
- **Configuración**: Lee `CONFIGURACION-SEGURIDAD.md`

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] README visible en el repositorio
- [ ] No hay archivos sensibles (.env.local, node_modules)
- [ ] Documentación completa
- [ ] Schema SQL listo para ejecutar
- [ ] .gitignore configurado correctamente

**¡Tu proyecto está listo para el mundo!** 🌍
