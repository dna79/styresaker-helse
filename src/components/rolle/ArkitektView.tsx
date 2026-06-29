"use client";
import { useState, useMemo } from "react";
import { Kapabilitet, VERDISTRØMMER, DOMENER, DomeneId, Verdistrøm, Prosesstype } from "@/lib/types";
import { HeatmapView } from "@/components/HeatmapView";
import { ProsessLandskapView } from "@/components/ProsessLandskapView";
import { StatistikkView } from "@/components/StatistikkView";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

type Visningsmodus = "nå" | "mål" | "gap";
type Subtab = "kapabiliteter" | "prosesslandskap" | "statistikk";

export function ArkitektView({
  kapabiliteter,
  onSelectKapabilitet,
}: {
  kapabiliteter: Kapabilitet[];
  onSelectKapabilitet: (k: Kapabilitet) => void;
}) {
  const [subtab, setSubtab] = useState<Subtab>("kapabiliteter");
  const [søk, setSøk] = useState("");
  const [filterDomene, setFilterDomene] = useState<DomeneId | "Alle">("Alle");
  const [filterVerdistrøm, setFilterVerdistrøm] = useState<Verdistrøm | "Alle">("Alle");
  const [filterProsesstype, setFilterProsesstype] = useState<Prosesstype | "Alle">("Alle");
  const [visningsmodus, setVisningsmodus] = useState<Visningsmodus>("nå");

  const filtrert = useMemo(() => {
    return kapabiliteter.filter((k) => {
      if (filterDomene !== "Alle" && k.domeneId !== filterDomene) return false;
      if (filterVerdistrøm !== "Alle" && k.verdistrøm !== filterVerdistrøm) return false;
      if (filterProsesstype !== "Alle" && k.prosesstype !== filterProsesstype) return false;
      if (søk) {
        const q = søk.toLowerCase();
        return k.navn.toLowerCase().includes(q) || k.beskrivelse?.toLowerCase().includes(q) || k.realisering.it4itKomponent?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [kapabiliteter, filterDomene, filterVerdistrøm, filterProsesstype, søk]);

  const activeFilters = [filterDomene, filterVerdistrøm, filterProsesstype].filter((f) => f !== "Alle").length + (søk ? 1 : 0);

  const SUBTABS: { id: Subtab; label: string }[] = [
    { id: "kapabiliteter", label: "Faglig kapabilitetsvisning" },
    { id: "prosesslandskap", label: "Prosesslandskap (IT4IT v3)" },
    { id: "statistikk", label: "Statistikk og analyser" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-blue-950/5 border border-blue-100 rounded-2xl p-4 text-sm text-blue-900">
        <div className="font-bold mb-1">Arkitektvisning</div>
        <p className="text-xs leading-relaxed">Full faglig dybde — kapabiliteter med IT4IT-kobling, prosesslandskap med funksjonell gruppeanalyse, og modenhetstatistikk på tvers av domener og verdistrømmer.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {SUBTABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubtab(t.id)}
            className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all", subtab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subtab === "kapabiliteter" && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  className="rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Søk kapabilitet, IT4IT..."
                  value={søk}
                  onChange={(e) => setSøk(e.target.value)}
                />
              </div>
              <Sel value={filterDomene} onChange={(v) => setFilterDomene(v as DomeneId | "Alle")} options={[{ value: "Alle", label: "Alle domener" }, ...DOMENER.map((d) => ({ value: d.id, label: `${d.ikon} ${d.navn}` }))]} />
              <Sel value={filterVerdistrøm} onChange={(v) => setFilterVerdistrøm(v as Verdistrøm | "Alle")} options={[{ value: "Alle", label: "Alle verdistrømmer" }, ...VERDISTRØMMER.map((v) => ({ value: v, label: v }))]} />
              <Sel value={filterProsesstype} onChange={(v) => setFilterProsesstype(v as Prosesstype | "Alle")} options={[{ value: "Alle", label: "Alle prosesser" }, { value: "Kjerne", label: "Kjerne" }, { value: "Styring", label: "Styring" }, { value: "Støtte", label: "Støtte" }]} />
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {(["nå", "mål", "gap"] as Visningsmodus[]).map((m) => (
                  <button key={m} onClick={() => setVisningsmodus(m)} className={cn("px-3 py-1.5 text-xs font-semibold transition-colors", visningsmodus === m ? "text-white" : "bg-white text-gray-500 hover:bg-gray-50")} style={visningsmodus === m ? { backgroundColor: "#0f1f3d" } : {}}>
                    {m === "nå" ? "Nå" : m === "mål" ? "Mål" : "Gap"}
                  </button>
                ))}
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { setSøk(""); setFilterDomene("Alle"); setFilterVerdistrøm("Alle"); setFilterProsesstype("Alle"); }} className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors">
                  <X className="h-3 w-3" />Nullstill ({activeFilters})
                </button>
              )}
              <span className="ml-auto text-xs text-gray-400">{filtrert.length} av {kapabiliteter.length}</span>
            </div>
          </div>
          <HeatmapView kapabiliteter={filtrert} visningsmodus={visningsmodus} onSelectKapabilitet={onSelectKapabilitet} fagligModus={true} />
        </>
      )}

      {subtab === "prosesslandskap" && <ProsessLandskapView />}

      {subtab === "statistikk" && <StatistikkView kapabiliteter={kapabiliteter} />}
    </div>
  );
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white", value !== "Alle" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600")}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
