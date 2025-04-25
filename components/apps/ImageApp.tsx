"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { API_URL } from '@/src/lib/env'

export function ImageApp() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Funzionalità temporaneamente disabilitata
    setError("La funzionalità di generazione immagini è temporaneamente non disponibile. Riprova più tardi.");
    return;
    
    // Codice originale commentato
    /*
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    setImageUrl(null);

    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError("Utente non autenticato.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/ai/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          prompt,
          userId: (await (window as any).supabase.auth.getUser()).data.user?.id
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Errore nella generazione dell'immagine");
      } else {
        setImageUrl(data.imageUrl);
        if (typeof data.remainingCredits === 'number') {
          setCredits(data.remainingCredits);
        }
      }
    } catch (err) {
      setError("Errore di connessione");
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
        <h2 className="text-xl font-semibold mb-2">Generazione Immagini</h2>
        <p className="text-zinc-400 text-sm">
          Descrivi l'immagine che desideri e l'AI la creerà per te
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Es. Un gatto che indossa una corona in stile rinascimentale..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PhotoIcon className="w-5 h-5" />
          {loading ? "Generando immagine..." : "Genera Immagine"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={imageUrl}
            alt="Immagine generata"
            className="w-full h-auto object-cover rounded-lg"
          />
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