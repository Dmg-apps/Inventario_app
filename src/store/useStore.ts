import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface House {
  id: string;
  name: string;
  address?: string;
  members: string[];
  createdAt: string;
}

interface Location {
  id: string;
  houseId: string;
  name: string;
  description?: string;
  nfcUrl?: string;
  icon?: string;
  createdAt: string;
}

interface Product {
  id: string;
  locationId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
  barcode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  houses: House[];
  locations: Location[];
  products: Product[];
  currentHouseId: string | null;
  
  // Actions
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  
  // Houses
  addHouse: (name: string, address?: string) => void;
  updateHouse: (id: string, updates: Partial<House>) => void;
  deleteHouse: (id: string) => void;
  setCurrentHouse: (id: string) => void;
  
  // Locations
  addLocation: (houseId: string, name: string, description?: string, icon?: string) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  setNfcUrl: (locationId: string, url: string) => void;
  
  // Products
  addProduct: (locationId: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      houses: [],
      locations: [],
      products: [],
      currentHouseId: null,
      
      // Auth actions
      login: (email, password) => {
        // Mock login - en producción usar Supabase
        const user = {
          id: 'user-' + Date.now(),
          email,
          name: email.split('@')[0]
        };
        set({ user, isAuthenticated: true });
      },
      
      register: (email, password, name) => {
        const user = {
          id: 'user-' + Date.now(),
          email,
          name
        };
        set({ user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, currentHouseId: null });
      },
      
      // House actions
      addHouse: (name, address) => {
        const newHouse: House = {
          id: 'house-' + Date.now(),
          name,
          address,
          members: [get().user?.id || ''],
          createdAt: new Date().toISOString()
        };
        set(state => ({ 
          houses: [...state.houses, newHouse],
          currentHouseId: newHouse.id 
        }));
      },
      
      updateHouse: (id, updates) => {
        set(state => ({
          houses: state.houses.map(h => h.id === id ? { ...h, ...updates } : h)
        }));
      },
      
      deleteHouse: (id) => {
        set(state => ({
          houses: state.houses.filter(h => h.id !== id),
          locations: state.locations.filter(l => l.houseId !== id),
          products: state.products.filter(p => !state.locations.find(l => l.id === p.locationId && l.houseId === id)),
          currentHouseId: state.currentHouseId === id ? null : state.currentHouseId
        }));
      },
      
      setCurrentHouse: (id) => {
        set({ currentHouseId: id });
      },
      
      // Location actions
      addLocation: (houseId, name, description, icon) => {
        const newLocation: Location = {
          id: 'loc-' + Date.now(),
          houseId,
          name,
          description,
          icon,
          createdAt: new Date().toISOString()
        };
        set(state => ({ locations: [...state.locations, newLocation] }));
      },
      
      updateLocation: (id, updates) => {
        set(state => ({
          locations: state.locations.map(l => l.id === id ? { ...l, ...updates } : l)
        }));
      },
      
      deleteLocation: (id) => {
        set(state => ({
          locations: state.locations.filter(l => l.id !== id),
          products: state.products.filter(p => p.locationId !== id)
        }));
      },
      
      setNfcUrl: (locationId, url) => {
        set(state => ({
          locations: state.locations.map(l => 
            l.id === locationId ? { ...l, nfcUrl: url } : l
          )
        }));
      },
      
      // Product actions
      addProduct: (locationId, product) => {
        const newProduct: Product = {
          ...product,
          id: 'prod-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({ products: [...state.products, newProduct] }));
      },
      
      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        }));
      },
      
      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }));
      }
    }),
    {
      name: 'home-inventory-storage'
    }
  )
);
