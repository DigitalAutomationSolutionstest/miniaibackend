import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Per verificare se le credenziali sono impostate correttamente
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase: credenziali mancanti. Imposta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
} 