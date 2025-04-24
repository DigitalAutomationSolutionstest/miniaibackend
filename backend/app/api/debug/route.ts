import { NextResponse } from 'next/server';

/**
 * API per verificare lo stato dei servizi
 * GET /api/debug
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "miniai-backend"
  });
} 