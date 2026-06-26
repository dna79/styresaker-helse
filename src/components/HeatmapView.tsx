"use client";
import { Kapabilitet, VERDISTRØMMER, Verdistrøm, IT4IT_MAP, Teamtype } from "@/lib/types";
import { ModenhetCell } from "./ModenhetCell";
import { cn } from "@/lib/utils";

interface Props {
  kapabiliteter: Kapabilitet[];
  filterTeamtype: Teamtype | "Alle";
  filterVerdistrøm: Verdistrøm | "Alle";
  visningsModus: "nå" | "mål" | "gap";
  onSelectKapabilitet: (k: Kapabilitet) => void;
}

const TEAMTYPE_COLORS: Record<Teamtype, string> = {
  Produktområde: "bg-purple-100 text-purple-700 border-purple-200",
  Plattformteam: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Støtteteam: "bg-amber-100 text-amber-700 border-amber-200",
};

const VERDISTRØM_COLORS: Record<Verdistrøm, string> = {
  "Evaluere produkter": "bg-violet-600",
  "Utforske produkter": "bg-blue-600",
  "Utvikle nye produkter": "bg-cyan-600",
  "Produksjonssette produkter": "bg-teal-600",
  "Tilgjengeliggjøre produkter": "bg-emerald-600",
  "Bruke produkter": "bg-orange-500",
  "Drifte produkter": "bg-red-600",
  "Tverrgående": "bg-gray-600",
};

function gapColor(gap: number) {
  if (gap <= 0) return "bg-green-200 text-green-900";
  if (gap === 1) return "bg-yellow-200 text-yellow-900";
  if (gap === 2) return "bg-orange-200 text-orange-900";
  return "bg-red-200 text-red-900";
}

export function HeatmapView({ kapabiliteter, filterTeamtype, filterVerdistrøm, visningsModus, onSelectKapabilitet }: Props) {
  const streams = filterVerdistrøm === "Alle"
    ? VERDISTRØMMER
    : [filterVerdistrøm];

  return (
    <div className="space-y-6">
      {streams.map((stream) => {
        const kaps = kapabiliteter.filter(
          (k) =>
            k.verdistrøm === stream &&
            (filterTeamtype === "Alle" || k.teamtype === filterTeamtype)
        );
        if (kaps.length === 0) return null;

        return (
          <section key={stream} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className={cn("px-4 py-3 text-white", VERDISTRØM_COLORS[stream])}>
              <div className="flex items-baseline gap-3">
                <h2 className="font-semibold text-base">{stream}</h2>
                <span className="text-xs opacity-75">IT4IT: {IT4IT_MAP[stream]}</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-2 w-64">Kapabilitet</th>
                    <th className="px-3 py-2 text-center">Teamtype</th>
                    <th className="px-3 py-2 text-center">Prosess</th>
                    <th className="px-3 py-2 text-center">Eierskap</th>
                    <th className="px-3 py-2 text-center">Kritikalitet</th>
                    {visningsModus === "nå" && <th className="px-3 py-2 text-center">Modenhet nå</th>}
                    {visningsModus === "mål" && <th className="px-3 py-2 text-center">Modenhetsmål</th>}
                    {visningsModus === "gap" && (
                      <>
                        <th className="px-3 py-2 text-center">Nå</th>
                        <th className="px-3 py-2 text-center">Mål</th>
                        <th className="px-3 py-2 text-center">Gap</th>
                      </>
                    )}
                    <th className="px-3 py-2 text-center">Klassifisering</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kaps.map((k) => {
                    const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : null;
                    return (
                      <tr
                        key={k.id}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => onSelectKapabilitet(k)}
                      >
                        <td className="px-4 py-2.5 font-medium text-gray-800">
                          {k.navn}
                          {k.notater && (
                            <span className="ml-2 text-[10px] text-blue-500">●</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border", TEAMTYPE_COLORS[k.teamtype])}>
                            {k.teamtype}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-gray-500">{k.prosesstype}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", k.eierskap === "Kjerne" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700")}>
                            {k.eierskap}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={cn("text-xs font-medium",
                            k.kritikalitet === "Høy" ? "text-red-600" :
                            k.kritikalitet === "Middels" ? "text-yellow-600" :
                            "text-green-600"
                          )}>
                            {k.kritikalitet}
                          </span>
                        </td>
                        {visningsModus === "nå" && (
                          <td className="px-3 py-2 text-center">
                            <div className="flex justify-center">
                              <ModenhetCell value={k.modenhetNå} mål={k.modenhetMål} compact />
                            </div>
                          </td>
                        )}
                        {visningsModus === "mål" && (
                          <td className="px-3 py-2 text-center">
                            <div className="flex justify-center">
                              <ModenhetCell value={k.modenhetMål} compact />
                            </div>
                          </td>
                        )}
                        {visningsModus === "gap" && (
                          <>
                            <td className="px-3 py-2 text-center">
                              <div className="flex justify-center">
                                <ModenhetCell value={k.modenhetNå} compact />
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex justify-center">
                                <ModenhetCell value={k.modenhetMål} compact />
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {gap !== null ? (
                                <span className={cn("inline-block w-10 rounded text-center text-sm font-bold py-1", gapColor(gap))}>
                                  {gap > 0 ? `+${gap}` : gap === 0 ? "✓" : gap}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          </>
                        )}
                        <td className="px-3 py-2 text-center">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full",
                            k.klassifisering === "IkkeVurdert" ? "bg-gray-100 text-gray-400" :
                            k.klassifisering === "UtvikleNytt" ? "bg-blue-100 text-blue-700" :
                            k.klassifisering === "Endre" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {k.klassifisering === "IkkeVurdert" ? "Ikke vurdert" :
                             k.klassifisering === "FaseUt" ? "Fase ut" :
                             k.klassifisering === "UtvikleNytt" ? "Utvikle nytt" :
                             "Endre"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
