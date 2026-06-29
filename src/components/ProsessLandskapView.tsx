"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  PROSESS_RADER, ProsessType, Dekning,
  IT4IT_VERDISTRØMMER, IT4IT_FUNKSJONELLE_GRUPPER,
} from "@/lib/prosessData";
import { cn } from "@/lib/utils";

const TYPE_STYLE: Record<ProsessType, string> = {
  Kjerne: "bg-blue-100 text-blue-700",
  Styring: "bg-violet-100 text-violet-700",
  Støtte: "bg-emerald-100 text-emerald-700",
};

const VS_STYLE: Record<string, string> = {
  "Evaluere produkter": "bg-sky-50 text-sky-700 border-sky-200",
  "Utforske produkter": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Utvikle nye produkter": "bg-orange-50 text-orange-700 border-orange-200",
  "Produksjonssette produkter": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Tilgjengeliggjøre produkter": "bg-green-50 text-green-700 border-green-200",
  "Bruke produkter": "bg-rose-50 text-rose-700 border-rose-200",
  "Drifte produkter": "bg-slate-50 text-slate-600 border-slate-200",
  "Tverrgående": "bg-stone-50 text-stone-600 border-stone-200",
};

const FG_STYLE: Record<string, string> = {
  Strategy: "bg-[#0f1f3d] text-white",
  Portfolio: "bg-blue-800 text-white",
  Develop: "bg-cyan-600 text-white",
  Test: "bg-violet-700 text-white",
  Fulfill: "bg-amber-700 text-white",
  Consume: "bg-rose-700 text-white",
  Support: "bg-emerald-700 text-white",
  Assure: "bg-gray-700 text-white",
  "—": "bg-gray-200 text-gray-500",
};

const DEKNING_STYLE: Record<Dekning, string> = {
  "✓": "text-emerald-600",
  "~": "text-amber-600",
  "⚠": "text-red-600",
};

export function ProsessLandskapView() {
  const [type, setType] = useState<ProsessType | "Alle">("Alle");
  const [vs, setVs] = useState<string>("Alle");
  const [fg, setFg] = useState<string>("Alle");
  const [søk, setSøk] = useState("");

  const filtrert = useMemo(() => {
    return PROSESS_RADER.filter((r) => {
      if (type !== "Alle" && r.type !== type) return false;
      if (vs !== "Alle" && !r.verdistrømmer.includes(vs)) return false;
      if (fg !== "Alle" && !r.funksjonelleGrupper.includes(fg)) return false;
      if (søk && !r.navn.toLowerCase().includes(søk.toLowerCase())) return false;
      return true;
    });
  }, [type, vs, fg, søk]);

  const activeFilters = [type !== "Alle", vs !== "Alle", fg !== "Alle", !!søk].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              className="rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Søk prosess..."
              value={søk}
              onChange={(e) => setSøk(e.target.value)}
            />
          </div>
          <Sel value={type} onChange={(v) => setType(v as ProsessType | "Alle")} options={["Alle", "Kjerne", "Styring", "Støtte"]} />
          <Sel value={vs} onChange={setVs} options={["Alle", ...IT4IT_VERDISTRØMMER]} />
          <Sel value={fg} onChange={setFg} options={["Alle", ...IT4IT_FUNKSJONELLE_GRUPPER]} />
          {activeFilters > 0 && (
            <button
              onClick={() => { setType("Alle"); setVs("Alle"); setFg("Alle"); setSøk(""); }}
              className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <X className="h-3 w-3" />
              Nullstill ({activeFilters})
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {filtrert.length} av {PROSESS_RADER.length} prosesser
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider" style={{ backgroundColor: "#0f1f3d", color: "white" }}>
                <th className="text-left px-4 py-3 min-w-[260px]">SP-prosess</th>
                <th className="text-left px-4 py-3 min-w-[180px]">Verdistrøm</th>
                <th className="text-left px-4 py-3 min-w-[160px]">Funksjonell gruppe</th>
                <th className="text-left px-4 py-3 min-w-[220px]">Utvalgte undernivåer</th>
                <th className="text-left px-4 py-3 min-w-[260px]">Merknad / kobling til kapabilitetsmodell</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrert.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors align-top">
                  <td className="px-4 py-3">
                    <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-full", TYPE_STYLE[r.type])}>
                      {r.type}
                    </span>
                    <div className="font-semibold text-gray-900 text-[13px] mt-1.5 leading-snug">{r.navn}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.verdistrømmer.map((v) => (
                        <span key={v} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap", VS_STYLE[v])}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.funksjonelleGrupper.map((g) => (
                        <span key={g} className={cn("text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap", FG_STYLE[g])}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 leading-relaxed">
                    {r.undernivåer.length ? r.undernivåer.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600 leading-relaxed">
                    <span className={cn("font-bold mr-1", DEKNING_STYLE[r.dekning])}>{r.dekning}</span>
                    {r.merknad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-5 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="font-bold text-emerald-600">✓</span> God dekning i IT4IT</span>
        <span className="flex items-center gap-1.5"><span className="font-bold text-amber-600">~</span> Delvis dekning / nærmeste analog</span>
        <span className="flex items-center gap-1.5"><span className="font-bold text-red-600">⚠</span> Utenfor IT4IT-scope</span>
      </div>
    </div>
  );
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors",
        value !== "Alle" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600"
      )}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
