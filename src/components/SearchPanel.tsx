'use client'

import { useState } from 'react'
import type { Nivaa, Region } from '@/app/page'

interface Props {
  onSok: (params: { tema: string; nivaa: Nivaa; region: Region; fraDato?: string; tilDato?: string }) => void
  laster: boolean
}

const HURTIGSOK = [
  'økonomi og budsjett',
  'bemanning og rekruttering',
  'pasienttilfredshet og kvalitet',
  'digitalisering og journalsystem',
  'investeringer og bygg',
  'ventetider og kapasitet',
]

export default function SearchPanel({ onSok, laster }: Props) {
  const [tema, setTema] = useState('')
  const [nivaa, setNivaa] = useState<Nivaa>('alle')
  const [region, setRegion] = useState<Region>('alle')
  const [fraDato, setFraDato] = useState('')
  const [tilDato, setTilDato] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSok({ tema, nivaa, region, fraDato, tilDato })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Søketema</label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="F.eks. økonomi, bemanning, digitalisering..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {HURTIGSOK.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setTema(h)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nivå</label>
            <select
              value={nivaa}
              onChange={(e) => setNivaa(e.target.value as Nivaa)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alle">Alle nivåer</option>
              <option value="departement">Departement (HOD)</option>
              <option value="rhf">RHF</option>
              <option value="hf">HF</option>
              <option value="ikt">IKT-selskaper</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alle">Alle regioner</option>
              <option value="hso">Helse Sør-Øst</option>
              <option value="vest">Helse Vest</option>
              <option value="midt">Helse Midt-Norge</option>
              <option value="nord">Helse Nord</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fra dato</label>
            <input
              type="date"
              value={fraDato}
              onChange={(e) => setFraDato(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Til dato</label>
            <input
              type="date"
              value={tilDato}
              onChange={(e) => setTilDato(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={laster}
          className="w-full py-3 bg-[#003366] text-white rounded-lg font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
        >
          {laster ? 'Henter og oppsummerer...' : 'Søk i styresaker'}
        </button>
      </form>
    </div>
  )
}
