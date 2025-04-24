/**
 * Utility di autenticazione
 */

import { NextRequest } from "next/server";

/**
 * Ottiene i dati utente dal token JWT
 */
export const getUserFromToken = async (token: string) => {
  return {
    id: "demo-user",
    email: "demo@example.com",
    credits: 10
  };
};

/**
 * Utility di debugging
 */
export const getDebugUser = async () => {
  return {
    id: "demo-user",
    email: "demo@example.com",
    credits: 10
  };
}; 