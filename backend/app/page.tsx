export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold mb-6">Mini AI Hub API</h1>
      <p className="mb-8 text-xl">Backend API per Mini AI Hub</p>
      
      <div className="grid gap-6 max-w-2xl w-full">
        <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900">
          <h2 className="text-2xl font-semibold mb-3">Endpoint API</h2>
          <ul className="space-y-3">
            <li className="p-2 bg-zinc-800 rounded">
              <code className="text-green-400">GET /api/debug</code> - Verifica connessione
            </li>
            <li className="p-2 bg-zinc-800 rounded">
              <code className="text-green-400">POST /api/ai/pdf</code> - Analisi PDF
            </li>
            <li className="p-2 bg-zinc-800 rounded">
              <code className="text-green-400">POST /api/ai/image</code> - Generazione immagini
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
} 