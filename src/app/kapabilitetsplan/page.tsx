"use client";
import { useState, useMemo } from "react";
import { useKapabilitetStore } from "@/lib/store";
import {
  Kapabilitet, Verdistrøm, Teamtype, VERDISTRØMMER, DOMENER, DomeneId, Klassifisering,
} from "@/lib/types";
import { HeatmapView } from "@/components/HeatmapView";
import { StatistikkView } from "@/components/StatistikkView";
import { KapabilitetEditor } from "@/components/KapabilitetEditor";
import { exportToExcel, exportToCSV } from "@/lib/export";
import {
  LayoutGrid, BarChart2, Download, RotateCcw, Filter, ChevronDown, X, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "heatmap" | "statistikk";
type Visningsmodus = "nå" | "mål" | "gap";

export default function KapabilitetsplanPage() {
  const { kapabiliteter, updateKapabilitet, resetToSeed } = useKapabilitetStore();
  const [tab, setTab] = useState<Tab>("heatmap");
  const [selected, setSelected] = useState<Kapabilitet | null>(null);

  // Filters
  const [søk, setSøk] = useState("");
  const [filterDomene, setFilterDomene] = useState<DomeneId | "Alle">("Alle");
  const [filterTeamtype, setFilterTeamtype] = useState<Teamtype | "Alle">("Alle");
  const [filterVerdistrøm, setFilterVerdistrøm] = useState<Verdistrøm | "Alle">("Alle");
  const [filterKritikalitet, setFilterKritikalitet] = useState<"Alle" | "Høy" | "Middels" | "Lav">("Alle");
  const [filterKlassifisering, setFilterKlassifisering] = useState<Klassifisering | "Alle">("Alle");
  const [visningsmodus, setVisningsmodus] = useState<Visningsmodus>("nå");
  const [showFilters, setShowFilters] = useState(true);

  const filtrerteKapabiliteter = useMemo(() => {
    return kapabiliteter.filter((k) => {
      if (filterDomene !== "Alle" && k.domeneId !== filterDomene) return false;
      if (filterTeamtype !== "Alle" && k.teamtype !== filterTeamtype) return false;
      if (filterVerdistrøm !== "Alle" && k.verdistrøm !== filterVerdistrøm) return false;
      if (filterKritikalitet !== "Alle" && k.kritikalitet !== filterKritikalitet) return false;
      if (filterKlassifisering !== "Alle" && k.klassifisering !== filterKlassifisering) return false;
      if (søk) {
        const q = søk.toLowerCase();
        return (
          k.navn.toLowerCase().includes(q) ||
          k.beskrivelse?.toLowerCase().includes(q) ||
          k.realisering.it4itKomponent?.toLowerCase().includes(q) ||
          k.realisering.verktøy?.some((v) => v.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [kapabiliteter, filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering, søk]);

  const activeFilters = [filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering].filter(
    (f) => f !== "Alle"
  ).length + (søk ? 1 : 0);

  function clearFilters() {
    setSøk("");
    setFilterDomene("Alle");
    setFilterTeamtype("Alle");
    setFilterVerdistrøm("Alle");
    setFilterKritikalitet("Alle");
    setFilterKlassifisering("Alle");
  }

  function handleReset() {
    if (confirm("Tilbakestill alle scoreringer og klassifiseringer til standardverdier?")) {
      resetToSeed();
    }
  }

  const vurdertCount = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const progress = Math.round((vurdertCount / kapabiliteter.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-5 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <LayoutGrid className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-none">Kapabilitetsplanlegging</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Sykehuspartner HF · T&A-avdelingen</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-2.5 ml-4">
            <div className="text-xs text-gray-400">{vurdertCount}/{kapabiliteter.length} vurdert</div>
            <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs font-semibold text-blue-600">{progress}%</div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Tabs */}
          <nav className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
            <TabBtn active={tab === "heatmap"} onClick={() => setTab("heatmap")} icon={<LayoutGrid className="h-3.5 w-3.5" />}>
              Heatmap
            </TabBtn>
            <TabBtn active={tab === "statistikk"} onClick={() => setTab("statistikk")} icon={<BarChart2 className="h-3.5 w-3.5" />}>
              Statistikk
            </TabBtn>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportToExcel(kapabiliteter)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </button>
            <button
              onClick={() => exportToCSV(kapabiliteter)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
            <button
              onClick={handleReset}
              title="Tilbakestill data"
              className="rounded-xl border border-gray-200 bg-white p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-5 py-5">
        {/* ── Filter bar ───────────────────────────────────────────────────── */}
        {tab === "heatmap" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  className="rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Søk kapabilitet..."
                  value={søk}
                  onChange={(e) => setSøk(e.target.value)}
                />
              </div>

              <FilterSelect
                value={filterDomene}
                onChange={(v) => setFilterDomene(v as DomeneId | "Alle")}
                label="Domene"
              >
                <option value="Alle">Alle domener</option>
                {DOMENER.map((d) => (
                  <option key={d.id} value={d.id}>{d.ikon} {d.navn}</option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={filterVerdistrøm}
                onChange={(v) => setFilterVerdistrøm(v as Verdistrøm | "Alle")}
                label="Verdistrøm"
              >
                <option value="Alle">Alle verdistrømmer</option>
                {VERDISTRØMMER.map((v) => <option key={v} value={v}>{v}</option>)}
              </FilterSelect>

              <FilterSelect
                value={filterTeamtype}
                onChange={(v) => setFilterTeamtype(v as Teamtype | "Alle")}
                label="Teamtype"
              >
                <option value="Alle">Alle teamtyper</option>
                <option value="Produktområde">Produktområde</option>
                <option value="Plattformteam">Plattformteam</option>
                <option value="Støtteteam">Støtteteam</option>
              </FilterSelect>

              <FilterSelect
                value={filterKritikalitet}
                onChange={(v) => setFilterKritikalitet(v as typeof filterKritikalitet)}
                label="Kritikalitet"
              >
                <option value="Alle">All kritikalitet</option>
                <option value="Høy">Høy</option>
                <option value="Middels">Middels</option>
                <option value="Lav">Lav</option>
              </FilterSelect>

              <FilterSelect
                value={filterKlassifisering}
                onChange={(v) => setFilterKlassifisering(v as typeof filterKlassifisering)}
                label="Klassifisering"
              >
                <option value="Alle">All klassifisering</option>
                <option value="Behold">Behold</option>
                <option value="Endre">Endre</option>
                <option value="UtvikleNytt">Utvikle nytt</option>
                <option value="FaseUt">Fase ut</option>
                <option value="IkkeVurdert">Ikke vurdert</option>
              </FilterSelect>

              {/* Visningsmodus toggle */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {(["nå", "mål", "gap"] as Visningsmodus[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setVisningsmodus(m)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold transition-colors",
                      visningsmodus === m ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {m === "nå" ? "Nå" : m === "mål" ? "Mål" : "Gap"}
                  </button>
                ))}
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Nullstill ({activeFilters})
                </button>
              )}

              <span className="ml-auto text-xs text-gray-400">
                {filtrerteKapabiliteter.length} av {kapabiliteter.length}
              </span>
            </div>
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────────────────── */}
        {tab === "heatmap" ? (
          <HeatmapView
            kapabiliteter={filtrerteKapabiliteter}
            visningsmodus={visningsmodus}
            onSelectKapabilitet={setSelected}
          />
        ) : (
          <StatistikkView kapabiliteter={kapabiliteter} />
        )}

        {/* ── Legend ───────────────────────────────────────────────────────── */}
        {tab === "heatmap" && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Modenhetsskala</div>
                <div className="flex gap-2">
                  {([0,1,2,3,4,5] as const).map((v) => (
                    <div key={v} className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-6 h-6 rounded border text-xs font-bold flex items-center justify-center",
                        v === 0 ? "bg-gray-100 text-gray-400 border-gray-200" :
                        v === 1 ? "bg-red-100 text-red-800 border-red-200" :
                        v === 2 ? "bg-orange-100 text-orange-800 border-orange-200" :
                        v === 3 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        v === 4 ? "bg-lime-100 text-lime-800 border-lime-200" :
                        "bg-green-200 text-green-900 border-green-300"
                      )}>
                        {v === 0 ? "—" : v}
                      </div>
                      <span className="text-[11px] text-gray-500 hidden sm:block">
                        {v === 0 ? "Ikke vurdert" : v === 1 ? "Ad hoc" : v === 2 ? "Delvis" :
                         v === 3 ? "Definert" : v === 4 ? "Styrt" : "Optimalisert"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-[11px] text-gray-400">
                Klikk en rad for å score kapabiliteten
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Editor dialog ─────────────────────────────────────────────────── */}
      <KapabilitetEditor
        kapabilitet={selected}
        onClose={() => setSelected(null)}
        onSave={updateKapabilitet}
      />
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        active ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function FilterSelect({
  value, onChange, label, children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors",
        value !== "Alle" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600"
      )}
    >
      {children}
    </select>
  );
}
