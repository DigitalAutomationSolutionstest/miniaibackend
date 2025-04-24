// Questo file esiste solo per compatibilità con i percorsi @/src/lib/supabase
// Reindirizza all'implementazione corretta

// Importa la vera implementazione
import { supabase } from '@/lib/supabase';

// Re-esporta tutto
export { supabase };
export default supabase; 