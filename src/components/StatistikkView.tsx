"use client";
import { Kapabilitet, VERDISTRØMMER, Verdistrøm, MODENHET_LABELS } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

interface Props {
  kapabiliteter: Kapabilitet[];
}

function avgModenhet(kaps: Kapabilitet[], field: "modenhetNå" | "modenhetMål") {
  const vurdert = kaps.filter((k) => k[field] > 0);
  if (vurdert.length === 0) return 0;
  return vurdert.reduce((sum, k) => sum + k[field], 0) / vurdert.length;
}

export function StatistikkView({ kapabiliteter }: Props) {
  const barData = VERDISTRØMMER.map((stream) => {
    const kaps = kapabiliteter.filter((k) => k.verdistrøm === stream);
    return {
      name: stream.replace(" produkter", "").replace("Tilgjengeliggjøre", "Tilgj."),
      nå: +avgModenhet(kaps, "modenhetNå").toFixed(2),
      mål: +avgModenhet(kaps, "modenhetMål").toFixed(2),
      antall: kaps.length,
    };
  });

  const radarData = VERDISTRØMMER.map((stream) => {
    const kaps = kapabiliteter.filter((k) => k.verdistrøm === stream);
    return {
      subject: stream.split(" ")[0],
      nå: +avgModenhet(kaps, "modenhetNå").toFixed(2),
      mål: +avgModenhet(kaps, "modenhetMål").toFixed(2),
    };
  });

  // Distribution
  const dist = [0, 1, 2, 3, 4, 5].map((v) => ({
    label: v === 0 ? "Ikke vurdert" : `${v} – ${MODENHET_LABELS[v]}`,
    antall: kapabiliteter.filter((k) => k.modenhetNå === v).length,
  }));

  const totalVurdert = kapabiliteter.filter((k) => k.modenhetNå > 0).length;
  const totalMålSatt = kapabiliteter.filter((k) => k.modenhetMål > 0).length;

  return (
    <div className="space-y-8">
      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Totalt kapabiliteter" value={kapabiliteter.length} />
        <StatCard label="Vurdert" value={`${totalVurdert} / ${kapabiliteter.length}`} sub={`${Math.round(totalVurdert / kapabiliteter.length * 100)}%`} />
        <StatCard label="Mål satt" value={`${totalMålSatt} / ${kapabiliteter.length}`} />
        <StatCard label="Snitt modenhet nå" value={avgModenhet(kapabiliteter, "modenhetNå").toFixed(2)} />
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Gjennomsnittlig modenhet per verdistrøm</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [typeof v === "number" ? v.toFixed(2) : v, ""]} />
            <Legend />
            <Bar dataKey="nå" name="Modenhet nå" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="mål" name="Modenhetsmål" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar */}
      <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Modenhetsprofil (radardiagram)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Radar name="Nå" dataKey="nå" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            <Radar name="Mål" dataKey="mål" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution */}
      <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Fordeling modenhetsnivå (nå)</h3>
        <div className="space-y-2">
          {dist.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-52">{d.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(d.antall / kapabiliteter.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-6 text-right">{d.antall}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per teamtype */}
      <TeamtypeTabell kapabiliteter={kapabiliteter} />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function TeamtypeTabell({ kapabiliteter }: { kapabiliteter: Kapabilitet[] }) {
  const teamtyper = ["Produktområde", "Plattformteam", "Støtteteam"] as const;
  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Modenhet per teamtype</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase border-b">
            <th className="text-left py-2">Teamtype</th>
            <th className="text-center py-2">Antall</th>
            <th className="text-center py-2">Snitt nå</th>
            <th className="text-center py-2">Snitt mål</th>
            <th className="text-center py-2">Gap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {teamtyper.map((tt) => {
            const kaps = kapabiliteter.filter((k) => k.teamtype === tt);
            const nå = avgModenhet(kaps, "modenhetNå");
            const mål = avgModenhet(kaps, "modenhetMål");
            return (
              <tr key={tt}>
                <td className="py-2 font-medium">{tt}</td>
                <td className="py-2 text-center text-gray-500">{kaps.length}</td>
                <td className="py-2 text-center text-blue-600 font-medium">{nå.toFixed(2)}</td>
                <td className="py-2 text-center text-green-600 font-medium">{mål.toFixed(2)}</td>
                <td className="py-2 text-center text-orange-600 font-medium">
                  {mål > 0 ? `+${(mål - nå).toFixed(2)}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
