import { RiskBadge } from "@/components/shared/RiskBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupplierProfiles } from "@/hooks/useBackend";
import { formatRiskScore, getRiskHex, normalizeRisk } from "@/lib/riskUtils";
import type { NetworkNode, SupplierProfile } from "@/types";
import {
  AlertTriangle,
  Layers,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  type MouseEvent,
  type WheelEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

// ─── Layout constants ────────────────────────────────────────────────────────
const SVG_W = 1100;
const SVG_H = 660;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const TIER_RADII: Record<number, number> = { 1: 90, 2: 220, 3: 340 };
const NODE_BASE: Record<number, number> = { 1: 22, 2: 16, 3: 12 };
const RING_W: Record<number, number> = { 1: 3, 2: 2, 3: 1.5 };

// ─── Type helpers ────────────────────────────────────────────────────────────
interface PositionedNode extends NetworkNode {
  x: number;
  y: number;
  radius: number;
}

function suppliersToNetworkNodes(suppliers: SupplierProfile[]): NetworkNode[] {
  return suppliers.map((s, idx) => {
    const deps: bigint[] = [];
    if (s.tier === 2) {
      const t1s = suppliers.filter((x) => x.tier === 1);
      if (t1s.length > 0) deps.push(t1s[idx % t1s.length].id);
    } else if (s.tier === 3) {
      const t2s = suppliers.filter((x) => x.tier === 2);
      if (t2s.length > 0) deps.push(t2s[idx % t2s.length].id);
    }
    return {
      supplierId: s.id,
      supplierName: s.name,
      tier: s.tier,
      category: s.category,
      compositeRisk: s.compositeRisk,
      dependsOn: deps,
    };
  });
}

function computeLayout(nodes: NetworkNode[]): PositionedNode[] {
  const tiers: Record<number, NetworkNode[]> = { 1: [], 2: [], 3: [] };
  for (const n of nodes) {
    const t = Math.min(3, Math.max(1, n.tier));
    tiers[t].push(n);
  }

  const positioned: PositionedNode[] = [];

  for (const tier of [1, 2, 3] as const) {
    const group = tiers[tier];
    const r = TIER_RADII[tier];
    const base = NODE_BASE[tier];
    group.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
      // node size: base + (compositeRisk normalized 0-1 * 8)
      const riskFloat = normalizeRisk(n.compositeRisk);
      const radius = base + riskFloat * 8;
      positioned.push({
        ...n,
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        radius,
      });
    });
  }

  return positioned;
}

// ─── Tooltip component ───────────────────────────────────────────────────────
interface TooltipState {
  node: PositionedNode;
  svgX: number;
  svgY: number;
}

function NodeTooltip({
  node,
  containerRef,
}: {
  node: PositionedNode;
  containerRef: React.RefObject<SVGSVGElement | null>;
}) {
  const el = containerRef.current;
  if (!el) return null;
  const bbox = el.getBoundingClientRect();

  const scaleX = bbox.width / SVG_W;
  const scaleY = bbox.height / SVG_H;
  const screenX = node.x * scaleX + bbox.left;
  const screenY = node.y * scaleY + bbox.top;

  const rScore = normalizeRisk(node.compositeRisk) * 100;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: screenX + 16,
        top: screenY - 8,
        transform: "translateY(-50%)",
      }}
    >
      <div className="bg-popover border border-border shadow-lg rounded-sm p-3 min-w-[200px] text-xs font-mono">
        <div className="font-bold text-foreground text-sm mb-1 truncate max-w-[180px]">
          {node.supplierName}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 font-mono"
          >
            Tier {node.tier}
          </Badge>
          <span className="text-muted-foreground">{node.category}</span>
        </div>
        <Separator className="mb-2" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Composite</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: getRiskHex(rScore) }}
            >
              {formatRiskScore(node.compositeRisk)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dependencies</span>
            <span className="tabular-nums">{node.dependsOn.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function NetworkSidebar({
  node,
  allNodes,
  suppliers,
  onClose,
}: {
  node: PositionedNode | null;
  allNodes: PositionedNode[];
  suppliers: SupplierProfile[];
  onClose: () => void;
}) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs font-mono gap-2 p-4">
        <Layers className="w-8 h-8 opacity-30" />
        <span>Click a node to inspect</span>
      </div>
    );
  }

  const profile = suppliers.find((s) => s.id === node.supplierId);
  const deps = allNodes.filter((n) => node.dependsOn.includes(n.supplierId));
  const dependents = allNodes.filter((n) =>
    n.dependsOn.includes(node.supplierId),
  );
  const rScore = normalizeRisk(node.compositeRisk) * 100;

  return (
    <div className="flex flex-col h-full overflow-y-auto text-xs font-mono">
      <div className="flex items-start justify-between p-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground text-sm truncate">
            {node.supplierName}
          </div>
          <div className="text-muted-foreground mt-0.5">
            Tier {node.tier} · {node.category}
          </div>
        </div>
        <button
          type="button"
          aria-label="Close panel"
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Risk scores */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Risk Breakdown
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Composite</span>
          <span
            className="font-bold tabular-nums text-sm"
            style={{ color: getRiskHex(rScore) }}
          >
            {formatRiskScore(node.compositeRisk)}
          </span>
        </div>
        {profile && (
          <>
            <RiskBar
              label="Quality"
              value={normalizeRisk(profile.qualityRisk)}
              color={getRiskHex(normalizeRisk(profile.qualityRisk) * 100)}
            />
            <RiskBar
              label="Delay"
              value={normalizeRisk(profile.delayRisk)}
              color={getRiskHex(normalizeRisk(profile.delayRisk) * 100)}
            />
            <RiskBar
              label="Failure"
              value={normalizeRisk(profile.failureRisk)}
              color={getRiskHex(normalizeRisk(profile.failureRisk) * 100)}
            />
          </>
        )}
        <div className="mt-2 pt-2 border-t border-border flex justify-between">
          <span className="text-muted-foreground">Risk Contribution</span>
          <span className="tabular-nums font-semibold">
            {rScore.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Dependencies */}
      <div className="p-3 border-b border-border">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Depends On ({deps.length})
        </div>
        {deps.length === 0 ? (
          <div className="text-muted-foreground text-[10px]">None</div>
        ) : (
          <div className="space-y-1">
            {deps.map((d) => (
              <div
                key={d.supplierId.toString()}
                className="flex justify-between items-center"
              >
                <span className="truncate text-foreground max-w-[120px]">
                  {d.supplierName}
                </span>
                <span
                  className="tabular-nums text-[10px]"
                  style={{
                    color: getRiskHex(normalizeRisk(d.compositeRisk) * 100),
                  }}
                >
                  {formatRiskScore(d.compositeRisk)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dependents */}
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Downstream ({dependents.length})
        </div>
        {dependents.length === 0 ? (
          <div className="text-muted-foreground text-[10px]">None</div>
        ) : (
          <div className="space-y-1">
            {dependents.slice(0, 6).map((d) => (
              <div
                key={d.supplierId.toString()}
                className="flex justify-between items-center"
              >
                <span className="truncate text-foreground max-w-[120px]">
                  {d.supplierName}
                </span>
                <span
                  className="tabular-nums text-[10px]"
                  style={{
                    color: getRiskHex(normalizeRisk(d.compositeRisk) * 100),
                  }}
                >
                  {formatRiskScore(d.compositeRisk)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiskBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums" style={{ color }}>
          {formatRiskScore(value)}
        </span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Network() {
  const { data: suppliers = [], isLoading } = useSupplierProfiles();

  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [highlightHigh, setHighlightHigh] = useState(false);
  const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const networkNodes = useMemo(
    () => suppliersToNetworkNodes(suppliers),
    [suppliers],
  );
  const positionedNodes = useMemo(
    () => computeLayout(networkNodes),
    [networkNodes],
  );

  const visibleNodes = useMemo(() => {
    let nodes = positionedNodes;
    if (tierFilter !== null) nodes = nodes.filter((n) => n.tier === tierFilter);
    return nodes;
  }, [positionedNodes, tierFilter]);

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.supplierId.toString())),
    [visibleNodes],
  );

  const edges = useMemo(() => {
    const result: Array<{
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      risk: number;
    }> = [];
    for (const node of visibleNodes) {
      for (const depId of node.dependsOn) {
        const dep = positionedNodes.find((n) => n.supplierId === depId);
        if (dep && visibleNodeIds.has(dep.supplierId.toString())) {
          // Average of two normalized (0-1) risk floats
          const risk =
            (normalizeRisk(node.compositeRisk) +
              normalizeRisk(dep.compositeRisk)) /
            2;
          result.push({
            key: `${node.supplierId}-${depId}`,
            x1: node.x,
            y1: node.y,
            x2: dep.x,
            y2: dep.y,
            risk,
          });
        }
      }
    }
    return result;
  }, [visibleNodes, positionedNodes, visibleNodeIds]);

  const tierCounts = useMemo(() => {
    const c: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const n of positionedNodes) c[n.tier] = (c[n.tier] ?? 0) + 1;
    return c;
  }, [positionedNodes]);

  const handleMouseDown = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y,
      };
    },
    [transform],
  );

  const handleMouseMove = useCallback((e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current) return;
    setTransform((prev) => ({
      ...prev,
      x: dragStart.current.tx + (e.clientX - dragStart.current.x),
      y: dragStart.current.ty + (e.clientY - dragStart.current.y),
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, Math.max(0.3, prev.scale * delta)),
    }));
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const handleNodeClick = useCallback(
    (node: PositionedNode) => {
      setSelectedNode(
        selectedNode?.supplierId === node.supplierId ? null : node,
      );
    },
    [selectedNode],
  );

  const handleNodeEnter = useCallback((node: PositionedNode) => {
    setTooltip({ node, svgX: node.x, svgY: node.y });
  }, []);

  const handleNodeLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="network-page">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[640px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3" data-ocid="network-page">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-foreground">
            Supply Network Visualization
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            Concentric tier layout · {positionedNodes.length} suppliers ·{" "}
            {edges.length} dependencies
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {([null, 1, 2, 3] as const).map((t) => (
            <Button
              key={t === null ? "all" : `t${t}`}
              type="button"
              variant={tierFilter === t ? "default" : "outline"}
              size="sm"
              className="h-6 text-[10px] font-mono px-2"
              onClick={() => setTierFilter(t)}
              data-ocid={`filter-tier-${t === null ? "all" : t}`}
            >
              {t === null ? "ALL" : `T${t} (${tierCounts[t] ?? 0})`}
            </Button>
          ))}
          <Separator orientation="vertical" className="h-5" />
          <Button
            type="button"
            variant={highlightHigh ? "destructive" : "outline"}
            size="sm"
            className="h-6 text-[10px] font-mono px-2 gap-1"
            onClick={() => setHighlightHigh((v) => !v)}
            data-ocid="toggle-highlight-high"
          >
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-mono px-2"
            onClick={() =>
              setTransform((p) => ({
                ...p,
                scale: Math.min(3, p.scale * 1.25),
              }))
            }
            data-ocid="zoom-in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-mono px-2"
            onClick={() =>
              setTransform((p) => ({
                ...p,
                scale: Math.max(0.3, p.scale * 0.8),
              }))
            }
            data-ocid="zoom-out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-mono px-2 gap-1"
            onClick={resetView}
            data-ocid="reset-view"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </div>

      {/* Tier legend */}
      <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill="transparent"
              stroke="oklch(0.75 0.15 190)"
              strokeWidth="3"
            />
          </svg>
          Tier 1 — Core
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill="transparent"
              stroke="oklch(0.75 0.15 190)"
              strokeWidth="2"
            />
          </svg>
          Tier 2 — Secondary
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill="transparent"
              stroke="oklch(0.75 0.15 190)"
              strokeWidth="1.5"
            />
          </svg>
          Tier 3 — Peripheral
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "oklch(0.55 0.2 25)" }}
          />
          High ≥70%
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "oklch(0.75 0.15 85)" }}
          />
          Med 40–70%
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "oklch(0.65 0.18 145)" }}
          />
          Low &lt;40%
        </span>
      </div>

      {/* Main content: SVG + sidebar */}
      <div className="flex flex-1 gap-3 min-h-0">
        {/* SVG canvas */}
        <div className="flex-1 bg-card border border-border overflow-hidden relative">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="cursor-grab active:cursor-grabbing select-none"
            aria-label="Supply network dependency graph"
            role="img"
            data-ocid="network-svg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="oklch(0.4 0.01 260)" />
              </marker>
              {[1, 2, 3].map((t) => (
                <circle key={`orbit-${t}`} cx={CX} cy={CY} r={TIER_RADII[t]} />
              ))}
            </defs>

            <g
              transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
            >
              {[1, 2, 3].map((t) => (
                <circle
                  key={`orbit-${t}`}
                  cx={CX}
                  cy={CY}
                  r={TIER_RADII[t]}
                  fill="none"
                  stroke="oklch(0.32 0.01 260)"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
              ))}

              <circle
                cx={CX}
                cy={CY}
                r={18}
                fill="oklch(0.22 0.02 260)"
                stroke="oklch(0.75 0.15 190)"
                strokeWidth={1.5}
              />
              <text
                x={CX}
                y={CY + 4}
                textAnchor="middle"
                fontSize="8"
                fontFamily="var(--font-mono)"
                fill="oklch(0.75 0.15 190)"
                fontWeight="bold"
              >
                HUB
              </text>

              {positionedNodes
                .filter((n) => n.tier === 1)
                .map((n) => (
                  <line
                    key={`hub-${n.supplierId}`}
                    x1={CX}
                    y1={CY}
                    x2={n.x}
                    y2={n.y}
                    stroke="oklch(0.35 0.01 260)"
                    strokeWidth={0.8}
                    strokeOpacity={0.4}
                  />
                ))}

              {edges.map((e) => (
                <line
                  key={e.key}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={
                    e.risk >= 0.7
                      ? "oklch(0.55 0.2 25)"
                      : e.risk >= 0.4
                        ? "oklch(0.75 0.15 85)"
                        : "oklch(0.65 0.18 145)"
                  }
                  strokeWidth={1.2}
                  strokeOpacity={0.35}
                  markerEnd="url(#arrow)"
                />
              ))}

              {visibleNodes.map((node) => {
                const isSelected = selectedNode?.supplierId === node.supplierId;
                const rScore = normalizeRisk(node.compositeRisk) * 100;
                const fillColor = getRiskHex(rScore);
                const ringW = RING_W[node.tier] ?? 1.5;
                const isDimmed = highlightHigh && rScore < 70 && !isSelected;

                return (
                  <g
                    key={node.supplierId.toString()}
                    data-ocid="network-node"
                    aria-label={`${node.supplierName} T${node.tier} ${formatRiskScore(node.compositeRisk)}`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => handleNodeEnter(node)}
                    onMouseLeave={handleNodeLeave}
                    onClick={() => handleNodeClick(node)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleNodeClick(node);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 6}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth={2}
                        strokeOpacity={0.4}
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={`${fillColor}22`}
                      stroke={fillColor}
                      strokeWidth={ringW}
                      opacity={isDimmed ? 0.2 : 1}
                    />
                    {rScore >= 70 && !isDimmed && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius * 0.45}
                        fill={fillColor}
                        opacity={0.3}
                      />
                    )}
                    {(node.tier === 1 || node.radius > 20) && !isDimmed && (
                      <text
                        x={node.x}
                        y={node.y + node.radius + 10}
                        textAnchor="middle"
                        fontSize="7"
                        fontFamily="var(--font-mono)"
                        fill="oklch(0.65 0.01 260)"
                      >
                        {node.supplierName.split(" ")[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-muted-foreground bg-card/80 px-2 py-1 border border-border rounded-sm">
            {Math.round(transform.scale * 100)}% · drag to pan · scroll to zoom
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-card border border-border flex-shrink-0 flex flex-col">
          <div className="px-3 py-2 border-b border-border">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Node Inspector
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <NetworkSidebar
              node={selectedNode}
              allNodes={positionedNodes}
              suppliers={suppliers}
              onClose={() => setSelectedNode(null)}
            />
          </div>

          <div className="border-t border-border p-3 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Network Stats
            </div>
            {[
              {
                label: "High Risk",
                value: positionedNodes.filter(
                  (n) => normalizeRisk(n.compositeRisk) >= 0.7,
                ).length,
                color: "oklch(0.55 0.2 25)",
              },
              {
                label: "Med Risk",
                value: positionedNodes.filter((n) => {
                  const r = normalizeRisk(n.compositeRisk);
                  return r >= 0.4 && r < 0.7;
                }).length,
                color: "oklch(0.75 0.15 85)",
              },
              {
                label: "Low Risk",
                value: positionedNodes.filter(
                  (n) => normalizeRisk(n.compositeRisk) < 0.4,
                ).length,
                color: "oklch(0.65 0.18 145)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between text-xs font-mono"
              >
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tooltip && <NodeTooltip node={tooltip.node} containerRef={svgRef} />}

      <div className="hidden">
        <RiskBadge score={0} />
      </div>
    </div>
  );
}
