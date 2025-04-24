import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Per verificare se le credenziali sono impostate correttamente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase: credenziali mancanti. Imposta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
} 