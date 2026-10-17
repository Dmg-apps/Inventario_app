# 📤 Instrucciones para Subir a GitHub

## 🎯 Objetivo
Subir el proyecto "Mi Despensa" a tu repositorio: https://github.com/Superprof94/Inventario

---

## 📋 Requisitos Previos

1. **Git instalado** en tu computadora
   - Verifica: `git --version`
   - Si no está instalado: https://git-scm.com/downloads

2. **Cuenta de GitHub** activa
   - Tu repositorio: https://github.com/Superprof94/Inventario

3. **Token de acceso personal** (si usas autenticación HTTPS)
   - Créalo en: GitHub → Settings → Developer settings → Personal access tokens
   - Permisos necesarios: `repo` (acceso completo a repositorios)

---

## 🚀 Método 1: Subir desde Cero (Recomendado)

### Paso 1: Clonar el repositorio existente
```bash
# Ve a la carpeta donde quieres trabajar
cd ~/Documents  # o donde prefieras

# Clona el repositorio
git clone https://github.com/Superprof94/Inventario.git

# Entra al repositorio
cd Inventario
```

### Paso 2: Copiar los archivos del proyecto
```bash
# Si tienes los archivos en otra carpeta, cópialos aquí
# Ejemplo (ajusta la ruta según tu caso):
cp -r /ruta/a/tu/proyecto/* .
cp -r /ruta/a/tu/proyecto/.env.example .
cp -r /ruta/a/tu/proyecto/.gitignore .
```

**O si estás trabajando en este entorno:**
- Descarga todos los archivos del proyecto
- Copia todo el contenido a la carpeta `Inventario`

### Paso 3: Verificar el estado
```bash
# Ver qué archivos se van a subir
git status

# Deberías ver todos los archivos nuevos/modificados
```

### Paso 4: Añadir todos los archivos
```bash
# Añadir todos los archivos
git add .

# O añadir archivos específicos
git add src/
git add package.json
git add README.md
# etc.
```

### Paso 5: Hacer commit
```bash
git commit -m "✨ Implementación completa de Mi Despensa

- Sistema de inventario multi-casa con ubicaciones
- 5 tipos de productos (alimentos, medicamentos, limpieza, baño, otros)
- Alertas de caducidad automáticas
- Generación de recetas con IA
- Soporte para tags NFC
- Autenticación segura con Supabase
- Row Level Security para protección de datos
- Interfaz responsive con animaciones
- Documentación completa (guía de uso, seguridad, configuración)"
```

### Paso 6: Subir a GitHub
```bash
# Subir los cambios
git push origin main

# Si es la primera vez y no hay rama main:
git branch -M main
git push -u origin main
```

---

## 🔄 Método 2: Si ya tienes archivos en el repositorio

### Opción A: Sobrescribir todo
```bash
# Clonar repositorio
git clone https://github.com/Superprof94/Inventario.git
cd Inventario

# Eliminar contenido anterior (opcional)
rm -rf *
rm -rf .github

# Copiar nuevos archivos
cp -r /ruta/a/tu/proyecto/* .

# Subir cambios
git add .
git commit -m "🔄 Actualización completa del proyecto"
git push origin main
```

### Opción B: Mantener historial y añadir nuevos archivos
```bash
# Clonar repositorio
git clone https://github.com/Superprof94/Inventario.git
cd Inventario

# Copiar nuevos archivos (sin eliminar los anteriores)
cp -r /ruta/a/tu/proyecto/* .

# Verificar cambios
git status

# Subir cambios
git add .
git commit -m "✨ Añadir implementación de Mi Despensa"
git push origin main
```

---

## 🔐 Método 3: Usando GitHub CLI (Más fácil)

### Instalar GitHub CLI
```bash
# macOS
brew install gh

# Windows (con Chocolatey)
choco install gh

# Linux
sudo apt install gh
```

### Autenticarse
```bash
gh auth login
# Sigue las instrucciones en pantalla
```

### Subir el proyecto
```bash
# Ir al repositorio
cd Inventario

# Copiar archivos
cp -r /ruta/a/tu/proyecto/* .

# Subir cambios
git add .
git commit -m "✨ Implementación completa de Mi Despensa"
gh repo view  # Verificar que estás en el repo correcto
git push origin main
```

---

## ✅ Verificación

Después de subir, verifica en GitHub:

1. **Ve a tu repositorio**: https://github.com/Superprof94/Inventario
2. **Deberías ver:**
   - ✅ Todos los archivos del proyecto
   - ✅ README.md visible en la página principal
   - ✅ Estructura de carpetas correcta (src/, public/, etc.)
   - ✅ Sin archivos sensibles (.env.local, node_modules, etc.)

3. **Verifica que NO se subieron:**
   - ❌ node_modules/
   - ❌ .env.local
   - ❌ dist/ o build/
   - ❌ *.log

---

## 🌐 Deploy (Opcional)

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sigue las instrucciones
# - Project name: mi-despensa
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

### Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# O conecta tu repo en: https://app.netlify.com/
```

### GitHub Pages
```bash
# Instalar gh-pages
npm install -D gh-pages

# Añadir a package.json:
# "scripts": {
#   "deploy": "gh-pages -d dist"
# }

# Deploy
npm run build
npm run deploy
```

---

## 🆘 Solución de Problemas

### "Permission denied (publickey)"
```bash
# Configurar SSH
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Añadir clave pública a GitHub
cat ~/.ssh/id_ed25519.pub
# Copia el resultado y añádelo en GitHub → Settings → SSH and GPG keys
```

### "Authentication failed"
```bash
# Usar token de acceso personal
# 1. Crea un token en GitHub → Settings → Developer settings → Personal access tokens
# 2. Usa el token como contraseña cuando git lo pida

# O configura el credential helper
git config --global credential.helper store
```

### "Updates were rejected because the remote contains work"
```bash
# Hacer pull primero
git pull origin main --rebase

# Resolver conflictos si los hay
git add .
git rebase --continue
git push origin main
```

### Archivos grandes no se suben
```bash
# Verificar que .gitignore está correcto
cat .gitignore

# Remover archivos cacheados
git rm -r --cached node_modules
git rm --cached .env.local
git commit -m "🔧 Remover archivos sensibles del tracking"
git push origin main
```

---

## 📊 Estructura Final en GitHub

Tu repositorio debería verse así:

```
Inventario/
├── 📄 README.md
├── 📄 GUIA-USO.md
├── 📄 SEGURIDAD.md
├── 📄 CONFIGURACION-SEGURIDAD.md
├── 📄 SUPAR-GITHUB.md (este archivo)
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 tsconfig.json
├── 📄 vite.config.js
├── 📄 index.html
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 setup.sh
├── 📄 supabase-schema.sql
├── 📁 src/
│   ├── 📄 App.tsx
│   ├── 📄 main.tsx
│   ├── 📄 index.css
│   ├── 📄 vite-env.d.ts
│   ├── 📁 components/
│   │   └── 📄 Layout.tsx
│   ├── 📁 pages/
│   │   ├── 📄 AuthPage.tsx
│   │   ├── 📄 Dashboard.tsx
│   │   ├── 📄 LocationsPage.tsx
│   │   ├── 📄 ProductsPage.tsx
│   │   ├── 📄 RecipesPage.tsx
│   │   ├── 📄 AlertsPage.tsx
│   │   └── 📄 SettingsPage.tsx
│   ├── 📁 lib/
│   │   ├── 📄 supabase.ts
│   │   ├── 📄 auth.ts
│   │   └── 📄 utils.ts
│   └── 📁 store/
│       └── 📄 useStore.ts
└── 📁 public/ (vacío o con assets)
```

---

## 🎉 ¡Listo!

Una vez subido:
1. ✅ Tu código está en GitHub
2. ✅ Otras personas pueden ver el proyecto
3. ✅ Puedes hacer deploy fácilmente
4. ✅ Puedes colaborar con otros desarrolladores
5. ✅ Tienes historial de cambios

**¡Felicidades! Tu proyecto está en GitHub** 🚀

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación en los archivos .md
2. Consulta: https://docs.github.com/es
3. Abre un issue en tu repositorio
