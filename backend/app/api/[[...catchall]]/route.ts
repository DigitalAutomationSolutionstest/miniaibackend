import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler per tutte le richieste API non gestite esplicitamente
 */
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  return NextResponse.json({
    message: "API endpoint non implementato in questa versione",
    requestedPath: pathname,
    status: "not_implemented",
    apiStatus: {
      debug: {
        path: "/api/debug",
        status: "active",
        info: "Usa questa API per verificare lo stato del servizio"
      }
    }
  }, { status: 501 });
}

export async function POST(request: NextRequest) {
  return GET(request);
}

export async function PUT(request: NextRequest) {
  return GET(request);
}

export async function DELETE(request: NextRequest) {
  return GET(request);
}

export async function PATCH(request: NextRequest) {
  return GET(request);
} 