import { motion } from 'framer-motion';
import { Github, ExternalLink, Download, CheckCircle, Zap, Shield, Brain, Code, Terminal } from 'lucide-react';

export default function ECCInfoPage() {
  const features = [
    {
      icon: Brain,
      title: 'Skills & Instincts',
      description: '123+ skills reutilizables que convierten victorias repetidas en flujos de trabajo automatizados',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: Shield,
      title: 'AgentShield Security',
      description: 'Seguridad de nivel empresarial con protección contra inyecciones y validación de prompts',
      color: 'from-red-500/20 to-orange-500/20'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Sistema de memoria, hooks y workflows que optimizan el rendimiento del agente',
      color: 'from-yellow-500/20 to-amber-500/20'
    },
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Soporte para TypeScript, Python, Go, Java, Rust, React, Next.js y más',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: Terminal,
      title: '69+ Agentes Especializados',
      description: 'Agentes para code review, testing, debugging, security scanning y más',
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      icon: Download,
      title: 'Fácil Instalación',
      description: 'Instalación con un solo comando compatible con Claude Code, Codex, Cursor y más',
      color: 'from-indigo-500/20 to-violet-500/20'
    }
  ];

  const installCommands = [
    { tool: 'Claude Code', command: '/plugin install ecc@ecc' },
    { tool: 'Codex', command: 'npx ecc-universal install --harness codex' },
    { tool: 'Cursor', command: 'npx ecc-universal install --harness cursor' },
    { tool: 'OpenCode', command: 'npx ecc-universal install --harness opencode' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Agent Harness Optimization System</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#fafafa] mb-6 tracking-tight">
              ECC
            </h1>
            <p className="text-xl md:text-2xl text-[#a1a1a1] mb-8 max-w-3xl mx-auto">
              Everything Claude Code - El sistema de optimización de rendimiento para agentes de IA
            </p>
            <p className="text-base text-[#737373] max-w-2xl mx-auto mb-10">
              Skills, instincts, memoria, seguridad y desarrollo research-first para Claude Code, Codex, OpenCode, Cursor y más.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://github.com/affaan-m/ECC"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Ver en GitHub
              </motion.a>
              <motion.a
                href="https://ecc.tools"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-[#1a1a1a] text-[#fafafa] font-semibold rounded-2xl border-2 border-[#262626] flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Sitio Web
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {[
              { value: '3,934', label: 'Commits' },
              { value: '123+', label: 'Skills' },
              { value: '69+', label: 'Agentes' },
              { value: '78', label: 'Comandos' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 bg-[#141414] border border-[#262626] rounded-2xl text-center"
              >
                <p className="text-3xl font-bold text-[#fafafa] mb-1">{stat.value}</p>
                <p className="text-xs text-[#525252] uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#fafafa] mb-4">Características Principales</h2>
            <p className="text-[#a1a1a1]">Un sistema completo para optimizar tus agentes de IA</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className={`p-6 bg-gradient-to-br ${feature.color} border border-[#262626] rounded-3xl`}
                >
                  <Icon className="w-10 h-10 text-[#fafafa] mb-4" />
                  <h3 className="text-lg font-bold text-[#fafafa] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#a1a1a1]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#fafafa] mb-4">Instalación Rápida</h2>
            <p className="text-[#a1a1a1]">Compatible con múltiples herramientas de IA</p>
          </motion.div>

          <div className="space-y-4">
            {installCommands.map((item, i) => (
              <motion.div
                key={item.tool}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-[#141414] border border-[#262626] rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#fafafa]">{item.tool}</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.command);
                    }}
                    className="px-3 py-1 text-xs bg-[#262626] text-[#a1a1a1] rounded-lg hover:bg-[#333] transition-colors duration-150"
                  >
                    Copiar
                  </button>
                </div>
                <code className="text-sm text-emerald-400 font-mono bg-[#0a0a0a] px-4 py-2 rounded-lg block">
                  $ {item.command}
                </code>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration with Mi Despensa */}
      <section className="px-6 py-20 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#fafafa] mb-4">Integración con Mi Despensa</h2>
            <p className="text-[#a1a1a1]">Cómo usar ECC para mejorar tu app de inventario</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: 'Code Review Automatizado',
                description: 'Usa /react-review para revisar componentes React con mejores prácticas',
                command: '/react-review'
              },
              {
                title: 'Testing con TDD',
                description: 'Genera tests unitarios automáticamente con /react-test',
                command: '/react-test'
              },
              {
                title: 'Optimización de Performance',
                description: 'Identifica problemas de rendimiento con /react-performance',
                command: '/react-performance'
              },
              {
                title: 'Security Scanning',
                description: 'Escanea vulnerabilidades de seguridad con /security-scan',
                command: '/security-scan'
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-[#141414] border border-[#262626] rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#fafafa] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#a1a1a1] mb-3">{item.description}</p>
                    <code className="text-xs text-purple-400 font-mono bg-[#0a0a0a] px-3 py-1.5 rounded-lg">
                      {item.command}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl"
          >
            <h2 className="text-3xl font-bold text-[#fafafa] mb-4">
              ¿Listo para optimizar tus agentes?
            </h2>
            <p className="text-[#a1a1a1] mb-8">
              ECC es gratuito y de código abierto bajo licencia MIT
            </p>
            <motion.a
              href="https://github.com/affaan-m/ECC"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/30"
            >
              <Github className="w-5 h-5" />
              Explorar ECC en GitHub
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
