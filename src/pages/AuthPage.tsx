import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
      register(email, password, name);
    }
  };

  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <span className="text-5xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">
            ¡Bienvenido!
          </h1>
          <p className="text-base text-[#a1a1a1]">
            Organiza tu hogar de forma inteligente
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#141414]/80 backdrop-blur-xl border border-[#262626] rounded-3xl p-8 shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1.5 bg-[#0a0a0a] rounded-2xl">
            <motion.button
              onClick={() => setIsLogin(true)}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-[#737373] hover:text-[#a1a1a1]'
              }`}
            >
              Iniciar Sesión
            </motion.button>
            <motion.button
              onClick={() => setIsLogin(false)}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-[#737373] hover:text-[#a1a1a1]'
              }`}
            >
              Registrarse
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-semibold text-[#a1a1a1] mb-2 uppercase tracking-wider">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525252]" />
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border-2 border-[#262626] rounded-2xl text-base text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-all duration-200"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1a1] mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525252]" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border-2 border-[#262626] rounded-2xl text-base text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1a1] mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525252]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border-2 border-[#262626] rounded-2xl text-base text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-all duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a1a1a1] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Password strength */}
              {!isLogin && password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <div className="flex gap-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <motion.div
                        key={level}
                        initial={{ width: 0 }}
                        animate={{ width: strength >= level ? '100%' : '0%' }}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= level
                            ? strength <= 1 ? 'bg-red-500' :
                              strength === 2 ? 'bg-orange-500' :
                              strength === 3 ? 'bg-yellow-500' :
                              'bg-emerald-500'
                            : 'bg-[#262626]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#525252]">Fortaleza:</span>
                    <span className={`font-semibold ${
                      strength <= 1 ? 'text-red-400' :
                      strength === 2 ? 'text-orange-400' :
                      strength === 3 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {strength <= 1 ? 'Débil' : strength === 2 ? 'Regular' : strength === 3 ? 'Buena' : 'Fuerte'}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-base font-semibold rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Entrar' : 'Crear cuenta'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <p className="text-sm text-[#525252] text-center mt-6">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <motion.button 
              onClick={() => setIsLogin(!isLogin)}
              whileTap={{ scale: 0.95 }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </motion.button>
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {[
            { emoji: '🔐', label: 'Seguro' },
            { emoji: '⚡', label: 'Rápido' },
            { emoji: '🎯', label: 'Fácil' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="p-4 bg-[#141414]/50 backdrop-blur-sm border border-[#262626] rounded-2xl text-center"
            >
              <span className="text-2xl mb-1 block">{feature.emoji}</span>
              <span className="text-xs font-medium text-[#a1a1a1]">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
