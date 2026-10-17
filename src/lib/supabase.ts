import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de la base de datos
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface House {
  id: string;
  name: string;
  address?: string;
  created_by: string;
  created_at: string;
}

export interface HouseMember {
  id: string;
  house_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'viewer';
  joined_at: string;
}

export interface Location {
  id: string;
  house_id: string;
  name: string;
  description?: string;
  nfc_url?: string;
  icon?: string;
  created_at: string;
}

export interface Product {
  id: string;
  location_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiration_date?: string;
  barcode?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  house_id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cooking_time?: number;
  servings?: number;
  created_at: string;
}
