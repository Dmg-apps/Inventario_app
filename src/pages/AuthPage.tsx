import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { signIn, signUp, validatePassword, getPasswordStrength } from '../lib/auth';
import { Home, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login real con Supabase
        const { session } = await signIn(email, password);
        if (session?.user) {
          // Actualizar store local con datos del usuario
          login(session.user.email!, password);
        }
      } else {
        // Registro real con Supabase
        const { user } = await signUp(email, password, name);
        if (user) {
          setSuccess('¡Cuenta creada! Revisa tu email para confirmar.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      // Manejar errores específicos de Supabase
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión');
      } else if (err.message?.includes('Too many requests')) {
        setError('Demasiados intentos. Espera unos minutos.');
      } else if (err.message?.includes('User already registered')) {
        setError('Este email ya está registrado');
      } else {
        setError(err.message || 'Error al procesar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength === 2) return 'Regular';
    if (passwordStrength === 3) return 'Buena';
    return 'Fuerte';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center"
          >
            <Home className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#fafafa]">Mi Despensa</h1>
          <p className="text-sm text-[#737373] mt-1">Organiza tu hogar con seguridad</p>
        </div>

        {/* Form */}
        <motion.div 
          className="bg-[#141414] border border-[#262626] rounded-2xl p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex gap-2 mb-6 p-1 bg-[#0a0a0a] rounded-lg">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isLogin ? 'bg-[#262626] text-[#fafafa]' : 'text-[#737373]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !isLogin ? 'bg-[#262626] text-[#fafafa]' : 'text-[#737373]'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  required={!isLogin}
                />
              </motion.div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {!isLogin && password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= level ? getStrengthColor() : 'bg-[#262626]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#737373]">Fortaleza:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 1 ? 'text-red-400' :
                    passwordStrength === 2 ? 'text-orange-400' :
                    passwordStrength === 3 ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-1.5 pt-2">
                  {[
                    { test: password.length >= 8, label: '8+ caracteres' },
                    { test: /[A-Z]/.test(password), label: 'Una mayúscula' },
                    { test: /[a-z]/.test(password), label: 'Una minúscula' },
                    { test: /[0-9]/.test(password), label: 'Un número' },
                    { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: 'Un carácter especial' },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {req.test ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <X className="w-3 h-3 text-[#525252]" />
                      )}
                      <span className={`text-xs ${req.test ? 'text-emerald-300' : 'text-[#525252]'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Crear cuenta'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-[#525252] text-center mt-4">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#fafafa] mb-1">Seguridad de nivel empresarial</p>
              <p className="text-[10px] text-[#737373] leading-relaxed">
                Autenticación con Supabase Auth · Encriptación AES-256 · Row Level Security · 
                Protección contra fuerza bruta · Tokens JWT seguros
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
