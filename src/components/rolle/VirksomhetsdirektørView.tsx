"use client";
import { Kapabilitet, DOMENER, KLASSIFISERING_LABELS, Klassifisering } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOMAIN_COLORS = ["#7c3aed","#0891b2","#1d4ed8","#ea580c","#b91c1c","#059669","#d97706"];

function avg(kaps: Kapabilitet[], field: "modenhetNå" | "modenhetMål") {
  const valid = kaps.filter((k) => k[field] > 0);
  if (!valid.length) return 0;
  return valid.reduce((s, k) => s + k[field], 0) / valid.length;
}

const KLASSIFISERING_CONFIG: Record<Klassifisering, { label: string; color: string; bg: string; border: string; desc: string }> = {
  Behold:       { label: "Behold",        color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", desc: "Stabil og tilstrekkelig" },
  Endre:        { label: "Endre",         color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   desc: "Behov for forbedring" },
  UtvikleNytt:  { label: "Utvikle nytt",  color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    desc: "Ny investering" },
  FaseUt:       { label: "Fase ut",       color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     desc: "Planlegges avviklet" },
  IkkeVurdert:  { label: "Ikke vurdert",  color: "text-gray-500",    bg: "bg-gray-50",     border: "border-gray-200",    desc: "Mangler beslutning" },
};

export function VirksomhetsdirektørView({ kapabiliteter }: { kapabiliteter: Kapabilitet[] }) {
  const klassifiseringer: Klassifisering[] = ["UtvikleNytt", "Endre", "Behold", "FaseUt", "IkkeVurdert"];

  const topGap = kapabiliteter
    .filter((k) => k.kritikalitet === "Høy" && k.modenhetNå > 0 && k.modenhetMål > 0)
    .map((k) => ({ ...k, gap: k.modenhetMål - k.modenhetNå }))
    .filter((k) => k.gap > 0)
    .sort((a, b) => b.gap - a.gap || b.modenhetMål - a.modenhetMål)
    .slice(0, 10);

  const totalNytt = kapabiliteter.filter((k) => k.klassifisering === "UtvikleNytt").length;
  const totalEndre = kapabiliteter.filter((k) => k.klassifisering === "Endre").length;
  const totalFaseUt = kapabiliteter.filter((k) => k.klassifisering === "FaseUt").length;

  return (
    <div className="space-y-6">
      {/* Klassifisering summary */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Kapabilitetsportefølje — beslutningsstatus</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {klassifiseringer.map((kl) => {
            const antall = kapabiliteter.filter((k) => k.klassifisering === kl).length;
            const pct = Math.round((antall / kapabiliteter.length) * 100);
            const cfg = KLASSIFISERING_CONFIG[kl];
            return (
              <div key={kl} className={cn("rounded-2xl border p-4 shadow-sm", cfg.bg, cfg.border)}>
                <div className={cn("text-2xl font-bold leading-none", cfg.color)}>{antall}</div>
                <div className={cn("text-xs font-semibold mt-1", cfg.color)}>{cfg.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{pct}% · {cfg.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stacked bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Investeringsretning</h3>
          <span className="text-xs text-gray-400">{kapabiliteter.length} kapabiliteter totalt</span>
        </div>
        <div className="flex h-8 rounded-xl overflow-hidden gap-px">
          {klassifiseringer.map((kl) => {
            const antall = kapabiliteter.filter((k) => k.klassifisering === kl).length;
            const pct = (antall / kapabiliteter.length) * 100;
            const colors: Record<Klassifisering, string> = {
              Behold: "#059669", Endre: "#d97706", UtvikleNytt: "#1d4ed8", FaseUt: "#dc2626", IkkeVurdert: "#d1d5db",
            };
            if (antall === 0) return null;
            return (
              <div key={kl} className="flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${pct}%`, backgroundColor: colors[kl], minWidth: pct < 5 ? "24px" : undefined }}>
                {pct >= 5 ? antall : ""}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500">
          {klassifiseringer.map((kl) => {
            const cfg = KLASSIFISERING_CONFIG[kl];
            const colors: Record<Klassifisering, string> = { Behold: "#059669", Endre: "#d97706", UtvikleNytt: "#1d4ed8", FaseUt: "#dc2626", IkkeVurdert: "#d1d5db" };
            return (
              <span key={kl} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[kl] }} />
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top gap — høy kritikalitet */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Største kapabilitetsgap — høy kritikalitet</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Sortert etter avstand mellom nå og mål</p>
          </div>
          <div className="divide-y divide-gray-50">
            {topGap.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Ingen gap funnet</div>
            ) : topGap.map((k) => {
              const domene = DOMENER.find((d) => d.id === k.domeneId);
              const kl = KLASSIFISERING_CONFIG[k.klassifisering];
              return (
                <div key={k.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-xs truncate">{k.navn}</div>
                    <div className="text-[10px] text-gray-400">{domene?.ikon} {domene?.navn}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", kl.bg, kl.border, kl.color)}>{kl.label}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-red-500">+{k.gap.toFixed(0)}</div>
                      <div className="text-[10px] text-gray-400">{k.modenhetNå}→{k.modenhetMål}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain investment overview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Domeneprioritering</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Investeringsnivå og gap per domene</p>
          </div>
          <div className="divide-y divide-gray-50">
            {DOMENER.map((d, i) => {
              const kaps = kapabiliteter.filter((k) => k.domeneId === d.id);
              const avgNå = avg(kaps, "modenhetNå");
              const avgMål = avg(kaps, "modenhetMål");
              const gap = avgNå > 0 && avgMål > 0 ? avgMål - avgNå : 0;
              const invest = kaps.filter((k) => k.klassifisering === "UtvikleNytt").length;
              const endre = kaps.filter((k) => k.klassifisering === "Endre").length;
              return (
                <div key={d.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-lg w-6 text-center flex-shrink-0">{d.ikon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-xs truncate">{d.navn}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {invest > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">{invest} ny</span>}
                      {endre > 0 && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">{endre} endre</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold" style={{ color: DOMAIN_COLORS[i] }}>{avgNå > 0 ? avgNå.toFixed(1) : "—"}</div>
                    {gap > 0 && <div className={cn("text-[10px] font-semibold", gap > 1.5 ? "text-red-500" : "text-orange-500")}>gap +{gap.toFixed(1)}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
