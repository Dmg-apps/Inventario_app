import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Package, MapPin, AlertTriangle, TrendingUp,
  ArrowRight, Plus
} from 'lucide-react';
import { 
  getExpirationStatus, getExpirationColor, 
  getExpirationLabel, formatRelativeDate, CATEGORIES 
} from '../lib/utils';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { houses, currentHouseId, locations, products } = useStore();
  
  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  const houseProducts = products.filter(p => 
    houseLocations.some(l => l.id === p.locationId)
  );

  // Stats
  const totalProducts = houseProducts.length;
  const totalLocations = houseLocations.length;
  const expiringProducts = houseProducts.filter(p => {
    const status = getExpirationStatus(p.expirationDate);
    return status === 'expired' || status === 'today' || status === 'soon';
  });
  const expiredProducts = houseProducts.filter(p => 
    getExpirationStatus(p.expirationDate) === 'expired'
  );

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map(cat => ({
    ...cat,
    count: houseProducts.filter(p => p.category === cat.id).length
  })).filter(c => c.count > 0);

  // Recent products
  const recentProducts = [...houseProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // If no house, show onboarding
  if (!currentHouse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
            <Package className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#fafafa] mb-2">¡Bienvenido!</h2>
          <p className="text-[#a1a1a1] mb-8 max-w-md">
            Empieza creando tu primera casa para organizar tus productos y ubicaciones.
          </p>
          <button
            onClick={() => onNavigate('settings')}
            className="px-6 py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press inline-flex items-center gap-2"
          >
            Crear mi casa
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Productos', value: totalProducts, icon: Package, color: 'emerald' },
          { label: 'Lugares', value: totalLocations, icon: MapPin, color: 'blue' },
          { label: 'Por caducar', value: expiringProducts.length, icon: AlertTriangle, color: 'yellow' },
          { label: 'Caducados', value: expiredProducts.length, icon: TrendingUp, color: 'red' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="p-4 bg-[#141414] border border-[#262626] rounded-xl"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                stat.color === 'emerald' ? 'bg-emerald-500/10' :
                stat.color === 'blue' ? 'bg-blue-500/10' :
                stat.color === 'yellow' ? 'bg-yellow-500/10' :
                'bg-red-500/10'
              }`}>
                <Icon className={`w-4 h-4 ${
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
              </div>
              <p className="text-2xl font-bold text-[#fafafa]">{stat.value}</p>
              <p className="text-xs text-[#525252]">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-[#fafafa]">Productos por caducar</h3>
            <button 
              onClick={() => onNavigate('alerts')}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4">
            {expiringProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#525252]">¡Todo en orden! No hay productos próximos a caducar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {expiringProducts.slice(0, 5).map((product) => {
                  const status = getExpirationStatus(product.expirationDate);
                  const location = houseLocations.find(l => l.id === product.locationId);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#fafafa]">{product.name}</p>
                          <p className="text-xs text-[#525252]">{location?.name}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getExpirationColor(status)}`}>
                        {product.expirationDate ? formatRelativeDate(product.expirationDate) : 'Sin fecha'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="bg-[#141414] border border-[#262626] rounded-xl"
        >
          <div className="p-4 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-[#fafafa]">Por categoría</h3>
          </div>
          <div className="p-4 space-y-2">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-[#525252] text-center py-4">Añade productos para ver categorías</p>
            ) : (
              categoryBreakdown.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-xs text-[#a1a1a1]">{cat.name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#525252]">{cat.count}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="bg-[#141414] border border-[#262626] rounded-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-[#fafafa]">Añadidos recientemente</h3>
          <button 
            onClick={() => onNavigate('products')}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150 flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="p-4">
          {recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[#525252] mb-3">No hay productos todavía</p>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Añadir producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentProducts.map((product) => {
                const location = houseLocations.find(l => l.id === product.locationId);
                const status = getExpirationStatus(product.expirationDate);
                return (
                  <div key={product.id} className="p-3 bg-[#0a0a0a] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg">
                        {CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}
                      </span>
                      {status !== 'none' && status !== 'ok' && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getExpirationColor(status)}`}>
                          {getExpirationLabel(status)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#fafafa] truncate">{product.name}</p>
                    <p className="text-xs text-[#525252] mt-0.5">
                      {location?.name} · {product.quantity} {product.unit}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
