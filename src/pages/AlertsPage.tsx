import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { AlertTriangle, CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';
import { 
  getExpirationStatus, getExpirationColor, 
  getExpirationLabel, formatDate, CATEGORIES 
} from '../lib/utils';

export default function AlertsPage() {
  const { houses, currentHouseId, locations, products } = useStore();
  
  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  const houseProducts = products.filter(p => houseLocations.some(l => l.id === p.locationId));

  // Group by expiration status
  const expired = houseProducts.filter(p => getExpirationStatus(p.expirationDate) === 'expired');
  const today = houseProducts.filter(p => getExpirationStatus(p.expirationDate) === 'today');
  const soon = houseProducts.filter(p => getExpirationStatus(p.expirationDate) === 'soon');
  const warning = houseProducts.filter(p => getExpirationStatus(p.expirationDate) === 'warning');

  const sections = [
    { title: 'Caducados', products: expired, icon: XCircle, color: 'red', description: 'Estos productos ya han caducado' },
    { title: 'Caducan hoy', products: today, icon: AlertTriangle, color: 'orange', description: 'Estos productos caducan hoy' },
    { title: 'Próximos a caducar', products: soon, icon: Calendar, color: 'yellow', description: 'Caducan en los próximos 3 días' },
    { title: 'Aviso', products: warning, icon: Calendar, color: 'amber', description: 'Caducan en los próximos 7 días' },
  ].filter(s => s.products.length > 0);

  if (!currentHouse) {
    return (
      <div className="text-center py-12">
        <p className="text-[#525252]">Crea una casa primero en Ajustes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#fafafa]">Alertas de caducidad</h2>
        <p className="text-sm text-[#525252]">
          {expired.length + today.length + soon.length + warning.length} productos necesitan atención
        </p>
      </div>

      {sections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-[#fafafa] mb-2">¡Todo en orden!</p>
          <p className="text-sm text-[#525252]">No hay productos próximos a caducar</p>
        </motion.div>
      ) : (
        sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden"
            >
              <div className={`p-4 border-b border-[#1a1a1a] flex items-center gap-3 ${
                section.color === 'red' ? 'bg-red-500/5' :
                section.color === 'orange' ? 'bg-orange-500/5' :
                section.color === 'yellow' ? 'bg-yellow-500/5' :
                'bg-amber-500/5'
              }`}>
                <Icon className={`w-5 h-5 ${
                  section.color === 'red' ? 'text-red-400' :
                  section.color === 'orange' ? 'text-orange-400' :
                  section.color === 'yellow' ? 'text-yellow-400' :
                  'text-amber-400'
                }`} />
                <div>
                  <h3 className="text-sm font-semibold text-[#fafafa]">{section.title}</h3>
                  <p className="text-xs text-[#525252]">{section.description}</p>
                </div>
                <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${
                  section.color === 'red' ? 'bg-red-500/20 text-red-400' :
                  section.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                  section.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {section.products.length}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {section.products.map((product) => {
                  const location = houseLocations.find(l => l.id === product.locationId);
                  const category = CATEGORIES.find(c => c.id === product.category);
                  const status = getExpirationStatus(product.expirationDate);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category?.icon || '📦'}</span>
                        <div>
                          <p className="text-sm font-medium text-[#fafafa]">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs text-[#525252]">
                            {location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {location.name}
                              </span>
                            )}
                            <span>·</span>
                            <span>{product.quantity} {product.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getExpirationColor(status)}`}>
                          {getExpirationLabel(status)}
                        </span>
                        {product.expirationDate && (
                          <p className="text-[10px] text-[#525252] mt-1">{formatDate(product.expirationDate)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
