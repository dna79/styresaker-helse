"use client";
import { useState, useMemo, useEffect } from "react";
import { useKapabilitetStore } from "@/lib/store";
import {
  Kapabilitet, Produktkapabilitet, Verdistrøm, Teamtype, Prosesstype,
  VERDISTRØMMER, DOMENER, DomeneId, Klassifisering,
  PRODUKT_VERDISTRØMMER, ProduktVerdistrøm,
} from "@/lib/types";
import { HeatmapView } from "@/components/HeatmapView";
import { StatistikkView } from "@/components/StatistikkView";
import { KapabilitetEditor } from "@/components/KapabilitetEditor";
import { ProduktHeatmapView } from "@/components/ProduktHeatmapView";
import { ProduktkapabilitetEditor } from "@/components/ProduktkapabilitetEditor";
import { DigitaltProduktView } from "@/components/DigitaltProduktView";
import { DomainDashboard } from "@/components/DomainDashboard";
import { exportToExcel, exportToJSON, parseImportedJSON } from "@/lib/export";
import {
  LayoutDashboard, LayoutGrid, BarChart2, Download, RotateCcw, X, Search,
  Building2, Cpu, Package, Upload, FileSpreadsheet, FileJson,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem =
  | "kapabilitetsplan"
  | "domeneoversikt"
  | "forretning"
  | "kjernekapabiliteter"
  | "produktkapabiliteter"
  | "digitale-produkter";

type Visningsmodus = "nå" | "mål" | "gap";

const NAV_KEY = "sp-nav";

export default function KapabilitetsplanPage() {
  const {
    kapabiliteter, updateKapabilitet, resetToSeed, loadFromSnapshot,
    produktkapabiliteter, updateProduktkapabilitet,
    digitaleProdukter, updateDigitaltProdukt,
  } = useKapabilitetStore();

  const [nav, setNav] = useState<NavItem>("kapabilitetsplan");
  const [selected, setSelected] = useState<Kapabilitet | null>(null);
  const [selectedPK, setSelectedPK] = useState<Produktkapabilitet | null>(null);

  // Kjerne filters
  const [søk, setSøk] = useState("");
  const [filterDomene, setFilterDomene] = useState<DomeneId | "Alle">("Alle");
  const [filterTeamtype, setFilterTeamtype] = useState<Teamtype | "Alle">("Alle");
  const [filterVerdistrøm, setFilterVerdistrøm] = useState<Verdistrøm | "Alle">("Alle");
  const [filterKritikalitet, setFilterKritikalitet] = useState<"Alle" | "Høy" | "Middels" | "Lav">("Alle");
  const [filterKlassifisering, setFilterKlassifisering] = useState<Klassifisering | "Alle">("Alle");
  const [filterProsesstype, setFilterProsesstype] = useState<Prosesstype | "Alle">("Alle");
  const [visningsmodus, setVisningsmodus] = useState<Visningsmodus>("nå");

  // Produkt filters
  const [produktSøk, setProduktSøk] = useState("");
  const [filterProduktVS, setFilterProduktVS] = useState<ProduktVerdistrøm | "Alle">("Alle");
  const [produktVisningsmodus, setProduktVisningsmodus] = useState<Visningsmodus>("nå");

  useEffect(() => {
    try {
      const n = localStorage.getItem(NAV_KEY) as NavItem | null;
      if (n) setNav(n);
    } catch { /* ignore */ }
  }, []);

  function navigate(item: NavItem) {
    setNav(item);
    try { localStorage.setItem(NAV_KEY, item); } catch { /* ignore */ }
  }

  const fagligModus = nav === "kjernekapabiliteter";

  const filtrerteKapabiliteter = useMemo(() => {
    return kapabiliteter.filter((k) => {
      if (filterDomene !== "Alle" && k.domeneId !== filterDomene) return false;
      if (filterTeamtype !== "Alle" && k.teamtype !== filterTeamtype) return false;
      if (filterVerdistrøm !== "Alle" && k.verdistrøm !== filterVerdistrøm) return false;
      if (filterKritikalitet !== "Alle" && k.kritikalitet !== filterKritikalitet) return false;
      if (filterKlassifisering !== "Alle" && k.klassifisering !== filterKlassifisering) return false;
      if (filterProsesstype !== "Alle" && k.prosesstype !== filterProsesstype) return false;
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
  }, [kapabiliteter, filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering, filterProsesstype, søk]);

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

  const activeKjerneFilters = [filterDomene, filterTeamtype, filterVerdistrøm, filterKritikalitet, filterKlassifisering, filterProsesstype]
    .filter((f) => f !== "Alle").length + (søk ? 1 : 0);

  function clearKjerneFilters() {
    setSøk(""); setFilterDomene("Alle"); setFilterTeamtype("Alle");
    setFilterVerdistrøm("Alle"); setFilterKritikalitet("Alle");
    setFilterKlassifisering("Alle"); setFilterProsesstype("Alle");
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
  const pct = Math.round((vurdertCount / kapabiliteter.length) * 100);

  // ── Page title / breadcrumb per nav ────────────────────────────────────────
  const PAGE_META: Record<NavItem, { label: string; section: string }> = {
    "kapabilitetsplan":     { label: "Kapabilitetsplan",     section: "Oversikt" },
    "domeneoversikt":       { label: "Domeneoversikt",       section: "Oversikt" },
    "forretning":           { label: "Forretningsvisning",   section: "Kjernekapabiliteter" },
    "kjernekapabiliteter":  { label: "Kjernekapabiliteter",  section: "Kjernekapabiliteter" },
    "produktkapabiliteter": { label: "Produktkapabiliteter", section: "Kapabiliteter" },
    "digitale-produkter":   { label: "Digitale produkter",   section: "Kapabiliteter" },
  };
  const meta = PAGE_META[nav];

  const isKjerneHeatmap = nav === "forretning" || nav === "kjernekapabiliteter";

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col" style={{ backgroundColor: "#0f1f3d" }}>
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <img src="/sykehuspartner-logo-white.svg" alt="Sykehuspartner" className="h-8 w-auto mb-2" />
          <p className="text-[11px] font-medium" style={{ color: "#6cace4" }}>
            Teknologi og arkitekturstyring
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* OVERSIKT */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-bold tracking-widest text-white/30 uppercase">
              Oversikt
            </div>
            <NavBtn nav={nav} id="kapabilitetsplan" onClick={navigate} icon={<LayoutDashboard className="h-4 w-4" />}>
              Kapabilitetsplan
            </NavBtn>
            <NavBtn nav={nav} id="domeneoversikt" onClick={navigate} icon={<BarChart2 className="h-4 w-4" />}>
              Domeneoversikt
            </NavBtn>
          </div>

          {/* KJERNEKAPABILITETER */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-bold tracking-widest text-white/30 uppercase">
              Kjernekapabiliteter
            </div>
            <NavBtn nav={nav} id="forretning" onClick={navigate} icon={<Building2 className="h-4 w-4" />}>
              Forretning
            </NavBtn>
            <NavBtn nav={nav} id="kjernekapabiliteter" onClick={navigate} icon={<Cpu className="h-4 w-4" />}>
              Faglig (utvidet)
            </NavBtn>
          </div>

          {/* KAPABILITETER */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-bold tracking-widest text-white/30 uppercase">
              Produkter
            </div>
            <NavBtn nav={nav} id="produktkapabiliteter" onClick={navigate} icon={<LayoutGrid className="h-4 w-4" />}>
              Produktkapabiliteter
            </NavBtn>
            <NavBtn nav={nav} id="digitale-produkter" onClick={navigate} icon={<Package className="h-4 w-4" />}>
              Digitale produkter
            </NavBtn>
          </div>
        </nav>

        {/* Bottom: progress + export */}
        <div className="border-t border-white/10 px-4 py-4 space-y-3">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-white/50">
              <span>Vurdert</span>
              <span className="font-semibold" style={{ color: pct === 100 ? "#6cace4" : "white" }}>
                {pct}%
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: "#6cace4" }}
              />
            </div>
          </div>

          {/* Export buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <SidebarAction
              onClick={() => exportToExcel(kapabiliteter, produktkapabiliteter, digitaleProdukter)}
              icon={<FileSpreadsheet className="h-3.5 w-3.5" />}
              label="Excel"
            />
            <SidebarAction
              onClick={() => exportToJSON(kapabiliteter, produktkapabiliteter, digitaleProdukter)}
              icon={<FileJson className="h-3.5 w-3.5" />}
              label="JSON"
            />
            <label className="flex flex-col items-center gap-1 rounded-lg bg-white/8 hover:bg-white/15 px-2 py-2 cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5 text-white/60" />
              <span className="text-[10px] text-white/50 font-medium">Import</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-white/30 hover:text-white/60 hover:bg-white/8 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Tilbakestill data
          </button>

          {/* User info */}
          <div className="pt-1 border-t border-white/10">
            <div className="text-[10px] text-white/30 leading-relaxed">
              T&amp;A Arkitektur<br />
              sykehuspartner.no
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 mb-0.5">{meta.section}</div>
            <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
          </div>
          {pct === 100 && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full px-3 py-1">
              ✓ {vurdertCount} av {kapabiliteter.length} vurdert
            </span>
          )}
        </div>

        <div className="px-8 py-6">

          {/* ── Kapabilitetsplan (dashboard) ─────────────────────── */}
          {nav === "kapabilitetsplan" && (
            <DomainDashboard kapabiliteter={kapabiliteter} />
          )}

          {/* ── Domeneoversikt (charts) ──────────────────────────── */}
          {nav === "domeneoversikt" && (
            <StatistikkView kapabiliteter={kapabiliteter} />
          )}

          {/* ── Forretning / Kjernekapabiliteter (heatmap) ──────── */}
          {isKjerneHeatmap && (
            <>
              {/* Filter bar */}
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
                    <option value="Alle">{kapabiliteter.length} nivå 1 kapabiliteter</option>
                    {DOMENER.map((d) => <option key={d.id} value={d.id}>{d.ikon} {d.navn}</option>)}
                  </FilterSelect>
                  <FilterSelect value={filterVerdistrøm} onChange={(v) => setFilterVerdistrøm(v as Verdistrøm | "Alle")} label="Verdistrøm">
                    <option value="Alle">Alle verdistrømmer</option>
                    {VERDISTRØMMER.map((v) => <option key={v} value={v}>{v}</option>)}
                  </FilterSelect>
                  <FilterSelect value={filterProsesstype} onChange={(v) => setFilterProsesstype(v as Prosesstype | "Alle")} label="Prosess">
                    <option value="Alle">Alle prosesser</option>
                    <option value="Kjerne">Kjerne</option>
                    <option value="Styring">Styring</option>
                    <option value="Støtte">Støtte</option>
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
                        style={visningsmodus === m ? { backgroundColor: "#0f1f3d" } : {}}
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

              <HeatmapView
                kapabiliteter={filtrerteKapabiliteter}
                visningsmodus={visningsmodus}
                onSelectKapabilitet={setSelected}
                fagligModus={fagligModus}
              />

              {/* Legend */}
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
            </>
          )}

          {/* ── Produktkapabiliteter ─────────────────────────────── */}
          {nav === "produktkapabiliteter" && (
            <>
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
                        style={produktVisningsmodus === m ? { backgroundColor: "#0f1f3d" } : {}}
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
                fagligModus={false}
              />
            </>
          )}

          {/* ── Digitale produkter ───────────────────────────────── */}
          {nav === "digitale-produkter" && (
            <DigitaltProduktView
              digitaleProdukter={digitaleProdukter}
              kjernekapabiliteter={kapabiliteter}
              produktkapabiliteter={produktkapabiliteter}
              onUpdate={updateDigitaltProdukt}
            />
          )}
        </div>
      </main>

      {/* ── Editors ────────────────────────────────────────────────────────── */}
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

function NavBtn({ nav, id, onClick, icon, children }: {
  nav: NavItem; id: NavItem; onClick: (id: NavItem) => void;
  icon: React.ReactNode; children: React.ReactNode;
}) {
  const active = nav === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
        active
          ? "text-white bg-white/15"
          : "text-white/50 hover:text-white/80 hover:bg-white/8"
      )}
    >
      <span className={active ? "text-[#6cace4]" : ""}>{icon}</span>
      {children}
      {active && <span className="ml-auto w-1 h-1 rounded-full bg-[#6cace4]" />}
    </button>
  );
}

function SidebarAction({ onClick, icon, label }: {
  onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-lg bg-white/8 hover:bg-white/15 px-2 py-2 transition-colors"
    >
      <span className="text-white/60">{icon}</span>
      <span className="text-[10px] text-white/50 font-medium">{label}</span>
    </button>
  );
}

function FilterSelect({ value, onChange, label, children }: {
  value: string; onChange: (v: string) => void; label: string; children: React.ReactNode;
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
