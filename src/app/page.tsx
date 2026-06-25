'use client'

import { useState } from 'react'
import SearchPanel from '@/components/SearchPanel'
import ResultCard from '@/components/ResultCard'
import SourcesPanel from '@/components/SourcesPanel'
import Header from '@/components/Header'

export type Nivaa = 'alle' | 'departement' | 'rhf' | 'hf' | 'ikt'
export type Region = 'alle' | 'hso' | 'vest' | 'midt' | 'nord'

export interface SakResultat {
  organ: string
  nivaa: string
  region: string
  dato: string
  sakstittel: string
  kategori: string
  sammendrag: string
  beslutninger: { type: 'vedtatt' | 'orientering' | 'utsatt'; tekst: string }[]
  oppfolgingspunkter: string[]
  kilde?: string
}

export default function Home() {
  const [aktivTab, setAktivTab] = useState<'sok' | 'kilder' | 'dokument'>('sok')
  const [resultater, setResultater] = useState<SakResultat[]>([])
  const [laster, setLaster] = useState(false)
  const [feil, setFeil] = useState<string | null>(null)

  const handleSok = async (params: {
    tema: string
    nivaa: Nivaa
    region: Region
    fraDato?: string
    tilDato?: string
  }) => {
    setLaster(true)
    setFeil(null)
    setResultater([])
    try {
      const res = await fetch('/api/sok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Noe gikk galt')
      }
      const data = await res.json()
      setResultater(data.resultater)
    } catch (e: unknown) {
      setFeil(e instanceof Error ? e.message : 'Ukjent feil')
    } finally {
      setLaster(false)
    }
  }

  const handleAnalyser = async (url: string) => {
    setLaster(true)
    setFeil(null)
    setResultater([])
    try {
      const res = await fetch('/api/analyser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Noe gikk galt')
      }
      const data = await res.json()
      setResultater([data.resultat])
    } catch (e: unknown) {
      setFeil(e instanceof Error ? e.message : 'Ukjent feil')
    } finally {
      setLaster(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['sok', 'kilder', 'dokument'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAktivTab(tab)}
              className={`px-5 py-2.5 font-medium text-sm rounded-t-lg transition-colors ${
                aktivTab === tab
                  ? 'bg-white border border-b-white border-gray-200 text-blue-700 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'sok' ? 'Søk i saker' : tab === 'kilder' ? 'Datakilder' : 'Analyser dokument'}
            </button>
          ))}
        </div>

        {aktivTab === 'sok' && (
          <SearchPanel onSok={handleSok} laster={laster} />
        )}
        {aktivTab === 'kilder' && <SourcesPanel />}
        {aktivTab === 'dokument' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Analyser styredokument</h2>
            <p className="text-sm text-gray-500 mb-4">
              Lim inn URL til en styresak-PDF fra et helseforetak eller RHF.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const url = (form.elements.namedItem('url') as HTMLInputElement).value
                handleAnalyser(url)
              }}
              className="flex gap-3"
            >
              <input
                name="url"
                type="url"
                placeholder="https://www.helse-sorost.no/.../styresak-2024.pdf"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={laster}
                className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
              >
                {laster ? 'Analyserer...' : 'Analyser'}
              </button>
            </form>
          </div>
        )}

        {feil && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {feil}
          </div>
        )}

        {resultater.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">{resultater.length} sak(er) funnet</p>
            {resultater.map((r, i) => (
              <ResultCard key={i} sak={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
