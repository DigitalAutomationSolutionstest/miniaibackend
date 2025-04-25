"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { API_URL } from '@/src/lib/env'

export function PDFApp() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [credits, setCredits] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== 'application/pdf') {
        setError('Per favore carica un file PDF valido')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Il file non deve superare i 10MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Funzionalità temporaneamente disabilitata
    setError('La funzionalità di analisi PDF è temporaneamente non disponibile. Riprova più tardi.')
    return
    
    // Codice originale commentato
    /*
    if (!file) return
    
    setLoading(true)
    setResult('')
    setCredits(null)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    if (question) formData.append('question', question)

    try {
      const token = (await (window as any).supabase.auth.getSession()).data.session?.access_token
      if (!token) {
        setError('Utente non autenticato.')
        setLoading(false)
        return
      }
      const res = await fetch(`${API_URL}/api/ai/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.message || 'Errore durante l\'analisi del PDF')
      } else {
        setResult(question 
          ? data.answer 
          : data.summary)
        if (typeof data.remainingCredits === 'number') {
          setCredits(data.remainingCredits)
        }
      }
    } catch (err) {
      setError('Errore di rete o server')
    } finally {
      setLoading(false)
    }
    */
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 rounded-xl p-6 space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Analisi PDF</h2>
        <p className="text-zinc-400 text-sm">
          Carica un PDF per estrarre informazioni o porre domande specifiche sul contenuto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ArrowUpTrayIcon className="w-12 h-12 text-zinc-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              {file ? file.name : 'Trascina qui il tuo PDF o clicca per selezionarlo'}
            </p>
            <p className="text-sm text-zinc-400">
              PDF fino a 10MB
            </p>
          </label>
        </div>

        <div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Domanda facoltativa (es. 'Quali sono i punti chiave?')"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentTextIcon className="w-5 h-5" />
          {loading ? 'Analisi in corso...' : 'Analizza PDF'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-400 text-sm">{error}</div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Risultato</h3>
          <p className="text-white whitespace-pre-wrap text-sm">
            {result}
          </p>
        </motion.div>
      )}

      {typeof credits === 'number' && (
        <div className="mt-4 text-right text-zinc-400 text-sm">
          Crediti residui: <span className="font-bold text-white">{credits}</span>
        </div>
      )}
    </motion.div>
  )
} 