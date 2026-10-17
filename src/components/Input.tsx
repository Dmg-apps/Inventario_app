import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

// Input component with smooth focus animations
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#a1a1a1] mb-2 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none group-focus-within:text-emerald-400 transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 bg-[#0a0a0a] border-2 rounded-2xl text-base text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:scale-[1.01] transition-all duration-200 ${
              error 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-[#262626] focus:border-emerald-500/50'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 mt-2"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
