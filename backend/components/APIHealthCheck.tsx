'use client';

import { useState, useEffect } from 'react';

export default function APIHealthCheck() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAPI() {
      try {
        setLoading(true);
        const res = await fetch('/api/debug');
        
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        
        const data = await res.json();
        setStatus(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Errore sconosciuto');
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }
    
    checkAPI();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Stato API</h2>
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg border border-red-500">
        <h2 className="text-xl font-bold mb-4">Stato API</h2>
        <div className="p-4 bg-red-900/30 rounded">
          <p className="text-red-400">Errore: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Stato API</h2>
      
      <div className="grid gap-4">
        <div className="p-4 bg-green-900/30 rounded">
          <p className="text-green-400 font-medium">
            Stato: {status?.status || 'N/A'}
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Timestamp: {status?.timestamp || 'N/A'}
          </p>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Dettagli:</h3>
          <pre className="bg-zinc-800 p-3 rounded overflow-auto max-h-64 text-xs">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 