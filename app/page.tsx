export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Mini AI Hub Backend</h1>
      <p className="mb-6">API Next.js v14 pronta per Vercel</p>
      <div className="p-4 bg-gray-800 rounded-md">
        <code>GET /api/debug</code> - Verifica stato server
      </div>
    </main>
  );
} 