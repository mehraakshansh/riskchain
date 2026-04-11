import { RiskBadge } from "@/components/shared/RiskBadge";
import { SparklineChart } from "@/components/shared/SparklineChart";
import { StatCard } from "@/components/shared/StatCard";
import { useThresholds } from "@/context/ThresholdContext";
import {
  usePortfolioSnapshot,
  usePortfolioTrend,
  useRiskAlerts,
  useSupplierProfiles,
} from "@/hooks/useBackend";
import {
  formatRiskScore,
  generateMockTrend,
  getRiskColor,
  getRiskHex,
  getRiskLabel,
  getRiskLevel,
  normalizeRisk,
  toNumber,
} from "@/lib/riskUtils";
import { cn } from "@/lib/utils";
import type { RiskAlert, RiskTrendEntry, SupplierProfile } from "@/types";
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Risk Gauge (SVG arc) ─────────────────────────────────────────────────────

function RiskGauge({ score }: { score: number }) {
  const pct = score * 100;
  const color = getRiskHex(pct);
  const label = getRiskLabel(pct);
  const radius = 52;
  const cx = 70;
  const cy = 68;
  const START = 215;
  const END = 325;
  const ARC = END - START;

  function polarToXY(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }
  function arcPath(a1: number, a2: number) {
    const s = polarToXY(a1);
    const e = polarToXY(a2);
    const lg = a2 - a1 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${lg} 1 ${e.x} ${e.y}`;
  }

  const progressEnd = START + (Math.min(pct, 100) / 100) * ARC;

  return (
    <svg width={140} height={88} role="img" aria-labelledby="gauge-title">
      <title id="gauge-title">{`Portfolio risk ${pct.toFixed(1)}%`}</title>
      <path
        d={arcPath(START, START + ARC)}
        fill="none"
        stroke="oklch(0.28 0.02 260)"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d={arcPath(START, progressEnd)}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill={color}
        fontSize={21}
        fontWeight={700}
        fontFamily="Space Grotesk"
      >
        {pct.toFixed(1)}%
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fill="oklch(0.55 0.01 260)"
        fontSize={9}
        fontFamily="Geist Mono"
        letterSpacing={2}
      >
        {label} RISK
      </text>
    </svg>
  );
}

// ── Risk Distribution Bars ────────────────────────────────────────────────────

function RiskDistribution({
  high,
  medium,
  low,
}: {
  high: number;
  medium: number;
  low: number;
}) {
  const total = Math.max(high + medium + low, 1);
  const bars = [
    {
      label: "HIGH",
      count: high,
      pct: (high / total) * 100,
      barClass: "bg-destructive",
    },
    {
      label: "MED",
      count: medium,
      pct: (medium / total) * 100,
      barClass: "bg-warning",
    },
    {
      label: "LOW",
      count: low,
      pct: (low / total) * 100,
      barClass: "bg-success",
    },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground w-8 shrink-0">
            {b.label}
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                b.barClass,
              )}
              style={{ width: `${b.pct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums text-foreground w-20 text-right shrink-0">
            {b.count} ({b.pct.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Top At-Risk Suppliers Table ───────────────────────────────────────────────

function SuppliersTable({ suppliers }: { suppliers: SupplierProfile[] }) {
  const top10 = [...suppliers]
    .sort((a, b) => Number(b.compositeRisk) - Number(a.compositeRisk))
    .slice(0, 10);

  const TIER_CLS: Record<number, string> = {
    1: "bg-primary/20 text-primary border-primary/30",
    2: "bg-muted text-muted-foreground border-border",
    3: "bg-muted/50 text-muted-foreground border-border",
  };

  const HEADERS = [
    "Supplier",
    "Tier",
    "Quality",
    "Delay",
    "Failure",
    "Composite",
    "30d Trend",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse min-w-[680px]">
        <thead>
          <tr className="border-b border-border">
            {HEADERS.map((h) => (
              <th
                key={h}
                className="text-left py-1.5 px-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top10.map((s) => {
            const compositeFloat = normalizeRisk(s.compositeRisk);
            const trend = generateMockTrend(s.compositeRisk, 30);
            const tierCls = TIER_CLS[s.tier] ?? TIER_CLS[3];
            return (
              <tr
                key={s.id.toString()}
                data-ocid="supplier-row"
                className="border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <td className="py-1.5 px-2 font-medium text-foreground max-w-[150px] truncate">
                  {s.name}
                </td>
                <td className="py-1.5 px-2">
                  <span
                    className={cn(
                      "inline-flex items-center border rounded-sm px-1.5 py-0.5 text-[9px] font-mono",
                      tierCls,
                    )}
                  >
                    T{s.tier}
                  </span>
                </td>
                <td className="py-1.5 px-2">
                  <RiskBadge score={normalizeRisk(s.qualityRisk)} size="sm" />
                </td>
                <td className="py-1.5 px-2">
                  <RiskBadge score={normalizeRisk(s.delayRisk)} size="sm" />
                </td>
                <td className="py-1.5 px-2">
                  <RiskBadge score={normalizeRisk(s.failureRisk)} size="sm" />
                </td>
                <td className="py-1.5 px-2">
                  <span
                    className={cn(
                      "font-mono font-bold tabular-nums text-xs",
                      getRiskColor(Number(s.compositeRisk)),
                    )}
                  >
                    {Number(s.compositeRisk).toFixed(1)}%
                  </span>
                </td>
                <td className="py-1.5 px-2 w-[100px]">
                  <SparklineChart
                    data={trend}
                    score={compositeFloat}
                    width={96}
                    height={26}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Portfolio Trend Area Chart ────────────────────────────────────────────────

function PortfolioTrendChart({ data }: { data: RiskTrendEntry[] }) {
  const chartData = data.map((d, i) => {
    const dt = new Date(Number(d.timestamp));
    return {
      i,
      label: `${dt.getMonth() + 1}/${dt.getDate()}`,
      composite: Number(((Number(d.compositeRisk) / 100) * 100).toFixed(1)),
      quality: Number(((Number(d.qualityRisk) / 100) * 100).toFixed(1)),
      delay: Number(((Number(d.delayRisk) / 100) * 100).toFixed(1)),
      failure: Number(((Number(d.failureRisk) / 100) * 100).toFixed(1)),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={176}>
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="oklch(0.75 0.15 190)"
              stopOpacity={0.28}
            />
            <stop
              offset="95%"
              stopColor="oklch(0.75 0.15 190)"
              stopOpacity={0.02}
            />
          </linearGradient>
          <linearGradient id="gq" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="oklch(0.55 0.2 25)"
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor="oklch(0.55 0.2 25)"
              stopOpacity={0.01}
            />
          </linearGradient>
          <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="oklch(0.75 0.15 85)"
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor="oklch(0.75 0.15 85)"
              stopOpacity={0.01}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(0.28 0.02 260)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{
            fontSize: 9,
            fill: "oklch(0.55 0.01 260)",
            fontFamily: "Geist Mono",
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{
            fontSize: 9,
            fill: "oklch(0.55 0.01 260)",
            fontFamily: "Geist Mono",
          }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.22 0.02 260)",
            border: "1px solid oklch(0.28 0.02 260)",
            borderRadius: "3px",
            fontSize: "10px",
            fontFamily: "Geist Mono",
          }}
          labelStyle={{ color: "oklch(0.95 0.01 260)", marginBottom: "4px" }}
          itemStyle={{ color: "oklch(0.75 0.01 260)" }}
          formatter={(v: number, name: string) => [`${v}%`, name]}
        />
        <Area
          type="monotone"
          dataKey="quality"
          name="Quality"
          stroke="oklch(0.55 0.2 25)"
          strokeWidth={1}
          fill="url(#gq)"
          dot={false}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="delay"
          name="Delay"
          stroke="oklch(0.75 0.15 85)"
          strokeWidth={1}
          fill="url(#gd)"
          dot={false}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="composite"
          name="Composite"
          stroke="oklch(0.75 0.15 190)"
          strokeWidth={2}
          fill="url(#gc)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Alert Feed ────────────────────────────────────────────────────────────────

function AlertFeed({ alerts }: { alerts: RiskAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div
        data-ocid="alert-empty"
        className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground"
      >
        <Shield className="w-5 h-5" />
        <span className="text-[10px] font-mono">No active alerts</span>
      </div>
    );
  }

  return (
    <div
      data-ocid="alert-feed"
      className="flex flex-col divide-y divide-border/50 overflow-y-auto max-h-[268px]"
    >
      {alerts.map((alert) => {
        const elapsed = Date.now() - Number(alert.triggeredAt);
        const mins = Math.floor(elapsed / 60000);
        const timeLabel =
          mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
        const compositeNum = Number(alert.compositeRisk);
        const level = getRiskLevel(compositeNum);
        const dotCls =
          level === "high"
            ? "bg-destructive"
            : level === "medium"
              ? "bg-warning"
              : "bg-success";

        return (
          <div
            key={alert.supplierId.toString()}
            data-ocid="alert-row"
            className="flex items-start gap-3 py-2 hover:bg-muted/20 transition-colors"
          >
            <div
              className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", dotCls)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-foreground truncate">
                  {alert.supplierName}
                </span>
                <RiskBadge
                  score={normalizeRisk(alert.compositeRisk)}
                  size="sm"
                  showScore={false}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Q:{formatRiskScore(alert.qualityRisk)} · D:
                {formatRiskScore(alert.delayRisk)} · F:
                {formatRiskScore(alert.failureRisk)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">
              {timeLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Chart Legend ──────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { label: "Composite", color: "oklch(0.75 0.15 190)" },
  { label: "Quality", color: "oklch(0.55 0.2 25)" },
  { label: "Delay", color: "oklch(0.75 0.15 85)" },
] as const;

function ChartLegend() {
  return (
    <div className="flex items-center gap-4">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className="w-3 h-0.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[10px] font-mono text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {count !== undefined && (
        <span className="text-[9px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
          {count}
        </span>
      )}
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const snapshotQuery = usePortfolioSnapshot();
  const suppliersQuery = useSupplierProfiles();
  const { compositeThreshold } = useThresholds();
  const alertsQuery = useRiskAlerts(compositeThreshold);
  const trendQuery = usePortfolioTrend(30);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevTs = useRef<number>(0);

  useEffect(() => {
    const ts = snapshotQuery.dataUpdatedAt;
    if (ts && ts !== prevTs.current) {
      prevTs.current = ts;
      setLastUpdated(new Date(ts));
      setIsRefreshing(true);
      const t = setTimeout(() => setIsRefreshing(false), 700);
      return () => clearTimeout(t);
    }
  }, [snapshotQuery.dataUpdatedAt]);

  const snapshot = snapshotQuery.data;
  const suppliers = suppliersQuery.data ?? [];
  const alerts = alertsQuery.data ?? [];
  const trend = trendQuery.data ?? [];

  // Normalize bigint scores to 0-1 floats for gauge/stat cards
  const portfolioScore = snapshot
    ? normalizeRisk(snapshot.portfolioRiskScore)
    : 0;
  const avgRisk = snapshot ? normalizeRisk(snapshot.avgCompositeRisk) : 0;
  const maxRiskScore = snapshot ? normalizeRisk(snapshot.maxRiskScore) : 0;
  const highCount = toNumber(snapshot?.highRiskCount ?? BigInt(0));
  const medCount = toNumber(snapshot?.mediumRiskCount ?? BigInt(0));
  const lowCount = toNumber(snapshot?.lowRiskCount ?? BigInt(0));
  const totalSuppliers = toNumber(snapshot?.totalSuppliers ?? BigInt(0));

  const timeStr = lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4 p-4" data-ocid="dashboard">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">
            Portfolio Risk Overview
          </h1>
          <p className="text-[10px] text-muted-foreground font-mono">
            ML-driven supply chain risk intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            data-ocid="last-updated"
            className={cn(
              "flex items-center gap-1.5 text-[10px] font-mono",
              isRefreshing ? "text-primary" : "text-muted-foreground",
            )}
          >
            <RefreshCw
              className={cn("w-3 h-3", isRefreshing && "animate-spin")}
            />
            <span>Updated {timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            LIVE · 5s
          </div>
        </div>
      </div>

      {/* Top Row: Gauge + 4 Stat Cards + Distribution */}
      <div className="grid grid-cols-12 gap-3">
        {/* Risk Gauge */}
        <div className="col-span-12 sm:col-span-3 bg-card border border-border p-3 flex flex-col items-center justify-center gap-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground self-start">
            Portfolio Risk Score
          </span>
          <RiskGauge score={portfolioScore} />
          <div className="text-[10px] font-mono text-muted-foreground">
            Max:{" "}
            <span className={getRiskColor(maxRiskScore * 100)}>
              {formatRiskScore(snapshot?.maxRiskScore ?? BigInt(0))}
            </span>
            {" · "}
            Supplier #{toNumber(snapshot?.maxRiskSupplierId ?? BigInt(0))}
          </div>
        </div>

        {/* 4 Stat Cards in 2×2 */}
        <div className="col-span-12 sm:col-span-5 grid grid-cols-2 gap-2">
          <StatCard
            data-ocid="stat-avg-risk"
            label="Avg Composite Risk"
            value={formatRiskScore(snapshot?.avgCompositeRisk ?? BigInt(0))}
            colorClass={getRiskColor(avgRisk * 100)}
            icon={<Zap className="w-3 h-3" />}
          />
          <StatCard
            data-ocid="stat-high-risk"
            label="High Risk Suppliers"
            value={highCount}
            colorClass="text-destructive"
            subValue={`of ${totalSuppliers} total`}
            icon={<AlertTriangle className="w-3 h-3" />}
          />
          <StatCard
            data-ocid="stat-total-suppliers"
            label="Total Suppliers"
            value={totalSuppliers}
            icon={<Users className="w-3 h-3" />}
          />
          <StatCard
            data-ocid="stat-alerts"
            label="Active Alerts"
            value={alerts.length}
            colorClass={alerts.length > 0 ? "text-warning" : "text-success"}
            icon={<Clock className="w-3 h-3" />}
          />
        </div>

        {/* Risk Distribution */}
        <div className="col-span-12 sm:col-span-4 bg-card border border-border p-3">
          <SectionHeader title="Risk Distribution" />
          <RiskDistribution high={highCount} medium={medCount} low={lowCount} />
        </div>
      </div>

      {/* Middle Row: Trend Chart + Alert Feed */}
      <div className="grid grid-cols-12 gap-3">
        {/* Portfolio Trend */}
        <div className="col-span-12 sm:col-span-8 bg-card border border-border p-3">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Portfolio Risk Trend — 30 Days
            </h2>
            <ChartLegend />
          </div>
          {trend.length > 0 ? (
            <PortfolioTrendChart data={trend} />
          ) : (
            <div className="h-[176px] flex items-center justify-center text-muted-foreground text-[11px] font-mono">
              Loading trend…
            </div>
          )}
        </div>

        {/* Alert Feed */}
        <div className="col-span-12 sm:col-span-4 bg-card border border-border p-3">
          <SectionHeader title="Active Alerts" count={alerts.length} />
          <AlertFeed alerts={alerts} />
        </div>
      </div>

      {/* Bottom: Top 10 At-Risk Suppliers */}
      <div className="bg-card border border-border p-3">
        <SectionHeader
          title="Top 10 At-Risk Suppliers"
          count={Math.min(10, suppliers.length)}
        />
        {suppliers.length > 0 ? (
          <SuppliersTable suppliers={suppliers} />
        ) : (
          <div className="h-24 flex items-center justify-center text-muted-foreground text-[11px] font-mono">
            Loading supplier data…
          </div>
        )}
      </div>
    </div>
  );
}
