"use client";
import { cn } from "@/lib/utils";
import { MODENHET_LABELS } from "@/lib/types";

const COLORS: Record<number, string> = {
  0: "bg-gray-100 text-gray-400",
  1: "bg-red-200 text-red-900",
  2: "bg-orange-200 text-orange-900",
  3: "bg-yellow-200 text-yellow-900",
  4: "bg-lime-200 text-lime-900",
  5: "bg-green-300 text-green-900",
};

interface ModenhetCellProps {
  value: number;
  mål?: number;
  onClick?: () => void;
  compact?: boolean;
}

export function ModenhetCell({ value, mål, onClick, compact = false }: ModenhetCellProps) {
  const gap = mål && mål > 0 ? mål - value : undefined;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded transition-all",
        COLORS[value],
        onClick && "cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-1",
        compact ? "h-10 min-w-[3rem] px-2" : "h-14 min-w-[4rem] px-3"
      )}
      title={`Nå: ${MODENHET_LABELS[value]}${mål && mål > 0 ? ` | Mål: ${MODENHET_LABELS[mål]}` : ""}`}
    >
      <span className={cn("font-bold", compact ? "text-sm" : "text-lg")}>
        {value === 0 ? "—" : value}
      </span>
      {gap !== undefined && gap > 0 && (
        <span className="text-[10px] font-medium opacity-70">+{gap}</span>
      )}
    </div>
  );
}
