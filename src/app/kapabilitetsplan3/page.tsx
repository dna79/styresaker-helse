"use client";
import { useState, useEffect } from "react";
import { useKapabilitetStore } from "@/lib/store";
import { Kapabilitet, Produktkapabilitet } from "@/lib/types";
import { KapabilitetEditor } from "@/components/KapabilitetEditor";
import { ProduktkapabilitetEditor } from "@/components/ProduktkapabilitetEditor";
import { OmradesStyrerView } from "@/components/rolle/OmradesStyrerView";
import { VirksomhetsdirektørView } from "@/components/rolle/VirksomhetsdirektørView";
import { OmradeLederView } from "@/components/rolle/OmradeLederView";
import { ProduktlederView } from "@/components/rolle/ProduktlederView";
import { ArkitektView } from "@/components/rolle/ArkitektView";
import { cn } from "@/lib/utils";

type Rolle = "velg" | "omradestyrer" | "virksomhetsdirektor" | "omradeleder" | "produktleder" | "arkitekt";

const ROLLE_KEY = "sp-rolle-v1";

interface RolleConfig {
  id: Rolle;
  tittel: string;
  ikon: string;
  beskrivelse: string;
  fokus: string[];
  accent: string;
  accentText: string;
}

const ROLLER: RolleConfig[] = [
  {
    id: "omradestyrer",
    tittel: "Områdestyrer",
    ikon: "🏛️",
    beskrivelse: "Overordnet governance og strategisk beslutningsgrunnlag",
    fokus: ["Domenestatus og gap", "Kritiske kapabiliteter", "Modenhetsoversikt"],
    accent: "#0f1f3d",
    accentText: "#6cace4",
  },
  {
    id: "virksomhetsdirektor",
    tittel: "Virksomhetsdirektør",
    ikon: "📊",
    beskrivelse: "Investeringsprioritering, porteføljestyring og forretningsstrategi",
    fokus: ["Klassifisering og beslutning", "Investeringsretning", "Gap-prioritering"],
    accent: "#1d4ed8",
    accentText: "#bfdbfe",
  },
  {
    id: "omradeleder",
    tittel: "Områdeleder",
    ikon: "🗂️",
    beskrivelse: "Detaljert status og modenhetsvurdering for eget ansvarsdomene",
    fokus: ["Domenevalg og status", "Kapabilitetoversikt", "Modenhet og gap"],
    accent: "#7c3aed",
    accentText: "#ede9fe",
  },
  {
    id: "produktleder",
    tittel: "Produktleder",
    ikon: "📦",
    beskrivelse: "Produktportefølje, digitale produkter og SP-rolleavklaring",
    fokus: ["Produktkapabiliteter", "Digitale produkter", "SP-rolle per kapabilitet"],
    accent: "#059669",
    accentText: "#d1fae5",
  },
  {
    id: "arkitekt",
    tittel: "Arkitekt",
    ikon: "🔧",
    beskrivelse: "Full faglig dybde med IT4IT-mapping og prosesslandskap",
    fokus: ["Faglig kapabilitetsvisning", "IT4IT v3 prosesslandskap", "Statistikk og analyser"],
    accent: "#b91c1c",
    accentText: "#fee2e2",
  },
];

const PAGE_META: Record<Rolle, { label: string; section: string }> = {
  velg:                  { label: "Velg din rolle",       section: "Rollebasert visning" },
  omradestyrer:          { label: "Områdestyrer",         section: "Governance" },
  virksomhetsdirektor:   { label: "Virksomhetsdirektør",  section: "Strategi og investering" },
  omradeleder:           { label: "Områdeleder",          section: "Domeneansvar" },
  produktleder:          { label: "Produktleder",         section: "Produktportefølje" },
  arkitekt:              { label: "Arkitekt",             section: "Teknisk arkitektur" },
};

export default function Kapabilitetsplan3Page() {
  const {
    kapabiliteter, updateKapabilitet,
    produktkapabiliteter, updateProduktkapabilitet,
    digitaleProdukter, updateDigitaltProdukt,
  } = useKapabilitetStore();

  const [rolle, setRolle] = useState<Rolle>("velg");
  const [selected, setSelected] = useState<Kapabilitet | null>(null);
  const [selectedPK, setSelectedPK] = useState<Produktkapabilitet | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem(ROLLE_KEY) as Rolle | null;
      if (r && r !== "velg") setRolle(r);
    } catch { /* ignore */ }
  }, []);

  function velgRolle(r: Rolle) {
    setRolle(r);
    try { localStorage.setItem(ROLLE_KEY, r); } catch { /* ignore */ }
  }

  const meta = PAGE_META[rolle];
  const aktivRolle = ROLLER.find((r) => r.id === rolle);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col" style={{ backgroundColor: "#0f1f3d" }}>
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <img src="/sykehuspartner-logo-white.svg" alt="Sykehuspartner" className="h-8 w-auto mb-2" />
          <p className="text-[11px] font-medium" style={{ color: "#6cace4" }}>Rollebasert kapabilitetsvisning</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 mb-3 text-[10px] font-bold tracking-widest text-white/30 uppercase">Din rolle</div>

          <button
            onClick={() => velgRolle("velg")}
            className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left mb-2",
              rolle === "velg" ? "bg-white/15 text-white" : "text-white/40 hover:text-white/60 hover:bg-white/8"
            )}
          >
            <span className="text-base">👤</span>
            <span>Velg rolle</span>
            {rolle === "velg" && <span className="ml-auto w-1 h-1 rounded-full bg-[#6cace4]" />}
          </button>

          <div className="h-px bg-white/10 my-2" />

          {ROLLER.map((r) => {
            const active = rolle === r.id;
            return (
              <button
                key={r.id}
                onClick={() => velgRolle(r.id)}
                className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                  active ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/8"
                )}
              >
                <span className="text-base w-6 text-center">{r.ikon}</span>
                <span className="flex-1 text-left">{r.tittel}</span>
                {active && <span className="w-1 h-1 rounded-full bg-[#6cace4]" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          {aktivRolle ? (
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
              <div className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1.5">Fokusområder</div>
              {aktivRolle.fokus.map((f) => (
                <div key={f} className="text-[11px] text-white/50 flex items-center gap-1.5 py-0.5">
                  <span style={{ color: "#6cace4" }}>·</span> {f}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-white/30 leading-relaxed">
              T&A Arkitektur<br />sykehuspartner.no
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400 mb-0.5">{meta.section}</div>
            <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
          </div>
          {aktivRolle && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: aktivRolle.accent }}>
              <span>{aktivRolle.ikon}</span> {aktivRolle.tittel}
            </span>
          )}
        </div>

        <div className="px-8 py-6">
          {/* ── Rolle-velger ──────────────────────────────────────────── */}
          {rolle === "velg" && (
            <div className="space-y-6 max-w-4xl">
              <div className="text-gray-600 text-sm leading-relaxed">
                Velg din rolle for en visning tilpasset dine interesseområder og arbeidsoppgaver. Du kan bytte rolle når som helst i sidemenyen.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROLLER.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => velgRolle(r.id)}
                    className="group text-left bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{r.ikon}</span>
                      <div>
                        <div className="font-bold text-gray-900 text-base">{r.tittel}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{r.beskrivelse}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {r.fokus.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: r.accent }} />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: r.accent }}>
                      Åpne visning →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Rolle-spesifikke visninger ─────────────────────────── */}
          {rolle === "omradestyrer" && (
            <OmradesStyrerView kapabiliteter={kapabiliteter} />
          )}

          {rolle === "virksomhetsdirektor" && (
            <VirksomhetsdirektørView kapabiliteter={kapabiliteter} />
          )}

          {rolle === "omradeleder" && (
            <OmradeLederView kapabiliteter={kapabiliteter} />
          )}

          {rolle === "produktleder" && (
            <ProduktlederView
              produktkapabiliteter={produktkapabiliteter}
              digitaleProdukter={digitaleProdukter}
            />
          )}

          {rolle === "arkitekt" && (
            <ArkitektView
              kapabiliteter={kapabiliteter}
              onSelectKapabilitet={setSelected}
            />
          )}
        </div>
      </main>

      {/* ── Editors ────────────────────────────────────────────────────── */}
      <KapabilitetEditor
        kapabilitet={selected}
        onClose={() => setSelected(null)}
        onSave={updateKapabilitet}
        fagligModus={true}
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
