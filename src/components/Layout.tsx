import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Home, MapPin, Package, ChefHat, Bell, Settings, LogOut, 
  Menu, X, Plus, AlertTriangle
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
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  
  // Count expiring products
  const expiringProducts = products.filter(p => {
    const status = getExpirationStatus(p.expirationDate);
    return status === 'expired' || status === 'today' || status === 'soon';
  });

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'locations', label: 'Lugares', icon: MapPin },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'recipes', label: 'Recetas IA', icon: ChefHat },
    { id: 'alerts', label: 'Alertas', icon: Bell, badge: expiringProducts.length },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#fafafa]">Mi Despensa</h1>
              <p className="text-xs text-[#525252]">{currentHouse?.name || 'Sin casa'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-[#fafafa]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
              <span className="text-xs font-medium text-purple-300">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#fafafa] truncate">{user?.name}</p>
              <p className="text-xs text-[#525252] truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-[#525252] hover:text-red-400 transition-colors duration-150"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-[#fafafa]">
                  {navItems.find(n => n.id === currentPage)?.label || 'Inicio'}
                </h2>
                {currentHouse && (
                  <p className="text-xs text-[#525252]">{currentHouse.name}</p>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              {expiringProducts.length > 0 && (
                <button
                  onClick={() => onNavigate('alerts')}
                  className="relative p-2 text-[#a1a1a1] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                </button>
              )}
              <button
                onClick={() => onNavigate('products')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-150 btn-press"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
