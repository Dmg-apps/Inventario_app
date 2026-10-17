import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

// Sonner-inspired toast system with perfect animations
export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.3,
              rotateX: -45
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.5, 
              transition: { 
                duration: 0.2,
                ease: [0.32, 0, 0.67, 0] // ease-in for exit
              } 
            }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1
            }}
            className="pointer-events-auto"
          >
            <div 
              onClick={() => onDismiss(toast.id)}
              className="flex items-center gap-3 px-5 py-4 bg-[#1a1a1a] border border-[#262626] rounded-2xl shadow-2xl cursor-pointer hover-lift group min-w-[300px] max-w-md"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1
                }}
                className={`p-2 rounded-xl ${
                  toast.type === 'success' ? 'bg-emerald-500/20' :
                  toast.type === 'error' ? 'bg-red-500/20' :
                  'bg-blue-500/20'
                }`}
              >
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
              </motion.div>

              {/* Message */}
              <span className="flex-1 text-sm font-medium text-[#fafafa]">{toast.message}</span>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 text-[#525252] hover:text-[#fafafa] transition-colors duration-150 opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                  toast.type === 'success' ? 'bg-emerald-400' :
                  toast.type === 'error' ? 'bg-red-400' :
                  'bg-blue-400'
                }`}
                style={{ borderRadius: '0 0 16px 16px' }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
