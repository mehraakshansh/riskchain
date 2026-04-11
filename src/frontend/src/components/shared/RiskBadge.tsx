import { getRiskBgColor, getRiskLabel } from "@/lib/riskUtils";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  /** Risk score as a 0–1 float (e.g. 0.72 = 72%). All classification is done on 0–100 scale internally. */
  score: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({
  score,
  showScore = true,
  size = "md",
  className,
}: RiskBadgeProps) {
  // Convert 0-1 float → 0-100 scale for classification
  const score100 = score * 100;
  const colorClass = getRiskBgColor(score100);
  const label = getRiskLabel(score100);
  const pct = score100.toFixed(1);

  const sizeClass = {
    sm: "text-[10px] px-1.5 py-0.5 font-mono",
    md: "text-xs px-2 py-0.5 font-mono",
    lg: "text-sm px-2.5 py-1 font-mono",
  }[size];

  return (
    <span
      data-ocid="risk-badge"
      className={cn(
        "inline-flex items-center gap-1 border rounded-sm font-semibold tabular-nums tracking-wide",
        colorClass,
        sizeClass,
        className,
      )}
    >
      <span>{label}</span>
      {showScore && <span className="opacity-80">{pct}%</span>}
    </span>
  );
}
