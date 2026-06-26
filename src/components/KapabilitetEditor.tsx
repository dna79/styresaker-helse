"use client";
import { useState } from "react";
import { Kapabilitet, MODENHET_LABELS, KLASSIFISERING_LABELS, Klassifisering } from "@/lib/types";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Select } from "./ui/select";

interface Props {
  kapabilitet: Kapabilitet | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Kapabilitet>) => void;
}

const KRITIKALITET_COLORS: Record<string, string> = {
  Høy: "text-red-600",
  Middels: "text-yellow-600",
  Lav: "text-green-600",
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

  return (
    <Dialog open={!!kapabilitet} onClose={onClose} title={kapabilitet.navn}>
      <div className="space-y-5">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Verdistrøm</div>
            <div className="font-medium">{kapabilitet.verdistrøm}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Teamtype</div>
            <div className="font-medium">{kapabilitet.teamtype}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Prosesstype</div>
            <div className="font-medium">{kapabilitet.prosesstype}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Eierskap</div>
            <div className="font-medium">{kapabilitet.eierskap === "Kjerne" ? "Kjerne (Sykehuspartner)" : "Produkt (HF/HSØ)"}</div>
          </div>
        </div>

        {/* Kritikalitet */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Kritikalitet</label>
          <div className="flex gap-2">
            {(["Høy", "Middels", "Lav"] as const).map((k) => (
              <button
                key={k}
                onClick={() => set("kritikalitet", k)}
                className={`flex-1 rounded-md py-2 text-sm font-medium border transition-colors ${
                  (form.kritikalitet ?? kapabilitet.kritikalitet) === k
                    ? k === "Høy" ? "bg-red-100 border-red-400 text-red-700" : k === "Middels" ? "bg-yellow-100 border-yellow-400 text-yellow-700" : "bg-green-100 border-green-400 text-green-700"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Modenhet nå */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Modenhet nå</label>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => set("modenhetNå", v as Kapabilitet["modenhetNå"])}
                title={MODENHET_LABELS[v]}
                className={`flex-1 rounded-md py-2.5 text-sm font-bold border transition-colors ${
                  (form.modenhetNå ?? kapabilitet.modenhetNå) === v
                    ? v === 0 ? "bg-gray-200 border-gray-400 text-gray-700" :
                      v === 1 ? "bg-red-200 border-red-400 text-red-800" :
                      v === 2 ? "bg-orange-200 border-orange-400 text-orange-800" :
                      v === 3 ? "bg-yellow-200 border-yellow-400 text-yellow-800" :
                      v === 4 ? "bg-lime-200 border-lime-400 text-lime-800" :
                      "bg-green-300 border-green-500 text-green-900"
                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {v === 0 ? "—" : v}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {MODENHET_LABELS[form.modenhetNå ?? kapabilitet.modenhetNå]}
          </div>
        </div>

        {/* Modenhetsmål */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Modenhetsmål</label>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => set("modenhetMål", v as Kapabilitet["modenhetMål"])}
                title={v === 0 ? "Ikke satt" : MODENHET_LABELS[v]}
                className={`flex-1 rounded-md py-2.5 text-sm font-bold border transition-colors ${
                  (form.modenhetMål ?? kapabilitet.modenhetMål) === v
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {v === 0 ? "—" : v}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(form.modenhetMål ?? kapabilitet.modenhetMål) === 0
              ? "Ikke satt"
              : MODENHET_LABELS[form.modenhetMål ?? kapabilitet.modenhetMål]}
          </div>
        </div>

        {/* Gap indicator */}
        {(form.modenhetMål ?? kapabilitet.modenhetMål) > 0 && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
            <span className="font-medium text-blue-700">Gap: </span>
            <span className="text-blue-600">
              {(form.modenhetMål ?? kapabilitet.modenhetMål) - (form.modenhetNå ?? kapabilitet.modenhetNå)} nivåer
            </span>
          </div>
        )}

        {/* Klassifisering */}
        <div>
          <Select
            label="Klassifisering"
            value={form.klassifisering ?? kapabilitet.klassifisering}
            onChange={(e) => set("klassifisering", e.target.value as Klassifisering)}
          >
            {(Object.entries(KLASSIFISERING_LABELS) as [Klassifisering, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>

        {/* IT4IT */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">IT4IT komponent (valgfri)</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.it4itKomponent ?? kapabilitet.it4itKomponent ?? ""}
            onChange={(e) => set("it4itKomponent", e.target.value)}
            placeholder="f.eks. Service Portfolio Management"
          />
        </div>

        {/* Notater */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Notater</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            value={form.notater ?? kapabilitet.notater}
            onChange={(e) => set("notater", e.target.value)}
            placeholder="Notater fra workshop, tiltak, ansvarlig..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button className="flex-1" onClick={handleSave}>Lagre</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Avbryt</Button>
        </div>
      </div>
    </Dialog>
  );
}
