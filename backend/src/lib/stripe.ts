// Questo file esiste solo per compatibilità con i percorsi @/src/lib/stripe
// Reindirizza all'implementazione corretta

// Importa la vera implementazione
import { stripe } from '@/lib/stripe';

// Re-esporta tutto
export { stripe };
export default stripe; 