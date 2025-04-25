import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Crea il client Supabase all'interno di una funzione per evitare
// che venga inizializzato durante la build
export function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Esportazione per compatibilità con il codice esistente
export default {
  auth: {
    getUser: async (token: string) => {
      const client = getSupabaseClient();
      return client.auth.getUser(token);
    },
    getSession: async () => {
      const client = getSupabaseClient();
      return client.auth.getSession();
    }
  },
  from: (table: string) => {
    const client = getSupabaseClient();
    return client.from(table);
  }
}; 