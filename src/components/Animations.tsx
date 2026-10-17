import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Custom easing curves (Emil Kowalski's philosophy)
export const EASING = {
  // Strong ease-out for UI interactions
  out: [0.23, 1, 0.32, 1] as const,
  // Strong ease-in-out for on-screen movement
  inOut: [0.77, 0, 0.175, 1] as const,
  // iOS-like drawer curve
  drawer: [0.32, 0.72, 0, 1] as const,
  // Spring-like bounce
  spring: [0.34, 1.56, 0.64, 1] as const,
};

// Fade in up animation (most common)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.out
    }
  }
};

// Fade in with scale
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASING.out
    }
  }
};

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Stagger item for lists
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASING.out
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASING.out
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASING.out
    }
  }
};

// Scale in (for modals, dialogs)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

// Exit animations
export const fadeOut: Variants = {
  hidden: { opacity: 1 },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0] // ease-in for exit
    }
  }
};

export const scaleOut: Variants = {
  hidden: { opacity: 1, scale: 1 },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0]
    }
  }
};

// Animated wrapper component
interface AnimatedProps {
  children: ReactNode;
  variant?: 'fadeInUp' | 'fadeInScale' | 'slideInRight' | 'slideInLeft' | 'scaleIn';
  delay?: number;
  className?: string;
}

export function Animated({ 
  children, 
  variant = 'fadeInUp', 
  delay = 0,
  className = ''
}: AnimatedProps) {
  const variants = {
    fadeInUp,
    fadeInScale,
    slideInRight,
    slideInLeft,
    scaleIn
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger list component
interface StaggerListProps {
  children: ReactNode;
  className?: string;
}

export function StaggerList({ children, className = '' }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
