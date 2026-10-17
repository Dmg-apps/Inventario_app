# 🚀 Configuración Rápida de Seguridad

## Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una nueva organización (si no tienes una)
4. Configura tu proyecto:
   - **Name**: Mi Despensa
   - **Database Password**: (guarda esta contraseña en un gestor de contraseñas)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: Free (suficiente para empezar)

5. Espera a que se cree el proyecto (~2 minutos)

---

## Paso 2: Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de terminal en el menú lateral)
2. Haz clic en "New Query"
3. Copia y pega todo el contenido de `supabase-schema.sql`
4. Haz clic en "Run" (o Ctrl+Enter)
5. Deberías ver: "Success. No rows returned"

✅ **Tablas creadas**: profiles, houses, house_members, locations, products, recipes, etc.

---

## Paso 3: Obtener Credenciales

1. Ve a **Settings** → **API** (en el menú lateral)
2. Copia estos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (la clave pública, NO la service_role)

3. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **IMPORTANTE**: 
- Usa `.env.local` para desarrollo (no se sube a Git)
- Nunca uses la `service_role key` en el frontend
- La `anon key` es segura para el frontend (tiene permisos limitados por RLS)

---

## Paso 4: Configurar Autenticación

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Configura las opciones recomendadas:

### Email Settings
- ✅ Confirm email: **ON** (recomendado para seguridad)
- Site URL: `http://localhost:5173` (desarrollo) o tu dominio (producción)
- Redirect URLs: 
  - `http://localhost:5173/**`
  - `https://tudominio.com/**`

### Password Policy
- Minimum password length: **8**
- Require uppercase: **ON**
- Require lowercase: **ON**
- Require numbers: **ON**
- Require special characters: **ON**

### Rate Limits
- Sign up: **10 requests per hour**
- Sign in: **5 requests per 15 minutes**
- Password recovery: **3 requests per hour**

---

## Paso 5: Configurar Row Level Security (RLS)

El schema SQL ya incluye las políticas RLS, pero verifica que estén activas:

1. Ve a **Authentication** → **Policies**
2. Deberías ver políticas para cada tabla:
   - ✅ profiles: Users can view/update own profile
   - ✅ houses: Members can view their houses
   - ✅ house_members: Members can view house members
   - ✅ locations: Members can view/manage locations
   - ✅ products: Members can view/manage products
   - ✅ recipes: Members can view/manage recipes

Si alguna política falta, ejecuta el SQL de nuevo.

---

## Paso 6: Probar la Autenticación

1. Inicia la app: `npm run dev`
2. Intenta registrarte con un email nuevo
3. Deberías recibir un email de confirmación
4. Confirma el email haciendo clic en el link
5. Inicia sesión con tus credenciales
6. ¡Deberías ver el dashboard!

---

## Paso 7: Configurar para Producción

### Variables de Entorno
En tu hosting (Vercel, Netlify, etc.), configura:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Dominio Personalizado
1. En Supabase: **Settings** → **Custom Domains**
2. Añade tu dominio
3. Configura los DNS según las instrucciones

### HTTPS
- Vercel/Netlify: HTTPS automático
- Servidor propio: Configura certificado SSL (Let's Encrypt)

---

## ✅ Checklist de Seguridad

Antes de lanzar a producción, verifica:

- [ ] Proyecto de Supabase creado
- [ ] Schema SQL ejecutado correctamente
- [ ] Variables de entorno configuradas
- [ ] Autenticación por email habilitada
- [ ] Confirmación de email activada
- [ ] Password policy configurada
- [ ] Rate limiting configurado
- [ ] RLS policies activas en todas las tablas
- [ ] `.env.local` en `.gitignore`
- [ ] HTTPS habilitado en producción
- [ ] Dominio personalizado configurado (opcional)
- [ ] Backups automáticos habilitados

---

## 🔐 Medidas de Seguridad Adicionales (Recomendado)

### 1. Habilitar 2FA (Two-Factor Authentication)
```sql
-- En Supabase Dashboard:
-- Authentication → Settings → Enable 2FA
```

### 2. Configurar Backups
- Supabase Free: Backups diarios (7 días)
- Supabase Pro: Backups cada 24h (30 días) + Point-in-time recovery

### 3. Monitoreo de Seguridad
- Ve a **Logs** en Supabase Dashboard
- Revisa logs de autenticación regularmente
- Configura alertas para actividad sospechosa

### 4. Rotación de Claves
- Cada 90 días, rota la `anon key`
- Ve a **Settings** → **API** → **Generate new key**
- Actualiza `.env.local` y variables de entorno

---

## 🆘 Solución de Problemas

### "Invalid API key"
- Verifica que copiaste la `anon key` (NO la `service_role`)
- Asegúrate de que no hay espacios al inicio/final

### "Email not confirmed"
- Revisa tu bandeja de entrada (y spam)
- Verifica que la confirmación de email esté habilitada

### "Too many requests"
- Espera 15 minutos antes de intentar de nuevo
- Aumenta los rate limits en Supabase Dashboard

### "Permission denied"
- Verifica que las RLS policies estén activas
- Asegúrate de que el usuario sea miembro de la casa

---

## 📚 Recursos

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Security Best Practices](https://supabase.com/docs/guides/auth/security-best-practices)
- [SEGURIDAD.md](./SEGURIDAD.md) - Documentación completa de seguridad

---

## 🎯 Siguiente Paso

Una vez configurada la seguridad, puedes:
1. Probar la app con usuarios reales
2. Invitar miembros a tu casa
3. Añadir productos y ubicaciones
4. Configurar tags NFC
5. Probar las recetas con IA

**¡Tu app está segura y lista para usar!** 🎉
