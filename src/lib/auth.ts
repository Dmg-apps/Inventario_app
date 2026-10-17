import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * Registro de nuevo usuario
 * - Valida contraseña fuerte
 * - Crea perfil automáticamente (trigger en Supabase)
 * - Envía email de confirmación (configurable)
 */
export async function signUp(email: string, password: string, fullName: string) {
  // Validar contraseña fuerte
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * Inicio de sesión
 * - Verifica credenciales
 * - Retorna sesión con JWT
 * - Protege contra fuerza bruta (Supabase limita intentos)
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

/**
 * Cierre de sesión
 * - Invalida tokens
 * - Limpia sesión local
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obtener sesión actual
 * - Verifica token JWT
 * - Renueva automáticamente si está expirado
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Obtener usuario actual
 * - Decodifica JWT
 * - Verifica permisos
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Recuperar contraseña
 * - Envía email con link de recuperación
 * - Token de un solo uso
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  if (error) throw error;
}

/**
 * Actualizar contraseña
 * - Requiere sesión activa
 * - Valida contraseña fuerte
 */
export async function updatePassword(newPassword: string) {
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

// ============================================
// VALIDACIÓN DE CONTRASEÑAS
// ============================================

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe tener al menos una mayúscula' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe tener al menos una minúscula' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe tener al menos un número' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'La contraseña debe tener al menos un carácter especial' };
  }
  
  return { valid: true, message: 'Contraseña válida' };
}

/**
 * Calcula la fortaleza de la contraseña
 * Retorna: 0-4 (débil a muy fuerte)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  return Math.min(4, strength);
}

// ============================================
// LISTENERS DE AUTENTICACIÓN
// ============================================

/**
 * Escuchar cambios de autenticación
 * - Login/logout
 * - Token refresh
 * - Password recovery
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================
// SEGURIDAD ADICIONAL
// ============================================

/**
 * Verificar si el email está confirmado
 */
export async function isEmailConfirmed(): Promise<boolean> {
  const user = await getUser();
  return user?.email_confirmed_at !== null;
}

/**
 * Obtener metadata del usuario
 */
export async function getUserMetadata() {
  const user = await getUser();
  return user?.user_metadata;
}

/**
 * Actualizar metadata del usuario
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  const { error } = await supabase.auth.updateUser({
    data: metadata
  });
  if (error) throw error;
}
