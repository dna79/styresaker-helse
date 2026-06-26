"use client";
import { Kapabilitet, DOMENER, Domene, Kritikalitet, Klassifisering, KLASSIFISERING_LABELS } from "@/lib/types";
import { ModenhetCell, MODENHET_BG } from "./ModenhetCell";
import { cn } from "@/lib/utils";

type Visningsmodus = "nå" | "mål" | "gap";

interface Props {
  kapabiliteter: Kapabilitet[];
  visningsmodus: Visningsmodus;
  onSelectKapabilitet: (k: Kapabilitet) => void;
}

const DOMENE_FARGE: Record<string, { header: string; dot: string }> = {
  "leveransedyktighet":       { header: "bg-violet-600", dot: "bg-violet-400" },
  "plattform-infrastruktur":  { header: "bg-cyan-700",   dot: "bg-cyan-400" },
  "data-integrasjon":         { header: "bg-blue-700",   dot: "bg-blue-400" },
  "kunde-tjenestestyring":    { header: "bg-orange-600", dot: "bg-orange-400" },
  "sikkerhet-risiko":         { header: "bg-red-700",    dot: "bg-red-400" },
  "styring-portefolje":       { header: "bg-emerald-700",dot: "bg-emerald-400" },
  "kompetanse-organisasjon":  { header: "bg-amber-600",  dot: "bg-amber-400" },
};

const KRITIKALITET_DOT: Record<Kritikalitet, string> = {
  Høy: "bg-red-500",
  Middels: "bg-yellow-400",
  Lav: "bg-green-400",
};

const KLASSIFISERING_CHIP: Record<Klassifisering, string> = {
  Behold: "bg-green-100 text-green-700",
  Endre: "bg-yellow-100 text-yellow-700",
  FaseUt: "bg-red-100 text-red-700",
  UtvikleNytt: "bg-blue-100 text-blue-700",
  IkkeVurdert: "bg-gray-100 text-gray-400",
};

function gapStyle(gap: number | null) {
  if (gap === null) return "bg-gray-100 text-gray-400";
  if (gap <= 0) return "bg-green-100 text-green-700";
  if (gap === 1) return "bg-yellow-100 text-yellow-700";
  if (gap === 2) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export function HeatmapView({ kapabiliteter, visningsmodus, onSelectKapabilitet }: Props) {
  return (
    <div className="space-y-5">
      {DOMENER.map((domene) => {
        const kaps = kapabiliteter.filter((k) => k.domeneId === domene.id);
        if (kaps.length === 0) return null;
        return (
          <DomeneSection
            key={domene.id}
            domene={domene}
            kapabiliteter={kaps}
            visningsmodus={visningsmodus}
            onSelect={onSelectKapabilitet}
          />
        );
      })}
    </div>
  );
}

function DomeneSection({
  domene, kapabiliteter, visningsmodus, onSelect,
}: {
  domene: Domene;
  kapabiliteter: Kapabilitet[];
  visningsmodus: Visningsmodus;
  onSelect: (k: Kapabilitet) => void;
}) {
  const farger = DOMENE_FARGE[domene.id];
  const vurdert = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const avgNå = vurdert > 0
    ? (kapabiliteter.filter(k => k.modenhetNå > 0).reduce((s, k) => s + k.modenhetNå, 0) / vurdert).toFixed(1)
    : "—";

  return (
    <section className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Domain header */}
      <div className={cn("px-5 py-3.5 text-white flex items-center justify-between", farger.header)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{domene.ikon}</span>
          <div>
            <h2 className="font-bold text-sm leading-none">{domene.navn}</h2>
            <p className="text-xs opacity-70 mt-0.5">{domene.beskrivelse}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs opacity-80 shrink-0">
          <span>{kapabiliteter.length} kapabiliteter</span>
          <span>{vurdert}/{kapabiliteter.length} vurdert</span>
          <span>Snitt: {avgNå}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-400 uppercase tracking-wide">
              <th className="text-left px-4 py-2.5">Kapabilitet</th>
              <th className="px-3 py-2.5 text-center">Teamtype</th>
              <th className="px-3 py-2.5 text-center">Prosess</th>
              <th className="px-3 py-2.5 text-center">Eierskap</th>
              <th className="px-3 py-2.5 text-center">Krit.</th>
              {visningsmodus === "nå" && <th className="px-3 py-2.5 text-center">Modenhet nå</th>}
              {visningsmodus === "mål" && <th className="px-3 py-2.5 text-center">Modenhetsmål</th>}
              {visningsmodus === "gap" && (
                <>
                  <th className="px-3 py-2.5 text-center">Nå</th>
                  <th className="px-3 py-2.5 text-center">Mål</th>
                  <th className="px-3 py-2.5 text-center">Gap</th>
                </>
              )}
              <th className="px-3 py-2.5 text-center">Klassifisering</th>
              <th className="px-3 py-2.5 text-center">Verktøy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kapabiliteter.map((k) => {
              const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : null;
              return (
                <tr
                  key={k.id}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  onClick={() => onSelect(k)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                      {k.navn}
                    </div>
                    {k.realisering.it4itKomponent && (
                      <div className="text-[11px] text-gray-400 mt-0.5">{k.realisering.it4itKomponent}</div>
                    )}
                    {k.notater && (
                      <div className="text-[10px] text-blue-400 mt-0.5 truncate max-w-xs">📝 {k.notater}</div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <TeamtypeChip value={k.teamtype} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs text-gray-500">{k.prosesstype}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full font-medium",
                      k.eierskap === "Kjerne" ? "bg-cyan-100 text-cyan-700" : "bg-pink-100 text-pink-700"
                    )}>
                      {k.eierskap}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn("inline-block w-2.5 h-2.5 rounded-full", KRITIKALITET_DOT[k.kritikalitet])}
                      title={k.kritikalitet}
                    />
                  </td>

                  {visningsmodus === "nå" && (
                    <td className="px-3 py-3">
                      <div className="flex justify-center">
                        <ModenhetCell value={k.modenhetNå} mål={k.modenhetMål} size="sm" />
                      </div>
                    </td>
                  )}
                  {visningsmodus === "mål" && (
                    <td className="px-3 py-3">
                      <div className="flex justify-center">
                        <ModenhetCell value={k.modenhetMål} size="sm" />
                      </div>
                    </td>
                  )}
                  {visningsmodus === "gap" && (
                    <>
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <ModenhetCell value={k.modenhetNå} size="sm" />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <ModenhetCell value={k.modenhetMål} size="sm" />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold",
                          gapStyle(gap)
                        )}>
                          {gap === null ? "—" : gap > 0 ? `+${gap}` : gap === 0 ? "✓" : gap}
                        </span>
                      </td>
                    </>
                  )}

                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full font-medium",
                      KLASSIFISERING_CHIP[k.klassifisering]
                    )}>
                      {k.klassifisering === "IkkeVurdert" ? "—" : KLASSIFISERING_LABELS[k.klassifisering]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {k.realisering.verktøy && k.realisering.verktøy.length > 0 && (
                      <span className="text-[11px] text-gray-400 truncate max-w-[120px] block" title={k.realisering.verktøy.join(", ")}>
                        {k.realisering.verktøy[0]}{k.realisering.verktøy.length > 1 ? ` +${k.realisering.verktøy.length - 1}` : ""}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TeamtypeChip({ value }: { value: Kapabilitet["teamtype"] }) {
  const styles: Record<string, string> = {
    Produktområde: "bg-purple-100 text-purple-700",
    Plattformteam: "bg-cyan-100 text-cyan-700",
    Støtteteam: "bg-amber-100 text-amber-700",
  };
  const short: Record<string, string> = {
    Produktområde: "Produkt",
    Plattformteam: "Platform",
    Støtteteam: "Støtte",
  };
  return (
    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", styles[value])}>
      {short[value]}
    </span>
  );
}
