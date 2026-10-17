import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Home, Plus, Edit2, Trash2, X, Save, Users,
  Database, Key, ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const { user, houses, currentHouseId, addHouse, updateHouse, deleteHouse, setCurrentHouse } = useStore();
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [editingHouse, setEditingHouse] = useState<string | null>(null);
  const [houseName, setHouseName] = useState('');
  const [houseAddress, setHouseAddress] = useState('');

  const handleAddHouse = () => {
    if (!houseName.trim()) return;
    addHouse(houseName.trim(), houseAddress.trim() || undefined);
    setHouseName('');
    setHouseAddress('');
    setShowAddHouse(false);
  };

  const handleUpdateHouse = () => {
    if (!editingHouse || !houseName.trim()) return;
    updateHouse(editingHouse, { name: houseName.trim(), address: houseAddress.trim() || undefined });
    setHouseName('');
    setHouseAddress('');
    setEditingHouse(null);
  };

  const handleDeleteHouse = (id: string) => {
    if (confirm('¿Eliminar esta casa? Se borrarán todos los lugares y productos asociados.')) {
      deleteHouse(id);
    }
  };

  const openEditHouse = (houseId: string) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) return;
    setHouseName(house.name);
    setHouseAddress(house.address || '');
    setEditingHouse(houseId);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* User info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="bg-[#141414] border border-[#262626] rounded-xl p-6"
      >
        <h3 className="text-sm font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Perfil
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
            <span className="text-lg font-medium text-purple-300">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#fafafa]">{user?.name}</p>
            <p className="text-xs text-[#525252]">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Houses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-400" />
            Mis casas
          </h3>
          <button
            onClick={() => {
              setHouseName('');
              setHouseAddress('');
              setShowAddHouse(true);
            }}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
          >
            <Plus className="w-3 h-3" />
            Nueva casa
          </button>
        </div>

        {houses.length === 0 ? (
          <div className="text-center py-12 bg-[#141414] border border-[#262626] rounded-xl">
            <Home className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#525252] mb-3">No tienes casas todavía</p>
            <button
              onClick={() => setShowAddHouse(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
            >
              Crear mi primera casa
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {houses.map((house) => (
              <div
                key={house.id}
                className={`p-4 bg-[#141414] border rounded-xl transition-colors duration-200 ${
                  house.id === currentHouseId
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      house.id === currentHouseId
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-[#1a1a1a] border border-[#262626]'
                    }`}>
                      <Home className={`w-5 h-5 ${
                        house.id === currentHouseId ? 'text-emerald-400' : 'text-[#525252]'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#fafafa]">{house.name}</p>
                      {house.address && (
                        <p className="text-xs text-[#525252]">{house.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {house.id !== currentHouseId && (
                      <button
                        onClick={() => setCurrentHouse(house.id)}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-colors duration-150"
                      >
                        Activar
                      </button>
                    )}
                    {house.id === currentHouseId && (
                      <span className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg">
                        Activa
                      </span>
                    )}
                    <button
                      onClick={() => openEditHouse(house.id)}
                      className="p-2 text-[#525252] hover:text-[#fafafa] hover:bg-[#262626] rounded-lg transition-colors duration-150"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHouse(house.id)}
                      className="p-2 text-[#525252] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Supabase config */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="bg-[#141414] border border-[#262626] rounded-xl p-6"
      >
        <h3 className="text-sm font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Supabase (Próximamente)
        </h3>
        <p className="text-xs text-[#737373] mb-4">
          Configura Supabase para sincronizar datos entre dispositivos y habilitar funciones multi-usuario.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#525252] mb-1 block">Supabase URL</label>
            <input
              type="text"
              placeholder="https://xxx.supabase.co"
              disabled
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-xs text-[#525252] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-[#525252] mb-1 block">Anon Key</label>
            <input
              type="password"
              placeholder="eyJ..."
              disabled
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-xs text-[#525252] cursor-not-allowed"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-300">
            💡 Actualmente los datos se guardan localmente en tu navegador. 
            La integración con Supabase estará disponible próximamente.
          </p>
        </div>
      </motion.div>

      {/* AI config */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="bg-[#141414] border border-[#262626] rounded-xl p-6"
      >
        <h3 className="text-sm font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          API de IA (Próximamente)
        </h3>
        <p className="text-xs text-[#737373] mb-4">
          Configura tu API key para generar recetas personalizadas con IA.
        </p>
        <div>
          <label className="text-xs text-[#525252] mb-1 block">API Key (OpenAI / Anthropic)</label>
          <input
            type="password"
            placeholder="sk-..."
            disabled
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-xs text-[#525252] cursor-not-allowed"
          />
        </div>
      </motion.div>

      {/* GitHub link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="text-center py-4"
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-[#525252] hover:text-[#a1a1a1] transition-colors duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          Ver en GitHub
        </a>
      </motion.div>

      {/* Add/Edit House Modal */}
      <AnimatePresence>
        {(showAddHouse || editingHouse) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddHouse(false);
              setEditingHouse(null);
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
                  {editingHouse ? 'Editar casa' : 'Nueva casa'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddHouse(false);
                    setEditingHouse(null);
                  }}
                  className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Nombre *</label>
                  <input
                    type="text"
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="Ej: Mi casa, Piso centro, Apartamento playa..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Dirección (opcional)</label>
                  <input
                    type="text"
                    value={houseAddress}
                    onChange={(e) => setHouseAddress(e.target.value)}
                    placeholder="Ej: Calle Mayor 1, Madrid"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  />
                </div>
                <button
                  onClick={editingHouse ? handleUpdateHouse : handleAddHouse}
                  disabled={!houseName.trim()}
                  className="w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingHouse ? 'Guardar cambios' : 'Crear casa'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
