import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}

// Card component with subtle, tasteful animations
export default function Card({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  delay = 0
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.23, 1, 0.32, 1] // Custom ease-out curve
      }}
      whileHover={hover ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-[#141414] border border-[#262626] rounded-3xl overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Card with 3D tilt effect on hover
interface Card3DProps {
  children: ReactNode;
  className?: string;
}

export function Card3D({ children, className = '' }: Card3DProps) {
  return (
    <motion.div
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={`bg-[#141414] border border-[#262626] rounded-3xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
