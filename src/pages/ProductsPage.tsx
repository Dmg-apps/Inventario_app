import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Package, Plus, Edit2, Trash2, X, Save, Search,
  Calendar, MapPin, Pill, Droplets, Apple, Bath
} from 'lucide-react';
import { 
  CATEGORIES, UNITS, PRODUCT_TYPES, getExpirationStatus, getExpirationColor, 
  formatRelativeDate, formatDate 
} from '../lib/utils';

type FillLevel = 'full' | 'medium' | 'low' | 'empty';

const FILL_LEVELS: { id: FillLevel; label: string; color: string; width: string }[] = [
  { id: 'full', label: 'Lleno', color: 'bg-emerald-400', width: 'w-full' },
  { id: 'medium', label: 'Medio', color: 'bg-yellow-400', width: 'w-2/3' },
  { id: 'low', label: 'Bajo', color: 'bg-orange-400', width: 'w-1/3' },
  { id: 'empty', label: 'Vacío', color: 'bg-red-400', width: 'w-0' },
];

export default function ProductsPage() {
  const { houses, currentHouseId, locations, products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'recent'>('recent');

  const [formData, setFormData] = useState({
    name: '',
    productType: 'food' as 'food' | 'medicine' | 'cleaning' | 'bathroom' | 'other',
    category: 'otros',
    quantity: 1,
    unit: 'ud',
    expirationDate: '',
    openedDate: '',
    dosage: '',
    frequency: '',
    fillLevel: 'full' as FillLevel,
    locationId: '',
    notes: ''
  });

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  const houseProducts = products.filter(p => houseLocations.some(l => l.id === p.locationId));

  const filteredProducts = houseProducts
    .filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterType && p.productType !== filterType) return false;
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

  // Filtrar categorías según el tipo de producto seleccionado
  const filteredCategories = CATEGORIES.filter(c => 
    filterType ? c.type === filterType : true
  );

  const resetForm = () => {
    setFormData({
      name: '',
      productType: 'food',
      category: 'otros',
      quantity: 1,
      unit: 'ud',
      expirationDate: '',
      openedDate: '',
      dosage: '',
      frequency: '',
      fillLevel: 'full',
      locationId: houseLocations[0]?.id || '',
      notes: ''
    });
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.locationId) return;
    const productData: any = {
      name: formData.name.trim(),
      productType: formData.productType,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      locationId: formData.locationId,
      notes: formData.notes.trim() || undefined,
      barcode: undefined,
    };
    
    // Campos según tipo
    if (formData.productType === 'food' || formData.productType === 'medicine') {
      if (formData.expirationDate) productData.expirationDate = formData.expirationDate;
      if (formData.openedDate) productData.openedDate = formData.openedDate;
    }
    
    if (formData.productType === 'medicine') {
      if (formData.dosage) productData.dosage = formData.dosage;
      if (formData.frequency) productData.frequency = formData.frequency;
    }
    
    if (formData.productType === 'cleaning' || formData.productType === 'bathroom') {
      productData.fillLevel = formData.fillLevel;
    }
    
    addProduct(formData.locationId, productData);
    resetForm();
    setShowAddModal(false);
  };

  const handleUpdate = () => {
    if (!editingProduct || !formData.name.trim() || !formData.locationId) return;
    const updates: any = {
      name: formData.name.trim(),
      productType: formData.productType,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      locationId: formData.locationId,
      notes: formData.notes.trim() || undefined,
    };
    
    if (formData.productType === 'food' || formData.productType === 'medicine') {
      updates.expirationDate = formData.expirationDate || undefined;
      updates.openedDate = formData.openedDate || undefined;
    } else {
      updates.expirationDate = undefined;
      updates.openedDate = undefined;
    }
    
    if (formData.productType === 'medicine') {
      updates.dosage = formData.dosage || undefined;
      updates.frequency = formData.frequency || undefined;
    } else {
      updates.dosage = undefined;
      updates.frequency = undefined;
    }
    
    if (formData.productType === 'cleaning' || formData.productType === 'bathroom') {
      updates.fillLevel = formData.fillLevel;
    } else {
      updates.fillLevel = undefined;
    }
    
    updateProduct(editingProduct, updates);
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
      productType: product.productType || 'food',
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      expirationDate: product.expirationDate || '',
      openedDate: product.openedDate || '',
      dosage: product.dosage || '',
      frequency: product.frequency || '',
      fillLevel: product.fillLevel || 'full',
      locationId: product.locationId,
      notes: product.notes || ''
    });
    setEditingProduct(productId);
  };

  const handleTypeChange = (type: 'food' | 'medicine' | 'cleaning' | 'bathroom' | 'other') => {
    setFormData({ ...formData, productType: type, category: 'otros' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return <Apple className="w-3.5 h-3.5" />;
      case 'medicine': return <Pill className="w-3.5 h-3.5" />;
      case 'cleaning': return <Droplets className="w-3.5 h-3.5" />;
      case 'bathroom': return <Bath className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'text-emerald-400 bg-emerald-400/10';
      case 'medicine': return 'text-red-400 bg-red-400/10';
      case 'cleaning': return 'text-blue-400 bg-blue-400/10';
      case 'bathroom': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-[#525252] bg-[#1a1a1a]';
    }
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
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-150 btn-press"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Añadir producto</span>
        </button>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-150 ${
            !filterType ? 'bg-[#262626] text-[#fafafa]' : 'bg-[#141414] text-[#737373] hover:text-[#a1a1a1]'
          }`}
        >
          Todos
        </button>
        {PRODUCT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setFilterType(type.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              filterType === type.id ? 'bg-[#262626] text-[#fafafa]' : 'bg-[#141414] text-[#737373] hover:text-[#a1a1a1]'
            }`}
          >
            <span>{type.icon}</span>
            {type.name}
          </button>
        ))}
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
          {filteredCategories.map(cat => (
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
            {searchQuery || filterType || filterCategory || filterLocation ? 'No se encontraron productos' : 'No hay productos todavía'}
          </p>
          {!searchQuery && !filterType && !filterCategory && !filterLocation && (
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
            const fillLevel = FILL_LEVELS.find(f => f.id === product.fillLevel);
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
                className="group relative p-4 bg-[#141414] border border-[#262626] rounded-xl hover:border-[#333] transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category?.icon || '📦'}</span>
                    <span className={`p-1 rounded-md ${getTypeColor(product.productType || 'other')}`}>
                      {getTypeIcon(product.productType || 'other')}
                    </span>
                  </div>
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

                {/* Medicine specific */}
                {(product.productType === 'medicine') && (product.dosage || product.frequency) && (
                  <div className="mb-2 p-2 bg-red-400/5 border border-red-400/10 rounded-lg">
                    {product.dosage && (
                      <p className="text-xs text-red-300">💊 {product.dosage}</p>
                    )}
                    {product.frequency && (
                      <p className="text-xs text-red-300">🕐 {product.frequency}</p>
                    )}
                  </div>
                )}

                {/* Fill level for cleaning/bathroom */}
                {(product.productType === 'cleaning' || product.productType === 'bathroom') && fillLevel && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#525252]">Nivel</span>
                      <span className="text-[10px] text-[#737373]">{fillLevel.label}</span>
                    </div>
                    <div className="h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div className={`h-full ${fillLevel.color} ${fillLevel.width} rounded-full transition-all duration-300`} />
                    </div>
                  </div>
                )}

                {/* Expiration date */}
                {product.expirationDate && (
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getExpirationColor(status)}`}>
                    <Calendar className="w-3 h-3" />
                    {formatRelativeDate(product.expirationDate)}
                  </div>
                )}

                {/* Opened date */}
                {product.openedDate && (
                  <p className="text-[10px] text-[#525252] mt-1">
                    Abierto: {formatDate(product.openedDate)}
                  </p>
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
            onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }}
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
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }}
                  className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Product Type */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Tipo de producto</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRODUCT_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeChange(type.id as any)}
                        className={`p-2 rounded-xl text-center transition-all duration-150 ${
                          formData.productType === type.id
                            ? 'bg-[#262626] border border-[#333]'
                            : 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{type.icon}</span>
                        <span className="text-[10px] text-[#a1a1a1]">{type.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={
                      formData.productType === 'food' ? 'Ej: Leche, Manzanas, Pan...' :
                      formData.productType === 'medicine' ? 'Ej: Ibuprofeno, Paracetamol...' :
                      formData.productType === 'cleaning' ? 'Ej: Lavavajillas, Lejía...' :
                      formData.productType === 'bathroom' ? 'Ej: Champú, Gel de baño...' :
                      'Ej: Producto...'
                    }
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
                    {filteredCategories.map(cat => (
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

                {/* Food & Medicine: Expiration + Opened dates */}
                {(formData.productType === 'food' || formData.productType === 'medicine') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#737373] mb-2 block">
                        {formData.productType === 'medicine' ? 'Fecha caducidad' : 'Fecha caducidad'}
                      </label>
                      <input
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-2 block">Fecha de apertura</label>
                      <input
                        type="date"
                        value={formData.openedDate}
                        onChange={(e) => setFormData({ ...formData, openedDate: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                      />
                    </div>
                  </div>
                )}

                {/* Medicine: Dosage and Frequency */}
                {formData.productType === 'medicine' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#737373] mb-2 block">Dosis</label>
                      <input
                        type="text"
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                        placeholder="Ej: 500mg, 1 comprimido"
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-2 block">Frecuencia</label>
                      <input
                        type="text"
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        placeholder="Ej: Cada 8h, 2 veces/día"
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] placeholder:text-[#525252] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
                      />
                    </div>
                  </div>
                )}

                {/* Cleaning & Bathroom: Fill level */}
                {(formData.productType === 'cleaning' || formData.productType === 'bathroom') && (
                  <div>
                    <label className="text-xs text-[#737373] mb-2 block">Nivel de llenado</label>
                    <div className="grid grid-cols-4 gap-2">
                      {FILL_LEVELS.map(level => (
                        <button
                          key={level.id}
                          onClick={() => setFormData({ ...formData, fillLevel: level.id })}
                          className={`p-3 rounded-xl text-center transition-all duration-150 ${
                            formData.fillLevel === level.id
                              ? 'bg-[#262626] border border-[#333]'
                              : 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333]'
                          }`}
                        >
                          <div className={`h-1.5 ${level.color} rounded-full mb-2 ${level.width} mx-auto`} style={{ maxWidth: '100%' }} />
                          <span className="text-xs text-[#a1a1a1]">{level.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="text-xs text-[#737373] mb-2 block">Notas (opcional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={
                      formData.productType === 'medicine' ? 'Ej: Con receta, para dolor de cabeza...' :
                      formData.productType === 'food' ? 'Ej: Marca específica, tamaño grande...' :
                      'Ej: Notas adicionales...'
                    }
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
