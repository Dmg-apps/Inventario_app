#!/bin/bash

# Script de configuración inicial para Mi Despensa
# Ejecuta: chmod +x setup.sh && ./setup.sh

echo "🏠 Configurando Mi Despensa..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm $(npm -v)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    echo "🔐 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado"
    echo ""
    echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase"
    echo "   Puedes obtenerlas en: https://supabase.com/dashboard/"
    echo ""
else
    echo "✅ Archivo .env.local ya existe"
    echo ""
fi

# Crear directorio public si no existe
if [ ! -d public ]; then
    mkdir public
    echo "📁 Directorio public creado"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Configura Supabase (lee CONFIGURACION-SEGURIDAD.md)"
echo "   2. Edita .env.local con tus credenciales"
echo "   3. Ejecuta: npm run dev"
echo "   4. Abre: http://localhost:5173"
echo ""
echo "📚 Documentación:"
echo "   - README.md: Información general"
echo "   - GUIA-USO.md: Cómo usar la app"
echo "   - SEGURIDAD.md: Detalles de seguridad"
echo "   - CONFIGURACION-SEGURIDAD.md: Setup de Supabase"
echo ""
