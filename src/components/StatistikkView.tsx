"use client";
import { Kapabilitet, DOMENER, MODENHET_LABELS, ModenhetScore } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";
import { MODENHET_BG } from "./ModenhetCell";
import { cn } from "@/lib/utils";

interface Props { kapabiliteter: Kapabilitet[] }

function avg(kaps: Kapabilitet[], field: "modenhetNå" | "modenhetMål") {
  const valid = kaps.filter((k) => k[field] > 0);
  if (!valid.length) return 0;
  return valid.reduce((s, k) => s + k[field], 0) / valid.length;
}

const CHART_COLORS = ["#7c3aed","#0891b2","#1d4ed8","#ea580c","#b91c1c","#059669","#d97706"];

export function StatistikkView({ kapabiliteter }: Props) {
  const totalVurdert = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const totalMålSatt = kapabiliteter.filter((k) => k.modenhetMål > 0).length;
  const globalAvgNå = avg(kapabiliteter, "modenhetNå");

  const barData = DOMENER.map((d, i) => {
    const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
    return {
      name: d.navn.split(" og ")[0].split(" og ")[0],
      ikon: d.ikon,
      nå: +avg(kaps, "modenhetNå").toFixed(2),
      mål: +avg(kaps, "modenhetMål").toFixed(2),
      antall: kaps.length,
      color: CHART_COLORS[i],
    };
  });

  const radarData = DOMENER.map((d) => {
    const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
    return {
      subject: d.ikon + " " + d.navn.split(" ")[0],
      nå: +avg(kaps, "modenhetNå").toFixed(2),
      mål: +avg(kaps, "modenhetMål").toFixed(2),
    };
  });

  const dist = ([0,1,2,3,4,5] as ModenhetScore[]).map((v) => ({
    score: v,
    label: MODENHET_LABELS[v],
    antall: kapabiliteter.filter((k) => k.modenhetNå === v).length,
    pct: Math.round((kapabiliteter.filter((k) => k.modenhetNå === v).length / kapabiliteter.length) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Totalt kapabiliteter" value={kapabiliteter.length} color="blue" />
        <KpiCard
          label="Vurdert"
          value={`${totalVurdert}/${kapabiliteter.length}`}
          sub={`${Math.round((totalVurdert / kapabiliteter.length) * 100)}%`}
          color="violet"
        />
        <KpiCard label="Mål satt" value={`${totalMålSatt}/${kapabiliteter.length}`} color="emerald" />
        <KpiCard
          label="Snitt modenhet"
          value={globalAvgNå > 0 ? globalAvgNå.toFixed(2) : "—"}
          color="orange"
        />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-5">Gjennomsnittlig modenhet per domene</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [typeof v === "number" ? v.toFixed(2) : v, ""]}
              contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
            />
            <Legend />
            <Bar dataKey="nå" name="Modenhet nå" radius={[4,4,0,0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
            <Bar dataKey="mål" name="Modenhetsmål" fill="#10b981" fillOpacity={0.5} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Modenhetsprofil</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0,5]} tick={{ fontSize: 10 }} tickCount={6} />
              <Radar name="Nå" dataKey="nå" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Mål" dataKey="mål" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Fordeling modenhetsnivå</h3>
          <div className="space-y-3">
            {dist.map((d) => (
              <div key={d.score} className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0",
                  MODENHET_BG[d.score as ModenhetScore]
                )}>
                  {d.score === 0 ? "—" : d.score}
                </div>
                <span className="text-xs text-gray-500 w-36 shrink-0">{d.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 w-8 text-right">{d.antall}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domene detaljtabell */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Oversikt per domene</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left py-2.5">Domene</th>
                <th className="text-center py-2.5">Antall</th>
                <th className="text-center py-2.5">Vurdert</th>
                <th className="text-center py-2.5">Snitt nå</th>
                <th className="text-center py-2.5">Snitt mål</th>
                <th className="text-center py-2.5">Gap</th>
                <th className="text-center py-2.5">Høy krit.</th>
                <th className="text-center py-2.5 w-40">Fremgang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DOMENER.map((d, i) => {
                const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
                const vurdert = kaps.filter((k) => k.modenhetNå > 0);
                const avgNå = avg(kaps, "modenhetNå");
                const avgMål = avg(kaps, "modenhetMål");
                const høy = kaps.filter((k) => k.kritikalitet === "Høy").length;
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 flex items-center gap-2">
                      <span>{d.ikon}</span>
                      <span className="font-medium text-gray-800">{d.navn}</span>
                    </td>
                    <td className="py-3 text-center text-gray-500">{kaps.length}</td>
                    <td className="py-3 text-center text-gray-500">{vurdert.length}</td>
                    <td className="py-3 text-center font-semibold text-blue-600">{avgNå > 0 ? avgNå.toFixed(1) : "—"}</td>
                    <td className="py-3 text-center font-semibold text-emerald-600">{avgMål > 0 ? avgMål.toFixed(1) : "—"}</td>
                    <td className="py-3 text-center font-semibold text-orange-500">
                      {avgNå > 0 && avgMål > 0 ? `+${(avgMål - avgNå).toFixed(1)}` : "—"}
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-xs font-medium text-red-600">{høy}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${avgNå > 0 ? (avgNå / 5) * 100 : 0}%`,
                              backgroundColor: CHART_COLORS[i],
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 w-8 text-right">
                          {avgNå > 0 ? `${Math.round((avgNå/5)*100)}%` : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prioriteringsliste: høy krit + lav modenhet */}
      <PrioriteringsListe kapabiliteter={kapabiliteter} />
    </div>
  );
}

function KpiCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color: string;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    violet: "text-violet-600 bg-violet-50",
    emerald: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
      <div className={cn("text-3xl font-bold", colors[color].split(" ")[0])}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      <div className="text-xs text-gray-500 mt-2">{label}</div>
    </div>
  );
}

function PrioriteringsListe({ kapabiliteter }: { kapabiliteter: Kapabilitet[] }) {
  const topGap = kapabiliteter
    .filter((k) => k.kritikalitet === "Høy" && k.modenhetNå < 3 && k.modenhetNå > 0)
    .sort((a, b) => (a.modenhetNå - b.modenhetNå))
    .slice(0, 8);

  const uVurdert = kapabiliteter.filter((k) => k.modenhetNå === 0 && k.kritikalitet === "Høy");

  if (topGap.length === 0 && uVurdert.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
      <h3 className="font-bold text-amber-900 mb-1">⚠️ Oppmerksomhetsliste</h3>
      <p className="text-xs text-amber-700 mb-4">Høy kritikalitet og lav modenhet (under 3) — prioriter disse i neste workshop</p>
      <div className="space-y-2">
        {topGap.map((k) => {
          const domene = DOMENER.find((d) => d.id === k.domeneId);
          return (
            <div key={k.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-amber-100">
              <span className="text-base">{domene?.ikon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm truncate">{k.navn}</div>
                <div className="text-xs text-gray-400">{domene?.navn}</div>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold",
                MODENHET_BG[k.modenhetNå as ModenhetScore]
              )}>
                {k.modenhetNå}
              </div>
            </div>
          );
        })}
        {uVurdert.length > 0 && (
          <div className="text-xs text-amber-700 mt-3 font-medium">
            {uVurdert.length} kapabilitet{uVurdert.length !== 1 ? "er" : ""} med høy kritikalitet mangler vurdering
          </div>
        )}
      </div>
    </div>
  );
}
