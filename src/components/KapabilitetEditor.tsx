"use client";
import { useState } from "react";
import {
  Kapabilitet, ModenhetScore, Klassifisering, KLASSIFISERING_LABELS,
  DOMENER, Kritikalitet, samlettModenhet,
  PROSESS_SKALA, KOMPETANSE_SKALA, IT_SKALA, VIKTIGHET_SKALA,
} from "@/lib/types";
import { ModenhetPicker } from "./ModenhetCell";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type EditorTab = "score" | "dimensjoner" | "realisering" | "teknisk";

interface Props {
  kapabilitet: Kapabilitet | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Kapabilitet>) => void;
  fagligModus: boolean;
}

const KLASSIFISERING_STYLE: Record<Klassifisering, string> = {
  Behold: "bg-green-100 border-green-400 text-green-800",
  Endre: "bg-yellow-100 border-yellow-400 text-yellow-800",
  FaseUt: "bg-red-100 border-red-400 text-red-800",
  UtvikleNytt: "bg-blue-100 border-blue-400 text-blue-800",
  IkkeVurdert: "bg-gray-100 border-gray-300 text-gray-500",
};

const KRITIKALITET_STYLE: Record<Kritikalitet, string> = {
  Høy: "bg-red-100 border-red-400 text-red-800",
  Middels: "bg-yellow-100 border-yellow-400 text-yellow-800",
  Lav: "bg-green-100 border-green-400 text-green-700",
};

export function KapabilitetEditor({ kapabilitet, onClose, onSave, fagligModus }: Props) {
  const [form, setForm] = useState<Partial<Kapabilitet>>(kapabilitet ?? {});
  const [activeTab, setActiveTab] = useState<EditorTab>("score");

  if (!kapabilitet) return null;

  function set<K extends keyof Kapabilitet>(key: K, value: Kapabilitet[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(kapabilitet!.id, form);
    onClose();
  }

  const get = <K extends keyof Kapabilitet>(key: K): Kapabilitet[K] =>
    (form[key] ?? kapabilitet[key]) as Kapabilitet[K];

  const domene = DOMENER.find((d) => d.id === kapabilitet.domeneId);
  const modenhetNå = get("modenhetNå") as ModenhetScore;
  const modenhetMål = get("modenhetMål") as ModenhetScore;
  const gap = modenhetMål > 0 ? modenhetMål - modenhetNå : null;

  const it4itNavn = kapabilitet.realisering.it4itFunksjonellKomponent?.navn ?? kapabilitet.realisering.it4itKomponent;
  const it4itVerdistrøm = kapabilitet.realisering.it4itFunksjonellKomponent?.verdistrøm;
  const prosessRef = kapabilitet.realisering.prosessreferanse
    ? [
        kapabilitet.realisering.prosessreferanse.prosessnavn,
        kapabilitet.realisering.prosessreferanse.underprosess,
      ].filter(Boolean).join(" › ")
    : kapabilitet.realisering.prosessReferanse;

  const tabs: { id: EditorTab; label: string }[] = [
    { id: "score", label: "Score" },
    { id: "dimensjoner", label: "P | K | I" },
    ...(fagligModus ? [{ id: "realisering" as EditorTab, label: "Realisering" }] : []),
    ...(fagligModus ? [{ id: "teknisk" as EditorTab, label: "Teknisk ref." }] : []),
  ];

  const pki = samlettModenhet({
    modenhetProsess: get("modenhetProsess") as ModenhetScore | undefined,
    modenhetKompetanse: get("modenhetKompetanse") as ModenhetScore | undefined,
    modenhetIT: get("modenhetIT") as ModenhetScore | undefined,
  });
  const viktighetVal = get("strategiskViktighet") as number | undefined;
  const gapViktighet = pki && viktighetVal ? viktighetVal - pki : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{domene?.ikon}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{domene?.navn}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{kapabilitet.navn}</h2>
            {kapabilitet.beskrivelse && (
              <p className="text-sm text-gray-500 mt-1">{kapabilitet.beskrivelse}</p>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="px-6 pt-4 flex gap-1 border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
                  activeTab === t.id
                    ? "border-[#003087] text-[#003087]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-5 space-y-6">
          {/* Metadata chips — always visible */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: kapabilitet.verdistrøm, color: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: kapabilitet.teamtype, color: "bg-purple-50 text-purple-700 border-purple-200" },
              ...(fagligModus ? [
                { label: kapabilitet.prosesstype, color: "bg-gray-50 text-gray-600 border-gray-200" },
                {
                  label: kapabilitet.eierskap === "Kjerne" ? "Kjerne (SP mandat)" : "Produkt (HF/HSØ)",
                  color: kapabilitet.eierskap === "Kjerne" ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-pink-50 text-pink-700 border-pink-200",
                },
              ] : []),
            ].map((chip) => (
              <span key={chip.label} className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", chip.color)}>
                {chip.label}
              </span>
            ))}
          </div>

          {/* ── SCORE TAB ── */}
          {activeTab === "score" && (
            <>
              {/* Kritikalitet */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Kritikalitet</div>
                <div className="flex gap-2">
                  {(["Høy", "Middels", "Lav"] as Kritikalitet[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set("kritikalitet", k)}
                      className={cn(
                        "flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                        get("kritikalitet") === k
                          ? KRITIKALITET_STYLE[k]
                          : "border-gray-200 text-gray-400 hover:border-gray-300"
                      )}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modenhet */}
              <div className="grid grid-cols-1 gap-4">
                <ModenhetPicker label="Modenhet nå" value={modenhetNå} onChange={(v) => set("modenhetNå", v)} />
                <ModenhetPicker label="Modenhetsmål" value={modenhetMål} onChange={(v) => set("modenhetMål", v)} />
              </div>

              {/* Gap */}
              {gap !== null && (
                <div className={cn(
                  "rounded-xl p-3 text-sm flex items-center gap-3",
                  gap > 0 ? "bg-orange-50 border border-orange-200" :
                  gap === 0 ? "bg-green-50 border border-green-200" :
                  "bg-blue-50 border border-blue-200"
                )}>
                  <span className={cn("text-2xl font-bold",
                    gap > 0 ? "text-orange-600" : gap === 0 ? "text-green-600" : "text-blue-600"
                  )}>
                    {gap > 0 ? `+${gap}` : gap === 0 ? "✓" : gap}
                  </span>
                  <span className="text-gray-600">
                    {gap > 0 ? `${gap} nivå å klatre for å nå målet` :
                     gap === 0 ? "Mål allerede nådd!" :
                     "Mål er lavere enn dagens nivå"}
                  </span>
                </div>
              )}

              {/* Klassifisering */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Klassifisering</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(KLASSIFISERING_LABELS) as Klassifisering[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set("klassifisering", k)}
                      className={cn(
                        "py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center",
                        get("klassifisering") === k
                          ? KLASSIFISERING_STYLE[k]
                          : "border-gray-200 text-gray-400 hover:border-gray-300"
                      )}
                    >
                      {KLASSIFISERING_LABELS[k]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notater */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Notater</label>
                <textarea
                  rows={3}
                  value={get("notater")}
                  onChange={(e) => set("notater", e.target.value)}
                  placeholder="Workshopnotat, tiltak, kontekst..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Prioritet & Ansvarlig */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Prioritet (1 = høyest)</label>
                  <input
                    type="number"
                    min={1} max={99}
                    value={get("prioritet") ?? ""}
                    onChange={(e) => set("prioritet", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="—"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Ansvarlig</label>
                  <input
                    type="text"
                    value={get("ansvarlig") ?? ""}
                    onChange={(e) => set("ansvarlig", e.target.value || undefined)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Navn / rolle"
                  />
                </div>
              </div>

              {/* Workshop dato */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Workshop dato</label>
                <input
                  type="date"
                  value={get("workshopDato") ?? ""}
                  onChange={(e) => set("workshopDato", e.target.value || undefined)}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* ── DIMENSJONER TAB (P | K | I) ── */}
          {activeTab === "dimensjoner" && (
            <div className="space-y-5">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 leading-relaxed">
                <strong>Svakeste ledd-prinsippet:</strong> Samlet modenhet = minimum av de tre dimensjonene.
                Kombinasjonen peker på tiltakstype (prosessarbeid, kompetansestyring, eller produkt-/plattformveikart).
              </div>

              {/* Strategisk viktighet */}
              <DimSection
                label="Strategisk viktighet"
                emoji="⭐"
                value={viktighetVal as ModenhetScore | undefined}
                onChange={(v) => set("strategiskViktighet", v)}
                skala={VIKTIGHET_SKALA}
                color="amber"
              />

              {/* Prosess */}
              <DimSection
                label="Prosess (P)"
                emoji="📋"
                value={get("modenhetProsess") as ModenhetScore | undefined}
                onChange={(v) => set("modenhetProsess", v)}
                skala={PROSESS_SKALA}
                color="blue"
              />
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Begrunnelse / evidens — Prosess</label>
                <textarea rows={2} value={get("begrunnelseProsess") ?? ""} onChange={(e) => set("begrunnelseProsess", e.target.value || undefined)} placeholder="F.eks. «prosess ikke i Kvalitetsportalen»" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* Kompetanse */}
              <DimSection
                label="Kompetanse (K)"
                emoji="🧠"
                value={get("modenhetKompetanse") as ModenhetScore | undefined}
                onChange={(v) => set("modenhetKompetanse", v)}
                skala={KOMPETANSE_SKALA}
                color="violet"
              />
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Begrunnelse / evidens — Kompetanse</label>
                <textarea rows={2} value={get("begrunnelseKompetanse") ?? ""} onChange={(e) => set("begrunnelseKompetanse", e.target.value || undefined)} placeholder="F.eks. «kun én person kan X»" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* IT-produkt */}
              <DimSection
                label="IT-produkt (I)"
                emoji="💻"
                value={get("modenhetIT") as ModenhetScore | undefined}
                onChange={(v) => set("modenhetIT", v)}
                skala={IT_SKALA}
                color="emerald"
              />
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Begrunnelse / evidens — IT-produkt</label>
                <textarea rows={2} value={get("begrunnelseIT") ?? ""} onChange={(e) => set("begrunnelseIT", e.target.value || undefined)} placeholder="F.eks. «tre overlappende verktøy»" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* Samlet og gap */}
              {pki !== null && (
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">Samlet modenhet (MIN)</span>
                    <PKIChips p={get("modenhetProsess") as ModenhetScore | undefined} k={get("modenhetKompetanse") as ModenhetScore | undefined} i={get("modenhetIT") as ModenhetScore | undefined} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-3xl font-bold", pki >= 4 ? "text-emerald-600" : pki >= 3 ? "text-yellow-600" : "text-red-500")}>{pki}</span>
                    <span className="text-xs text-gray-500">av 5</span>
                    {gapViktighet !== null && (
                      <span className={cn("ml-auto text-sm font-bold px-3 py-1 rounded-xl", gapViktighet > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700")}>
                        Gap: {gapViktighet > 0 ? `+${gapViktighet}` : "✓"}
                      </span>
                    )}
                  </div>
                  {gapViktighet !== null && gapViktighet > 0 && (
                    <div className="text-xs text-gray-500">
                      {(() => {
                        const p = get("modenhetProsess") as ModenhetScore | undefined;
                        const k = get("modenhetKompetanse") as ModenhetScore | undefined;
                        const i = get("modenhetIT") as ModenhetScore | undefined;
                        if (p && k && i) {
                          if (p === pki && p < (k ?? 5) && p < (i ?? 5)) return "📋 Prosessen er svakeste ledd — prosessarbeid i verdistrømmen først";
                          if (k === pki && k < (p ?? 5) && k < (i ?? 5)) return "🧠 Kompetanse er svakeste ledd — tiltak via strategisk HRM";
                          if (i === pki) return "💻 IT-produkt er svakeste ledd — inn i produkt- og plattformveikart";
                        }
                        return "Prioriter svakeste dimensjon";
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Kapabilitetseier */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Kapabilitetseier</label>
                <input type="text" value={get("kapabilitetseier") ?? ""} onChange={(e) => set("kapabilitetseier", e.target.value || undefined)} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Navn / rolle" />
              </div>
            </div>
          )}

          {/* ── REALISERING TAB ── */}
          {activeTab === "realisering" && fagligModus && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Realisering (nivå 3)
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                {it4itNavn && <InfoRow label="IT4IT komponent" value={it4itNavn + (it4itVerdistrøm ? ` (${it4itVerdistrøm})` : "")} />}
                {prosessRef && <InfoRow label="Prosessreferanse" value={prosessRef} />}
                {kapabilitet.realisering.verktøy && kapabilitet.realisering.verktøy.length > 0 && (
                  <InfoRow label="Verktøy" value={kapabilitet.realisering.verktøy.join(", ")} />
                )}
                {kapabilitet.realisering.kompetansekrav && kapabilitet.realisering.kompetansekrav.length > 0 && (
                  <InfoRow label="Kompetansekrav" value={kapabilitet.realisering.kompetansekrav.join(", ")} />
                )}
                {kapabilitet.realisering.avhengigheter && kapabilitet.realisering.avhengigheter.length > 0 && (
                  <InfoRow label="Avhengigheter" value={kapabilitet.realisering.avhengigheter.join(", ")} />
                )}
              </div>
            </div>
          )}

          {/* ── TEKNISK REFERANSE TAB ── */}
          {activeTab === "teknisk" && fagligModus && (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#E8F4FC] border border-[#00A3E0]/30 p-4 text-sm text-gray-600">
                Kobling til Gartners Enterprise Technical Reference Architecture (mai 2025) og IT4IT v3 funksjonelle komponenter.
                Disse er ikke kapabiliteter i seg selv, men viser hvordan kapabiliteten understøttes teknisk.
              </div>

              {kapabilitet.gartnerKategori ? (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gartner ETRA</div>
                  <InfoRow label="Domene" value={kapabilitet.gartnerKategori.domene} />
                  <InfoRow label="Kategori" value={kapabilitet.gartnerKategori.kategori} />
                  {kapabilitet.gartnerKategori.subkategori && (
                    <InfoRow label="Subkategori" value={kapabilitet.gartnerKategori.subkategori} />
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">Ingen Gartner-tilknytning registrert.</div>
              )}

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">IT4IT v3</div>
                {it4itNavn ? (
                  <>
                    <InfoRow label="Funksjonell komponent" value={it4itNavn} />
                    {it4itVerdistrøm && <InfoRow label="Verdistrøm" value={it4itVerdistrøm} />}
                  </>
                ) : (
                  <div className="text-sm text-gray-400 italic">Ingen IT4IT-komponent registrert.</div>
                )}
              </div>

              {kapabilitet.realisering.verktøy && kapabilitet.realisering.verktøy.length > 0 && (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Verktøy</div>
                  <div className="flex flex-wrap gap-2">
                    {kapabilitet.realisering.verktøy.map((v) => (
                      <span key={v} className="text-xs px-2.5 py-1 rounded-full bg-[#003087] text-white font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl text-white py-2.5 text-sm font-semibold transition-colors"
              style={{ backgroundColor: "var(--sp-primary)" }}
            >
              Lagre
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 text-gray-600 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs text-gray-400 w-40 shrink-0 pt-0.5">{label}</span>
      <span className="text-gray-700 text-xs">{value}</span>
    </div>
  );
}

const DIM_COLORS: Record<string, { active: string; ring: string }> = {
  amber:   { active: "bg-amber-500 text-white border-amber-500",   ring: "ring-amber-300" },
  blue:    { active: "bg-blue-600 text-white border-blue-600",     ring: "ring-blue-300" },
  violet:  { active: "bg-violet-600 text-white border-violet-600", ring: "ring-violet-300" },
  emerald: { active: "bg-emerald-600 text-white border-emerald-600", ring: "ring-emerald-300" },
};

const SCORE_COLOR: Record<number, string> = {
  0: "bg-gray-100 text-gray-400 border-gray-200",
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-lime-100 text-lime-800 border-lime-200",
  5: "bg-green-200 text-green-900 border-green-300",
};

function DimSection({ label, emoji, value, onChange, skala, color }: {
  label: string; emoji: string; value: ModenhetScore | undefined; onChange: (v: ModenhetScore) => void; skala: Record<number, string>; color: string;
}) {
  const c = DIM_COLORS[color];
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        <span>{emoji}</span> {label}
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 as ModenhetScore : n as ModenhetScore)}
            title={skala[n]}
            className={cn(
              "flex-1 h-9 rounded-xl border-2 text-sm font-bold transition-all",
              value === n ? c.active : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {value !== undefined && value > 0 && (
        <div className="text-[11px] text-gray-400 italic">{skala[value]}</div>
      )}
    </div>
  );
}

export function PKIChips({ p, k, i }: { p?: ModenhetScore; k?: ModenhetScore; i?: ModenhetScore }) {
  const chips = [
    { label: "P", val: p, title: "Prosess" },
    { label: "K", val: k, title: "Kompetanse" },
    { label: "I", val: i, title: "IT-produkt" },
  ];
  if (!p && !k && !i) return null;
  return (
    <div className="flex gap-1">
      {chips.map(({ label, val, title }) => (
        <span
          key={label}
          title={`${title}: ${val ?? "—"}`}
          className={cn("inline-flex items-center justify-center w-7 h-6 rounded text-[10px] font-bold border", val ? SCORE_COLOR[val] : "bg-gray-50 text-gray-300 border-gray-200")}
        >
          {val ? val : "—"}
        </span>
      ))}
    </div>
  );
}
