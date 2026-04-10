import { getRiskBgColor, getRiskLabel } from "@/lib/riskUtils";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
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
  const colorClass = getRiskBgColor(score);
  const label = getRiskLabel(score);
  const pct = (score * 100).toFixed(1);

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
