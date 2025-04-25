import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  // Verifica le variabili d'ambiente a runtime
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Variabili d\'ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY richieste');
  }

  // Crea il client solo a runtime, mai durante la build
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} 