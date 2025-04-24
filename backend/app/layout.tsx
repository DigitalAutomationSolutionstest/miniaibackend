import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mini AI Hub - Backend API',
  description: 'Backend API per Mini AI Hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
