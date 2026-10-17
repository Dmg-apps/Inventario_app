import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

// Toast system (Sonner-inspired)
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, transform: 'translateY(16px) scale(0.95)' }}
            animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
            exit={{ opacity: 0, transform: 'translateY(-8px) scale(0.95)' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-2xl cursor-pointer btn-press"
            onClick={() => onDismiss(toast.id)}
          >
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-green-400' : 
              toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
            }`} />
            <span className="text-sm text-[#fafafa]">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Interactive card with spring-based mouse tracking
function InteractiveCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(-(y - centerY) / 20);
    rotateY.set((x - centerX) / 20);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Principle card component
function PrincipleCard({ number, title, description, icon }: { 
  number: string; title: string; description: string; icon: string 
}) {
  return (
    <InteractiveCard className="group">
      <div className="relative p-6 bg-[#141414] border border-[#262626] rounded-2xl hover-lift transition-colors duration-200 hover:border-[#333]">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{icon}</span>
          <span className="text-xs font-mono text-[#525252]">{number}</span>
        </div>
        <h3 className="text-lg font-semibold text-[#fafafa] mb-2">{title}</h3>
        <p className="text-sm text-[#a1a1a1] leading-relaxed">{description}</p>
      </div>
    </InteractiveCard>
  );
}

// Code comparison component
function CodeComparison({ before, after, label }: { before: string; after: string; label: string }) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-mono text-[#525252] uppercase tracking-wider">{label}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400/60" />
            <span className="text-xs text-[#737373]">Before</span>
          </div>
          <code className="text-xs text-[#a1a1a1] font-mono leading-relaxed">{before}</code>
        </div>
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400/60" />
            <span className="text-xs text-[#737373]">After</span>
          </div>
          <code className="text-xs text-[#fafafa] font-mono leading-relaxed">{after}</code>
        </div>
      </div>
    </div>
  );
}

// Easing visualizer
function EasingVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const easings = [
    { name: 'ease-out', value: 'cubic-bezier(0.23, 1, 0.32, 1)', color: '#4ade80' },
    { name: 'ease-in-out', value: 'cubic-bezier(0.77, 0, 0.175, 1)', color: '#60a5fa' },
    { name: 'ease (default)', value: 'ease', color: '#a78bfa' },
    { name: 'ease-in', value: 'ease-in', color: '#f87171' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#fafafa]">Easing Comparison</h4>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 text-xs font-medium bg-[#262626] text-[#fafafa] rounded-lg btn-press hover:bg-[#333] transition-colors duration-150"
        >
          {isPlaying ? 'Reset' : 'Play'}
        </button>
      </div>
      <div className="space-y-3">
        {easings.map((easing) => (
          <div key={easing.name} className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#737373] w-28 shrink-0">{easing.name}</span>
            <div className="flex-1 h-8 bg-[#1a1a1a] rounded-lg overflow-hidden relative">
              <motion.div
                className="h-full rounded-lg"
                style={{ backgroundColor: easing.color }}
                animate={isPlaying ? { width: ['0%', '100%'] } : { width: '0%' }}
                transition={{ 
                  duration: 1, 
                  ease: easing.value as any,
                  repeat: isPlaying ? Infinity : 0,
                  repeatDelay: 0.5
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#737373] leading-relaxed">
        Notice how <span className="text-green-400">ease-out</span> starts instantly and feels responsive, 
        while <span className="text-red-400">ease-in</span> feels sluggish — the exact moment the user watches most closely has no movement.
      </p>
    </div>
  );
}

// Navigation
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
          <span className="text-sm font-semibold text-[#fafafa]">Design Engineering</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#principles" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Principles</a>
          <a href="#animations" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Animations</a>
          <a href="#craft" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Craft</a>
        </div>
      </div>
    </motion.nav>
  );
}

// Hero section
function Hero({ onToast }: { onToast: (msg: string, type: Toast['type']) => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, transform: 'translateY(20px) scale(0.98)' }}
        animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-3xl relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-[#a1a1a1]">Skill loaded — emil-design-eng</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#fafafa] tracking-tight leading-[1.1] mb-6">
          The craft of{' '}
          <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            invisible details
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#a1a1a1] leading-relaxed max-w-2xl mx-auto mb-10">
          Most details users never consciously notice. That is the point. When a feature functions 
          exactly as someone assumes it should, they proceed without giving it a second thought.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => onToast('Welcome! Explore the principles below.', 'success')}
            className="px-6 py-3 bg-white text-black text-sm font-medium rounded-xl btn-press hover:bg-white/90 transition-colors duration-150"
          >
            Explore Principles
          </button>
          <button 
            onClick={() => onToast('Scroll down to see animations in action', 'info')}
            className="px-6 py-3 bg-[#1a1a1a] text-[#fafafa] text-sm font-medium rounded-xl border border-[#262626] btn-press hover:bg-[#262626] transition-colors duration-150"
          >
            See Animations
          </button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
          className="w-5 h-8 border border-[#333] rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 bg-[#525252] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Principles section
function Principles() {
  const principles = [
    { number: '01', title: 'Taste is trained', description: 'Good taste is not personal preference. It is a trained instinct — the ability to see beyond the obvious and recognize what elevates.', icon: '🎯' },
    { number: '02', title: 'Unseen details compound', description: 'Every decision exists because the aggregate of invisible correctness creates interfaces people love without knowing why.', icon: '✨' },
    { number: '03', title: 'Beauty is leverage', description: 'People select tools based on the overall experience. Good defaults and good animations are real differentiators.', icon: '⚡' },
    { number: '04', title: 'Never animate from scale(0)', description: 'Nothing in the real world disappears and reappears completely. Start from scale(0.95) with opacity.', icon: '🎭' },
    { number: '05', title: 'Buttons must feel responsive', description: 'Add transform: scale(0.97) on :active. This gives instant feedback that the UI is truly listening.', icon: '👆' },
    { number: '06', title: 'Speed is perception', description: 'A fast-spinning spinner makes loading feel faster. A 180ms select feels more responsive than 400ms.', icon: '🚀' },
  ];

  return (
    <section id="principles" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Core Philosophy</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight">
            Principles that compound
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map((principle, i) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <PrincipleCard {...principle} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Animation decision framework
function AnimationFramework() {
  return (
    <section id="animations" className="py-32 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Animation Framework</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            The decision framework
          </h2>
          <p className="text-[#a1a1a1] max-w-2xl">
            Before writing any animation code, answer these questions in order.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="p-6 bg-[#141414] border border-[#262626] rounded-2xl"
          >
            <EasingVisualizer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-4"
          >
            <CodeComparison
              label="Easing"
              before="transition: all 300ms ease-in"
              after="transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1)"
            />
            <CodeComparison
              label="Entry Animation"
              before="transform: scale(0)"
              after="transform: scale(0.95); opacity: 0"
            />
            <CodeComparison
              label="Button Press"
              before="/* No active state */"
              after=".button:active { transform: scale(0.97) }"
            />
          </motion.div>
        </div>

        {/* Duration table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8 p-6 bg-[#141414] border border-[#262626] rounded-2xl"
        >
          <h4 className="text-sm font-medium text-[#fafafa] mb-4">Duration Guidelines</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { element: 'Button press feedback', duration: '100-160ms' },
              { element: 'Tooltips, small popovers', duration: '125-200ms' },
              { element: 'Dropdowns, selects', duration: '150-250ms' },
              { element: 'Modals, drawers', duration: '200-500ms' },
            ].map((item) => (
              <div key={item.element} className="flex items-center justify-between py-2 px-3 bg-[#0a0a0a] rounded-lg">
                <span className="text-xs text-[#a1a1a1]">{item.element}</span>
                <span className="text-xs font-mono text-[#fafafa]">{item.duration}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Interactive demo section
function InteractiveDemo({ onToast }: { onToast: (msg: string, type: Toast['type']) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Transform', 'Opacity', 'Clip-path'];

  return (
    <section id="craft" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Interactive</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            Feel the difference
          </h2>
          <p className="text-[#a1a1a1] max-w-2xl">
            Interact with these elements. Notice how buttons respond to your press, 
            how cards track your cursor, and how transitions feel natural.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Button showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="p-6 bg-[#141414] border border-[#262626] rounded-2xl space-y-4"
          >
            <h4 className="text-sm font-medium text-[#fafafa]">Button Feedback</h4>
            <p className="text-xs text-[#737373]">Press and hold — notice the scale(0.97) response</p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onToast('Button pressed! scale(0.97) feedback', 'success')}
                className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg btn-press"
              >
                Primary
              </button>
              <button 
                onClick={() => onToast('Secondary action triggered', 'info')}
                className="px-4 py-2.5 bg-[#262626] text-[#fafafa] text-sm font-medium rounded-lg btn-press hover:bg-[#333] transition-colors duration-150"
              >
                Secondary
              </button>
              <button 
                onClick={() => onToast('Ghost button clicked', 'info')}
                className="px-4 py-2.5 text-[#a1a1a1] text-sm font-medium rounded-lg btn-press hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-all duration-150"
              >
                Ghost
              </button>
            </div>
          </motion.div>

          {/* Tab demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="p-6 bg-[#141414] border border-[#262626] rounded-2xl space-y-4"
          >
            <h4 className="text-sm font-medium text-[#fafafa]">Tab Transitions</h4>
            <div className="relative flex gap-1 p-1 bg-[#0a0a0a] rounded-lg w-fit">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className="relative px-4 py-2 text-sm font-medium rounded-md btn-press z-10 transition-colors duration-150"
                >
                  {activeTab === i && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#262626] rounded-md"
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  <span className={`relative z-10 ${activeTab === i ? 'text-[#fafafa]' : 'text-[#737373]'}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="p-4 bg-[#0a0a0a] rounded-xl"
              >
                {activeTab === 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#a1a1a1]">GPU-accelerated, runs on compositor thread</p>
                    <code className="text-xs text-[#737373] font-mono">transform: translateX(100px) scale(1.05)</code>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#a1a1a1]">Also GPU-accelerated, great for enter/exit</p>
                    <code className="text-xs text-[#737373] font-mono">opacity: 0 → 1</code>
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#a1a1a1]">Powerful for reveals and wipes</p>
                    <code className="text-xs text-[#737373] font-mono">clip-path: inset(0 100% 0 0) → inset(0)</code>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 3D card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-2"
          >
            <InteractiveCard>
              <div className="p-8 bg-[#141414] border border-[#262626] rounded-2xl text-center">
                <p className="text-xs text-[#525252] mb-4">Move your cursor over this card</p>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Spring-based tracking</h3>
                <p className="text-sm text-[#a1a1a1] max-w-md mx-auto">
                  Using <code className="text-xs bg-[#262626] px-1.5 py-0.5 rounded">useSpring</code> from Framer Motion 
                  to interpolate rotation with momentum. Feels natural, not artificial.
                </p>
              </div>
            </InteractiveCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Review checklist
function ReviewChecklist() {
  const items = [
    { issue: 'transition: all', fix: 'Specify exact properties' },
    { issue: 'scale(0) entry', fix: 'Start from scale(0.95) + opacity' },
    { issue: 'ease-in on UI', fix: 'Switch to ease-out or custom curve' },
    { issue: 'transform-origin: center on popover', fix: 'Set to trigger location' },
    { issue: 'Animation on keyboard action', fix: 'Remove animation entirely' },
    { issue: 'Duration > 300ms', fix: 'Reduce to 150-250ms' },
    { issue: 'Hover without media query', fix: 'Add @media (hover: hover)' },
    { issue: 'Keyframes on rapid element', fix: 'Use CSS transitions' },
  ];

  return (
    <section className="py-32 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Checklist</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight">
            Review checklist
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-[1fr_1fr] gap-px bg-[#262626]">
            <div className="p-4 bg-[#141414]">
              <span className="text-xs font-medium text-[#737373] uppercase tracking-wider">Issue</span>
            </div>
            <div className="p-4 bg-[#141414]">
              <span className="text-xs font-medium text-[#737373] uppercase tracking-wider">Fix</span>
            </div>
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="contents"
              >
                <div className="p-4 bg-[#141414] border-t border-[#1a1a1a]">
                  <code className="text-xs text-red-400/80 font-mono">{item.issue}</code>
                </div>
                <div className="p-4 bg-[#141414] border-t border-[#1a1a1a]">
                  <span className="text-xs text-[#a1a1a1]">{item.fix}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Quote section
function Quote() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-2xl md:text-3xl text-[#fafafa] font-light leading-relaxed tracking-tight">
            "All those unseen details combine to produce something that's just stunning, 
            like a thousand barely audible voices all singing in tune."
          </p>
          <footer className="mt-6">
            <span className="text-sm text-[#737373]">— Paul Graham</span>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
          <span className="text-sm text-[#737373]">Built with Emil Kowalski's design engineering principles</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/emilkowalski/skills" target="_blank" rel="noopener noreferrer" className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150 btn-press">
            GitHub
          </a>
          <a href="https://emilkowal.ski/skill" target="_blank" rel="noopener noreferrer" className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150 btn-press">
            Skills
          </a>
        </div>
      </div>
    </footer>
  );
}

// Main App
export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = (message: string, type: Toast['type']) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      <Nav />
      <Hero onToast={addToast} />
      <Principles />
      <AnimationFramework />
      <InteractiveDemo onToast={addToast} />
      <Quote />
      <ReviewChecklist />
      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
