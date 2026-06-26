import * as XLSX from "xlsx";
import { Kapabilitet, MODENHET_LABELS, KLASSIFISERING_LABELS, DOMENER, Produktkapabilitet, DigitaltProdukt } from "./types";

const domeneNavn = (id: string) => DOMENER.find((d) => d.id === id)?.navn ?? id;

function toRow(k: Kapabilitet) {
  const gap = k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : "";
  return {
    ID: k.id,
    Domene: domeneNavn(k.domeneId),
    Kapabilitet: k.navn,
    Beskrivelse: k.beskrivelse ?? "",
    Verdistrøm: k.verdistrøm,
    Teamtype: k.teamtype,
    Prosesstype: k.prosesstype,
    Eierskap: k.eierskap,
    Kritikalitet: k.kritikalitet,
    Klassifisering: KLASSIFISERING_LABELS[k.klassifisering],
    "Modenhet nå (0-5)": k.modenhetNå,
    "Modenhet nå": MODENHET_LABELS[k.modenhetNå],
    "Modenhetsmål (0-5)": k.modenhetMål,
    "Modenhetsmål": k.modenhetMål === 0 ? "Ikke satt" : MODENHET_LABELS[k.modenhetMål],
    "Gap": gap,
    Prioritet: k.prioritet ?? "",
    Ansvarlig: k.ansvarlig ?? "",
    "IT4IT komponent": k.realisering.it4itKomponent ?? "",
    Prosessreferanse: k.realisering.prosessReferanse ?? "",
    Verktøy: k.realisering.verktøy?.join(", ") ?? "",
    Kompetansekrav: k.realisering.kompetansekrav?.join(", ") ?? "",
    Avhengigheter: k.realisering.avhengigheter?.join(", ") ?? "",
    Notater: k.notater,
    "Workshop dato": k.workshopDato ?? "",
  };
}

function autoWidth(sheet: XLSX.WorkSheet, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  sheet["!cols"] = cols.map((col) => ({
    wch: Math.min(
      50,
      Math.max(
        col.length + 2,
        ...rows.map((r) => String(r[col] ?? "").length)
      )
    ),
  }));
}

function produktkapabilitetToRow(pk: Produktkapabilitet) {
  const gap = pk.modenhetMål > 0 ? pk.modenhetMål - pk.modenhetNå : "";
  const domene = DOMENER.find((d) => d.id === pk.domeneId)?.navn ?? pk.domeneId;
  return {
    ID: pk.id,
    Verdistrøm: pk.verdistrøm,
    Domene: domene,
    Navn: pk.navn,
    Beskrivelse: pk.beskrivelse,
    Kritikalitet: pk.kritikalitet,
    "SP-rolle": pk.spRolle,
    "Modenhet nå (0-5)": pk.modenhetNå,
    "Modenhetsmål (0-5)": pk.modenhetMål,
    Gap: gap,
    Notater: pk.notater,
  };
}

function digitaltProduktToRow(dp: DigitaltProdukt) {
  return {
    ID: dp.id,
    Navn: dp.navn,
    Beskrivelse: dp.beskrivelse,
    Produktområde: dp.produktområde,
    Status: dp.status,
    "Produktkapabilitet-IDer": dp.produktkapabilitetIder.join(", "),
    "Kjernekapabilitet-IDer": dp.kjernekapabilitetIder.join(", "),
    Notater: dp.notater,
  };
}

export function exportToExcel(
  kapabiliteter: Kapabilitet[],
  produktkapabiliteter?: Produktkapabilitet[],
  digitaleProdukter?: DigitaltProdukt[],
  filename = "kapabilitetsplan",
) {
  const wb = XLSX.utils.book_new();

  // Sammendrag-ark
  const summaryRows = DOMENER.map((d) => {
    const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
    const vurdert = kaps.filter((k) => k.modenhetNå > 0);
    const avgNå = vurdert.length > 0
      ? (vurdert.reduce((s, k) => s + k.modenhetNå, 0) / vurdert.length).toFixed(2)
      : "—";
    const withMål = kaps.filter((k) => k.modenhetMål > 0);
    const avgMål = withMål.length > 0
      ? (withMål.reduce((s, k) => s + k.modenhetMål, 0) / withMål.length).toFixed(2)
      : "—";
    return {
      Domene: d.navn,
      "Antall kapabiliteter": kaps.length,
      "Vurdert": vurdert.length,
      "Snitt modenhet nå": avgNå,
      "Snitt modenhetsmål": avgMål,
      "Høy kritikalitet": kaps.filter((k) => k.kritikalitet === "Høy").length,
    };
  });
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  autoWidth(summarySheet, summaryRows);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Sammendrag");

  // Alle kapabiliteter
  const allRows = kapabiliteter.map(toRow);
  const allSheet = XLSX.utils.json_to_sheet(allRows);
  autoWidth(allSheet, allRows);
  XLSX.utils.book_append_sheet(wb, allSheet, "Alle kapabiliteter");

  // Per domene
  for (const d of DOMENER) {
    const rows = kapabiliteter.filter((k) => k.domeneId === d.id).map(toRow);
    if (rows.length === 0) continue;
    const sheet = XLSX.utils.json_to_sheet(rows);
    autoWidth(sheet, rows);
    XLSX.utils.book_append_sheet(wb, sheet, d.navn.substring(0, 31));
  }

  // Produktkapabiliteter sheet
  if (produktkapabiliteter && produktkapabiliteter.length > 0) {
    const pkRows = produktkapabiliteter.map(produktkapabilitetToRow);
    const pkSheet = XLSX.utils.json_to_sheet(pkRows);
    autoWidth(pkSheet, pkRows);
    XLSX.utils.book_append_sheet(wb, pkSheet, "Produktkapabiliteter");
  }

  // Digitale produkter sheet
  if (digitaleProdukter && digitaleProdukter.length > 0) {
    const dpRows = digitaleProdukter.map(digitaltProduktToRow);
    const dpSheet = XLSX.utils.json_to_sheet(dpRows);
    autoWidth(dpSheet, dpRows);
    XLSX.utils.book_append_sheet(wb, dpSheet, "Digitale produkter");
  }

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export interface AppSnapshot {
  version: 1;
  exportedAt: string;
  kapabiliteter: Kapabilitet[];
  produktkapabiliteter: Produktkapabilitet[];
  digitaleProdukter: DigitaltProdukt[];
}

export function exportToJSON(
  kapabiliteter: Kapabilitet[],
  produktkapabiliteter: Produktkapabilitet[],
  digitaleProdukter: DigitaltProdukt[],
  filename = "kapabilitetsplan",
) {
  const snapshot: AppSnapshot = {
    version: 1,
    exportedAt: new Date().toISOString(),
    kapabiliteter,
    produktkapabiliteter,
    digitaleProdukter,
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(text: string): AppSnapshot {
  const parsed = JSON.parse(text);
  if (parsed.version !== 1) throw new Error("Ukjent filversjon");
  if (!Array.isArray(parsed.kapabiliteter)) throw new Error("Ugyldig format: mangler kapabiliteter");
  return parsed as AppSnapshot;
}

export function exportToCSV(kapabiliteter: Kapabilitet[], filename = "kapabilitetsplan") {
  const rows = kapabiliteter.map(toRow);
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, sheet, "Data");
  XLSX.writeFile(wb, `${filename}.csv`, { bookType: "csv" });
}
