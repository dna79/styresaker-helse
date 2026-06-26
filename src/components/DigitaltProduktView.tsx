"use client";
import { useState } from "react";
import {
  DigitaltProdukt, Kapabilitet, Produktkapabilitet,
  ProduktOmråde, ProduktStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { X, AlertTriangle, Link2 } from "lucide-react";

type PanelTab = "oversikt" | "produktkapabiliteter" | "kjernekapabiliteter" | "risiko";

interface Props {
  digitaleProdukter: DigitaltProdukt[];
  kjernekapabiliteter: Kapabilitet[];
  produktkapabiliteter: Produktkapabilitet[];
  onUpdate: (id: string, updates: Partial<DigitaltProdukt>) => void;
}

const STATUS_STYLE: Record<ProduktStatus, string> = {
  "Idé":              "bg-gray-100 text-gray-600",
  "Under utvikling":  "bg-blue-100 text-blue-700",
  "I produksjon":     "bg-green-100 text-green-700",
  "Avviklet":         "bg-red-100 text-red-600",
};

const OMRÅDE_STYLE: Record<ProduktOmråde, string> = {
  "Administrative produkter":                     "bg-amber-50 border-amber-200",
  "Kliniske produkter":                           "bg-blue-50 border-blue-200",
  "IKT-Produkter":                                "bg-purple-50 border-purple-200",
  "Produkter for bruker og datadrevet utvikling": "bg-teal-50 border-teal-200",
};

const MODENHET_BG: Record<number, string> = {
  0: "bg-gray-100 text-gray-400 border-gray-200",
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-lime-100 text-lime-800 border-lime-200",
  5: "bg-green-200 text-green-900 border-green-300",
};

export function DigitaltProduktView({ digitaleProdukter, kjernekapabiliteter, produktkapabiliteter, onUpdate }: Props) {
  const [selected, setSelected] = useState<DigitaltProdukt | null>(null);

  // Group by produktområde
  const grupper: ProduktOmråde[] = [
    "Kliniske produkter",
    "Administrative produkter",
    "IKT-Produkter",
    "Produkter for bruker og datadrevet utvikling",
  ];

  return (
    <div>
      {/* Card grid */}
      {grupper.map((gruppe) => {
        const produkter = digitaleProdukter.filter((dp) => dp.produktområde === gruppe);
        if (produkter.length === 0) return null;
        return (
          <div key={gruppe} className="mb-8">
            <h3 className="font-bold text-gray-700 text-sm mb-3 px-1">{gruppe}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produkter.map((dp) => (
                <ProduktKort
                  key={dp.id}
                  produkt={dp}
                  kjernekapabiliteter={kjernekapabiliteter}
                  produktkapabiliteter={produktkapabiliteter}
                  onClick={() => setSelected(dp)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Side panel */}
      {selected && (
        <ProduktPanel
          produkt={selected}
          kjernekapabiliteter={kjernekapabiliteter}
          produktkapabiliteter={produktkapabiliteter}
          alleProdukter={digitaleProdukter}
          onClose={() => setSelected(null)}
          onSave={(updates) => {
            onUpdate(selected.id, updates);
            setSelected((prev) => prev ? { ...prev, ...updates } : null);
          }}
        />
      )}
    </div>
  );
}

function ProduktKort({ produkt, kjernekapabiliteter, produktkapabiliteter, onClick }: {
  produkt: DigitaltProdukt;
  kjernekapabiliteter: Kapabilitet[];
  produktkapabiliteter: Produktkapabilitet[];
  onClick: () => void;
}) {
  const kjerne = kjernekapabiliteter.filter((k) => produkt.kjernekapabilitetIder.includes(k.id));
  const kritiskeGap = kjerne.filter((k) => {
    const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : 0;
    return gap >= 2;
  });
  const pkNavn = produktkapabiliteter
    .filter((pk) => produkt.produktkapabilitetIder.includes(pk.id))
    .map((pk) => pk.navn);

  const borderstyle = OMRÅDE_STYLE[produkt.produktområde] ?? "bg-white border-gray-200";

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all group",
        borderstyle
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#003087] transition-colors">
            {produkt.navn}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{produkt.beskrivelse}</p>
        </div>
        <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2", STATUS_STYLE[produkt.status])}>
          {produkt.status}
        </span>
      </div>

      {pkNavn.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Understøtter</div>
          <div className="flex flex-wrap gap-1">
            {pkNavn.slice(0, 3).map((navn) => (
              <span key={navn} className="text-[11px] px-2 py-0.5 bg-white/80 border border-gray-200 rounded-full text-gray-600">
                {navn.length > 30 ? navn.substring(0, 30) + "…" : navn}
              </span>
            ))}
            {pkNavn.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 bg-white/80 border border-gray-200 rounded-full text-gray-400">
                +{pkNavn.length - 3} til
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-[11px] text-gray-400">
          <Link2 className="inline h-3 w-3 mr-1" />
          {kjerne.length} kjernekapabiliteter
        </div>
        {kritiskeGap.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            {kritiskeGap.length} kritisk gap
          </div>
        )}
      </div>
      {produkt.notater && (
        <div className="mt-2 text-[11px] text-blue-500 truncate">📝 {produkt.notater}</div>
      )}
    </div>
  );
}

function ProduktPanel({ produkt, kjernekapabiliteter, produktkapabiliteter, alleProdukter, onClose, onSave }: {
  produkt: DigitaltProdukt;
  kjernekapabiliteter: Kapabilitet[];
  produktkapabiliteter: Produktkapabilitet[];
  alleProdukter: DigitaltProdukt[];
  onClose: () => void;
  onSave: (updates: Partial<DigitaltProdukt>) => void;
}) {
  const [form, setForm] = useState<Partial<DigitaltProdukt>>(produkt);
  const [activeTab, setActiveTab] = useState<PanelTab>("oversikt");

  function get<K extends keyof DigitaltProdukt>(key: K): DigitaltProdukt[K] {
    return (form[key] ?? produkt[key]) as DigitaltProdukt[K];
  }

  const pkIds = get("produktkapabilitetIder") as string[];
  const kIds = get("kjernekapabilitetIder") as string[];

  function togglePK(id: string) {
    const curr = pkIds;
    setForm((f) => ({
      ...f,
      produktkapabilitetIder: curr.includes(id)
        ? curr.filter((x) => x !== id)
        : [...curr, id],
    }));
  }

  function toggleKjerne(id: string) {
    const curr = kIds;
    setForm((f) => ({
      ...f,
      kjernekapabilitetIder: curr.includes(id)
        ? curr.filter((x) => x !== id)
        : [...curr, id],
    }));
  }

  const kjerne = kjernekapabiliteter.filter((k) => kIds.includes(k.id));
  const risikoGap = kjerne.filter((k) => {
    const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : (k.modenhetNå === 0 ? 0 : 0);
    return k.modenhetMål > 0 && (k.modenhetMål - k.modenhetNå) >= 2;
  });

  const tabs: { id: PanelTab; label: string }[] = [
    { id: "oversikt", label: "Oversikt" },
    { id: "produktkapabiliteter", label: "Produktkapabiliteter" },
    { id: "kjernekapabiliteter", label: "Kjernekapabiliteter" },
    { id: "risiko", label: "Risikobilde" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{produkt.produktområde}</div>
            <h2 className="text-lg font-bold text-gray-900">{produkt.navn}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{produkt.beskrivelse}</p>
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-1 border-b border-gray-100 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap",
                activeTab === t.id
                  ? "border-[#003087] text-[#003087]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
              {t.id === "risiko" && risikoGap.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {risikoGap.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── OVERSIKT ── */}
          {activeTab === "oversikt" && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {(["Idé", "Under utvikling", "I produksjon", "Avviklet"] as ProduktStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all",
                        get("status") === s
                          ? STATUS_STYLE[s] + " border-current"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Notater</label>
                <textarea
                  rows={4}
                  value={get("notater")}
                  onChange={(e) => setForm((f) => ({ ...f, notater: e.target.value }))}
                  placeholder="Kontekst, avhengigheter, beslutninger..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </>
          )}

          {/* ── PRODUKTKAPABILITETER ── */}
          {activeTab === "produktkapabiliteter" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Velg hvilke produktkapabiliteter dette produktet understøtter.</p>
              {produktkapabiliteter.map((pk) => {
                const checked = pkIds.includes(pk.id);
                return (
                  <button
                    key={pk.id}
                    type="button"
                    onClick={() => togglePK(pk.id)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                      checked
                        ? "border-[#003087] bg-[#E8F4FC]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className={cn("text-sm font-medium", checked ? "text-[#003087]" : "text-gray-700")}>
                      {pk.navn}
                    </div>
                    <div className="text-[11px] text-gray-400">{pk.verdistrøm}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── KJERNEKAPABILITETER ── */}
          {activeTab === "kjernekapabiliteter" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Velg hvilke kjernekapabiliteter som kreves for å realisere dette produktet.</p>
              {kjernekapabiliteter.map((k) => {
                const checked = kIds.includes(k.id);
                const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : null;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => toggleKjerne(k.id)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                      checked
                        ? "border-[#003087] bg-[#E8F4FC]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("text-sm font-medium", checked ? "text-[#003087]" : "text-gray-700")}>
                        {k.navn}
                      </div>
                      {gap !== null && gap >= 2 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold ml-2">
                          Gap +{gap}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">{k.verdistrøm}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── RISIKOBILDE ── */}
          {activeTab === "risiko" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#E8F4FC] border border-[#00A3E0]/30 p-4 text-sm text-gray-600">
                Automatisk beregnet risikovurdering basert på kjernekapabiliteter med gap ≥ 2 koblet til dette produktet.
              </div>
              {risikoGap.length === 0 ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
                  <div className="text-green-600 font-semibold text-sm">Ingen kritiske gap identifisert</div>
                  <div className="text-xs text-green-500 mt-1">
                    Kjernekapabiliteter med gap &lt; 2, eller der modenhetsmål ikke er satt
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                    Følgende kjernekapabiliteter har gap ≥ 2 og kan påvirke leveransen av dette produktet:
                  </div>
                  <div className="space-y-2">
                    {risikoGap.map((k) => {
                      const gap = k.modenhetMål - k.modenhetNå;
                      return (
                        <div key={k.id} className="rounded-xl border border-red-200 bg-white px-4 py-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm text-gray-800">{k.navn}</div>
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "inline-flex items-center justify-center w-8 h-7 rounded-lg border text-xs font-bold",
                                MODENHET_BG[k.modenhetNå] ?? MODENHET_BG[0]
                              )}>
                                {k.modenhetNå || "—"}
                              </div>
                              <span className="text-red-600 font-bold text-sm">+{gap}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <span>{k.verdistrøm}</span>
                            <span>·</span>
                            <span>{k.klassifisering}</span>
                            {(k.realisering.gapÅrsak && k.realisering.gapÅrsak !== "IkkeVurdert") && (
                              <>
                                <span>·</span>
                                <span>{k.realisering.gapÅrsak}</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { onSave(form); onClose(); }}
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
