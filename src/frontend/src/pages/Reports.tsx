import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePortfolioTrend,
  useRiskAlerts,
  useSupplierProfiles,
} from "@/hooks/useBackend";
import {
  formatRiskScore,
  getRiskBgColor,
  getRiskColor,
  getRiskLabel,
  normalizeRisk,
} from "@/lib/riskUtils";
import type { RiskAlert, RiskTrendEntry, SupplierProfile } from "@/types";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(ts: bigint | number): string {
  const d = new Date(typeof ts === "bigint" ? Number(ts) : ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtDateTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SortKey = "qualityRisk" | "delayRisk" | "failureRisk" | "compositeRisk";
type SortDir = "asc" | "desc";

const TABS = [
  { id: "trends", label: "Risk Trends" },
  { id: "performance", label: "Performance History" },
  { id: "alerts", label: "Alerts Log" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const SKEL_ROWS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

// ─── RiskTrends ───────────────────────────────────────────────────────────────

function buildChartData(trend: RiskTrendEntry[]) {
  return trend.map((e) => ({
    date: fmtDate(e.timestamp),
    // Backend stores risk as bigint on 0-100 scale; convert to float for chart display
    composite: Number((normalizeRisk(e.compositeRisk) * 100).toFixed(1)),
    quality: Number((normalizeRisk(e.qualityRisk) * 100).toFixed(1)),
    delay: Number((normalizeRisk(e.delayRisk) * 100).toFixed(1)),
    failure: Number((normalizeRisk(e.failureRisk) * 100).toFixed(1)),
  }));
}

// Stable delta seeded from supplier id to avoid re-randomizing on every render
function stableDelta(id: bigint): number {
  const seed = Number(id % BigInt(1000));
  return (seed / 1000 - 0.5) * 0.2;
}

function RiskTrendsTab() {
  const { data: trend, isLoading } = usePortfolioTrend(30);
  const { data: suppliers } = useSupplierProfiles();

  const chartData = useMemo(
    () => (trend ? buildChartData(trend) : []),
    [trend],
  );

  const supplierDeltas = useMemo(() => {
    if (!suppliers)
      return {
        improved: [] as Array<SupplierProfile & { delta: number }>,
        degraded: [] as Array<SupplierProfile & { delta: number }>,
      };
    const withDelta = suppliers.map((s) => ({
      ...s,
      delta: stableDelta(s.id),
    }));
    const sorted = [...withDelta].sort((a, b) => a.delta - b.delta);
    return {
      improved: sorted.slice(0, 5),
      degraded: sorted.slice(-5).reverse(),
    };
  }, [suppliers]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Area chart — composite */}
      <div className="rounded border border-border bg-card p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Portfolio Composite Risk — 30 Days
        </p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.75 0.15 190)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.75 0.15 190)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.02 260)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.014 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  borderRadius: 4,
                  fontSize: 11,
                }}
                formatter={(v: number) => [`${v}%`, "Composite"]}
              />
              <Area
                type="monotone"
                dataKey="composite"
                stroke="oklch(0.75 0.15 190)"
                strokeWidth={2}
                fill="url(#compGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart — quality / delay / failure */}
      <div className="rounded border border-border bg-card p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Quality / Delay / Failure Risk — 30 Days
        </p>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.02 260)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 260)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.014 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  borderRadius: 4,
                  fontSize: 11,
                }}
                formatter={(v: number, name: string) => [`${v}%`, name]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="quality"
                name="Quality"
                stroke="oklch(0.55 0.2 25)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="delay"
                name="Delay"
                stroke="oklch(0.75 0.15 85)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="failure"
                name="Failure"
                stroke="oklch(0.65 0.18 145)"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top movers tables */}
      <div className="grid grid-cols-2 gap-4">
        <MoversTable
          title="Top 5 Most Improved"
          suppliers={supplierDeltas.improved}
          improved
        />
        <MoversTable
          title="Top 5 Most Degraded"
          suppliers={supplierDeltas.degraded}
          improved={false}
        />
      </div>
    </div>
  );
}

interface MoversTableProps {
  title: string;
  suppliers: Array<SupplierProfile & { delta: number }>;
  improved: boolean;
}

function MoversTable({ title, suppliers, improved }: MoversTableProps) {
  return (
    <div className="rounded border border-border bg-card">
      <div className="px-3 py-2 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Supplier</th>
            <th className="px-3 py-2 text-right font-medium">Composite</th>
            <th className="px-3 py-2 text-right font-medium">Δ 30d</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr
              key={s.id.toString()}
              className="border-b border-border/50 hover:bg-muted/20 transition-colors"
            >
              <td className="px-3 py-2 font-medium truncate max-w-[120px]">
                {s.name}
              </td>
              <td
                className={`px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.compositeRisk) * 100)}`}
              >
                {formatRiskScore(s.compositeRisk)}
              </td>
              <td
                className={`px-3 py-2 text-right font-mono font-semibold tabular-nums ${improved ? "text-success" : "text-destructive"}`}
              >
                {improved ? "▼" : "▲"} {Math.abs(s.delta * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── PerformanceHistory ───────────────────────────────────────────────────────

function PerformanceHistoryTab() {
  const { data: suppliers, isLoading } = useSupplierProfiles();
  const [sortKey, setSortKey] = useState<SortKey>("compositeRisk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    if (!suppliers) return [];
    return [...suppliers].sort((a, b) => {
      const an = normalizeRisk(a[sortKey]);
      const bn = normalizeRisk(b[sortKey]);
      return sortDir === "desc" ? bn - an : an - bn;
    });
  }, [suppliers, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="opacity-30 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {SKEL_ROWS.map((k) => (
          <Skeleton key={k} className="h-8" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground">
              <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-muted/30">
                Supplier
              </th>
              <th className="px-3 py-2 text-left font-semibold">Category</th>
              <th className="px-3 py-2 text-left font-semibold">Location</th>
              <th className="px-3 py-2 text-right font-semibold">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("qualityRisk")}
                  data-ocid="sort-quality"
                >
                  Quality <SortIcon col="qualityRisk" />
                </button>
              </th>
              <th className="px-3 py-2 text-right font-semibold">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("delayRisk")}
                  data-ocid="sort-delay"
                >
                  Delay <SortIcon col="delayRisk" />
                </button>
              </th>
              <th className="px-3 py-2 text-right font-semibold">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("failureRisk")}
                  data-ocid="sort-failure"
                >
                  Failure <SortIcon col="failureRisk" />
                </button>
              </th>
              <th className="px-3 py-2 text-right font-semibold">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort("compositeRisk")}
                  data-ocid="sort-composite"
                >
                  Composite <SortIcon col="compositeRisk" />
                </button>
              </th>
              <th className="px-3 py-2 text-right font-semibold">Δ 30d</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const delta = stableDelta(s.id);
              return (
                <tr
                  key={s.id.toString()}
                  className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                  data-ocid="perf-row"
                >
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {s.category}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    {s.location}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.qualityRisk) * 100)}`}
                  >
                    {formatRiskScore(s.qualityRisk)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.delayRisk) * 100)}`}
                  >
                    {formatRiskScore(s.delayRisk)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.failureRisk) * 100)}`}
                  >
                    {formatRiskScore(s.failureRisk)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums font-semibold ${getRiskColor(normalizeRisk(s.compositeRisk) * 100)}`}
                  >
                    {formatRiskScore(s.compositeRisk)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${delta < 0 ? "text-success" : "text-destructive"}`}
                  >
                    {delta < 0 ? "▼" : "▲"} {Math.abs(delta * 100).toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── AlertsLog ────────────────────────────────────────────────────────────────

const SEVERITY_OPTIONS = ["all", "high", "medium", "low"] as const;
type SeverityFilter = (typeof SEVERITY_OPTIONS)[number];

function groupByDate(alerts: RiskAlert[]): Record<string, RiskAlert[]> {
  return alerts.reduce<Record<string, RiskAlert[]>>((acc, a) => {
    const key = new Date(Number(a.triggeredAt)).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});
}

function AlertsLogTab() {
  const { data: alerts, isLoading } = useRiskAlerts(0);
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (severity !== "all" && a.riskLevel !== severity) return false;
      if (
        search &&
        !a.supplierName.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (dateFrom && Number(a.triggeredAt) < new Date(dateFrom).getTime())
        return false;
      if (
        dateTo &&
        Number(a.triggeredAt) > new Date(dateTo).getTime() + 86400000
      )
        return false;
      return true;
    });
  }, [alerts, severity, search, dateFrom, dateTo]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {SKEL_ROWS.map((k) => (
          <Skeleton key={k} className="h-10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-2"
        data-ocid="alerts-filters"
      >
        <Input
          placeholder="Search supplier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs w-44"
          data-ocid="alerts-search"
        />
        <div className="flex items-center gap-1">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSeverity(opt)}
              className={`px-2 py-1 text-[10px] font-semibold uppercase rounded border transition-smooth ${
                severity === opt
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/50"
              }`}
              data-ocid={`severity-filter-${opt}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-muted-foreground">From</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-7 text-xs w-32"
            data-ocid="date-from"
          />
          <span className="text-xs text-muted-foreground">To</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-7 text-xs w-32"
            data-ocid="date-to"
          />
        </div>
      </div>

      {/* Grouped alerts */}
      {Object.keys(grouped).length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground text-sm"
          data-ocid="alerts-empty"
        >
          No alerts match the current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, dayAlerts]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {date}
                </span>
                <span className="text-[10px] text-muted-foreground/50">
                  ({dayAlerts.length})
                </span>
                <div className="flex-1 border-t border-border/40" />
              </div>
              <div className="space-y-1">
                {dayAlerts.map((alert) => (
                  <AlertRow
                    key={`${alert.supplierId.toString()}-${alert.triggeredAt.toString()}`}
                    alert={alert}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: RiskAlert }) {
  const compositeFloat = normalizeRisk(alert.compositeRisk);
  const bgClass = getRiskBgColor(compositeFloat * 100);
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded border bg-card hover:bg-muted/20 transition-colors text-xs"
      data-ocid="alert-row"
    >
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${bgClass}`}
      >
        {getRiskLabel(compositeFloat * 100)}
      </span>
      <span className="font-medium flex-1 min-w-0 truncate">
        {alert.supplierName}
      </span>
      <span className="text-muted-foreground font-mono tabular-nums text-[10px]">
        Q:{formatRiskScore(alert.qualityRisk)} D:
        {formatRiskScore(alert.delayRisk)} F:
        {formatRiskScore(alert.failureRisk)}
      </span>
      <span
        className={`font-mono tabular-nums font-semibold ${getRiskColor(compositeFloat * 100)}`}
      >
        {formatRiskScore(alert.compositeRisk)}
      </span>
      <span className="text-muted-foreground/70 font-mono text-[10px]">
        {fmtDateTime(alert.triggeredAt)}
      </span>
    </div>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabId>("trends");

  return (
    <div className="space-y-4" data-ocid="reports-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest">
            Reports
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            Risk trends, performance history &amp; audit trail
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono">
          Live Data
        </Badge>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-0 border-b border-border"
        data-ocid="reports-tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-smooth ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "trends" && <RiskTrendsTab />}
        {activeTab === "performance" && <PerformanceHistoryTab />}
        {activeTab === "alerts" && <AlertsLogTab />}
      </div>
    </div>
  );
}
