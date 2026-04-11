import { RiskBadge } from "@/components/shared/RiskBadge";
import { SparklineChart } from "@/components/shared/SparklineChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLogMitigation,
  useSupplierProfiles,
  useSupplierTrend,
} from "@/hooks/useBackend";
import {
  formatPercent,
  formatRiskScore,
  generateMockTrend,
  getRiskColor,
  normalizeRisk,
} from "@/lib/riskUtils";
import type { MitigationAction, SupplierProfile } from "@/types";
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

// ─── Types ────────────────────────────────────────────────────────────────────
type SortKey =
  | "name"
  | "tier"
  | "category"
  | "location"
  | "qualityRisk"
  | "delayRisk"
  | "failureRisk"
  | "compositeRisk";

type SortDir = "asc" | "desc";
type TierFilter = "all" | "1" | "2" | "3";
type RiskFilter = "all" | "high" | "medium" | "low";

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({
  col,
  active,
  dir,
}: { col: SortKey; active: SortKey; dir: SortDir }) {
  if (col !== active)
    return <ChevronsUpDown className="h-3 w-3 opacity-30 shrink-0" />;
  return dir === "asc" ? (
    <ChevronDown className="h-3 w-3 rotate-180 shrink-0" />
  ) : (
    <ChevronDown className="h-3 w-3 shrink-0" />
  );
}

// ─── Metric row ───────────────────────────────────────────────────────────────
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-muted-foreground text-[11px]">{label}</span>
      <span className="font-mono text-[11px] tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

// ─── Mitigation panel ─────────────────────────────────────────────────────────
interface MitigationPanelProps {
  supplierId: bigint;
  localActions: MitigationAction[];
  onAdded: (a: MitigationAction) => void;
}

function MitigationPanel({
  supplierId,
  localActions,
  onAdded,
}: MitigationPanelProps) {
  const [actionText, setActionText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const logMitigation = useLogMitigation();

  const handleAdd = useCallback(() => {
    const text = actionText.trim();
    if (!text || !dueDate) return;
    const due = BigInt(new Date(dueDate).getTime());
    const newAction: MitigationAction = {
      id: BigInt(Date.now()),
      supplierId,
      action: text,
      dueDate: due,
      status: "pending",
      createdAt: BigInt(Date.now()),
    };
    logMitigation.mutate(
      { supplierId, action: text, dueDate: due },
      {
        onSuccess: (id) => onAdded({ ...newAction, id }),
        onError: () => onAdded(newAction),
      },
    );
    setActionText("");
    setDueDate("");
  }, [actionText, dueDate, supplierId, logMitigation, onAdded]);

  const statusColor: Record<string, string> = {
    pending: "bg-warning/15 text-warning border-warning/30",
    completed: "bg-success/15 text-success border-success/30",
    cancelled: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Mitigation Actions
      </p>

      {/* Add action form */}
      <div className="flex gap-1.5 items-center">
        <Input
          placeholder="Describe mitigation action..."
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          className="h-7 text-xs flex-1 bg-muted/30 border-border"
          data-ocid="mitigation-action-input"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-7 text-xs w-32 bg-muted/30 border-border"
          data-ocid="mitigation-due-date"
        />
        <Button
          type="button"
          size="sm"
          className="h-7 text-xs px-2 shrink-0"
          onClick={handleAdd}
          disabled={!actionText.trim() || !dueDate || logMitigation.isPending}
          data-ocid="mitigation-add-btn"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Existing actions */}
      {localActions.length === 0 ? (
        <p className="text-[11px] text-muted-foreground italic">
          No mitigation actions recorded.
        </p>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {localActions.map((a) => (
            <div
              key={a.id.toString()}
              className="flex items-start gap-2 py-1 border-b border-border last:border-0"
            >
              <span
                className={`inline-flex items-center border rounded-sm px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wide shrink-0 ${statusColor[a.status] ?? "bg-muted text-foreground border-border"}`}
              >
                {a.status.toUpperCase()}
              </span>
              <span className="flex-1 text-[11px] text-foreground leading-snug min-w-0">
                {a.action}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {new Date(Number(a.dueDate)).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
interface DetailPanelProps {
  supplier: SupplierProfile;
  onClose: () => void;
  localActions: MitigationAction[];
  onActionAdded: (a: MitigationAction) => void;
}

function DetailPanel({
  supplier,
  onClose,
  localActions,
  onActionAdded,
}: DetailPanelProps) {
  const { data: trend } = useSupplierTrend(supplier.id, 30);
  const qTrend =
    trend?.map((t) => normalizeRisk(t.qualityRisk)) ??
    generateMockTrend(supplier.qualityRisk, 30);
  const dTrend =
    trend?.map((t) => normalizeRisk(t.delayRisk)) ??
    generateMockTrend(supplier.delayRisk, 30);
  const fTrend =
    trend?.map((t) => normalizeRisk(t.failureRisk)) ??
    generateMockTrend(supplier.failureRisk, 30);
  const cTrend =
    trend?.map((t) => normalizeRisk(t.compositeRisk)) ??
    generateMockTrend(supplier.compositeRisk, 30);

  const riskRows = [
    {
      label: "Quality Risk",
      data: qTrend,
      score: normalizeRisk(supplier.qualityRisk),
    },
    {
      label: "Delay Risk",
      data: dTrend,
      score: normalizeRisk(supplier.delayRisk),
    },
    {
      label: "Failure Risk",
      data: fTrend,
      score: normalizeRisk(supplier.failureRisk),
    },
    {
      label: "Composite",
      data: cTrend,
      score: normalizeRisk(supplier.compositeRisk),
    },
  ];

  return (
    <tr>
      <td colSpan={10} className="p-0">
        <div
          className="bg-muted/10 border-b border-border px-4 py-3 space-y-3"
          data-ocid="supplier-detail-panel"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                {supplier.name}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                Tier {supplier.tier}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {supplier.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {supplier.location}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 shrink-0"
              onClick={onClose}
              aria-label="Close detail panel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Metrics column */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                Operational Metrics
              </p>
              <div className="divide-y divide-border">
                <MetricRow
                  label="Defect Rate"
                  value={formatPercent(supplier.defectRate)}
                />
                <MetricRow
                  label="On-Time Delivery"
                  value={formatPercent(supplier.onTimeDeliveryRate)}
                />
                <MetricRow
                  label="Avg Lead Time"
                  value={`${Number(supplier.avgLeadTimeDays)}d`}
                />
                <MetricRow
                  label="Carrier Score"
                  value={formatPercent(supplier.carrierPerformanceScore)}
                />
                <MetricRow
                  label="Equipment Failure"
                  value={formatPercent(supplier.equipmentFailureRate)}
                />
                <MetricRow
                  label="Supply Interruptions"
                  value={supplier.supplyInterruptionCount.toString()}
                />
                <MetricRow
                  label="Volume Handled"
                  value={Number(supplier.volumeHandled).toLocaleString()}
                />
                <MetricRow
                  label="Years Active"
                  value={`${Number(supplier.yearsActive)}y`}
                />
              </div>
            </div>

            {/* Trend column */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                30-Day Risk Trend
              </p>
              <div className="space-y-2">
                {riskRows.map(({ label, data, score }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-24 shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <SparklineChart
                        data={data}
                        score={score}
                        height={22}
                        showTooltip
                      />
                    </div>
                    <span
                      className={`text-[11px] font-mono tabular-nums shrink-0 ${getRiskColor(score * 100)}`}
                    >
                      {formatRiskScore(score)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigation column */}
            <div>
              <MitigationPanel
                supplierId={supplier.id}
                localActions={localActions}
                onAdded={onActionAdded}
              />
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Supplier row ─────────────────────────────────────────────────────────────
interface SupplierRowProps {
  supplier: SupplierProfile;
  isExpanded: boolean;
  onToggle: () => void;
  localActions: MitigationAction[];
  onActionAdded: (a: MitigationAction) => void;
}

function SupplierRow({
  supplier,
  isExpanded,
  onToggle,
  localActions,
  onActionAdded,
}: SupplierRowProps) {
  const compositeFloat = normalizeRisk(supplier.compositeRisk);
  const sparkData = useMemo(
    () => generateMockTrend(supplier.compositeRisk, 14),
    [supplier.compositeRisk],
  );

  return (
    <>
      <tr
        className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggle();
        }}
        data-ocid="supplier-row"
      >
        {/* Name */}
        <td className="px-3 py-2">
          <div className="flex items-center gap-1.5">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
              {supplier.name}
            </span>
          </div>
        </td>
        {/* Tier */}
        <td className="px-3 py-2 text-center">
          <Badge
            variant="outline"
            className="text-[10px] font-mono py-0 px-1.5"
          >
            T{supplier.tier}
          </Badge>
        </td>
        {/* Category */}
        <td className="px-3 py-2 text-[11px] text-muted-foreground">
          {supplier.category}
        </td>
        {/* Location */}
        <td className="px-3 py-2 text-[11px] text-muted-foreground truncate max-w-[110px]">
          {supplier.location}
        </td>
        {/* Quality */}
        <td className="px-3 py-2">
          <RiskBadge score={normalizeRisk(supplier.qualityRisk)} size="sm" />
        </td>
        {/* Delay */}
        <td className="px-3 py-2">
          <RiskBadge score={normalizeRisk(supplier.delayRisk)} size="sm" />
        </td>
        {/* Failure */}
        <td className="px-3 py-2">
          <RiskBadge score={normalizeRisk(supplier.failureRisk)} size="sm" />
        </td>
        {/* Composite */}
        <td className="px-3 py-2">
          <RiskBadge score={compositeFloat} size="sm" />
        </td>
        {/* Sparkline */}
        <td className="px-3 py-2 w-24">
          <SparklineChart data={sparkData} score={compositeFloat} height={26} />
        </td>
        {/* Action */}
        <td className="px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] px-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            data-ocid="supplier-row-action"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "Collapse" : "Details"}
          </Button>
        </td>
      </tr>

      {isExpanded && (
        <DetailPanel
          supplier={supplier}
          onClose={onToggle}
          localActions={localActions}
          onActionAdded={onActionAdded}
        />
      )}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Suppliers() {
  const { data: suppliers, isLoading } = useSupplierProfiles();

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("compositeRisk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localMitigations, setLocalMitigations] = useState<
    Record<string, MitigationAction[]>
  >({});

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
      setPage(0);
    },
    [sortKey],
  );

  const filtered = useMemo(() => {
    const list = suppliers ?? [];
    return list
      .filter((s) => {
        const q = search.toLowerCase();
        if (q && !s.name.toLowerCase().includes(q)) return false;
        if (tierFilter !== "all" && s.tier !== Number(tierFilter)) return false;
        if (riskFilter !== "all") {
          // compositeRisk is bigint on 0-100 scale from backend
          // HIGH: >70, MID: >40 && <=70, LOW: <=40
          const score = Number(s.compositeRisk);
          if (riskFilter === "high" && score <= 70) return false;
          if (riskFilter === "medium" && (score <= 40 || score > 70))
            return false;
          if (riskFilter === "low" && score > 40) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let av: number | string;
        let bv: number | string;
        switch (sortKey) {
          case "name":
            av = a.name;
            bv = b.name;
            break;
          case "tier":
            av = a.tier;
            bv = b.tier;
            break;
          case "category":
            av = a.category;
            bv = b.category;
            break;
          case "location":
            av = a.location;
            bv = b.location;
            break;
          default:
            // bigint risk fields — convert to number for comparison
            av = Number(a[sortKey] as bigint);
            bv = Number(b[sortKey] as bigint);
        }
        if (typeof av === "string" && typeof bv === "string") {
          return sortDir === "asc"
            ? av.localeCompare(bv)
            : bv.localeCompare(av);
        }
        const an = av as number;
        const bn = bv as number;
        return sortDir === "asc" ? an - bn : bn - an;
      });
  }, [suppliers, search, tierFilter, riskFilter, sortKey, sortDir]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleActionAdded = useCallback(
    (supplierId: string, action: MitigationAction) => {
      setLocalMitigations((prev) => ({
        ...prev,
        [supplierId]: [...(prev[supplierId] ?? []), action],
      }));
    },
    [],
  );

  // Column header with sort
  function ThCol({
    col,
    label,
    className = "",
  }: { col: SortKey; label: string; className?: string }) {
    return (
      <th
        className={`px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap ${className}`}
        onClick={() => handleSort(col)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleSort(col);
        }}
        data-ocid={`sort-${col}`}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <SortIcon col={col} active={sortKey} dir={sortDir} />
        </span>
      </th>
    );
  }

  const skeletonRows = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];
  const skeletonCols = [
    "sc1",
    "sc2",
    "sc3",
    "sc4",
    "sc5",
    "sc6",
    "sc7",
    "sc8",
    "sc9",
    "sc10",
  ];

  // Page buttons — sliding window of max 7
  const windowStart = Math.max(0, Math.min(pageCount - 7, page - 3));
  const pageButtons = Array.from(
    { length: Math.min(pageCount, 7) },
    (_, i) => windowStart + i,
  );

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="suppliers-page">
      {/* Toolbar */}
      <div className="bg-card border-b border-border px-4 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
        <h1 className="font-display font-semibold text-sm text-foreground mr-1">
          Supplier Directory
        </h1>

        {/* Search */}
        <div className="relative min-w-[180px] max-w-xs flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search suppliers..."
            className="h-7 pl-6 text-xs bg-muted/30 border-border"
            data-ocid="supplier-search"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearch("");
                setPage(0);
              }}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Tier filter */}
        <div className="flex items-center gap-1" data-ocid="tier-filter">
          {(["all", "1", "2", "3"] as TierFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTierFilter(t);
                setPage(0);
              }}
              className={`h-7 px-2.5 rounded-sm text-[11px] font-mono transition-colors border ${
                tierFilter === t
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {t === "all" ? "All Tiers" : `T${t}`}
            </button>
          ))}
        </div>

        {/* Risk filter */}
        <div className="flex items-center gap-1" data-ocid="risk-filter">
          {(["all", "high", "medium", "low"] as RiskFilter[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRiskFilter(r);
                setPage(0);
              }}
              className={`h-7 px-2.5 rounded-sm text-[11px] font-mono capitalize transition-colors border ${
                riskFilter === r
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {r === "all" ? "All Risk" : r}
            </button>
          ))}
        </div>

        <span
          className="ml-auto text-[11px] text-muted-foreground font-mono tabular-nums shrink-0"
          data-ocid="supplier-count"
        >
          {filtered.length} supplier{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table
          className="w-full text-sm border-collapse"
          data-ocid="supplier-table"
        >
          <thead className="sticky top-0 bg-card border-b border-border z-10">
            <tr>
              <ThCol col="name" label="Supplier" />
              <ThCol col="tier" label="Tier" className="w-14 text-center" />
              <ThCol col="category" label="Category" />
              <ThCol col="location" label="Location" />
              <ThCol col="qualityRisk" label="Quality" />
              <ThCol col="delayRisk" label="Delay" />
              <ThCol col="failureRisk" label="Failure" />
              <ThCol col="compositeRisk" label="Composite" />
              <th className="px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-muted-foreground w-24">
                Trend
              </th>
              <th className="px-3 py-2 w-20" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? skeletonRows.map((rk) => (
                  <tr key={rk} className="border-b border-border">
                    {skeletonCols.map((ck) => (
                      <td key={`${rk}-${ck}`} className="px-3 py-2">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : paged.map((s) => {
                  const sid = s.id.toString();
                  return (
                    <SupplierRow
                      key={sid}
                      supplier={s}
                      isExpanded={expandedId === sid}
                      onToggle={() => toggleExpand(sid)}
                      localActions={localMitigations[sid] ?? []}
                      onActionAdded={(a) => handleActionAdded(sid, a)}
                    />
                  );
                })}
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            data-ocid="suppliers-empty"
          >
            <Search className="h-8 w-8 mb-3 opacity-30" />
            <p className="text-sm font-medium">
              No suppliers match your filters
            </p>
            <p className="text-xs mt-1 opacity-70">
              Try adjusting the search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div
          className="bg-card border-t border-border px-4 py-2 flex items-center justify-between shrink-0"
          data-ocid="pagination"
        >
          <span className="text-[11px] text-muted-foreground font-mono">
            Page {page + 1} of {pageCount} &mdash; {filtered.length} total
          </span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="pagination-prev"
            >
              Prev
            </Button>
            {pageButtons.map((pg) => (
              <Button
                key={`pg-${pg}`}
                type="button"
                variant={pg === page ? "default" : "outline"}
                size="sm"
                className="h-6 w-6 p-0 text-xs"
                onClick={() => setPage(pg)}
                data-ocid={`pagination-page-${pg}`}
              >
                {pg + 1}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="pagination-next"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
