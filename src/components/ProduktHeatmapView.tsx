"use client";
import { Produktkapabilitet, PRODUKT_VERDISTRØMMER, ProduktVerdistrøm, Kritikalitet, DOMENER } from "@/lib/types";
import { cn } from "@/lib/utils";

type Visningsmodus = "nå" | "mål" | "gap";

interface Props {
  kapabiliteter: Produktkapabilitet[];
  visningsmodus: Visningsmodus;
  onSelect: (k: Produktkapabilitet) => void;
  fagligModus: boolean;
}

const KRITIKALITET_DOT: Record<Kritikalitet, string> = {
  Høy: "bg-red-500",
  Middels: "bg-yellow-400",
  Lav: "bg-green-400",
};

const SP_ROLLE_CHIP: Record<string, string> = {
  Kartlegge:    "bg-blue-50 text-blue-700",
  Pådriver:     "bg-orange-50 text-orange-700",
  Støtte:       "bg-green-50 text-green-700",
  IkkeVurdert:  "bg-gray-100 text-gray-400",
};

const MODENHET_BG: Record<number, string> = {
  0: "bg-gray-100 text-gray-400 border-gray-200",
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-lime-100 text-lime-800 border-lime-200",
  5: "bg-green-200 text-green-900 border-green-300",
};

function gapStyle(gap: number | null) {
  if (gap === null) return "bg-gray-100 text-gray-400";
  if (gap <= 0) return "bg-green-100 text-green-700";
  if (gap === 1) return "bg-yellow-100 text-yellow-700";
  if (gap === 2) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

function ModenhetBadge({ value }: { value: number }) {
  return (
    <div className={cn(
      "inline-flex items-center justify-center w-8 h-7 rounded-lg border text-xs font-bold",
      MODENHET_BG[value] ?? MODENHET_BG[0]
    )}>
      {value === 0 ? "—" : value}
    </div>
  );
}

export function ProduktHeatmapView({ kapabiliteter, visningsmodus, onSelect, fagligModus }: Props) {
  const kliniske = PRODUKT_VERDISTRØMMER.filter((v) => v.kategori === "Klinisk");
  const admin = PRODUKT_VERDISTRØMMER.filter((v) => v.kategori === "Administrativ");

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="rounded-2xl border border-blue-200 bg-[#E8F4FC] px-5 py-4 text-sm text-gray-700">
        <span className="font-semibold text-[#003087]">Produktkapabiliteter</span> beskriver hva sykehusene og HSØ må
        kunne gjøre. Sykehuspartner eier ikke disse — men vi må forstå dem for å bygge riktige digitale produkter.
        Mandat til å endre disse ligger hos HF/HSØ.
      </div>

      {/* Kliniske verdistrømmer */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Kliniske forløp</div>
        {kliniske.map((vs) => (
          <VerdistrømSection
            key={vs.id}
            verdistrøm={vs.id}
            ikon={vs.ikon}
            kapabiliteter={kapabiliteter.filter((k) => k.verdistrøm === vs.id)}
            visningsmodus={visningsmodus}
            onSelect={onSelect}
            fagligModus={fagligModus}
          />
        ))}
      </div>

      {/* Administrative verdistrømmer */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Administrative forløp</div>
        {admin.map((vs) => (
          <VerdistrømSection
            key={vs.id}
            verdistrøm={vs.id}
            ikon={vs.ikon}
            kapabiliteter={kapabiliteter.filter((k) => k.verdistrøm === vs.id)}
            visningsmodus={visningsmodus}
            onSelect={onSelect}
            fagligModus={fagligModus}
          />
        ))}
      </div>
    </div>
  );
}

function VerdistrømSection({ verdistrøm, ikon, kapabiliteter, visningsmodus, onSelect, fagligModus }: {
  verdistrøm: ProduktVerdistrøm;
  ikon: string;
  kapabiliteter: Produktkapabilitet[];
  visningsmodus: Visningsmodus;
  onSelect: (k: Produktkapabilitet) => void;
  fagligModus: boolean;
}) {
  if (kapabiliteter.length === 0) return null;

  const vurdert = kapabiliteter.filter((k) => k.modenhetNå > 0).length;

  return (
    <section className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-4">
      {/* Section header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--sp-primary)", color: "white" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{ikon}</span>
          <span className="font-bold text-sm">{verdistrøm}</span>
        </div>
        <div className="text-xs opacity-70">
          {kapabiliteter.length} kapabiliteter · {vurdert} vurdert
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-400 uppercase tracking-wide">
              <th className="text-left px-4 py-2.5">Produktkapabilitet</th>
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
              <th className="px-3 py-2.5 text-center">SP-rolle</th>
              {fagligModus && <th className="px-3 py-2.5 text-center">Domene</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kapabiliteter.map((k, i) => {
              const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : null;
              const domene = DOMENER.find((d) => d.id === k.domeneId);
              return (
                <tr
                  key={k.id}
                  onClick={() => onSelect(k)}
                  className={cn(
                    "hover:bg-blue-50/50 cursor-pointer transition-colors group",
                    i % 2 === 1 ? "bg-[#F5F7FA]" : "bg-white"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                      {k.navn}
                    </div>
                    {k.notater && (
                      <div className="text-[10px] text-blue-400 mt-0.5 truncate max-w-xs">📝 {k.notater}</div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn("inline-block w-2.5 h-2.5 rounded-full", KRITIKALITET_DOT[k.kritikalitet])}
                      title={k.kritikalitet}
                    />
                  </td>
                  {visningsmodus === "nå" && (
                    <td className="px-3 py-3 text-center"><ModenhetBadge value={k.modenhetNå} /></td>
                  )}
                  {visningsmodus === "mål" && (
                    <td className="px-3 py-3 text-center"><ModenhetBadge value={k.modenhetMål} /></td>
                  )}
                  {visningsmodus === "gap" && (
                    <>
                      <td className="px-3 py-3 text-center"><ModenhetBadge value={k.modenhetNå} /></td>
                      <td className="px-3 py-3 text-center"><ModenhetBadge value={k.modenhetMål} /></td>
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
                      SP_ROLLE_CHIP[k.spRolle]
                    )}>
                      {k.spRolle === "IkkeVurdert" ? "—" : k.spRolle}
                    </span>
                  </td>
                  {fagligModus && (
                    <td className="px-3 py-3 text-center">
                      <span className="text-[11px] text-gray-400">
                        {domene ? `${domene.ikon} ${domene.navn.split(" ")[0]}` : k.domeneId}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
