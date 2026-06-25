import type { SakResultat } from '@/app/page'

const KATEGORI_FARGER: Record<string, string> = {
  økonomi: 'bg-green-100 text-green-800',
  bemanning: 'bg-purple-100 text-purple-800',
  kvalitet: 'bg-blue-100 text-blue-800',
  digitalisering: 'bg-cyan-100 text-cyan-800',
  strategi: 'bg-orange-100 text-orange-800',
  investering: 'bg-yellow-100 text-yellow-800',
  annet: 'bg-gray-100 text-gray-800',
}

const BESLUTNING_STIL: Record<string, string> = {
  vedtatt: 'border-l-4 border-green-500 bg-green-50 text-green-900',
  orientering: 'border-l-4 border-blue-400 bg-blue-50 text-blue-900',
  utsatt: 'border-l-4 border-yellow-400 bg-yellow-50 text-yellow-900',
}

const BESLUTNING_ETIKETT: Record<string, string> = {
  vedtatt: 'Vedtatt',
  orientering: 'Til orientering',
  utsatt: 'Utsatt',
}

const NIVAA_ETIKETT: Record<string, string> = {
  departement: 'Departement',
  rhf: 'RHF',
  hf: 'HF',
  ikt: 'IKT',
}

export default function ResultCard({ sak }: { sak: SakResultat }) {
  const kategoriKlasse = KATEGORI_FARGER[sak.kategori] ?? KATEGORI_FARGER.annet

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">{sak.sakstittel}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs font-medium text-white bg-[#003366] px-2 py-0.5 rounded">
              {NIVAA_ETIKETT[sak.nivaa] ?? sak.nivaa}
            </span>
            <span className="text-xs text-gray-500">{sak.organ}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{sak.dato}</span>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${kategoriKlasse}`}>
          {sak.kategori}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{sak.sammendrag}</p>

      {sak.beslutninger?.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Beslutninger</p>
          {sak.beslutninger.map((b, i) => (
            <div key={i} className={`px-3 py-2 rounded text-sm ${BESLUTNING_STIL[b.type] ?? ''}`}>
              <span className="font-medium text-xs mr-2">{BESLUTNING_ETIKETT[b.type]}</span>
              {b.tekst}
            </div>
          ))}
        </div>
      )}

      {sak.oppfolgingspunkter?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Oppfølgingspunkter</p>
          <ul className="space-y-1">
            {sak.oppfolgingspunkter.map((p, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-blue-400 flex-shrink-0">→</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sak.kilde && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <a
            href={sak.kilde}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Kilde: {sak.kilde}
          </a>
        </div>
      )}
    </div>
  )
}
