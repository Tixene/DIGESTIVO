import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MealType = 'desayuno' | 'almuerzo' | 'cena' | 'snacks';

export interface DigestiveEntry {
  id: string;
  entry_date: string;
  meal_type: MealType;
  foods: string;
  bloating: boolean;
  pain: boolean;
  reflux: boolean;
  gas: boolean;
  bristol_type: number | null;
  intensity: number;
  notes: string;
  created_at: string;
}

export interface NewEntryInput {
  entry_date: string;
  meal_type: MealType;
  foods: string;
  bloating: boolean;
  pain: boolean;
  reflux: boolean;
  gas: boolean;
  bristol_type: number | null;
  intensity: number;
  notes: string;
}
