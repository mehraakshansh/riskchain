import { RiskBadge } from "@/components/shared/RiskBadge";
import { SparklineChart } from "@/components/shared/SparklineChart";
import {
  useAlternativeSuppliers,
  useSimulateDisruption,
  useSupplierProfiles,
} from "@/hooks/useBackend";
import {
  generateMockTrend,
  getRiskBgColor,
  getRiskColor,
  getRiskHex,
  getRiskLabel,
  normalizeRisk,
} from "@/lib/riskUtils";
import { cn } from "@/lib/utils";
import type {
  AlternativeSupplier,
  DisruptionType,
  SupplierProfile,
} from "@/types";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Clock,
  GitBranch,
  Search,
  ShieldAlert,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

// ── Disruption Config ─────────────────────────────────────────────────────────
type DisruptionId =
  | "SupplyInterruption"
  | "QualityFailure"
  | "LogisticsDelay"
  | "EquipmentFailure"
  | "NaturalDisaster";

const DISRUPTION_VARIANTS: Record<DisruptionId, DisruptionType> = {
  SupplyInterruption: { SupplyShortage: null },
  QualityFailure: { OperationalFailure: null },
  LogisticsDelay: { LogisticsDisruption: null },
  EquipmentFailure: { OperationalFailure: null },
  NaturalDisaster: { Natural: null },
};

interface DisruptionOption {
  id: DisruptionId;
  label: string;
  description: string;
  icon: React.ReactNode;
  baseColor: string;
}

const DISRUPTION_OPTIONS: DisruptionOption[] = [
  {
    id: "SupplyInterruption",
    label: "Supply Interruption",
    description: "Raw material or component shortage",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    baseColor: "text-warning",
  },
  {
    id: "QualityFailure",
    label: "Quality Failure",
    description: "Defect rate spike or compliance breach",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    baseColor: "text-destructive",
  },
  {
    id: "LogisticsDelay",
    label: "Logistics Delay",
    description: "Transit delay or carrier disruption",
    icon: <Clock className="w-3.5 h-3.5" />,
    baseColor: "text-primary",
  },
  {
    id: "EquipmentFailure",
    label: "Equipment Failure",
    description: "Production line or machinery failure",
    icon: <Zap className="w-3.5 h-3.5" />,
    baseColor: "text-destructive",
  },
  {
    id: "NaturalDisaster",
    label: "Natural Disaster",
    description: "Seismic, weather, or geopolitical event",
    icon: <Activity className="w-3.5 h-3.5" />,
    baseColor: "text-warning",
  },
];

// ── Supplier Dropdown ─────────────────────────────────────────────────────────
interface SupplierDropdownProps {
  suppliers: SupplierProfile[];
  selected: SupplierProfile | null;
  onSelect: (s: SupplierProfile) => void;
}

function SupplierDropdown({
  suppliers,
  selected,
  onSelect,
}: SupplierDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [suppliers, query],
  );

  function handleSelect(s: SupplierProfile) {
    onSelect(s);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        data-ocid="supplier-selector"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded border bg-card",
          "text-sm text-foreground transition-smooth hover:border-primary/50",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          open ? "border-primary/60" : "border-border",
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected ? selected.name : "Select supplier…"}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full rounded border border-border bg-popover shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search suppliers…"
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                No suppliers match
              </div>
            ) : (
              filtered.map((s) => {
                const compositeFloat = normalizeRisk(s.compositeRisk);
                return (
                  <button
                    key={s.id.toString()}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm",
                      "hover:bg-muted/50 transition-colors",
                      selected?.id === s.id && "bg-primary/10 text-primary",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        T{s.tier}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-sm font-mono shrink-0",
                        getRiskBgColor(compositeFloat * 100),
                      )}
                    >
                      {(compositeFloat * 100).toFixed(0)}%
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Risk Delta Bar ─────────────────────────────────────────────────────────────
interface RiskDeltaBarProps {
  before: number;
  after: number;
  label: string;
}

function RiskDeltaBar({ before, after, label }: RiskDeltaBarProps) {
  const beforePct = Math.min(before * 100, 100);
  const afterPct = Math.min(after * 100, 100);
  const increased = after > before;
  const delta = after - before;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground truncate mr-2">{label}</span>
        <div className="flex items-center gap-2 font-mono shrink-0">
          <span className={getRiskColor(before * 100)}>
            {beforePct.toFixed(1)}%
          </span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span className={cn(getRiskColor(after * 100), "font-semibold")}>
            {afterPct.toFixed(1)}%
          </span>
          <span
            className={cn(
              "text-[10px] px-1 py-0.5 rounded-sm border",
              increased
                ? "bg-destructive/15 text-destructive border-destructive/30"
                : "bg-success/15 text-success border-success/30",
            )}
          >
            {increased ? "+" : ""}
            {(delta * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full opacity-40 transition-all duration-500"
          style={{
            width: `${beforePct}%`,
            backgroundColor: getRiskHex(before * 100),
          }}
        />
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${afterPct}%`,
            backgroundColor: getRiskHex(after * 100),
          }}
        />
      </div>
    </div>
  );
}

// ── Alternatives Table ─────────────────────────────────────────────────────────
function AlternativesTable({
  supplierId,
  category,
}: {
  supplierId: bigint;
  category: string;
}) {
  const { data: alts = [], isLoading } = useAlternativeSuppliers(
    supplierId,
    category,
  );

  const displayAlts: AlternativeSupplier[] = useMemo(() => {
    if (alts.length > 0) return alts;
    return [
      {
        supplierId: BigInt(101),
        name: "Apex Components",
        compositeRisk: BigInt(28),
        avgLeadTimeDays: BigInt(12),
        tier: 1,
        category,
        rank: BigInt(1),
      },
      {
        supplierId: BigInt(102),
        name: "Vector Systems",
        compositeRisk: BigInt(35),
        avgLeadTimeDays: BigInt(18),
        tier: 2,
        category,
        rank: BigInt(2),
      },
      {
        supplierId: BigInt(103),
        name: "Meridian Tech",
        compositeRisk: BigInt(42),
        avgLeadTimeDays: BigInt(22),
        tier: 2,
        category,
        rank: BigInt(3),
      },
      {
        supplierId: BigInt(104),
        name: "Nova Parts",
        compositeRisk: BigInt(51),
        avgLeadTimeDays: BigInt(28),
        tier: 3,
        category,
        rank: BigInt(4),
      },
    ];
  }, [alts, category]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {["alt-sk-a", "alt-sk-b", "alt-sk-c"].map((k) => (
          <div key={k} className="h-9 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">
              Supplier
            </th>
            <th className="text-center py-2 px-2 text-muted-foreground font-medium">
              Tier
            </th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">
              Risk
            </th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">
              Lead Time
            </th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">
              #
            </th>
          </tr>
        </thead>
        <tbody>
          {displayAlts.map((alt) => {
            const rankNum = Number(alt.rank);
            return (
              <tr
                key={alt.supplierId.toString()}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-2 px-2 font-medium">{alt.name}</td>
                <td className="py-2 px-2 text-center text-muted-foreground font-mono">
                  T{alt.tier}
                </td>
                <td className="py-2 px-2 text-right">
                  <RiskBadge
                    score={normalizeRisk(alt.compositeRisk)}
                    size="sm"
                  />
                </td>
                <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                  {Number(alt.avgLeadTimeDays)}d
                </td>
                <td className="py-2 px-2 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold",
                      rankNum === 1
                        ? "bg-primary/20 text-primary"
                        : rankNum === 2
                          ? "bg-muted text-foreground"
                          : "bg-muted/50 text-muted-foreground",
                    )}
                  >
                    {rankNum}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Severity helpers ──────────────────────────────────────────────────────────
function getSeverityScore(severity: string): number {
  if (severity === "Critical") return 0.9;
  if (severity === "High") return 0.75;
  if (severity === "Medium") return 0.5;
  return 0.25;
}

function getSeverityBannerClass(severity: string): string {
  if (severity === "Critical") return "bg-destructive/10 border-destructive/40";
  if (severity === "High") return "bg-warning/10 border-warning/40";
  if (severity === "Medium") return "bg-warning/5 border-warning/20";
  return "bg-success/10 border-success/40";
}

function getSeverityIconClass(severity: string): string {
  if (severity === "Critical") return "text-destructive";
  if (severity === "High") return "text-warning";
  if (severity === "Medium") return "text-warning";
  return "text-success";
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Simulator() {
  const { data: suppliers = [], isLoading: suppliersLoading } =
    useSupplierProfiles();
  const simulate = useSimulateDisruption();

  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierProfile | null>(null);
  const [selectedDisruption, setSelectedDisruption] =
    useState<DisruptionId>("SupplyInterruption");

  function handleRunSimulation() {
    if (!selectedSupplier) return;
    simulate.mutate({
      supplierId: selectedSupplier.id,
      disruptionType: DISRUPTION_VARIANTS[selectedDisruption],
    });
  }

  const impact = simulate.data;
  const isRunning = simulate.isPending;

  const cascadingSuppliers = useMemo(() => {
    if (!impact) return [];
    return impact.cascadingSupplierIds.map((cid) => {
      const match = suppliers.find((s) => s.id === cid);
      const risk = match
        ? normalizeRisk(match.compositeRisk)
        : 0.55 + Math.random() * 0.3;
      return {
        id: cid,
        name: match?.name ?? `Supplier #${cid.toString()}`,
        risk,
      };
    });
  }, [impact, suppliers]);

  const basePortfolioRisk = 0.58;
  // directRiskIncrease and portfolioRiskDelta are bigint on 0-100 scale
  const directRiskFloat = impact ? normalizeRisk(impact.directRiskIncrease) : 0;
  const portfolioDeltaFloat = impact
    ? normalizeRisk(impact.portfolioRiskDelta)
    : 0;
  const afterPortfolioRisk = impact
    ? Math.min(1, basePortfolioRisk + portfolioDeltaFloat)
    : 0;

  const affectedSupplier = impact
    ? (suppliers.find((s) => s.id === impact.affectedSupplierId) ?? null)
    : null;
  const affectedCompositeFloat = affectedSupplier
    ? normalizeRisk(affectedSupplier.compositeRisk)
    : 0.5;

  const postDisruptionTrend = useMemo(() => {
    if (!impact) return generateMockTrend(0.5, 20);
    return [
      ...generateMockTrend(affectedCompositeFloat - 0.05, 10),
      ...generateMockTrend(affectedCompositeFloat + directRiskFloat, 10),
    ];
  }, [impact, affectedCompositeFloat, directRiskFloat]);

  const estimatedRecoveryDays = impact
    ? Number(impact.estimatedRecoveryDays)
    : 0;

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      data-ocid="simulator-page"
    >
      {/* Page Header */}
      <div className="border-b border-border bg-card px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <GitBranch className="w-4 h-4 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold font-display text-foreground">
              Scenario Simulator
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono">
              Model supply chain disruptions and cascade impact analysis
            </p>
          </div>
          {impact && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded border border-border">
              <TrendingUp className="w-3 h-3" />
              Simulation complete
            </div>
          )}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 grid grid-cols-[320px_1fr] overflow-hidden min-h-0">
        {/* ── Left Control Panel ── */}
        <div className="border-r border-border bg-card flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-mono">
              Simulation Controls
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Supplier Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                Target Supplier
              </span>
              {suppliersLoading ? (
                <div className="h-9 bg-muted/50 rounded animate-pulse" />
              ) : (
                <SupplierDropdown
                  suppliers={suppliers}
                  selected={selectedSupplier}
                  onSelect={(s) => {
                    setSelectedSupplier(s);
                    simulate.reset();
                  }}
                />
              )}
              {selectedSupplier && (
                <div className="rounded border border-border bg-background/40 px-3 py-2 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      T{selectedSupplier.tier} · {selectedSupplier.location}
                    </span>
                    <RiskBadge
                      score={normalizeRisk(selectedSupplier.compositeRisk)}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      {
                        l: "Quality",
                        v: normalizeRisk(selectedSupplier.qualityRisk),
                      },
                      {
                        l: "Delay",
                        v: normalizeRisk(selectedSupplier.delayRisk),
                      },
                      {
                        l: "Failure",
                        v: normalizeRisk(selectedSupplier.failureRisk),
                      },
                    ].map(({ l, v }) => (
                      <div key={l} className="text-center">
                        <div className="text-[9px] font-mono text-muted-foreground/70">
                          {l}
                        </div>
                        <div
                          className={cn(
                            "text-xs font-mono font-bold tabular-nums",
                            getRiskColor(v * 100),
                          )}
                        >
                          {(v * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <SparklineChart
                    data={generateMockTrend(selectedSupplier.compositeRisk, 14)}
                    score={normalizeRisk(selectedSupplier.compositeRisk)}
                    height={28}
                  />
                </div>
              )}
            </div>

            {/* Disruption Type */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                Disruption Type
              </span>
              <div className="space-y-1">
                {DISRUPTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid={`disruption-${opt.id.toLowerCase()}`}
                    onClick={() => {
                      setSelectedDisruption(opt.id);
                      simulate.reset();
                    }}
                    className={cn(
                      "w-full flex items-start gap-2.5 px-3 py-2 rounded border text-left transition-smooth",
                      selectedDisruption === opt.id
                        ? "border-primary/60 bg-primary/8"
                        : "border-border hover:border-border/80 hover:bg-muted/30",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        selectedDisruption === opt.id
                          ? "text-primary"
                          : opt.baseColor,
                      )}
                    >
                      {opt.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-xs font-medium",
                          selectedDisruption === opt.id
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {opt.description}
                      </div>
                    </div>
                    {selectedDisruption === opt.id && (
                      <div className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run Button */}
          <div className="p-4 border-t border-border shrink-0">
            <button
              type="button"
              data-ocid="run-simulation-btn"
              disabled={!selectedSupplier || isRunning}
              onClick={handleRunSimulation}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded",
                "text-sm font-semibold transition-smooth",
                !selectedSupplier || isRunning
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99]",
              )}
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  Run Simulation
                </>
              )}
            </button>
            {!selectedSupplier && (
              <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-mono">
                Select a supplier to enable simulation
              </p>
            )}
          </div>
        </div>

        {/* ── Right Results Panel ── */}
        <div className="bg-background overflow-y-auto min-h-0">
          {/* Empty state */}
          {!impact && !isRunning && (
            <div
              data-ocid="simulator-empty"
              className="flex flex-col items-center justify-center h-full min-h-64 gap-3 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  No simulation run yet
                </p>
                <p className="text-xs text-muted-foreground max-w-52">
                  Select a supplier and disruption type, then run the simulation
                  to see cascade impact.
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isRunning && (
            <div
              data-ocid="sim-loading-state"
              className="flex flex-col items-center justify-center h-full min-h-64 gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Running ML disruption model…
              </p>
            </div>
          )}

          {/* Results */}
          {impact && !isRunning && (
            <div className="p-4 space-y-4">
              {/* Severity banner */}
              <div
                className={cn(
                  "rounded border px-4 py-3 flex items-center justify-between gap-3",
                  getSeverityBannerClass(impact.severity),
                )}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      getSeverityIconClass(impact.severity),
                    )}
                  />
                  <span className="text-sm font-mono font-bold text-foreground">
                    {impact.severity.toUpperCase()} SEVERITY EVENT
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {
                    DISRUPTION_OPTIONS.find((o) => o.id === selectedDisruption)
                      ?.label
                  }
                </span>
              </div>

              {/* Impact summary */}
              <div className="rounded border border-border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      Affected Supplier
                    </div>
                    <div className="text-sm font-semibold font-display text-foreground mt-0.5">
                      {affectedSupplier?.name ??
                        `Supplier #${impact.affectedSupplierId.toString()}`}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded border font-semibold font-mono shrink-0",
                      getRiskBgColor(getSeverityScore(impact.severity) * 100),
                    )}
                  >
                    {getRiskLabel(getSeverityScore(impact.severity) * 100)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div
                    data-ocid="sim-direct-risk"
                    className="px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5"
                  >
                    <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      Direct Risk +Δ
                    </div>
                    <div
                      className={cn(
                        "text-xl font-bold font-mono tabular-nums leading-none",
                        getRiskColor(directRiskFloat * 100),
                      )}
                    >
                      +{(directRiskFloat * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div
                    data-ocid="sim-portfolio-delta"
                    className="px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5"
                  >
                    <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      Portfolio Δ
                    </div>
                    <div
                      className={cn(
                        "text-xl font-bold font-mono tabular-nums leading-none",
                        portfolioDeltaFloat > 0
                          ? "text-destructive"
                          : "text-success",
                      )}
                    >
                      {portfolioDeltaFloat > 0 ? "+" : ""}
                      {(portfolioDeltaFloat * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div
                    data-ocid="sim-recovery"
                    className="px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5"
                  >
                    <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      Recovery
                    </div>
                    <div className="text-xl font-bold font-mono tabular-nums leading-none text-foreground">
                      {estimatedRecoveryDays}d
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio before/after gauge */}
              <div className="rounded border border-border bg-card p-4 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Portfolio Risk Before / After
                </div>
                <RiskDeltaBar
                  before={basePortfolioRisk}
                  after={afterPortfolioRisk}
                  label="Portfolio composite risk"
                />
                {selectedSupplier && (
                  <RiskDeltaBar
                    before={affectedCompositeFloat}
                    after={Math.min(
                      1,
                      affectedCompositeFloat + directRiskFloat,
                    )}
                    label={`${selectedSupplier.name} (direct)`}
                  />
                )}
              </div>

              {/* Risk trajectory sparkline */}
              <div className="rounded border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  Risk Trajectory (post-disruption)
                </div>
                <SparklineChart
                  data={postDisruptionTrend}
                  score={Math.min(1, affectedCompositeFloat + directRiskFloat)}
                  height={56}
                  showTooltip
                />
                <p className="text-[9px] font-mono text-muted-foreground">
                  Projected 20-day composite risk for{" "}
                  {affectedSupplier?.name ?? "affected supplier"}
                </p>
              </div>

              {/* Cascading impact */}
              <div className="rounded border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    Cascading Impact
                  </div>
                  <span
                    data-ocid="sim-cascading"
                    className="text-[10px] font-mono text-muted-foreground"
                  >
                    {cascadingSuppliers.length} affected
                  </span>
                </div>

                {cascadingSuppliers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center font-mono">
                    No cascading suppliers detected
                  </p>
                ) : (
                  <div className="space-y-1">
                    {cascadingSuppliers.map((cs) => (
                      <div
                        key={cs.id.toString()}
                        data-ocid="cascade-supplier-row"
                        className="flex items-center justify-between px-3 py-2 rounded border border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: getRiskHex(cs.risk * 100),
                            }}
                          />
                          <span className="text-xs font-medium truncate">
                            {cs.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span
                            className={cn(
                              "text-[10px] font-mono tabular-nums",
                              getRiskColor(cs.risk * 100),
                            )}
                          >
                            {(cs.risk * 100).toFixed(1)}%
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-sm border font-mono font-semibold",
                              getRiskBgColor(cs.risk * 100),
                            )}
                          >
                            {getRiskLabel(cs.risk * 100)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alternative suppliers */}
              {selectedSupplier && (
                <div className="rounded border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                      Recommended Alternatives
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {selectedSupplier.category}
                    </span>
                  </div>
                  <AlternativesTable
                    supplierId={selectedSupplier.id}
                    category={selectedSupplier.category}
                  />
                </div>
              )}

              {/* Mitigations */}
              <div className="rounded border border-border bg-card p-4 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Recommended Mitigations
                </div>
                <div className="space-y-1">
                  {[
                    {
                      id: "m1",
                      text: "Activate secondary supplier contracts within 24h",
                    },
                    {
                      id: "m2",
                      text: "Increase safety stock by 2–3× for affected SKUs",
                    },
                    {
                      id: "m3",
                      text: `Initiate emergency sourcing from ${cascadingSuppliers.length > 0 ? cascadingSuppliers.length : "Tier 2"} alternative suppliers`,
                    },
                    {
                      id: "m4",
                      text: `Notify procurement team — estimated ${estimatedRecoveryDays}-day recovery window`,
                    },
                  ].map(({ id, text }) => (
                    <div
                      key={id}
                      className="flex items-start gap-2 text-[11px] font-mono text-muted-foreground"
                    >
                      <span className="text-primary shrink-0 mt-0.5">→</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
