import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ChefHat, Sparkles, Clock, Users, Loader2 } from 'lucide-react';
import { CATEGORIES, getExpirationStatus } from '../lib/utils';

interface Recipe {
  title: string;
  description: string;
  ingredients: { name: string; available: boolean }[];
  steps: string[];
  time: string;
  servings: number;
}

export default function RecipesPage() {
  const { houses, currentHouseId, locations, products } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const houseLocations = locations.filter(l => l.houseId === currentHouseId);
  const houseProducts = products.filter(p => houseLocations.some(l => l.id === p.locationId));

  const generateRecipes = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter products by category if selected
    const availableProducts = selectedCategory 
      ? houseProducts.filter(p => p.category === selectedCategory && p.productType === 'food')
      : houseProducts.filter(p => p.productType === 'food');

    // Prioritize expiring products
    const expiringProducts = availableProducts.filter(p => {
      const status = getExpirationStatus(p.expirationDate);
      return status === 'expired' || status === 'today' || status === 'soon';
    });

    const productsToUse = expiringProducts.length > 0 ? expiringProducts : availableProducts.slice(0, 10);

    // Generate mock recipes
    const mockRecipes: Recipe[] = [
      {
        title: 'Ensalada Fresca de Temporada',
        description: 'Una ensalada ligera y nutritiva perfecta para aprovechar los ingredientes frescos.',
        ingredients: productsToUse.slice(0, 5).map(p => ({
          name: p.name,
          available: true
        })).concat([
          { name: 'Aceite de oliva', available: false },
          { name: 'Sal y pimienta', available: false }
        ]),
        steps: [
          'Lava y corta todos los vegetales',
          'Mezcla en un bol grande',
          'Añade aceite de oliva, sal y pimienta al gusto',
          'Sirve inmediatamente'
        ],
        time: '15 min',
        servings: 4
      },
      {
        title: 'Salteado Rápido',
        description: 'Un plato caliente y sabroso listo en minutos.',
        ingredients: productsToUse.slice(0, 4).map(p => ({
          name: p.name,
          available: true
        })).concat([
          { name: 'Salsa de soja', available: false },
          { name: 'Ajo', available: false }
        ]),
        steps: [
          'Calienta aceite en una sartén',
          'Añade los ingredientes principales',
          'Saltea a fuego alto durante 5-7 minutos',
          'Añade salsa de soja y ajo al gusto',
          'Sirve caliente'
        ],
        time: '20 min',
        servings: 3
      },
      {
        title: 'Crema Reconfortante',
        description: 'Una crema suave y reconfortante perfecta para días fríos.',
        ingredients: productsToUse.slice(0, 3).map(p => ({
          name: p.name,
          available: true
        })).concat([
          { name: 'Caldo vegetal', available: false },
          { name: 'Nata', available: false },
          { name: 'Especias', available: false }
        ]),
        steps: [
          'Corta los ingredientes en trozos',
          'Cocina en caldo vegetal hasta que estén tiernos',
          'Tritura hasta obtener una crema suave',
          'Añade nata y especias al gusto',
          'Sirve caliente con un chorrito de aceite'
        ],
        time: '30 min',
        servings: 4
      }
    ];

    setRecipes(mockRecipes);
    setIsGenerating(false);
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
      <div>
        <h2 className="text-xl font-bold text-[#fafafa]">Recetas con IA</h2>
        <p className="text-sm text-[#525252]">Genera recetas basadas en tus productos disponibles</p>
      </div>

      {/* Controls */}
      <div className="p-6 bg-[#141414] border border-[#262626] rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-[#fafafa] focus:outline-none focus:border-emerald-500/50 transition-colors duration-150"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          <button
            onClick={generateRecipes}
            disabled={isGenerating || houseProducts.length === 0}
            className="px-6 py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors duration-150 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generar recetas
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-[#525252]">
          {houseProducts.length} productos disponibles
          {selectedCategory && ` en ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
        </p>
      </div>

      {/* Recipes */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recipes.map((recipe, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#fafafa] mb-1">{recipe.title}</h3>
                    <p className="text-sm text-[#737373]">{recipe.description}</p>
                  </div>
                  <ChefHat className="w-6 h-6 text-emerald-400 shrink-0" />
                </div>

                <div className="flex gap-4 mb-4 text-xs text-[#525252]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {recipe.servings} personas
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-[#a1a1a1] uppercase tracking-wider mb-2">Ingredientes</h4>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ing, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${ing.available ? 'bg-emerald-400' : 'bg-[#525252]'}`} />
                        <span className={ing.available ? 'text-[#fafafa]' : 'text-[#525252]'}>
                          {ing.name}
                        </span>
                        {ing.available && (
                          <span className="text-[10px] text-emerald-400">✓ disponible</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#a1a1a1] uppercase tracking-wider mb-2">Preparación</h4>
                  <ol className="space-y-2">
                    {recipe.steps.map((step, j) => (
                      <li key={j} className="flex gap-3 text-sm text-[#a1a1a1]">
                        <span className="w-5 h-5 rounded-full bg-[#262626] flex items-center justify-center text-xs font-medium text-[#737373] shrink-0">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {recipes.length === 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#141414] border border-[#262626] rounded-xl"
        >
          <ChefHat className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-[#525252] mb-2">
            {houseProducts.length === 0 ? 'Añade productos para generar recetas' : 'Genera recetas con tus productos'}
          </p>
          <p className="text-xs text-[#737373]">
            La IA creará recetas basadas en lo que tienes disponible
          </p>
        </motion.div>
      )}
    </div>
  );
}
