// Questo file esiste solo per compatibilità con i percorsi @/src/lib/auth
// Reindirizza all'implementazione corretta

// Implementazione dummy dell'auth
export const getCurrentUser = async () => {
  return {
    id: "demo-user",
    email: "demo@example.com",
    credits: 10
  };
};

export const isAuthenticated = async () => true;

export const getUserId = async () => "demo-user";

/**
 * Ottiene l'ID utente dalla richiesta
 */
export const getUserIdFromRequest = async (req: Request) => {
  return "demo-user";
};

export default {
  getCurrentUser,
  isAuthenticated,
  getUserId,
  getUserIdFromRequest
}; 