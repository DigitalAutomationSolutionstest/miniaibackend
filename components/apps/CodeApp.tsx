"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CodeBracketIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import { API_URL } from '@/src/lib/env'

export function CodeApp() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number|null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Funzionalità temporaneamente disabilitata
    setError("La funzionalità di generazione codice è temporaneamente non disponibile. Riprova più tardi.");
    return;
    
    // Codice originale commentato
    /*
    if (!prompt.trim()) return;
    
    setLoading(true);
    setCode("");
    setCredits(null);
    setError("");

    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/ai/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ query: prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Errore generazione codice");
      } else {
        setCode(data.result);
        if (typeof data.credits === 'number') setCredits(data.credits);
      }
    } catch (err) {
      setError("Errore di rete o server");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 rounded-xl p-6 space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Assistente Codice</h2>
        <p className="text-zinc-400 text-sm">
          Descrivi cosa vuoi ottenere e riceverai il codice pronto da usare
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Es. Crea un componente React che mostri un carrello della spesa"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CodeBracketIcon className="w-5 h-5" />
          {loading ? "Generando codice..." : "Genera Codice"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {code && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800 rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Codice Generato</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
              }}
              className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
            >
              <DocumentCheckIcon className="w-4 h-4 mr-1" />
              Copia
            </button>
          </div>
          <pre className="text-white whitespace-pre-wrap text-sm overflow-x-auto">
            {code}
          </pre>
        </motion.div>
      )}

      {typeof credits === 'number' && (
        <div className="mt-4 text-right text-zinc-400 text-sm">
          Crediti residui: <span className="font-bold text-white">{credits}</span>
        </div>
      )}
    </motion.div>
  );
} 