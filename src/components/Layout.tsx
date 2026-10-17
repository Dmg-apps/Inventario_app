import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Home, MapPin, Package, ChefHat, Bell, Settings, LogOut, 
  Menu, X, Plus, AlertTriangle, Download, Upload
} from 'lucide-react';
import { getExpirationStatus } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, houses, currentHouseId, products, locations } = useStore();

  const currentHouse = houses.find(h => h.id === currentHouseId);
  
  // Count expiring products
  const expiringProducts = products.filter(p => {
    const status = getExpirationStatus(p.expirationDate);
    return status === 'expired' || status === 'today' || status === 'soon';
  });

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home, emoji: '🏠' },
    { id: 'locations', label: 'Lugares', icon: MapPin, emoji: '📍' },
    { id: 'products', label: 'Productos', icon: Package, emoji: '📦' },
    { id: 'recipes', label: 'Recetas IA', icon: ChefHat, emoji: '👨‍🍳' },
    { id: 'alerts', label: 'Alertas', icon: Bell, emoji: '⏰', badge: expiringProducts.length },
    { id: 'settings', label: 'Ajustes', icon: Settings, emoji: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d]/95 backdrop-blur-xl border-r border-[#1a1a1a] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <span className="text-2xl">🏠</span>
            </motion.div>
            <div>
              <h1 className="text-base font-bold text-[#fafafa]">Mi Despensa</h1>
              <p className="text-xs text-[#525252]">{currentHouse?.name || 'Sin casa'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : 'text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-[#fafafa] border-2 border-transparent'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-lg shadow-red-500/50"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-[#1a1a1a] space-y-2">
          <motion.button
            onClick={() => {
              onNavigate('download');
              setSidebarOpen(false);
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Descargar ZIP</span>
          </motion.button>
        </div>

        {/* User */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3 p-3 bg-[#141414] rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/40 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-300">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#fafafa] truncate">{user?.name}</p>
              <p className="text-xs text-[#525252] truncate">{user?.email}</p>
            </div>
            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-[#525252] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setSidebarOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-xl transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
              <div>
                <h2 className="text-xl font-bold text-[#fafafa]">
                  {navItems.find(n => n.id === currentPage)?.emoji}{' '}
                  {navItems.find(n => n.id === currentPage)?.label || 'Inicio'}
                </h2>
                {currentHouse && (
                  <p className="text-xs text-[#525252] mt-0.5">{currentHouse.name}</p>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              {expiringProducts.length > 0 && (
                <motion.button
                  onClick={() => onNavigate('alerts')}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2.5 text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-xl transition-all duration-200"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                  />
                </motion.button>
              )}
              <motion.button
                onClick={() => onNavigate('import')}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-[#fafafa] text-sm font-medium rounded-xl border border-[#262626] hover:border-[#333] hover:bg-[#262626] transition-all duration-200"
                title="Importar Excel"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar</span>
              </motion.button>
              <motion.button
                onClick={() => onNavigate('products')}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
