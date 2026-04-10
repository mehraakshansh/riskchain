import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  colorClass?: string;
  icon?: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  colorClass,
  icon,
  className,
  "data-ocid": dataOcid,
}: StatCardProps) {
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  const trendColor =
    trend === "up"
      ? "text-destructive"
      : trend === "down"
        ? "text-success"
        : "text-muted-foreground";

  return (
    <div
      data-ocid={dataOcid ?? "stat-card"}
      className={cn(
        "bg-card border border-border p-3 flex flex-col gap-1 min-w-0",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate">
          {label}
        </span>
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
      </div>
      <div
        className={cn(
          "text-2xl font-display font-bold tabular-nums leading-none",
          colorClass ?? "text-foreground",
        )}
      >
        {value}
      </div>
      {(subValue || trendValue) && (
        <div className="flex items-center gap-2 mt-0.5">
          {trendValue && (
            <span
              className={cn("text-[10px] font-mono tabular-nums", trendColor)}
            >
              {trendIcon} {trendValue}
            </span>
          )}
          {subValue && (
            <span className="text-[10px] text-muted-foreground truncate">
              {subValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
