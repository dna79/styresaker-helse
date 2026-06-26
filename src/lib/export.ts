import * as XLSX from "xlsx";
import { Kapabilitet, MODENHET_LABELS, KLASSIFISERING_LABELS } from "./types";

function toRow(k: Kapabilitet) {
  return {
    Navn: k.navn,
    Verdistrøm: k.verdistrøm,
    Teamtype: k.teamtype,
    Prosesstype: k.prosesstype,
    Eierskap: k.eierskap,
    Kritikalitet: k.kritikalitet,
    Klassifisering: KLASSIFISERING_LABELS[k.klassifisering],
    "Modenhet nå (0-5)": k.modenhetNå,
    "Modenhet nå (label)": MODENHET_LABELS[k.modenhetNå],
    "Modenhetsmål (0-5)": k.modenhetMål,
    "Modenhetsmål (label)": MODENHET_LABELS[k.modenhetMål],
    Gap: k.modenhetMål > 0 ? k.modenhetMål - k.modenhetNå : "",
    "IT4IT komponent": k.it4itKomponent ?? "",
    Notater: k.notater,
  };
}

export function exportToExcel(kapabiliteter: Kapabilitet[], filename = "kapabilitetsplan") {
  const wb = XLSX.utils.book_new();

  // All
  const allRows = kapabiliteter.map(toRow);
  const allSheet = XLSX.utils.json_to_sheet(allRows);
  XLSX.utils.book_append_sheet(wb, allSheet, "Alle kapabiliteter");

  // Per verdistrøm
  const streams = [...new Set(kapabiliteter.map((k) => k.verdistrøm))];
  for (const stream of streams) {
    const rows = kapabiliteter.filter((k) => k.verdistrøm === stream).map(toRow);
    const sheet = XLSX.utils.json_to_sheet(rows);
    const safeSheetName = stream.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, sheet, safeSheetName);
  }

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToCSV(kapabiliteter: Kapabilitet[], filename = "kapabilitetsplan") {
  const rows = kapabiliteter.map(toRow);
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, sheet, "Data");
  XLSX.writeFile(wb, `${filename}.csv`, { bookType: "csv" });
}
