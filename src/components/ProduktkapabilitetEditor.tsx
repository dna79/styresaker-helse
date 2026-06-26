"use client";
import { useState } from "react";
import { Produktkapabilitet, Kritikalitet, DigitaltProdukt, Kapabilitet, DOMENER } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type EditorTab = "score" | "kobling";

const MODENHET_LABELS: Record<number, string> = {
  0: "Ikke vurdert", 1: "Ad hoc / Initial", 2: "Delvis definert",
  3: "Definert og dokumentert", 4: "Styrt og målt", 5: "Optimalisert",
};

const MODENHET_BG: Record<number, string> = {
  0: "bg-gray-100 text-gray-400 border-gray-200",
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-lime-100 text-lime-800 border-lime-200",
  5: "bg-green-200 text-green-900 border-green-300",
};

const KRITIKALITET_STYLE: Record<Kritikalitet, string> = {
  Høy: "bg-red-100 border-red-400 text-red-800",
  Middels: "bg-yellow-100 border-yellow-400 text-yellow-800",
  Lav: "bg-green-100 border-green-400 text-green-700",
};

const SP_ROLLE_OPTIONS: { value: Produktkapabilitet["spRolle"]; label: string; desc: string }[] = [
  { value: "Kartlegge", label: "Kartlegge", desc: "Forstå markedet og sykehusenes behov" },
  { value: "Pådriver", label: "Pådriver", desc: "Drive endring hos HF/HSØ" },
  { value: "Støtte", label: "Støtte", desc: "Understøtte med digitale produkter" },
  { value: "IkkeVurdert", label: "Ikke vurdert", desc: "" },
];

interface Props {
  kapabilitet: Produktkapabilitet | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Produktkapabilitet>) => void;
  digitaleProdukter: DigitaltProdukt[];
  kjernekapabiliteter: Kapabilitet[];
}

export function ProduktkapabilitetEditor({
  kapabilitet, onClose, onSave, digitaleProdukter, kjernekapabiliteter,
}: Props) {
  const [form, setForm] = useState<Partial<Produktkapabilitet>>(kapabilitet ?? {});
  const [activeTab, setActiveTab] = useState<EditorTab>("score");

  if (!kapabilitet) return null;

  function set<K extends keyof Produktkapabilitet>(key: K, value: Produktkapabilitet[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function get<K extends keyof Produktkapabilitet>(key: K): Produktkapabilitet[K] {
    return (form[key] ?? kapabilitet![key]) as Produktkapabilitet[K];
  }

  function handleSave() {
    onSave(kapabilitet!.id, form);
    onClose();
  }

  const nå = get("modenhetNå") as number;
  const mål = get("modenhetMål") as number;
  const gap = mål > 0 ? mål - nå : null;

  // Kobling: find which digital products reference this produktkapabilitet
  const koblede = digitaleProdukter.filter((dp) =>
    dp.produktkapabilitetIder.includes(kapabilitet.id)
  );

  const domene = DOMENER.find((d) => d.id === kapabilitet.domeneId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                {kapabilitet.verdistrøm}
              </span>
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
        <div className="px-6 pt-4 flex gap-1 border-b border-gray-100">
          {(["score", "kobling"] as EditorTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors capitalize",
                activeTab === t
                  ? "border-[#003087] text-[#003087]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {t === "score" ? "Score" : "Kobling"}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-blue-50 text-blue-700 border-blue-200">
              {kapabilitet.verdistrøm}
            </span>
            {domene && (
              <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-gray-50 text-gray-600 border-gray-200">
                {domene.ikon} {domene.navn}
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-purple-50 text-purple-700 border-purple-200">
              HF/HSØ-eierskap
            </span>
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

              {/* Modenhet nå */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Modenhet nå (sykehusenes evne)</div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("modenhetNå", v)}
                      className={cn(
                        "flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all",
                        nå === v
                          ? cn(MODENHET_BG[v], "border-current scale-105")
                          : "border-gray-200 text-gray-400 hover:border-gray-300"
                      )}
                    >
                      {v === 0 ? "—" : v}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">{MODENHET_LABELS[nå]}</div>
              </div>

              {/* Modenhetsmål */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Modenhetsmål</div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("modenhetMål", v)}
                      className={cn(
                        "flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all",
                        mål === v
                          ? cn(MODENHET_BG[v], "border-current scale-105")
                          : "border-gray-200 text-gray-400 hover:border-gray-300"
                      )}
                    >
                      {v === 0 ? "—" : v}
                    </button>
                  ))}
                </div>
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
                     gap === 0 ? "Mål allerede nådd!" : "Mål er lavere enn dagens nivå"}
                  </span>
                </div>
              )}

              {/* SP-rolle */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Sykehuspartners rolle</div>
                <div className="grid grid-cols-2 gap-2">
                  {SP_ROLLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("spRolle", opt.value)}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2.5 text-left transition-all",
                        get("spRolle") === opt.value
                          ? "border-[#003087] bg-[#E8F4FC]"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className={cn(
                        "text-xs font-semibold",
                        get("spRolle") === opt.value ? "text-[#003087]" : "text-gray-600"
                      )}>
                        {opt.label}
                      </div>
                      {opt.desc && (
                        <div className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</div>
                      )}
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
                  placeholder="Kontekst, avhengigheter, tiltak..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </>
          )}

          {/* ── KOBLING TAB ── */}
          {activeTab === "kobling" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#E8F4FC] border border-[#00A3E0]/30 p-4 text-sm text-gray-600">
                Viser hvilke digitale produkter som understøtter denne produktkapabiliteten, og hvilke
                kjernekapabiliteter disse krever. Redigeres i Digital produkt-visningen.
              </div>

              {koblede.length === 0 ? (
                <div className="text-sm text-gray-400 italic py-4 text-center">
                  Ingen digitale produkter er koblet til denne kapabiliteten ennå.
                </div>
              ) : (
                koblede.map((dp) => {
                  const kjerneKaps = kjernekapabiliteter.filter((k) =>
                    dp.kjernekapabilitetIder.includes(k.id)
                  );
                  return (
                    <div key={dp.id} className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{dp.navn}</div>
                          <div className="text-[11px] text-gray-400">{dp.produktområde}</div>
                        </div>
                        <StatusBadge status={dp.status} />
                      </div>
                      {kjerneKaps.length > 0 && (
                        <div className="px-4 py-3 space-y-2">
                          <div className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">
                            Krever kjernekapabiliteter
                          </div>
                          {kjerneKaps.map((k) => {
                            const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : null;
                            return (
                              <div key={k.id} className="flex items-center gap-3">
                                <div className="flex-1 text-sm text-gray-700">{k.navn}</div>
                                {gap !== null && gap > 1 && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                    Gap: +{gap}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Idé":               "bg-gray-100 text-gray-600",
    "Under utvikling":   "bg-blue-100 text-blue-700",
    "I produksjon":      "bg-green-100 text-green-700",
    "Avviklet":          "bg-red-100 text-red-600",
  };
  return (
    <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-semibold", styles[status] ?? "bg-gray-100 text-gray-600")}>
      {status}
    </span>
  );
}
