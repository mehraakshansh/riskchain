import { usePortfolioSnapshot } from "@/hooks/useBackend";
import { useRiskAlerts } from "@/hooks/useBackend";
import { getRiskBgColor, getRiskLabel, normalizeRisk } from "@/lib/riskUtils";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { data: snapshot, isFetching } = usePortfolioSnapshot();
  const { data: alerts } = useRiskAlerts(60);
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!isFetching) setLastRefresh(new Date());
  }, [isFetching]);

  const portfolioScore = snapshot
    ? normalizeRisk(snapshot.portfolioRiskScore)
    : 0;
  const riskClass = getRiskBgColor(portfolioScore * 100);
  const riskLabel = getRiskLabel(portfolioScore * 100);
  const alertCount = alerts?.length ?? 0;

  const elapsedSec = Math.floor((Date.now() - lastRefresh.getTime()) / 1000);

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <header
      data-ocid="header"
      className="h-12 bg-card border-b border-border flex items-center px-4 gap-4 shrink-0"
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xs font-mono font-bold tracking-widest uppercase text-foreground truncate">
          Supply Chain Risk Intelligence
        </h1>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            isFetching ? "bg-warning animate-pulse" : "bg-success",
          )}
        />
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums hidden sm:block">
          {isFetching ? "SYNCING" : `${elapsedSec}s ago`}
        </span>
      </div>

      {/* Portfolio Risk Badge */}
      {snapshot && (
        <div
          data-ocid="portfolio-risk-badge"
          className={cn(
            "flex items-center gap-1.5 border px-2 py-1 rounded-sm",
            riskClass,
          )}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest opacity-70">
            Portfolio
          </span>
          <span className="text-xs font-mono font-bold tabular-nums">
            {riskLabel} {(portfolioScore * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Alerts */}
      <button
        type="button"
        data-ocid="alerts-btn"
        onClick={handleRefresh}
        className="relative text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`${alertCount} active alerts`}
      >
        <Bell size={14} />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-[8px] font-mono rounded-full w-3.5 h-3.5 flex items-center justify-center text-destructive-foreground">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        )}
      </button>

      {/* Refresh */}
      <button
        type="button"
        data-ocid="refresh-btn"
        onClick={handleRefresh}
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors",
          isFetching && "animate-spin",
        )}
        aria-label="Refresh data"
      >
        <RefreshCw size={14} />
      </button>
    </header>
  );
}
