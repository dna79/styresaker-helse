import { DATAKILDER } from '@/lib/datakilder'

const NIVAA_FARGE: Record<string, string> = {
  departement: 'bg-red-100 text-red-800',
  rhf: 'bg-orange-100 text-orange-800',
  hf: 'bg-blue-100 text-blue-800',
  ikt: 'bg-purple-100 text-purple-800',
}

export default function SourcesPanel() {
  const grupper = (['departement', 'rhf', 'hf', 'ikt'] as const).map((nivaa) => ({
    nivaa,
    kilder: DATAKILDER.filter((k) => k.nivaa === nivaa),
  }))

  const NIVAA_NAVN: Record<string, string> = {
    departement: 'Departement',
    rhf: 'Regionale helseforetak (RHF)',
    hf: 'Helseforetak (HF)',
    ikt: 'IKT-selskaper',
  }

  return (
    <div className="space-y-6">
      {grupper.map(({ nivaa, kilder }) => (
        <div key={nivaa} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">{NIVAA_NAVN[nivaa]}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {kilder.map((k) => (
              <a
                key={k.url}
                href={k.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
              >
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${NIVAA_FARGE[k.nivaa]}`}>
                  {k.nivaa.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{k.navn}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{k.beskrivelse}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
