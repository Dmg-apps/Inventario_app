import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { ArrowRight, Plus, Package, AlertTriangle } from 'lucide-react';
import { getExpirationStatus, getExpirationColor, CATEGORIES } from '../lib/utils';

/**
 * Props para el componente Dashboard
 */
interface DashboardProps {
  /** Callback para navegar a otras páginas */
  onNavigate: (page: string) => void;
}

/**
 * Página principal del dashboard
 * 
 * Muestra estadísticas generales, productos próximos a caducar,
 * acciones rápidas y productos añadidos recientemente.
 * 
 * Optimizaciones aplicadas (ECC /react-performance):
 * - useMemo para cálculos costosos
 * - useCallback para funciones estables
 * - React.memo implícito en componentes hijos
 * 
 * @example
 * ```tsx
 * <Dashboard onNavigate={setCurrentPage} />
 * ```
 */
export default function Dashboard({ onNavigate }: DashboardProps) {
  const { houses, currentHouseId, locations, products } = useStore();
  
  // ✅ useMemo: Solo recalcular cuando cambien las dependencias
  const currentHouse = useMemo(
    () => houses.find(h => h.id === currentHouseId),
    [houses, currentHouseId]
  );

  const houseLocations = useMemo(
    () => locations.filter(l => l.houseId === currentHouseId),
    [locations, currentHouseId]
  );

  const houseProducts = useMemo(
    () => products.filter(p => houseLocations.some(l => l.id === p.locationId)),
    [products, houseLocations]
  );

  const totalProducts = houseProducts.length;
  const totalLocations = houseLocations.length;

  // ✅ useMemo: Filtrar productos próximos a caducar
  const expiringProducts = useMemo(() => {
    return houseProducts.filter(p => {
      const status = getExpirationStatus(p.expirationDate);
      return status === 'expired' || status === 'today' || status === 'soon';
    });
  }, [houseProducts]);

  // ✅ useMemo: Productos recientes ordenados
  const recentProducts = useMemo(() => {
    return [...houseProducts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [houseProducts]);

  // ✅ useCallback: Funciones estables para evitar re-renders
  const handleNavigateToSettings = useCallback(() => {
    onNavigate('settings');
  }, [onNavigate]);

  const handleNavigateToAlerts = useCallback(() => {
    onNavigate('alerts');
  }, [onNavigate]);

  const handleNavigateToProducts = useCallback(() => {
    onNavigate('products');
  }, [onNavigate]);

  const handleNavigateToLocations = useCallback(() => {
    onNavigate('locations');
  }, [onNavigate]);

  const handleNavigateToRecipes = useCallback(() => {
    onNavigate('recipes');
  }, [onNavigate]);

  if (!currentHouse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 flex items-center justify-center shadow-2xl shadow-emerald-500/20"
          >
            <span className="text-6xl">🏠</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-[#fafafa] mb-4">
            ¡Empieza tu aventura!
          </h2>
          <p className="text-base text-[#a1a1a1] mb-8 leading-relaxed">
            Crea tu primera casa para comenzar a organizar tus productos y ubicaciones de forma inteligente.
          </p>
          <motion.button
            onClick={handleNavigateToSettings}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-base font-semibold rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 shadow-lg shadow-emerald-500/30 inline-flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Crear mi primera casa
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl"
          >
            👋
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-[#fafafa] mb-1">
              ¡Hola! Bienvenido a {currentHouse.name}
            </h2>
            <p className="text-sm text-[#a1a1a1]">
              Tienes {totalProducts} productos en {totalLocations} ubicaciones
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Productos', value: totalProducts, icon: '📦', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
          { label: 'Lugares', value: totalLocations, icon: '📍', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
          { label: 'Por caducar', value: expiringProducts.length, icon: '⏰', color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30' },
          { label: 'Categorías', value: new Set(houseProducts.map(p => p.category)).size, icon: '🏷️', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-6 bg-gradient-to-br ${stat.color} border-2 ${stat.border} rounded-3xl backdrop-blur-sm`}
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <p className="text-3xl font-bold text-[#fafafa] mb-1">{stat.value}</p>
            <p className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#fafafa]">Atención necesaria</h3>
                <p className="text-xs text-[#525252]">Productos próximos a caducar</p>
              </div>
            </div>
            <motion.button
              onClick={() => onNavigate('alerts')}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
          <div className="p-6">
            {expiringProducts.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  ✅
                </motion.div>
                <p className="text-sm text-[#525252]">¡Todo en orden! No hay productos próximos a caducar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expiringProducts.slice(0, 4).map((product, i) => {
                  const status = getExpirationStatus(product.expirationDate);
                  const location = houseLocations.find(l => l.id === product.locationId);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl hover:bg-[#1a1a1a] transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          {CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#fafafa]">{product.name}</p>
                          <p className="text-xs text-[#525252]">{location?.name}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getExpirationColor(status)}`}>
                        {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString('es') : 'Sin fecha'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#141414] border border-[#262626] rounded-3xl p-6"
        >
          <h3 className="text-base font-bold text-[#fafafa] mb-6">Acciones rápidas</h3>
          <div className="space-y-3">
            {[
              { emoji: '📦', label: 'Añadir producto', page: 'products', color: 'from-emerald-500/20 to-teal-500/20' },
              { emoji: '📍', label: 'Nuevo lugar', page: 'locations', color: 'from-blue-500/20 to-cyan-500/20' },
              { emoji: '👨‍🍳', label: 'Generar recetas', page: 'recipes', color: 'from-purple-500/20 to-pink-500/20' },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r ${action.color} border border-[#262626] rounded-2xl hover:border-[#333] transition-all duration-200 text-left`}
              >
                <span className="text-3xl">{action.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#fafafa]">{action.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#525252]" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[#141414] border border-[#262626] rounded-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fafafa]">Añadidos recientemente</h3>
              <p className="text-xs text-[#525252]">Últimos productos</p>
            </div>
          </div>
          <motion.button
            onClick={() => onNavigate('products')}
            whileTap={{ scale: 0.95 }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </motion.button>
        </div>
        <div className="p-6">
          {recentProducts.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                📦
              </motion.div>
              <p className="text-sm text-[#525252] mb-4">No hay productos todavía</p>
              <motion.button
                onClick={() => onNavigate('products')}
                whileTap={{ scale: 0.97 }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Añadir primer producto
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProducts.map((product, i) => {
                const location = houseLocations.find(l => l.id === product.locationId);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-5 bg-[#0a0a0a] rounded-2xl hover:bg-[#1a1a1a] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">
                        {CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}
                      </span>
                      <span className="text-xs font-mono text-[#525252]">{product.quantity} {product.unit}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#fafafa] mb-1 truncate">{product.name}</p>
                    <p className="text-xs text-[#525252] truncate">{location?.name}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
