import { motion } from 'framer-motion';
import { ReactNode, memo } from 'react';

/**
 * Props para el componente Button
 */
interface ButtonProps {
  /** Contenido del botón */
  children: ReactNode;
  /** Callback al hacer clic */
  onClick?: () => void;
  /** Variante visual del botón */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Tamaño del botón */
  size?: 'sm' | 'md' | 'lg';
  /** Icono opcional antes del texto */
  icon?: ReactNode;
  /** Clases CSS adicionales */
  className?: string;
  /** Si el botón está deshabilitado */
  disabled?: boolean;
  /** Label accesible para screen readers */
  'aria-label'?: string;
}

/**
 * Componente Button con micro-interacciones perfectas
 * 
 * Características:
 * - Spring physics para animaciones naturales
 * - Scale 0.97 en press (feedback táctil)
 * - Ripple effect en click
 * - Accesibilidad completa (ARIA, keyboard navigation)
 * - Performance optimizada con React.memo
 * 
 * @example
 * ```tsx
 * <Button onClick={handleClick} variant="primary">
 *   Click me
 * </Button>
 * ```
 */
const Button = memo(function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  disabled = false,
  'aria-label': ariaLabel
}: ButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 overflow-hidden";
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400',
    secondary: 'bg-[#1a1a1a] text-[#fafafa] border-2 border-[#262626] hover:border-[#333] hover:bg-[#262626]',
    ghost: 'text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#1a1a1a]'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

export default Button;
