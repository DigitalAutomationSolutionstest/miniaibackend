import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware di autenticazione per API
 */
export async function authMiddleware(req: NextRequest) {
  // Placeholder per autenticazione
  return null;
}

/**
 * Gestore delle rate limit per API
 */
export async function rateLimitMiddleware(req: NextRequest) {
  // Placeholder per rate limiting
  return null;
}

/**
 * Wrapper per le richieste API
 */
export function withApiMiddleware(handler: Function) {
  return async (req: NextRequest) => {
    try {
      // Implementazione reale farebbe controlli di autenticazione e rate limiting
      return await handler(req);
    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: error.status || 500 }
      );
    }
  };
}

/**
 * Abilita CORS per le richieste API
 */
export function allowCors(handler: Function) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    
    // Aggiungi gli header CORS alla risposta
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    return response;
  };
}

/**
 * Middleware per limitare il rate delle richieste
 */
export function withRateLimit(handler: Function) {
  return async (req: NextRequest) => {
    // Placeholder implementazione del rate limiting
    return await handler(req);
  };
}

/**
 * Middleware per validare i dati della richiesta
 */
export function withValidation(schema: any) {
  return function(handler: Function) {
    return async (req: NextRequest) => {
      try {
        // Implementazione reale utilizzerebbe schema per validare i dati
        return await handler(req);
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Validation error', details: error.message },
          { status: 400 }
        );
      }
    };
  };
}

/**
 * Middleware per logging delle richieste API
 */
export function withLogging(handler: Function) {
  return async (req: NextRequest) => {
    const start = Date.now();
    console.log(`API Request: ${req.method} ${req.url}`);
    
    const response = await handler(req);
    
    const duration = Date.now() - start;
    console.log(`API Response: ${req.method} ${req.url} [${response.status}] ${duration}ms`);
    
    return response;
  };
} 