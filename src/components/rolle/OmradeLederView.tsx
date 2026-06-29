"use client";
import { useState } from "react";
import { Kapabilitet, DOMENER, DomeneId, ModenhetScore, MODENHET_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MODENHET_BG } from "@/components/ModenhetCell";

function avg(kaps: Kapabilitet[], field: "modenhetNå" | "modenhetMål") {
  const valid = kaps.filter((k) => k[field] > 0);
  if (!valid.length) return 0;
  return valid.reduce((s, k) => s + k[field], 0) / valid.length;
}

export function OmradeLederView({ kapabiliteter }: { kapabiliteter: Kapabilitet[] }) {
  const [valgtDomene, setValgtDomene] = useState<DomeneId>(DOMENER[0].id);
  const domene = DOMENER.find((d) => d.id === valgtDomene)!;
  const kaps = kapabiliteter.filter((k) => k.domeneId === valgtDomene);
  const avgNå = avg(kaps, "modenhetNå");
  const avgMål = avg(kaps, "modenhetMål");
  const gap = avgNå > 0 && avgMål > 0 ? avgMål - avgNå : 0;
  const vurdert = kaps.filter((k) => k.modenhetNå > 0).length;

  const sorted = [...kaps].sort((a, b) => {
    if (b.kritikalitet !== a.kritikalitet) {
      const ord = { Høy: 0, Middels: 1, Lav: 2 };
      return ord[a.kritikalitet] - ord[b.kritikalitet];
    }
    return a.modenhetNå - b.modenhetNå;
  });

  return (
    <div className="space-y-5">
      {/* Domene picker */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Velg ditt ansvarsområde</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {DOMENER.map((d) => (
            <button
              key={d.id}
              onClick={() => setValgtDomene(d.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all",
                valgtDomene === d.id
                  ? "border-[#0f1f3d] bg-[#0f1f3d] text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span className="text-2xl">{d.ikon}</span>
              <span className="text-[10px] font-semibold leading-tight">{d.navn.split(" og ")[0].split(" og\n")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Domain summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Kapabiliteter</div>
          <div className="text-3xl font-bold text-gray-900">{kaps.length}</div>
          <div className="text-xs text-gray-400 mt-1">{vurdert} vurdert</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Snitt modenhet</div>
          <div className="text-3xl font-bold text-orange-500">{avgNå > 0 ? avgNå.toFixed(1) : "—"}</div>
          <div className="text-xs text-gray-400 mt-1">av 5.0</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Mål</div>
          <div className="text-3xl font-bold text-blue-600">{avgMål > 0 ? avgMål.toFixed(1) : "—"}</div>
          <div className="text-xs text-gray-400 mt-1">gjennomsnittsmål</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Gap</div>
          <div className={cn("text-3xl font-bold", gap > 1.5 ? "text-red-500" : gap > 0.5 ? "text-amber-500" : "text-emerald-500")}>
            {gap > 0 ? `+${gap.toFixed(1)}` : gap === 0 && avgNå > 0 ? "0" : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">nå→mål</div>
        </div>
      </div>

      {/* Capability list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-xl">{domene.ikon}</span>
          <h3 className="font-bold text-gray-900 text-sm">{domene.navn}</h3>
          <span className="ml-auto text-xs text-gray-400">{kaps.length} kapabiliteter</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Kapabilitet</th>
                <th className="px-4 py-3 text-center">Krit.</th>
                <th className="px-4 py-3 text-center">Nå</th>
                <th className="px-4 py-3 text-center">Mål</th>
                <th className="px-4 py-3 text-center">Gap</th>
                <th className="px-4 py-3 text-left">Beslutning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((k) => {
                const gap = k.modenhetNå > 0 && k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : 0;
                const kritColors = { Høy: "bg-red-100 text-red-700", Middels: "bg-amber-50 text-amber-700", Lav: "bg-gray-100 text-gray-500" };
                const klColors: Record<string, string> = { Behold: "text-emerald-600", Endre: "text-amber-600", UtvikleNytt: "text-blue-600", FaseUt: "text-red-500", IkkeVurdert: "text-gray-400" };
                const klLabels: Record<string, string> = { Behold: "Behold", Endre: "Endre", UtvikleNytt: "Utvikle nytt", FaseUt: "Fase ut", IkkeVurdert: "—" };
                return (
                  <tr key={k.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-800 text-sm">{k.navn}</div>
                      {k.beskrivelse && <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{k.beskrivelse}</div>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", kritColors[k.kritikalitet])}>{k.kritikalitet}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border", MODENHET_BG[k.modenhetNå as ModenhetScore])}>
                        {k.modenhetNå || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border", MODENHET_BG[k.modenhetMål as ModenhetScore])}>
                        {k.modenhetMål || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("text-sm font-semibold", gap > 1 ? "text-red-500" : gap > 0 ? "text-amber-500" : "text-gray-300")}>
                        {gap > 0 ? `+${gap}` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-semibold", klColors[k.klassifisering])}>
                        {klLabels[k.klassifisering]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
