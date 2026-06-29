"use client";
import { useState } from "react";
import { Produktkapabilitet, DigitaltProdukt, PRODUKT_VERDISTRØMMER, ProduktVerdistrøm } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MODENHET_BG } from "@/components/ModenhetCell";

const STATUS_CONFIG = {
  "I produksjon":    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  "Under utvikling": { bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-200" },
  "Idé":             { bg: "bg-violet-100",  text: "text-violet-700",  border: "border-violet-200" },
  "Avviklet":        { bg: "bg-gray-100",    text: "text-gray-500",    border: "border-gray-200" },
} as const;

const ROLLE_CONFIG = {
  Kartlegge:    { label: "Kartlegge",    color: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-200" },
  Pådriver:     { label: "Pådriver",     color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
  Støtte:       { label: "Støtte",       color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-200" },
  IkkeVurdert:  { label: "Ikke vurdert", color: "text-gray-400",   bg: "bg-gray-50",    border: "border-gray-200" },
} as const;

export function ProduktlederView({
  produktkapabiliteter,
  digitaleProdukter,
}: {
  produktkapabiliteter: Produktkapabilitet[];
  digitaleProdukter: DigitaltProdukt[];
}) {
  const [tab, setTab] = useState<"produkter" | "digitalt">("produkter");
  const [filterVS, setFilterVS] = useState<ProduktVerdistrøm | "Alle">("Alle");

  const filtered = produktkapabiliteter.filter((k) => filterVS === "Alle" || k.verdistrøm === filterVS);

  const prodStatus = ["I produksjon","Under utvikling","Idé","Avviklet"] as const;
  const statusCount = Object.fromEntries(prodStatus.map((s) => [s, digitaleProdukter.filter((d) => d.status === s).length]));

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Produktkapabiliteter</div>
          <div className="text-3xl font-bold text-blue-600">{produktkapabiliteter.length}</div>
          <div className="text-xs text-gray-400 mt-1">på tvers av {PRODUKT_VERDISTRØMMER.length} verdistrømmer</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Digitale produkter</div>
          <div className="text-3xl font-bold text-violet-600">{digitaleProdukter.length}</div>
          <div className="text-xs text-gray-400 mt-1">{statusCount["I produksjon"]} i produksjon</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">SP som pådriver</div>
          <div className="text-3xl font-bold text-emerald-600">{produktkapabiliteter.filter((k) => k.spRolle === "Pådriver").length}</div>
          <div className="text-xs text-gray-400 mt-1">av {produktkapabiliteter.length} kapabiliteter</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Under utvikling</div>
          <div className="text-3xl font-bold text-orange-500">{statusCount["Under utvikling"]}</div>
          <div className="text-xs text-gray-400 mt-1">digitale produkter</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ id: "produkter", label: "Produktkapabiliteter" }, { id: "digitalt", label: "Digitale produkter" }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all", tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "produkter" && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex flex-wrap gap-2">
            <select
              value={filterVS}
              onChange={(e) => setFilterVS(e.target.value as ProduktVerdistrøm | "Alle")}
              className={cn("rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none bg-white", filterVS !== "Alle" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600")}
            >
              <option value="Alle">Alle verdistrømmer</option>
              {PRODUKT_VERDISTRØMMER.map((vs) => <option key={vs.id} value={vs.id}>{vs.ikon} {vs.id}</option>)}
            </select>
            <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} av {produktkapabiliteter.length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Kapabilitet</th>
                    <th className="px-4 py-3 text-left">Verdistrøm</th>
                    <th className="px-4 py-3 text-center">Krit.</th>
                    <th className="px-4 py-3 text-center">Nå</th>
                    <th className="px-4 py-3 text-center">Mål</th>
                    <th className="px-4 py-3 text-left">SP-rolle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((k) => {
                    const vs = PRODUKT_VERDISTRØMMER.find((v) => v.id === k.verdistrøm);
                    const rolle = ROLLE_CONFIG[k.spRolle];
                    const kritColors = { Høy: "bg-red-100 text-red-700", Middels: "bg-amber-50 text-amber-700", Lav: "bg-gray-100 text-gray-500" };
                    return (
                      <tr key={k.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800 text-sm">{k.navn}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{k.beskrivelse}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{vs?.ikon} {k.verdistrøm}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", kritColors[k.kritikalitet])}>{k.kritikalitet}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border", MODENHET_BG[k.modenhetNå as 0|1|2|3|4|5])}>
                            {k.modenhetNå || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border", MODENHET_BG[k.modenhetMål as 0|1|2|3|4|5])}>
                            {k.modenhetMål || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", rolle.bg, rolle.border, rolle.color)}>{rolle.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "digitalt" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {prodStatus.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className={cn("rounded-2xl border p-4", cfg.bg, cfg.border)}>
                  <div className={cn("text-2xl font-bold", cfg.text)}>{statusCount[s]}</div>
                  <div className={cn("text-xs font-semibold mt-1", cfg.text)}>{s}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digitaleProdukter.map((p) => {
              const cfg = STATUS_CONFIG[p.status];
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{p.navn}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{p.produktområde}</div>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap", cfg.bg, cfg.border, cfg.text)}>{p.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.beskrivelse}</p>
                  <div className="mt-2 text-[10px] text-gray-400">
                    {p.produktkapabilitetIder.length} produktkap. · {p.kjernekapabilitetIder.length} kjernekap.
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
