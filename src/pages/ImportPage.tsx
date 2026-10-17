import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { useStore } from '../store/useStore';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, X, Eye } from 'lucide-react';
import { CATEGORIES, UNITS, PRODUCT_TYPES } from '../lib/utils';

interface ImportData {
  casas: Array<{ nombre: string; direccion?: string }>;
  lugares: Array<{ casa: string; nombre: string; icono?: string; descripcion?: string }>;
  productos: Array<{
    casa: string;
    lugar: string;
    nombre: string;
    tipo?: string;
    categoria?: string;
    cantidad?: number;
    unidad?: string;
    fecha_caducidad?: string;
    fecha_apertura?: string;
    dosis?: string;
    frecuencia?: string;
    nivel?: string;
    notas?: string;
  }>;
}

export default function ImportPage() {
  const { addHouse, addLocation, addProduct, houses, locations } = useStore();
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  // Descargar plantilla Excel
  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Hoja 1: Casas
    const casasData = [
      ['nombre', 'direccion'],
      ['Mi Casa', 'Calle Principal 123'],
      ['Piso Playa', 'Av. del Mar 456'],
    ];
    const wsCasas = XLSX.utils.aoa_to_sheet(casasData);
    XLSX.utils.book_append_sheet(wb, wsCasas, 'Casas');

    // Hoja 2: Lugares
    const lugaresData = [
      ['casa', 'nombre', 'icono', 'descripcion'],
      ['Mi Casa', 'Nevera', '🧊', 'Electrodoméstico principal'],
      ['Mi Casa', 'Despensa', '🗄️', 'Armario de alimentos'],
      ['Mi Casa', 'Baño', '🚿', 'Productos de higiene'],
      ['Mi Casa', 'Botiquín', '💊', 'Medicamentos'],
      ['Piso Playa', 'Cocina', '🍳', 'Cocina del piso'],
    ];
    const wsLugares = XLSX.utils.aoa_to_sheet(lugaresData);
    XLSX.utils.book_append_sheet(wb, wsLugares, 'Lugares');

    // Hoja 3: Productos
    const productosData = [
      ['casa', 'lugar', 'nombre', 'tipo', 'categoria', 'cantidad', 'unidad', 'fecha_caducidad', 'fecha_apertura', 'dosis', 'frecuencia', 'nivel', 'notas'],
      ['Mi Casa', 'Nevera', 'Leche', 'food', 'lacteos', 2, 'ud', '2024-02-15', '', '', '', '', 'Marca entera'],
      ['Mi Casa', 'Nevera', 'Yogur', 'food', 'lacteos', 6, 'ud', '2024-02-10', '', '', '', '', 'Natural'],
      ['Mi Casa', 'Despensa', 'Arroz', 'food', 'conservas', 1, 'kg', '2025-12-31', '', '', '', '', 'Integral'],
      ['Mi Casa', 'Despensa', 'Aceite', 'food', 'especias', 1, 'l', '2025-06-30', '2024-01-15', '', '', '', 'Oliva virgen'],
      ['Mi Casa', 'Botiquín', 'Ibuprofeno', 'medicine', 'medicamentos', 1, 'pack', '2025-03-31', '', '600mg', 'Cada 8h', '', 'Para dolor'],
      ['Mi Casa', 'Botiquín', 'Paracetamol', 'medicine', 'medicamentos', 1, 'pack', '2025-04-30', '', '500mg', 'Cada 6h', '', ''],
      ['Mi Casa', 'Baño', 'Champú', 'bathroom', 'cuidado_cabello', 1, 'ud', '', '', '', '', 'medium', ''],
      ['Mi Casa', 'Baño', 'Gel', 'bathroom', 'higiene_personal', 1, 'ud', '', '', '', '', 'low', ''],
      ['Mi Casa', 'Baño', 'Papel', 'bathroom', 'papel_higienico', 4, 'ud', '', '', '', '', 'full', ''],
      ['Piso Playa', 'Cocina', 'Sal', 'food', 'especias', 1, 'ud', '2026-12-31', '', '', '', '', ''],
    ];
    const wsProductos = XLSX.utils.aoa_to_sheet(productosData);
    XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');

    // Hoja 4: Instrucciones
    const instruccionesData = [
      ['INSTRUCCIONES PARA IMPORTAR EXCEL'],
      [''],
      ['FORMATO DEL EXCEL:'],
      ['El archivo debe tener 3 hojas: Casas, Lugares, Productos'],
      [''],
      ['HOJA 1: CASAS'],
      ['Columnas obligatorias: nombre'],
      ['Columnas opcionales: direccion'],
      [''],
      ['HOJA 2: LUGARES'],
      ['Columnas obligatorias: casa (nombre de la casa), nombre'],
      ['Columnas opcionales: icono (emoji), descripcion'],
      [''],
      ['HOJA 3: PRODUCTOS'],
      ['Columnas obligatorias: casa, lugar, nombre'],
      ['Columnas opcionales: tipo, categoria, cantidad, unidad, fecha_caducidad, fecha_apertura, dosis, frecuencia, nivel, notas'],
      [''],
      ['TIPOS DE PRODUCTO:'],
      ['food - Alimentos'],
      ['medicine - Medicamentos'],
      ['cleaning - Limpieza'],
      ['bathroom - Baño e Higiene'],
      ['other - Otros'],
      [''],
      ['CATEGORÍAS DISPONIBLES:'],
      ['Alimentos: frutas, lacteos, carnes, panaderia, bebidas, congelados, conservas, snacks, especias'],
      ['Medicamentos: medicamentos, vitaminas, primeros_auxilios'],
      ['Limpieza: limpieza_cocina, limpieza_bano, limpieza_general, lavanderia'],
      ['Baño: higiene_personal, cuidado_cabello, cuidado_piel, higiene_bucal, papel_higienico'],
      ['Otros: mascotas, bebe, otros'],
      [''],
      ['UNIDADES:'],
      ['ud - Unidad'],
      ['kg - Kilogramo'],
      ['g - Gramo'],
      ['l - Litro'],
      ['ml - Mililitro'],
      ['pack - Pack'],
      [''],
      ['FECHAS:'],
      ['Formato: YYYY-MM-DD (ejemplo: 2024-02-15)'],
      ['Dejar vacío si no tiene fecha'],
      [''],
      ['NIVELES (solo limpieza y baño):'],
      ['full - Lleno'],
      ['medium - Medio'],
      ['low - Bajo'],
      ['empty - Vacío'],
      [''],
      ['EJEMPLO COMPLETO:'],
      ['Ver las hojas Casas, Lugares y Productos para ejemplos'],
    ];
    const wsInstrucciones = XLSX.utils.aoa_to_sheet(instruccionesData);
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones');

    XLSX.writeFile(wb, 'plantilla-inventario.xlsx');
  };

  // Leer archivo Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors([]);
    setImported(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const parsedData: ImportData = {
          casas: [],
          lugares: [],
          productos: [],
        };

        // Leer hoja Casas
        if (workbook.SheetNames.includes('Casas')) {
          const wsCasas = workbook.Sheets['Casas'];
          const casasJson = XLSX.utils.sheet_to_json(wsCasas);
          parsedData.casas = casasJson as any;
        }

        // Leer hoja Lugares
        if (workbook.SheetNames.includes('Lugares')) {
          const wsLugares = workbook.Sheets['Lugares'];
          const lugaresJson = XLSX.utils.sheet_to_json(wsLugares);
          parsedData.lugares = lugaresJson as any;
        }

        // Leer hoja Productos
        if (workbook.SheetNames.includes('Productos')) {
          const wsProductos = workbook.Sheets['Productos'];
          const productosJson = XLSX.utils.sheet_to_json(wsProductos);
          parsedData.productos = productosJson as any;
        }

        // Validar datos
        const validationErrors = validateData(parsedData);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }

        setImportData(parsedData);
        setShowPreview(true);
      } catch (error) {
        setErrors(['Error al leer el archivo. Asegúrate de que es un archivo Excel válido.']);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Validar datos importados
  const validateData = (data: ImportData): string[] => {
    const errors: string[] = [];

    // Validar casas
    if (data.casas.length === 0) {
      errors.push('La hoja "Casas" está vacía o no existe');
    }
    data.casas.forEach((casa, i) => {
      if (!casa.nombre) {
        errors.push(`Casa ${i + 1}: Falta el nombre`);
      }
    });

    // Validar lugares
    if (data.lugares.length === 0) {
      errors.push('La hoja "Lugares" está vacía o no existe');
    }
    data.lugares.forEach((lugar, i) => {
      if (!lugar.casa) {
        errors.push(`Lugar ${i + 1}: Falta la casa`);
      }
      if (!lugar.nombre) {
        errors.push(`Lugar ${i + 1}: Falta el nombre`);
      }
      if (lugar.casa && !data.casas.find(c => c.nombre === lugar.casa)) {
        errors.push(`Lugar ${i + 1}: La casa "${lugar.casa}" no existe en la hoja Casas`);
      }
    });

    // Validar productos
    if (data.productos.length === 0) {
      errors.push('La hoja "Productos" está vacía o no existe');
    }
    data.productos.forEach((producto, i) => {
      if (!producto.casa) {
        errors.push(`Producto ${i + 1}: Falta la casa`);
      }
      if (!producto.lugar) {
        errors.push(`Producto ${i + 1}: Falta el lugar`);
      }
      if (!producto.nombre) {
        errors.push(`Producto ${i + 1}: Falta el nombre`);
      }
      if (producto.casa && !data.casas.find(c => c.nombre === producto.casa)) {
        errors.push(`Producto ${i + 1}: La casa "${producto.casa}" no existe`);
      }
      if (producto.lugar && !data.lugares.find(l => l.nombre === producto.lugar && l.casa === producto.casa)) {
        errors.push(`Producto ${i + 1}: El lugar "${producto.lugar}" no existe en la casa "${producto.casa}"`);
      }
    });

    return errors;
  };

  // Importar datos
  const handleImport = () => {
    if (!importData) return;

    setImporting(true);

    try {
      // Importar casas
      importData.casas.forEach(casa => {
        addHouse(casa.nombre, casa.direccion);
      });

      // Importar lugares
      importData.lugares.forEach(lugar => {
        const casa = houses.find(h => h.name === lugar.casa) || 
                    importData.casas.find(c => c.nombre === lugar.casa);
        if (casa) {
          const casaId = 'id' in casa ? casa.id : houses.find(h => h.name === lugar.casa)?.id;
          if (casaId) {
            addLocation(casaId, lugar.nombre, lugar.descripcion, lugar.icono);
          }
        }
      });

      // Importar productos
      importData.productos.forEach(producto => {
        const lugar = locations.find(l => l.name === producto.lugar) ||
                     importData.lugares.find(l => l.nombre === producto.lugar && l.casa === producto.casa);
        if (lugar) {
          const lugarId = 'id' in lugar ? lugar.id : locations.find(l => l.name === producto.lugar)?.id;
          if (lugarId) {
            const productData = {
              name: producto.nombre,
              productType: (producto.tipo as any) || 'other',
              category: producto.categoria || 'otros',
              quantity: producto.cantidad || 1,
              unit: producto.unidad || 'ud',
              expirationDate: producto.fecha_caducidad,
              openedDate: producto.fecha_apertura,
              dosage: producto.dosis,
              frequency: producto.frecuencia,
              fillLevel: producto.nivel as any,
              notes: producto.notas,
              barcode: undefined,
            };
            addProduct(lugarId, productData as any);
          }
        }
      });

      setImported(true);
      setTimeout(() => {
        setImporting(false);
        setShowPreview(false);
        setImportData(null);
      }, 2000);
    } catch (error) {
      setErrors(['Error al importar los datos']);
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#fafafa]">Importar Excel</h2>
        <p className="text-sm text-[#525252]">Sube tu inventario desde un archivo Excel</p>
      </div>

      {/* Download template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] border border-[#262626] rounded-2xl p-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Download className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#fafafa] mb-2">Paso 1: Descarga la plantilla</h3>
            <p className="text-sm text-[#a1a1a1] mb-4">
              Descarga la plantilla Excel y rellénala con tus datos. Incluye ejemplos e instrucciones.
            </p>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-150 btn-press inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar plantilla
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-[#0a0a0a] rounded-xl">
            <h4 className="text-sm font-semibold text-[#fafafa] mb-3">📋 El Excel debe tener 3 hojas:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">Casas</p>
                  <p className="text-xs text-[#525252] mt-0.5">nombre, direccion</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">Lugares</p>
                  <p className="text-xs text-[#525252] mt-0.5">casa, nombre, icono, descripcion</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">Productos</p>
                  <p className="text-xs text-[#525252] mt-0.5">casa, lugar, nombre, tipo, categoria, cantidad, unidad, fecha_caducidad, etc.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-emerald-300 leading-relaxed">
              💡 <strong>Consejo:</strong> Descarga la plantilla, copia tus datos y súbela. Los nombres de casas y lugares deben coincidir exactamente entre las hojas.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Upload file */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141414] border border-[#262626] rounded-2xl p-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#fafafa] mb-2">Paso 2: Sube tu Excel</h3>
            <p className="text-sm text-[#a1a1a1] mb-4">
              Selecciona el archivo Excel que has rellenado con tus datos
            </p>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#262626] rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors duration-150">
              <div className="flex flex-col items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 text-[#525252] mb-2" />
                <p className="text-sm text-[#a1a1a1]">Haz clic para seleccionar archivo</p>
                <p className="text-xs text-[#525252] mt-1">.xlsx, .xls</p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-300 mb-2">Errores encontrados:</h3>
                <ul className="space-y-1">
                  {errors.map((error, i) => (
                    <li key={i} className="text-xs text-red-300">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <AnimatePresence>
        {showPreview && importData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#141414] border border-[#262626] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-[#fafafa]">Vista previa</h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 text-[#525252] hover:text-[#fafafa] transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-[#0a0a0a] rounded-xl">
                <p className="text-sm text-[#a1a1a1] mb-2">Casas:</p>
                <p className="text-lg font-bold text-[#fafafa]">{importData.casas.length}</p>
              </div>
              <div className="p-4 bg-[#0a0a0a] rounded-xl">
                <p className="text-sm text-[#a1a1a1] mb-2">Lugares:</p>
                <p className="text-lg font-bold text-[#fafafa]">{importData.lugares.length}</p>
              </div>
              <div className="p-4 bg-[#0a0a0a] rounded-xl">
                <p className="text-sm text-[#a1a1a1] mb-2">Productos:</p>
                <p className="text-lg font-bold text-[#fafafa]">{importData.productos.length}</p>
              </div>
            </div>

            {imported ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-sm text-emerald-300">¡Datos importados correctamente!</p>
              </div>
            ) : (
              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full py-3 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importando...' : 'Importar datos'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
