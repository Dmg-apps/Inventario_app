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
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(-(y - centerY) / 25);
    rotateY.set((x - centerX) / 25);
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

// Provider card
function ProviderCard({ icon, name, description, status }: { 
  icon: string; name: string; description: string; status: string 
}) {
  return (
    <InteractiveCard className="group">
      <div className="relative p-5 bg-[#141414] border border-[#262626] rounded-2xl hover-lift transition-colors duration-200 hover:border-[#333]">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            status === 'stable' ? 'bg-green-400/10 text-green-400' : 
            status === 'beta' ? 'bg-yellow-400/10 text-yellow-400' :
            'bg-blue-400/10 text-blue-400'
          }`}>{status}</span>
        </div>
        <h3 className="text-base font-semibold text-[#fafafa] mb-1.5">{name}</h3>
        <p className="text-xs text-[#a1a1a1] leading-relaxed">{description}</p>
      </div>
    </InteractiveCard>
  );
}

// Terminal component
function Terminal() {
  const [currentLine, setCurrentLine] = useState(0);
  const lines = [
    { prefix: '$', text: 'npx @anthropic-ai/rea install', color: 'text-green-400' },
    { prefix: '', text: '→ Installing REA agents v6.5.0...', color: 'text-[#737373]' },
    { prefix: '', text: '→ Detecting providers...', color: 'text-[#737373]' },
    { prefix: '✓', text: ' Ghidra 12.1.4 found', color: 'text-green-400' },
    { prefix: '✓', text: ' Hopper Disassembler found', color: 'text-green-400' },
    { prefix: '✓', text: ' MCP server configured', color: 'text-green-400' },
    { prefix: '', text: '', color: '' },
    { prefix: '$', text: 'rea analyze ./target.bin', color: 'text-green-400' },
    { prefix: '', text: '→ Opening binary with Ghidra...', color: 'text-[#737373]' },
    { prefix: '', text: '→ Running analysis pipeline...', color: 'text-[#737373]' },
    { prefix: '✓', text: ' 47 functions decompiled', color: 'text-green-400' },
    { prefix: '✓', text: ' Call graph generated', color: 'text-green-400' },
    { prefix: '✓', text: ' Evidence collected', color: 'text-green-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev >= lines.length - 1) {
          setTimeout(() => setCurrentLine(0), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#141414] border-b border-[#1a1a1a]">
        <div className="w-3 h-3 rounded-full bg-[#333]" />
        <div className="w-3 h-3 rounded-full bg-[#333]" />
        <div className="w-3 h-3 rounded-full bg-[#333]" />
        <span className="ml-2 text-xs text-[#525252] font-mono">terminal</span>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed min-h-[280px]">
        {lines.slice(0, currentLine + 1).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className={`${line.color} ${i === currentLine ? '' : ''}`}
          >
            {line.prefix && <span className="mr-2">{line.prefix}</span>}
            {line.text}
          </motion.div>
        ))}
        {currentLine < lines.length - 1 && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-2 h-3.5 bg-[#525252] ml-0.5"
          />
        )}
      </div>
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
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-300">R</span>
          </div>
          <span className="text-sm font-semibold text-[#fafafa]">REA</span>
          <span className="text-[10px] font-mono text-[#525252] bg-[#1a1a1a] px-1.5 py-0.5 rounded">v6.5</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#providers" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Providers</a>
          <a href="#capabilities" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Capabilities</a>
          <a href="#install" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150">Install</a>
          <a href="https://github.com/morluto/rea" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150 btn-press">
            GitHub ↗
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

// Hero section
function Hero({ onToast }: { onToast: (msg: string, type: Toast['type']) => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.03),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, transform: 'translateY(20px) scale(0.98)' }}
        animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-4xl relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-[#a1a1a1]">Reverse Engineer Anything — with AI agents</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#fafafa] tracking-tight leading-[1.1] mb-6">
          Reverse engineer{' '}
          <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            anything
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#a1a1a1] leading-relaxed max-w-2xl mx-auto mb-10">
          From app behavior down to native binaries. Unified MCP interface across 
          Ghidra, Hopper, IDA, JADX, and more — with evidence-backed analysis.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText('npx @anthropic-ai/rea install');
              onToast('Install command copied!', 'success');
            }}
            className="px-6 py-3 bg-white text-black text-sm font-medium rounded-xl btn-press hover:bg-white/90 transition-colors duration-150"
          >
            Get Started
          </button>
          <a 
            href="https://github.com/morluto/rea" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#1a1a1a] text-[#fafafa] text-sm font-medium rounded-xl border border-[#262626] btn-press hover:bg-[#262626] transition-colors duration-150"
          >
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { value: '3,545', label: 'Commits' },
            { value: '135', label: 'Branches' },
            { value: '37', label: 'Releases' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-[#fafafa]">{stat.value}</div>
              <div className="text-xs text-[#525252]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
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

// Providers section
function Providers() {
  const providers = [
    { icon: '🐘', name: 'Ghidra', description: 'NSA reverse engineering framework. Full decompilation, cross-references, and type analysis.', status: 'stable' },
    { icon: '🦘', name: 'Hopper', description: 'macOS/Linux disassembler. Swift, Objective-C, and native binary analysis with MCP bridge.', status: 'stable' },
    { icon: '📱', name: 'JADX', description: 'Android DEX to Java decompiler. APK analysis with resource extraction and smali support.', status: 'stable' },
    { icon: '🌐', name: 'Browser (CDP)', description: 'Chrome DevTools Protocol. Web app behavior capture, network interception, and DOM analysis.', status: 'stable' },
    { icon: '🤖', name: 'ADB', description: 'Android Debug Bridge. Device automation, APK installation, and runtime behavior capture.', status: 'stable' },
    { icon: '⚡', name: 'Kuna', description: 'Deep analysis provider. Procedure search, pseudocode, and assembly from project exports.', status: 'beta' },
    { icon: '🔧', name: 'Cutter', description: 'Rizin-based GUI. Open-source reverse engineering with radare2 backend.', status: 'beta' },
    { icon: '📦', name: 'Firmware', description: 'Binwalk and Unblob integration. Firmware extraction and embedded system analysis.', status: 'new' },
  ];

  return (
    <section id="providers" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Providers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight">
            Unified analysis across tools
          </h2>
          <p className="text-[#a1a1a1] mt-4 max-w-2xl">
            One interface to rule them all. REA connects to multiple reverse engineering tools 
            through a consistent MCP protocol, preserving evidence and provenance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((provider, i) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <ProviderCard {...provider} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Capabilities section
function Capabilities() {
  const capabilities = [
    { 
      title: 'MCP Server', 
      description: 'Full Model Context Protocol support. Connect any AI agent to your analysis pipeline.',
      icon: '🔌',
      code: 'mcp serve --stdio'
    },
    { 
      title: 'Evidence-Backed', 
      description: 'Every observation is recorded with provenance. Cleanup ownership, cancellation, and retry semantics.',
      icon: '📋',
      code: 'Evidence { source, file_span, raw_result }'
    },
    { 
      title: 'Batch Decompile', 
      description: 'Decompile entire binaries or selected functions in batch. Cross-provider comparison support.',
      icon: '⚡',
      code: 'batch_decompile(functions: string[])'
    },
    { 
      title: 'Call Graph Analysis', 
      description: 'Generate and traverse call graphs across providers. Xref analysis with type information.',
      icon: '🕸️',
      code: 'get_call_graph(address, depth)'
    },
    { 
      title: 'Cross-Platform', 
      description: 'macOS, Linux, and Windows support. Native binaries, managed code, and firmware analysis.',
      icon: '🖥️',
      code: 'supports: [arm64, x64, m68k, 6502]'
    },
    { 
      title: 'Session Management', 
      description: 'Persistent analysis sessions with cache ownership, cleanup retry, and cancellation support.',
      icon: '🔄',
      code: 'session.open(target).analyze()'
    },
  ];

  return (
    <section id="capabilities" className="py-32 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight">
            Built for serious analysis
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="p-5 bg-[#141414] border border-[#262626] rounded-2xl hover-lift h-full">
                <span className="text-2xl mb-3 block">{cap.icon}</span>
                <h3 className="text-base font-semibold text-[#fafafa] mb-2">{cap.title}</h3>
                <p className="text-xs text-[#a1a1a1] leading-relaxed mb-3">{cap.description}</p>
                <code className="text-[10px] text-[#525252] font-mono bg-[#0a0a0a] px-2 py-1 rounded block truncate">
                  {cap.code}
                </code>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Install section
function Install({ onToast }: { onToast: (msg: string, type: Toast['type']) => void }) {
  return (
    <section id="install" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Quick Start</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
              Install in seconds
            </h2>
            <p className="text-[#a1a1a1] mb-8 leading-relaxed">
              REA auto-detects available providers and configures itself. 
              Just install and start analyzing.
            </p>
            
            <div className="space-y-4">
              {[
                { step: '1', text: 'Install REA globally', cmd: 'npm install -g rea-agents' },
                { step: '2', text: 'Run the setup wizard', cmd: 'rea setup' },
                { step: '3', text: 'Start analyzing', cmd: 'rea analyze ./target' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-xs text-[#a1a1a1] shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm text-[#fafafa] mb-1">{item.text}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.cmd);
                        onToast(`Copied: ${item.cmd}`, 'success');
                      }}
                      className="text-xs font-mono text-[#737373] hover:text-[#a1a1a1] transition-colors duration-150 btn-press cursor-pointer"
                    >
                      <code>$ {item.cmd}</code>
                      <span className="ml-2 text-[#525252]">↗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Architecture section
function Architecture() {
  return (
    <section className="py-32 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3 block">Architecture</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] tracking-tight">
            How it works
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Connection lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/20 via-blue-500/20 to-cyan-500/20" />
            
            {[
              { label: 'AI Agent', sublabel: 'Claude, GPT, or any MCP client', color: 'purple', position: 'top' },
              { label: 'MCP Server', sublabel: 'stdio or HTTP transport', color: 'blue', position: 'middle' },
              { label: 'Provider Layer', sublabel: 'Ghidra, Hopper, JADX, ADB...', color: 'cyan', position: 'bottom' },
            ].map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="relative flex items-center justify-center py-8"
              >
                <div className={`relative z-10 px-6 py-4 bg-[#141414] border border-[#262626] rounded-xl text-center ${
                  layer.color === 'purple' ? 'border-purple-500/20' :
                  layer.color === 'blue' ? 'border-blue-500/20' :
                  'border-cyan-500/20'
                }`}>
                  <div className="text-sm font-semibold text-[#fafafa]">{layer.label}</div>
                  <div className="text-xs text-[#737373] mt-1">{layer.sublabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-purple-300">R</span>
          </div>
          <span className="text-sm text-[#737373]">
            REA — Reverse Engineer Anything
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/morluto/rea" target="_blank" rel="noopener noreferrer" className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150 btn-press">
            GitHub
          </a>
          <a href="https://github.com/morluto/rea/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150 btn-press">
            Docs
          </a>
          <a href="https://github.com/morluto/rea/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150 btn-press">
            License
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
      <Providers />
      <Capabilities />
      <Architecture />
      <Install onToast={addToast} />
      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
