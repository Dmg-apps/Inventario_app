import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  MapPin, Plus, Edit2, Trash2, QrCode, X, Save,
  Link, Smartphone
} from 'lucide-react';
import { LOCATION_ICONS, generateNfcUrl } from '../lib/utils';

export default function LocationsPage() {
  const { houses, currentHouseId, locations, products, addLocation, updateLocation, deleteLocation, setNfcUrl } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [nfcModal, setNfcModal] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('📦');
  const [nfcUrl, setNfcUrlState] = useState('');

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);

  const handleAdd = () => {
    if (!newName.trim() || !currentHouseId) return;
    addLocation(currentHouseId, newName.trim(), newDescription.trim() || undefined, newIcon);
    setNewName('');
    setNewDescription('');
    setNewIcon('📦');
    setShowAddModal(false);
  };

  const handleUpdate = () => {
    if (!editingLocation || !newName.trim()) return;
    updateLocation(editingLocation, { name: newName.trim(), description: newDescription.trim() || undefined, icon: newIcon });
    setEditingLocation(null);
    setNewName('');
    setNewDescription('');
    setNewIcon('📦');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este lugar? También se eliminarán todos los productos asociados.')) {
      deleteLocation(id);
    }
  };

  const handleNfcSave = () => {
    if (!nfcModal) return;
    setNfcUrl(nfcModal, nfcUrl);
    setNfcModal(null);
    setNfcUrlState('');
  };

  const generateNfc = (locationId: string) => {
    const url = generateNfcUrl(locationId);
    setNfcUrlState(url);
    setNfcModal(locationId);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#fafafa]">Lugares</h2>
          <p className="text-sm text-[#525252]">{houseLocations.length} ubicaciones en {currentHouse.name}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-150 btn-press"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo lugar</span>
        </button>
      </div>

      {/* Locations grid */}
      {houseLocations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <MapPin className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-[#525252] mb-4">No hay lugares todavía</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
          >
            Crear primer lugar
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {houseLocations.map((location, i) => {
            const locationProducts = products.filter(p => p.locationId === location.id);
            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="group relative p-5 bg-[#141414] border border-[#262626] rounded-xl hover:border-[#333] transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{location.icon || '📦'}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => {
                        setEditingLocation(location.id);
                        setNewName(location.name);
                        setNewDescription(location.description || '');
                        setNewIcon(location.icon || '📦');
                      }}
                      className="p-1.5 text-[#525252] hover:text-[#fafafa] hover:bg-[#262626] rounded-lg transition-colors duration-150"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="p-1.5 text-[#525252] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#fafafa] mb-1">{location.name}</h3>
                {location.description && (
                  <p className="text-xs text-[#737373] mb-3">{location.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#525252]">
                    {locationProducts.length} producto{locationProducts.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => generateNfc(location.id)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
                  >
                    <QrCode className="w-3 h-3" />
                    NFC
                  </button>
                </div>
                {location.nfcUrl && (
                  <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                    <p className="text-[10px] text-[#525252] truncate flex items-center gap-1">
                      <Link className="w-2.5 h-2.5" />
                      {location.nfcUrl}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingLocation) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingLocation(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#fafafa]">
                  {editingLocation ? 'Editar lugar' : 'Nuevo lugar'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLocation(null);
                  }}
                  className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Icon picker */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Icono</label>
                  <div className="grid grid-cols-8 gap-2">
                    {LOCATION_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-150 ${
                          newIcon === icon
                            ? 'bg-emerald-500/20 border border-emerald-500/40'
                            : 'bg-[#0a0a0a] border border-[#262626] hover:border-[#333]'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Nombre</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Nevera, Despensa, Baño..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Descripción (opcional)</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ej: Segunda balda, estante superior..."
                    rows={2}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150 resize-none"
                  />
                </div>

                <button
                  onClick={editingLocation ? handleUpdate : handleAdd}
                  disabled={!newName.trim()}
                  className="w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingLocation ? 'Guardar cambios' : 'Crear lugar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFC Modal */}
      <AnimatePresence>
        {nfcModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setNfcModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#fafafa]">Configurar NFC</h3>
                <button
                  onClick={() => setNfcModal(null)}
                  className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-[#fafafa]">URL para tag NFC</p>
                      <p className="text-xs text-[#525252]">Escribe esta URL en tu tag NFC</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={nfcUrl}
                    onChange={(e) => setNfcUrlState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#262626] rounded-lg text-xs font-mono text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  />
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    💡 Puedes usar apps como "NFC Tools" para escribir esta URL en cualquier tag NFC. 
                    Al escanear el tag, se abrirá directamente este lugar.
                  </p>
                </div>

                <button
                  onClick={handleNfcSave}
                  className="w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar enlace NFC
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
