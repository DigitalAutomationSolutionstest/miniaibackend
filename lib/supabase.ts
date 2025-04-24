import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are missing');
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Per verificare se le credenziali sono impostate correttamente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase: credenziali mancanti. Imposta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
} 