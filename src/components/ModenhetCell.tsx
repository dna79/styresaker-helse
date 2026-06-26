"use client";
import { cn } from "@/lib/utils";
import { ModenhetScore, MODENHET_LABELS } from "@/lib/types";

export const MODENHET_BG: Record<ModenhetScore, string> = {
  0: "bg-gray-100 text-gray-400 border-gray-200",
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-lime-100 text-lime-800 border-lime-200",
  5: "bg-green-200 text-green-900 border-green-300",
};

interface ModenhetCellProps {
  value: ModenhetScore;
  mål?: ModenhetScore;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function ModenhetCell({ value, mål, onClick, size = "md" }: ModenhetCellProps) {
  const gap = mål && mål > 0 ? mål - value : undefined;
  return (
    <div
      onClick={onClick}
      title={`Nå: ${MODENHET_LABELS[value]}${mål && mål > 0 ? ` · Mål: ${MODENHET_LABELS[mål]}` : ""}`}
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-lg border font-bold select-none transition-all",
        MODENHET_BG[value],
        size === "md" ? "h-12 w-12 text-base" : "h-9 w-9 text-sm",
        onClick && "cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 hover:scale-105"
      )}
    >
      <span>{value === 0 ? "—" : value}</span>
      {gap !== undefined && gap > 0 && (
        <span className="text-[9px] font-semibold opacity-60 leading-none">+{gap}</span>
      )}
    </div>
  );
}

export function ModenhetPicker({
  value,
  onChange,
  label,
}: {
  value: ModenhetScore;
  onChange: (v: ModenhetScore) => void;
  label: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500 mb-2">{label}</div>
      <div className="flex gap-1.5">
        {([0, 1, 2, 3, 4, 5] as ModenhetScore[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            title={v === 0 ? "Ikke vurdert / Ikke satt" : MODENHET_LABELS[v]}
            className={cn(
              "flex-1 rounded-lg border-2 py-2.5 text-sm font-bold transition-all",
              value === v
                ? cn(MODENHET_BG[v], "border-current scale-105 shadow-sm")
                : "border-gray-200 bg-white text-gray-300 hover:border-gray-300 hover:text-gray-500"
            )}
          >
            {v === 0 ? "—" : v}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">
        {value === 0 ? (label.includes("Mål") ? "Ikke satt" : "Ikke vurdert") : MODENHET_LABELS[value]}
      </p>
    </div>
  );
}
