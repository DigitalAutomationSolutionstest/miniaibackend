import { createClient } from '@supabase/supabase-js';

// Ottieni valori dalle variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nuvvezmucfeaswkmerbs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Crea client Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verifica le credenziali al momento dell'esportazione
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key configurata:', supabaseAnonKey ? 'Sì' : 'No'); 