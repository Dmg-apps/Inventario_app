import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Package, Plus, Edit2, Trash2, X, Save, Search, Filter,
  Calendar, MapPin
} from 'lucide-react';
import { 
  CATEGORIES, UNITS, getExpirationStatus, getExpirationColor, 
  formatRelativeDate, formatDate 
} from '../lib/utils';

export default function ProductsPage() {
  const { houses, currentHouseId, locations, products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'recent'>('recent');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'otros',
    quantity: 1,
    unit: 'ud',
    expirationDate: '',
    locationId: '',
    notes: ''
  });

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  const houseProducts = products.filter(p => 
    houseLocations.some(l => l.id === p.locationId)
  );

  // Filter and sort products
  const filteredProducts = houseProducts
    .filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterLocation && p.locationId !== filterLocation) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') {
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'otros',
      quantity: 1,
      unit: 'ud',
      expirationDate: '',
      locationId: houseLocations[0]?.id || '',
      notes: ''
    });
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.locationId) return;
    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      expirationDate: formData.expirationDate || undefined,
      notes: formData.notes.trim() || undefined
    };
    addProduct(formData.locationId, productData as any);
    resetForm();
    setShowAddModal(false);
  };

  const handleUpdate = () => {
    if (!editingProduct || !formData.name.trim() || !formData.locationId) return;
    updateProduct(editingProduct, {
      name: formData.name.trim(),
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      expirationDate: formData.expirationDate || undefined,
      locationId: formData.locationId,
      notes: formData.notes.trim() || undefined
    });
    resetForm();
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const openEditModal = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      expirationDate: product.expirationDate || '',
      locationId: product.locationId,
      notes: product.notes || ''
    });
    setEditingProduct(productId);
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
          <h2 className="text-xl font-bold text-[#fafafa]">Productos</h2>
          <p className="text-sm text-[#525252]">{houseProducts.length} productos en total</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-150 btn-press"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Añadir producto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="px-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
        >
          <option value="">Todos los lugares</option>
          {houseLocations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.icon} {loc.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
        >
          <option value="recent">Más recientes</option>
          <option value="name">Nombre A-Z</option>
          <option value="date">Fecha caducidad</option>
        </select>
      </div>

      {/* Products list */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <Package className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-[#525252] mb-4">
            {searchQuery || filterCategory || filterLocation ? 'No se encontraron productos' : 'No hay productos todavía'}
          </p>
          {!searchQuery && !filterCategory && !filterLocation && (
            <button
              onClick={() => setShowAddModal(true)}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
            >
              Añadir primer producto
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, i) => {
            const location = houseLocations.find(l => l.id === product.locationId);
            const category = CATEGORIES.find(c => c.id === product.category);
            const status = getExpirationStatus(product.expirationDate);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
                className="group relative p-4 bg-[#141414] border border-[#262626] rounded-xl hover:border-[#333] transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{category?.icon || '📦'}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => openEditModal(product.id)}
                      className="p-1.5 text-[#525252] hover:text-[#fafafa] hover:bg-[#262626] rounded-lg transition-colors duration-150"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-[#525252] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[#fafafa] mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#525252] mb-2">
                  <span>{product.quantity} {product.unit}</span>
                  {location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location.name}
                      </span>
                    </>
                  )}
                </div>
                {product.expirationDate && (
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getExpirationColor(status)}`}>
                    <Calendar className="w-3 h-3" />
                    {formatRelativeDate(product.expirationDate)}
                  </div>
                )}
                {product.notes && (
                  <p className="text-xs text-[#737373] mt-2 line-clamp-2">{product.notes}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingProduct(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg bg-[#141414] border border-[#262626] rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#fafafa]">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Leche, Manzanas, Pan..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                    autoFocus
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#737373] mb-2 block">Cantidad</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#737373] mb-2 block">Unidad</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                    >
                      {UNITS.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Ubicación *</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  >
                    <option value="">Seleccionar ubicación</option>
                    {houseLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.icon} {loc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Fecha de caducidad</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Notas (opcional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ej: Marca específica, tamaño grande..."
                    rows={2}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150 resize-none"
                  />
                </div>

                <button
                  onClick={editingProduct ? handleUpdate : handleAdd}
                  disabled={!formData.name.trim() || !formData.locationId}
                  className="w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Guardar cambios' : 'Añadir producto'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
