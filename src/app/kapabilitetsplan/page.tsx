"use client";
import { useState, useMemo, useEffect } from "react";
import { useKapabilitetStore } from "@/lib/store";
import {
  Kapabilitet, Produktkapabilitet, Verdistrøm, Teamtype,
  VERDISTRØMMER, DOMENER, DomeneId, Klassifisering,
  Dimensjon, PRODUKT_VERDISTRØMMER, ProduktVerdistrøm,
} from "@/lib/types";
import { HeatmapView } from "@/components/HeatmapView";
import { StatistikkView } from "@/components/StatistikkView";
import { KapabilitetEditor } from "@/components/KapabilitetEditor";
import { ProduktHeatmapView } from "@/components/ProduktHeatmapView";
import { ProduktkapabilitetEditor } from "@/components/ProduktkapabilitetEditor";
import { DigitaltProduktView } from "@/components/DigitaltProduktView";
import { exportToExcel, exportToCSV, exportToJSON, parseImportedJSON } from "@/lib/export";
import {
  LayoutGrid, BarChart2, Download, RotateCcw, X, Search, Code2,
  Building2, FlaskConical, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

type KjerneTab = "statistikk" | "heatmap";
type Visningsmodus = "nå" | "mål" | "gap";
export type AppModus = "forretning" | "faglig";

const MODUS_KEY = "sp-appmodus";
const DIMENSJON_KEY = "sp-dimensjon";

export default function KapabilitetsplanPage() {
  const {
    kapabiliteter, updateKapabilitet, resetToSeed, loadFromSnapshot,
    produktkapabiliteter, updateProduktkapabilitet,
    digitaleProdukter, updateDigitaltProdukt,
  } = useKapabilitetStore();

  const [appModus, setAppModus] = useState<AppModus>("forretning");
  const [dimensjon, setDimensjon] = useState<Dimensjon>("kjerne");
  const [kjerneTab, setKjerneTab] = useState<KjerneTab>("statistikk");
  const [selected, setSelected] = useState<Kapabilitet | null>(null);
  const [selectedPK, setSelectedPK] = useState<Produktkapabilitet | null>(null);

  // Filters (kjerne)
  const [søk, setSøk] = useState("");
  const [filterDomene, setFilterDomene] = useState<DomeneId | "Alle">("Alle");
  const [filterTeamtype, setFilterTeamtype] = useState<Teamtype | "Alle">("Alle");
  const [filterVerdistrøm, setFilterVerdistrøm] = useState<Verdistrøm | "Alle">("Alle");
  const [filterKritikalitet, setFilterKritikalitet] = useState<"Alle" | "Høy" | "Middels" | "Lav">("Alle");
  const [filterKlassifisering, setFilterKlassifisering] = useState<Klassifisering | "Alle">("Alle");
  const [visningsmodus, setVisningsmodus] = useState<Visningsmodus>("nå");

  // Filters (produkt)
  const [produktSøk, setProduktSøk] = useState("");
  const [filterProduktVS, setFilterProduktVS] = useState<ProduktVerdistrøm | "Alle">("Alle");
  const [produktVisningsmodus, setProduktVisningsmodus] = useState<Visningsmodus>("nå");

  useEffect(() => {
    try {
      const m = localStorage.getItem(MODUS_KEY) as AppModus | null;
      if (m === "forretning" || m === "faglig") setAppModus(m);

      const d = localStorage.getItem(DIMENSJON_KEY) as Dimensjon | null;
      if (d === "kjerne" || d === "produkt" || d === "digitalt") setDimensjon(d);
    } catch { /* ignore */ }
  }, []);

  function setAndSaveModus(m: AppModus) {
    setAppModus(m);
    try { localStorage.setItem(MODUS_KEY, m); } catch { /* ignore */ }
  }

  function setAndSaveDimensjon(d: Dimensjon) {
    setDimensjon(d);
    try { localStorage.setItem(DIMENSJON_KEY, d); } catch { /* ignore */ }
    // Reset default sub-tab when switching
    if (d === "kjerne") setKjerneTab(appModus === "faglig" ? "heatmap" : "statistikk");
  }

  const fagligModus = appModus === "faglig";

  // ── Filtered kjernekapabiliteter ──────────────────────────────────────────
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
          k.realisering.it4itFunksjonellKomponent?.navn.toLowerCase().includes(q) ||
          k.realisering.verktøy?.some((v) => v.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [kapabiliteter, filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering, søk]);

  // ── Filtered produktkapabiliteter ─────────────────────────────────────────
  const filtrerteProdukt = useMemo(() => {
    return produktkapabiliteter.filter((k) => {
      if (filterProduktVS !== "Alle" && k.verdistrøm !== filterProduktVS) return false;
      if (produktSøk) {
        const q = produktSøk.toLowerCase();
        return k.navn.toLowerCase().includes(q) || k.beskrivelse.toLowerCase().includes(q);
      }
      return true;
    });
  }, [produktkapabiliteter, filterProduktVS, produktSøk]);

  const activeKjerneFilters = [filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering]
    .filter((f) => f !== "Alle").length + (søk ? 1 : 0);

  function clearKjerneFilters() {
    setSøk(""); setFilterDomene("Alle"); setFilterTeamtype("Alle");
    setFilterVerdistrøm("Alle"); setFilterKritikalitet("Alle"); setFilterKlassifisering("Alle");
  }

  function handleReset() {
    if (confirm("Tilbakestill alle data til standardverdier?")) resetToSeed();
  }

  function handleImportJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const snapshot = parseImportedJSON(ev.target?.result as string);
        if (confirm(`Importer data fra ${file.name}? Dette erstatter alle lokale endringer.`)) {
          loadFromSnapshot(snapshot);
        }
      } catch (err) {
        alert(`Kunne ikke importere fil: ${err instanceof Error ? err.message : "Ugyldig format"}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const vurdertCount = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const progress = Math.round((vurdertCount / kapabiliteter.length) * 100);

  const DIMENSJON_TABS: { id: Dimensjon; label: string; ikon: string }[] = [
    { id: "kjerne",   label: "Kjernekapabiliteter",   ikon: "⚙️" },
    { id: "produkt",  label: "Produktkapabiliteter",  ikon: "🏥" },
    { id: "digitalt", label: "Digitale produkter",    ikon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: "var(--sp-primary)", color: "white" }}>
        {/* Top row */}
        <div className="max-w-screen-2xl mx-auto px-6 pt-4 pb-0 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold leading-none" style={{ color: "var(--sp-accent)" }}>+</span>
              <div>
                <div className="font-bold text-lg leading-none">Sykehuspartner</div>
                <div className="text-xs leading-none mt-0.5" style={{ color: "var(--sp-accent)" }}>
                  Teknologi og arkitekturstyring
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 mx-2" />
            <h1 className="text-lg font-semibold">Kapabilitetsplanlegging</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 pb-1">
            {/* Progress */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-xs text-white/60">{vurdertCount}/{kapabiliteter.length} vurdert</div>
              <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: "var(--sp-accent)" }} />
              </div>
              <div className="text-xs font-semibold" style={{ color: "var(--sp-accent)" }}>{progress}%</div>
            </div>

            <button
              onClick={() => exportToExcel(kapabiliteter, produktkapabiliteter, digitaleProdukter)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </button>

            <button
              onClick={() => exportToJSON(kapabiliteter, produktkapabiliteter, digitaleProdukter)}
              title="Eksporter alle data til JSON"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>

            <label
              title="Importer data fra JSON-fil"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Importer
              <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>

            <button
              onClick={handleReset}
              title="Tilbakestill data"
              className="rounded-xl border border-white/20 bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Modus toggle */}
            <button
              onClick={() => setAndSaveModus(fagligModus ? "forretning" : "faglig")}
              title={fagligModus ? "Bytt til Forretningsvisning" : "Bytt til Faglig visning"}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                fagligModus
                  ? "border-[#00A3E0] bg-[#00A3E0] text-white"
                  : "border-white/30 bg-white/15 text-white hover:bg-white/25"
              )}
            >
              {fagligModus ? <Code2 className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
              {fagligModus ? "Faglig" : "Forretning"}
            </button>
          </div>
        </div>

        {/* Dimensjon tabs row */}
        <div className="max-w-screen-2xl mx-auto px-6 flex items-end gap-0 mt-2">
          {DIMENSJON_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setAndSaveDimensjon(t.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-t-xl border-t border-l border-r",
                dimensjon === t.id
                  ? "bg-gray-50/90 text-[#003087] border-gray-200 border-b-0 -mb-px relative z-10"
                  : "text-white/70 border-transparent hover:text-white hover:bg-white/10"
              )}
            >
              <span>{t.ikon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-5 py-5">

        {/* ── KJERNEKAPABILITETER ─────────────────────────────────────── */}
        {dimensjon === "kjerne" && (
          <>
            {/* Sub-tabs */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 gap-0.5 shadow-sm">
                <SubTabBtn
                  active={kjerneTab === "statistikk"}
                  onClick={() => setKjerneTab("statistikk")}
                  icon={<BarChart2 className="h-3.5 w-3.5" />}
                >
                  {fagligModus ? "Statistikk" : "Domeneoversikt"}
                </SubTabBtn>
                <SubTabBtn
                  active={kjerneTab === "heatmap"}
                  onClick={() => setKjerneTab("heatmap")}
                  icon={<LayoutGrid className="h-3.5 w-3.5" />}
                >
                  Heatmap
                </SubTabBtn>
              </div>
            </div>

            {/* Filter bar (heatmap only) */}
            {kjerneTab === "heatmap" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      className="rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Søk kapabilitet..."
                      value={søk}
                      onChange={(e) => setSøk(e.target.value)}
                    />
                  </div>
                  <FilterSelect value={filterDomene} onChange={(v) => setFilterDomene(v as DomeneId | "Alle")} label="Domene">
                    <option value="Alle">Alle domener</option>
                    {DOMENER.map((d) => <option key={d.id} value={d.id}>{d.ikon} {d.navn}</option>)}
                  </FilterSelect>
                  <FilterSelect value={filterVerdistrøm} onChange={(v) => setFilterVerdistrøm(v as Verdistrøm | "Alle")} label="Verdistrøm">
                    <option value="Alle">Alle verdistrømmer</option>
                    {VERDISTRØMMER.map((v) => <option key={v} value={v}>{v}</option>)}
                  </FilterSelect>
                  {fagligModus && (
                    <FilterSelect value={filterTeamtype} onChange={(v) => setFilterTeamtype(v as Teamtype | "Alle")} label="Teamtype">
                      <option value="Alle">Alle teamtyper</option>
                      <option value="Produktområde">Produktområde</option>
                      <option value="Plattformteam">Plattformteam</option>
                      <option value="Støtteteam">Støtteteam</option>
                    </FilterSelect>
                  )}
                  <FilterSelect value={filterKritikalitet} onChange={(v) => setFilterKritikalitet(v as typeof filterKritikalitet)} label="Krit.">
                    <option value="Alle">All kritikalitet</option>
                    <option value="Høy">Høy</option>
                    <option value="Middels">Middels</option>
                    <option value="Lav">Lav</option>
                  </FilterSelect>
                  <FilterSelect value={filterKlassifisering} onChange={(v) => setFilterKlassifisering(v as typeof filterKlassifisering)} label="Klassif.">
                    <option value="Alle">All klassifisering</option>
                    <option value="Behold">Behold</option>
                    <option value="Endre">Endre</option>
                    <option value="UtvikleNytt">Utvikle nytt</option>
                    <option value="FaseUt">Fase ut</option>
                    <option value="IkkeVurdert">Ikke vurdert</option>
                  </FilterSelect>
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                    {(["nå", "mål", "gap"] as Visningsmodus[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setVisningsmodus(m)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold transition-colors",
                          visningsmodus === m ? "text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                        )}
                        style={visningsmodus === m ? { backgroundColor: "var(--sp-primary)" } : {}}
                      >
                        {m === "nå" ? "Nå" : m === "mål" ? "Mål" : "Gap"}
                      </button>
                    ))}
                  </div>
                  {activeKjerneFilters > 0 && (
                    <button
                      onClick={clearKjerneFilters}
                      className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Nullstill ({activeKjerneFilters})
                    </button>
                  )}
                  <span className="ml-auto text-xs text-gray-400">
                    {filtrerteKapabiliteter.length} av {kapabiliteter.length}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            {kjerneTab === "heatmap" ? (
              <HeatmapView
                kapabiliteter={filtrerteKapabiliteter}
                visningsmodus={visningsmodus}
                onSelectKapabilitet={setSelected}
                fagligModus={fagligModus}
              />
            ) : (
              <StatistikkView kapabiliteter={kapabiliteter} />
            )}

            {/* Legend */}
            {kjerneTab === "heatmap" && (
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
                            {["Ikke vurdert","Ad hoc","Delvis","Definert","Styrt","Optimalisert"][v]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-[11px] text-gray-400">Klikk en rad for å score kapabiliteten</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PRODUKTKAPABILITETER ────────────────────────────────────── */}
        {dimensjon === "produkt" && (
          <>
            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    className="rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Søk produktkapabilitet..."
                    value={produktSøk}
                    onChange={(e) => setProduktSøk(e.target.value)}
                  />
                </div>
                <FilterSelect value={filterProduktVS} onChange={(v) => setFilterProduktVS(v as ProduktVerdistrøm | "Alle")} label="Verdistrøm">
                  <option value="Alle">Alle verdistrømmer</option>
                  {PRODUKT_VERDISTRØMMER.map((vs) => (
                    <option key={vs.id} value={vs.id}>{vs.ikon} {vs.id}</option>
                  ))}
                </FilterSelect>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                  {(["nå", "mål", "gap"] as Visningsmodus[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setProduktVisningsmodus(m)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold transition-colors",
                        produktVisningsmodus === m ? "text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                      )}
                      style={produktVisningsmodus === m ? { backgroundColor: "var(--sp-primary)" } : {}}
                    >
                      {m === "nå" ? "Nå" : m === "mål" ? "Mål" : "Gap"}
                    </button>
                  ))}
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {filtrerteProdukt.length} av {produktkapabiliteter.length}
                </span>
              </div>
            </div>

            <ProduktHeatmapView
              kapabiliteter={filtrerteProdukt}
              visningsmodus={produktVisningsmodus}
              onSelect={setSelectedPK}
              fagligModus={fagligModus}
            />
          </>
        )}

        {/* ── DIGITALE PRODUKTER ──────────────────────────────────────── */}
        {dimensjon === "digitalt" && (
          <DigitaltProduktView
            digitaleProdukter={digitaleProdukter}
            kjernekapabiliteter={kapabiliteter}
            produktkapabiliteter={produktkapabiliteter}
            onUpdate={updateDigitaltProdukt}
          />
        )}
      </div>

      {/* ── Editor dialogs ─────────────────────────────────────────────── */}
      <KapabilitetEditor
        kapabilitet={selected}
        onClose={() => setSelected(null)}
        onSave={updateKapabilitet}
        fagligModus={fagligModus}
      />
      <ProduktkapabilitetEditor
        kapabilitet={selectedPK}
        onClose={() => setSelectedPK(null)}
        onSave={updateProduktkapabilitet}
        digitaleProdukter={digitaleProdukter}
        kjernekapabiliteter={kapabiliteter}
      />
    </div>
  );
}

function SubTabBtn({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        active ? "bg-[#003087] shadow-sm text-white" : "text-gray-500 hover:text-gray-700"
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
