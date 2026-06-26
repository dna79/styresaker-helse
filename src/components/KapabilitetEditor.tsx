"use client";
import { useState } from "react";
import {
  Kapabilitet, ModenhetScore, Klassifisering, KLASSIFISERING_LABELS,
  DOMENER, Kritikalitet,
} from "@/lib/types";
import { ModenhetPicker } from "./ModenhetCell";
import { cn } from "@/lib/utils";
import { X, ExternalLink } from "lucide-react";

interface Props {
  kapabilitet: Kapabilitet | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Kapabilitet>) => void;
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

export function KapabilitetEditor({ kapabilitet, onClose, onSave }: Props) {
  const [form, setForm] = useState<Partial<Kapabilitet>>(kapabilitet ?? {});

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
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: kapabilitet.verdistrøm, color: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: kapabilitet.teamtype, color: "bg-purple-50 text-purple-700 border-purple-200" },
              { label: kapabilitet.prosesstype, color: "bg-gray-50 text-gray-600 border-gray-200" },
              {
                label: kapabilitet.eierskap === "Kjerne" ? "Kjerne (SP mandat)" : "Produkt (HF/HSØ)",
                color: kapabilitet.eierskap === "Kjerne" ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-pink-50 text-pink-700 border-pink-200",
              },
            ].map((chip) => (
              <span key={chip.label} className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", chip.color)}>
                {chip.label}
              </span>
            ))}
          </div>

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
            <ModenhetPicker
              label="Modenhet nå"
              value={modenhetNå}
              onChange={(v) => set("modenhetNå", v)}
            />
            <ModenhetPicker
              label="Modenhetsmål"
              value={modenhetMål}
              onChange={(v) => set("modenhetMål", v)}
            />
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

          {/* Prioritet & Ansvarlig */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Prioritet (1 = høyest)</label>
              <input
                type="number"
                min={1}
                max={99}
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

          {/* Realisering (read-only + editable fields) */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Realisering (nivå 3)
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
              {kapabilitet.realisering.it4itKomponent && (
                <InfoRow label="IT4IT komponent" value={kapabilitet.realisering.it4itKomponent} />
              )}
              {kapabilitet.realisering.prosessReferanse && (
                <InfoRow label="Prosessreferanse" value={kapabilitet.realisering.prosessReferanse} />
              )}
              {kapabilitet.realisering.verktøy && kapabilitet.realisering.verktøy.length > 0 && (
                <InfoRow
                  label="Verktøy"
                  value={kapabilitet.realisering.verktøy.join(", ")}
                />
              )}
              {kapabilitet.realisering.kompetansekrav && kapabilitet.realisering.kompetansekrav.length > 0 && (
                <InfoRow
                  label="Kompetansekrav"
                  value={kapabilitet.realisering.kompetansekrav.join(", ")}
                />
              )}
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
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
      <span className="text-xs text-gray-400 w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-gray-700 text-xs">{value}</span>
    </div>
  );
}
