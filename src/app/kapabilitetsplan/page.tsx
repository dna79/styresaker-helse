"use client";
import { useState, useMemo } from "react";
import { useKapabilitetStore } from "@/lib/store";
import { Kapabilitet, Verdistrøm, Teamtype, VERDISTRØMMER } from "@/lib/types";
import { HeatmapView } from "@/components/HeatmapView";
import { StatistikkView } from "@/components/StatistikkView";
import { KapabilitetEditor } from "@/components/KapabilitetEditor";
import { Button } from "@/components/ui/button";
import { exportToExcel, exportToCSV } from "@/lib/export";
import { BarChart2, Grid, Download, RotateCcw, Filter } from "lucide-react";

type Tab = "heatmap" | "statistikk";
type Visningsmodus = "nå" | "mål" | "gap";

export default function KapabilitetsplanPage() {
  const { kapabiliteter, updateKapabilitet, resetToSeed } = useKapabilitetStore();
  const [tab, setTab] = useState<Tab>("heatmap");
  const [selected, setSelected] = useState<Kapabilitet | null>(null);
  const [filterTeamtype, setFilterTeamtype] = useState<Teamtype | "Alle">("Alle");
  const [filterVerdistrøm, setFilterVerdistrøm] = useState<Verdistrøm | "Alle">("Alle");
  const [filterKritikalitet, setFilterKritikalitet] = useState<"Alle" | "Høy" | "Middels" | "Lav">("Alle");
  const [visningsModus, setVisningsModus] = useState<Visningsmodus>("nå");
  const [søk, setSøk] = useState("");

  const filtrerteKapabiliteter = useMemo(() => {
    return kapabiliteter.filter((k) => {
      if (filterTeamtype !== "Alle" && k.teamtype !== filterTeamtype) return false;
      if (filterVerdistrøm !== "Alle" && k.verdistrøm !== filterVerdistrøm) return false;
      if (filterKritikalitet !== "Alle" && k.kritikalitet !== filterKritikalitet) return false;
      if (søk && !k.navn.toLowerCase().includes(søk.toLowerCase())) return false;
      return true;
    });
  }, [kapabiliteter, filterTeamtype, filterVerdistrøm, filterKritikalitet, søk]);

  function handleReset() {
    if (confirm("Tilbakestill alle scoreringer og klassifiseringer til startverdier?")) {
      resetToSeed();
    }
  }

  const vurdertCount = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const progress = Math.round((vurdertCount / kapabiliteter.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Grid className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-none">Kapabilitetsplanlegging</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Sykehuspartner HF · T&A</p>
            </div>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-gray-500">{vurdertCount}/{kapabiliteter.length} vurdert</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-medium text-blue-600">{progress}%</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportToExcel(kapabiliteter)}
              className="hidden sm:flex gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportToCSV(kapabiliteter)}
              className="hidden sm:flex gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset} title="Tilbakestill data">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("heatmap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "heatmap" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Grid className="h-4 w-4" />
            Heatmap
          </button>
          <button
            onClick={() => setTab("statistikk")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "statistikk" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <BarChart2 className="h-4 w-4" />
            Statistikk
          </button>
        </div>

        {/* Filters */}
        {tab === "heatmap" && (
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>

            {/* Søk */}
            <input
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              placeholder="Søk kapabilitet..."
              value={søk}
              onChange={(e) => setSøk(e.target.value)}
            />

            {/* Verdistrøm */}
            <select
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterVerdistrøm}
              onChange={(e) => setFilterVerdistrøm(e.target.value as Verdistrøm | "Alle")}
            >
              <option value="Alle">Alle verdistrømmer</option>
              {VERDISTRØMMER.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            {/* Teamtype */}
            <select
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterTeamtype}
              onChange={(e) => setFilterTeamtype(e.target.value as Teamtype | "Alle")}
            >
              <option value="Alle">Alle teamtyper</option>
              <option value="Produktområde">Produktområde</option>
              <option value="Plattformteam">Plattformteam</option>
              <option value="Støtteteam">Støtteteam</option>
            </select>

            {/* Kritikalitet */}
            <select
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterKritikalitet}
              onChange={(e) => setFilterKritikalitet(e.target.value as typeof filterKritikalitet)}
            >
              <option value="Alle">Alle kritikalitet</option>
              <option value="Høy">Høy</option>
              <option value="Middels">Middels</option>
              <option value="Lav">Lav</option>
            </select>

            {/* Visningsmodus */}
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              {(["nå", "mål", "gap"] as Visningsmodus[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setVisningsModus(m)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${visningsModus === m ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  {m === "nå" ? "Nå" : m === "mål" ? "Mål" : "Gap"}
                </button>
              ))}
            </div>

            {/* Result count */}
            <span className="text-sm text-gray-400 ml-auto self-center">
              {filtrerteKapabiliteter.length} kapabiliteter
            </span>
          </div>
        )}

        {/* Content */}
        {tab === "heatmap" ? (
          <HeatmapView
            kapabiliteter={filtrerteKapabiliteter}
            filterTeamtype={filterTeamtype}
            filterVerdistrøm={filterVerdistrøm}
            visningsModus={visningsModus}
            onSelectKapabilitet={setSelected}
          />
        ) : (
          <StatistikkView kapabiliteter={kapabiliteter} />
        )}
      </div>

      {/* Legend */}
      {tab === "heatmap" && (
        <footer className="max-w-screen-2xl mx-auto px-4 pb-8 mt-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Modenhetsskala</div>
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2, 3, 4, 5].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded text-center text-xs font-bold flex items-center justify-center ${
                    v === 0 ? "bg-gray-100 text-gray-400" :
                    v === 1 ? "bg-red-200 text-red-800" :
                    v === 2 ? "bg-orange-200 text-orange-800" :
                    v === 3 ? "bg-yellow-200 text-yellow-800" :
                    v === 4 ? "bg-lime-200 text-lime-800" :
                    "bg-green-300 text-green-900"
                  }`}>{v === 0 ? "—" : v}</div>
                  <span className="text-xs text-gray-600">
                    {v === 0 ? "Ikke vurdert" :
                     v === 1 ? "Ad hoc" :
                     v === 2 ? "Delvis definert" :
                     v === 3 ? "Definert" :
                     v === 4 ? "Styrt og målt" :
                     "Optimalisert"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      )}

      {/* Editor dialog */}
      <KapabilitetEditor
        kapabilitet={selected}
        onClose={() => setSelected(null)}
        onSave={updateKapabilitet}
      />
    </div>
  );
}
