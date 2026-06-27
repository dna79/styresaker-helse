"use client";
import { Kapabilitet, DOMENER, MODENHET_LABELS, ModenhetScore } from "@/lib/types";
import { MODENHET_BG } from "./ModenhetCell";
import { cn } from "@/lib/utils";

interface Props { kapabiliteter: Kapabilitet[] }

function avg(kaps: Kapabilitet[], field: "modenhetNå" | "modenhetMål") {
  const valid = kaps.filter((k) => k[field] > 0);
  if (!valid.length) return 0;
  return valid.reduce((s, k) => s + k[field], 0) / valid.length;
}

const DOMAIN_COLORS = ["#7c3aed","#0891b2","#1d4ed8","#ea580c","#b91c1c","#059669","#d97706"];

export function DomainDashboard({ kapabiliteter }: Props) {
  const totalVurdert = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const globalAvgNå = avg(kapabiliteter, "modenhetNå");
  const høyKrit = kapabiliteter.filter((k) => k.kritikalitet === "Høy").length;
  const pctVurdert = Math.round((totalVurdert / kapabiliteter.length) * 100);

  const dist = ([1,2,3,4,5] as ModenhetScore[]).map((v) => ({
    score: v,
    label: MODENHET_LABELS[v],
    antall: kapabiliteter.filter((k) => k.modenhetNå === v).length,
  }));
  const maxDist = Math.max(...dist.map((d) => d.antall), 1);

  const attention = kapabiliteter
    .filter((k) => k.kritikalitet === "Høy" && k.modenhetNå > 0 && k.modenhetNå < 3)
    .sort((a, b) => a.modenhetNå - b.modenhetNå)
    .slice(0, 8);
  const uVurdertHøy = kapabiliteter.filter((k) => k.kritikalitet === "Høy" && k.modenhetNå === 0);

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTALT"
          value={kapabiliteter.length}
          sub="kapabiliteter"
          color="blue"
        />
        <StatCard
          label="VURDERT"
          value={`${pctVurdert}%`}
          sub={`${totalVurdert} av ${kapabiliteter.length}`}
          color={pctVurdert === 100 ? "emerald" : "violet"}
          badge={pctVurdert === 100 ? "✓ Fullført" : undefined}
        />
        <StatCard
          label="SNITT MODENHET"
          value={globalAvgNå > 0 ? globalAvgNå.toFixed(2) : "—"}
          sub="av 5.00"
          color="orange"
        />
        <StatCard
          label="HØY KRITIKALITET"
          value={høyKrit}
          sub={`${kapabiliteter.length - høyKrit} middels/lav`}
          color="red"
        />
      </div>

      {/* ── Domain table + Right panel ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Domain table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Domeneoversikt</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Domene</th>
                  <th className="px-4 py-3 text-center">Nå</th>
                  <th className="px-4 py-3 w-48">Modenhetsgap</th>
                  <th className="px-4 py-3 text-center">Gap</th>
                  <th className="px-4 py-3 text-center">Krit.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DOMENER.map((d, i) => {
                  const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
                  const avgNå = avg(kaps, "modenhetNå");
                  const avgMål = avg(kaps, "modenhetMål");
                  const gap = avgNå > 0 && avgMål > 0 ? avgMål - avgNå : 0;
                  const høy = kaps.filter((k) => k.kritikalitet === "Høy").length;
                  const fillPct = avgNå > 0 ? (avgNå / 5) * 100 : 0;
                  const målPct = avgMål > 0 ? (avgMål / 5) * 100 : 0;
                  const color = DOMAIN_COLORS[i];
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{d.ikon}</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm leading-tight">{d.navn}</div>
                            <div className="text-[11px] text-gray-400">{kaps.length} kapabiliteter</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-base font-bold" style={{ color }}>
                          {avgNå > 0 ? avgNå.toFixed(1) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {avgNå > 0 ? (
                          <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
                            {/* fill to nå */}
                            <div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ width: `${fillPct}%`, backgroundColor: color, opacity: 0.7 }}
                            />
                            {/* orange circle at mål */}
                            {avgMål > 0 && (
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-orange-400 bg-white"
                                style={{ left: `calc(${målPct}% - 7px)` }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="h-3 bg-gray-100 rounded-full" />
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={cn(
                          "text-sm font-semibold",
                          gap > 1.5 ? "text-red-500" : gap > 0.5 ? "text-orange-500" : "text-gray-400"
                        )}>
                          {gap > 0 ? `+${gap.toFixed(1)}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {høy > 0 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            {høy}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-8 h-2 rounded-full bg-blue-400 opacity-70" />
              Modenhet nå
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-orange-400 bg-white" />
              Modenhetsmål
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Modenhetsprofil */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Modenhetsprofil</h3>
            <div className="flex items-end gap-2 h-36">
              {dist.map((d) => {
                const heightPct = (d.antall / maxDist) * 100;
                const barColors: Record<number, string> = {
                  1: "#ef4444", 2: "#f97316", 3: "#eab308", 4: "#84cc16", 5: "#22c55e",
                };
                return (
                  <div key={d.score} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[11px] font-semibold text-gray-700">{d.antall}</span>
                    <div className="w-full flex flex-col justify-end" style={{ height: "96px" }}>
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height: `${Math.max(heightPct, 4)}%`,
                          backgroundColor: barColors[d.score],
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 text-center leading-tight">
                      {d.label.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-1 text-[10px] text-gray-400 justify-center">
              Modenhetsnivå 1–5 · {kapabiliteter.filter((k) => k.modenhetNå === 0).length} ikke vurdert
            </div>
          </div>

          {/* Oppmerksomhetsliste */}
          {(attention.length > 0 || uVurdertHøy.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">Oppmerksomhetsliste</h3>
                <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-red-100 text-red-700 text-[11px] font-bold px-1.5">
                  {attention.length + uVurdertHøy.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {attention.map((k) => {
                  const domene = DOMENER.find((d) => d.id === k.domeneId);
                  return (
                    <div key={k.id} className="flex items-center gap-3 px-4 py-3 border-l-4"
                      style={{ borderLeftColor: k.modenhetNå <= 1 ? "#ef4444" : "#f97316" }}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-xs truncate">{k.navn}</div>
                        <div className="text-[10px] text-gray-400">{domene?.ikon} {domene?.navn}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded",
                          k.modenhetNå <= 1 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        )}>
                          Nivå {k.modenhetNå}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {uVurdertHøy.length > 0 && (
                  <div className="px-4 py-3 text-[11px] text-gray-500 bg-gray-50">
                    + {uVurdertHøy.length} høy-kritiske uten vurdering
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, badge }: {
  label: string; value: string | number; sub?: string; color: string; badge?: string;
}) {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    blue:    { text: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
    violet:  { text: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    orange:  { text: "text-orange-500",  bg: "bg-orange-50",  border: "border-orange-100" },
    red:     { text: "text-red-600",     bg: "bg-red-50",     border: "border-red-100" },
  };
  const c = colors[color] ?? colors.blue;
  return (
    <div className={cn("rounded-2xl border shadow-sm p-5", c.bg, c.border)}>
      <div className="text-[10px] font-semibold tracking-wider text-gray-400 mb-2">{label}</div>
      <div className={cn("text-3xl font-bold leading-none", c.text)}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1.5">{sub}</div>}
      {badge && (
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
          {badge}
        </div>
      )}
    </div>
  );
}
