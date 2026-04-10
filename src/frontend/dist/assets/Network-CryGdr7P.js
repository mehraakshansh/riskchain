import { c as createLucideIcon, b as useSupplierProfiles, r as reactExports, n as normalizeRisk, j as jsxRuntimeExports, S as Skeleton, R as RefreshCw, f as formatRiskScore, i as getRiskHex } from "./index-DZ04Si5K.js";
import { R as RiskBadge } from "./RiskBadge-CJJ2jeVw.js";
import { B as Badge } from "./badge-B5NySoM2.js";
import { B as Button, X } from "./button-D1di8VIN.js";
import { S as Separator } from "./separator-DsAenMS2.js";
import { T as TriangleAlert } from "./triangle-alert-COSefzu6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
const SVG_W = 1100;
const SVG_H = 660;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const TIER_RADII = { 1: 90, 2: 220, 3: 340 };
const NODE_BASE = { 1: 22, 2: 16, 3: 12 };
const RING_W = { 1: 3, 2: 2, 3: 1.5 };
function suppliersToNetworkNodes(suppliers) {
  return suppliers.map((s, idx) => {
    const deps = [];
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
      dependsOn: deps
    };
  });
}
function computeLayout(nodes) {
  const tiers = { 1: [], 2: [], 3: [] };
  for (const n of nodes) {
    const t = Math.min(3, Math.max(1, n.tier));
    tiers[t].push(n);
  }
  const positioned = [];
  for (const tier of [1, 2, 3]) {
    const group = tiers[tier];
    const r = TIER_RADII[tier];
    const base = NODE_BASE[tier];
    group.forEach((n, i) => {
      const angle = 2 * Math.PI * i / group.length - Math.PI / 2;
      const riskFloat = normalizeRisk(n.compositeRisk);
      const radius = base + riskFloat * 8;
      positioned.push({
        ...n,
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        radius
      });
    });
  }
  return positioned;
}
function NodeTooltip({
  node,
  containerRef
}) {
  const el = containerRef.current;
  if (!el) return null;
  const bbox = el.getBoundingClientRect();
  const scaleX = bbox.width / SVG_W;
  const scaleY = bbox.height / SVG_H;
  const screenX = node.x * scaleX + bbox.left;
  const screenY = node.y * scaleY + bbox.top;
  const rScore = normalizeRisk(node.compositeRisk) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 pointer-events-none",
      style: {
        left: screenX + 16,
        top: screenY - 8,
        transform: "translateY(-50%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-popover border border-border shadow-lg rounded-sm p-3 min-w-[200px] text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground text-sm mb-1 truncate max-w-[180px]", children: node.supplierName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-[10px] px-1.5 py-0 font-mono",
              children: [
                "Tier ",
                node.tier
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: node.category })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Composite" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-semibold tabular-nums",
                style: { color: getRiskHex(rScore) },
                children: formatRiskScore(node.compositeRisk)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Dependencies" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: node.dependsOn.length })
          ] })
        ] })
      ] })
    }
  );
}
function NetworkSidebar({
  node,
  allNodes,
  suppliers,
  onClose
}) {
  if (!node) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground text-xs font-mono gap-2 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-8 h-8 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Click a node to inspect" })
    ] });
  }
  const profile = suppliers.find((s) => s.id === node.supplierId);
  const deps = allNodes.filter((n) => node.dependsOn.includes(n.supplierId));
  const dependents = allNodes.filter(
    (n) => n.dependsOn.includes(node.supplierId)
  );
  const rScore = normalizeRisk(node.compositeRisk) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-y-auto text-xs font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground text-sm truncate", children: node.supplierName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground mt-0.5", children: [
          "Tier ",
          node.tier,
          " · ",
          node.category
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Close panel",
          className: "ml-2 text-muted-foreground hover:text-foreground transition-colors",
          onClick: onClose,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Risk Breakdown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Composite" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-bold tabular-nums text-sm",
            style: { color: getRiskHex(rScore) },
            children: formatRiskScore(node.compositeRisk)
          }
        )
      ] }),
      profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RiskBar,
          {
            label: "Quality",
            value: normalizeRisk(profile.qualityRisk),
            color: getRiskHex(normalizeRisk(profile.qualityRisk) * 100)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RiskBar,
          {
            label: "Delay",
            value: normalizeRisk(profile.delayRisk),
            color: getRiskHex(normalizeRisk(profile.delayRisk) * 100)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RiskBar,
          {
            label: "Failure",
            value: normalizeRisk(profile.failureRisk),
            color: getRiskHex(normalizeRisk(profile.failureRisk) * 100)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-border flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Risk Contribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums font-semibold", children: [
          rScore.toFixed(1),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: [
        "Depends On (",
        deps.length,
        ")"
      ] }),
      deps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: "None" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: deps.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex justify-between items-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground max-w-[120px]", children: d.supplierName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "tabular-nums text-[10px]",
                style: {
                  color: getRiskHex(normalizeRisk(d.compositeRisk) * 100)
                },
                children: formatRiskScore(d.compositeRisk)
              }
            )
          ]
        },
        d.supplierId.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: [
        "Downstream (",
        dependents.length,
        ")"
      ] }),
      dependents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: "None" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: dependents.slice(0, 6).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex justify-between items-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground max-w-[120px]", children: d.supplierName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "tabular-nums text-[10px]",
                style: {
                  color: getRiskHex(normalizeRisk(d.compositeRisk) * 100)
                },
                children: formatRiskScore(d.compositeRisk)
              }
            )
          ]
        },
        d.supplierId.toString()
      )) })
    ] })
  ] });
}
function RiskBar({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", style: { color }, children: formatRiskScore(value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all duration-300",
        style: { width: `${value * 100}%`, backgroundColor: color }
      }
    ) })
  ] });
}
function Network() {
  const { data: suppliers = [], isLoading } = useSupplierProfiles();
  const [tierFilter, setTierFilter] = reactExports.useState(null);
  const [highlightHigh, setHighlightHigh] = reactExports.useState(false);
  const [selectedNode, setSelectedNode] = reactExports.useState(null);
  const [tooltip, setTooltip] = reactExports.useState(null);
  const [transform, setTransform] = reactExports.useState({ x: 0, y: 0, scale: 1 });
  const isDragging = reactExports.useRef(false);
  const dragStart = reactExports.useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = reactExports.useRef(null);
  const networkNodes = reactExports.useMemo(
    () => suppliersToNetworkNodes(suppliers),
    [suppliers]
  );
  const positionedNodes = reactExports.useMemo(
    () => computeLayout(networkNodes),
    [networkNodes]
  );
  const visibleNodes = reactExports.useMemo(() => {
    let nodes = positionedNodes;
    if (tierFilter !== null) nodes = nodes.filter((n) => n.tier === tierFilter);
    return nodes;
  }, [positionedNodes, tierFilter]);
  const visibleNodeIds = reactExports.useMemo(
    () => new Set(visibleNodes.map((n) => n.supplierId.toString())),
    [visibleNodes]
  );
  const edges = reactExports.useMemo(() => {
    const result = [];
    for (const node of visibleNodes) {
      for (const depId of node.dependsOn) {
        const dep = positionedNodes.find((n) => n.supplierId === depId);
        if (dep && visibleNodeIds.has(dep.supplierId.toString())) {
          const risk = (normalizeRisk(node.compositeRisk) + normalizeRisk(dep.compositeRisk)) / 2;
          result.push({
            key: `${node.supplierId}-${depId}`,
            x1: node.x,
            y1: node.y,
            x2: dep.x,
            y2: dep.y,
            risk
          });
        }
      }
    }
    return result;
  }, [visibleNodes, positionedNodes, visibleNodeIds]);
  const tierCounts = reactExports.useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0 };
    for (const n of positionedNodes) c[n.tier] = (c[n.tier] ?? 0) + 1;
    return c;
  }, [positionedNodes]);
  const handleMouseDown = reactExports.useCallback(
    (e) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y
      };
    },
    [transform]
  );
  const handleMouseMove = reactExports.useCallback((e) => {
    if (!isDragging.current) return;
    setTransform((prev) => ({
      ...prev,
      x: dragStart.current.tx + (e.clientX - dragStart.current.x),
      y: dragStart.current.ty + (e.clientY - dragStart.current.y)
    }));
  }, []);
  const handleMouseUp = reactExports.useCallback(() => {
    isDragging.current = false;
  }, []);
  const handleWheel = reactExports.useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, Math.max(0.3, prev.scale * delta))
    }));
  }, []);
  const resetView = reactExports.useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);
  const handleNodeClick = reactExports.useCallback(
    (node) => {
      setSelectedNode(
        (selectedNode == null ? void 0 : selectedNode.supplierId) === node.supplierId ? null : node
      );
    },
    [selectedNode]
  );
  const handleNodeEnter = reactExports.useCallback((node) => {
    setTooltip({ node, svgX: node.x, svgY: node.y });
  }, []);
  const handleNodeLeave = reactExports.useCallback(() => {
    setTooltip(null);
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "network-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[640px] w-full" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full gap-3", "data-ocid": "network-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-mono font-bold uppercase tracking-widest text-foreground", children: "Supply Network Visualization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground mt-0.5", children: [
          "Concentric tier layout · ",
          positionedNodes.length,
          " suppliers ·",
          " ",
          edges.length,
          " dependencies"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        [null, 1, 2, 3].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: tierFilter === t ? "default" : "outline",
            size: "sm",
            className: "h-6 text-[10px] font-mono px-2",
            onClick: () => setTierFilter(t),
            "data-ocid": `filter-tier-${t === null ? "all" : t}`,
            children: t === null ? "ALL" : `T${t} (${tierCounts[t] ?? 0})`
          },
          t === null ? "all" : `t${t}`
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: highlightHigh ? "destructive" : "outline",
            size: "sm",
            className: "h-6 text-[10px] font-mono px-2 gap-1",
            onClick: () => setHighlightHigh((v) => !v),
            "data-ocid": "toggle-highlight-high",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
              "High Risk"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            className: "h-6 text-[10px] font-mono px-2",
            onClick: () => setTransform((p) => ({
              ...p,
              scale: Math.min(3, p.scale * 1.25)
            })),
            "data-ocid": "zoom-in",
            "aria-label": "Zoom in",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            className: "h-6 text-[10px] font-mono px-2",
            onClick: () => setTransform((p) => ({
              ...p,
              scale: Math.max(0.3, p.scale * 0.8)
            })),
            "data-ocid": "zoom-out",
            "aria-label": "Zoom out",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            className: "h-6 text-[10px] font-mono px-2 gap-1",
            onClick: resetView,
            "data-ocid": "reset-view",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
              "Reset"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[10px] font-mono text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "7",
            cy: "7",
            r: "5",
            fill: "transparent",
            stroke: "oklch(0.75 0.15 190)",
            strokeWidth: "3"
          }
        ) }),
        "Tier 1 — Core"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "7",
            cy: "7",
            r: "5",
            fill: "transparent",
            stroke: "oklch(0.75 0.15 190)",
            strokeWidth: "2"
          }
        ) }),
        "Tier 2 — Secondary"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "7",
            cy: "7",
            r: "5",
            fill: "transparent",
            stroke: "oklch(0.75 0.15 190)",
            strokeWidth: "1.5"
          }
        ) }),
        "Tier 3 — Peripheral"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-block w-2 h-2 rounded-full",
            style: { backgroundColor: "oklch(0.55 0.2 25)" }
          }
        ),
        "High ≥70%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-block w-2 h-2 rounded-full",
            style: { backgroundColor: "oklch(0.75 0.15 85)" }
          }
        ),
        "Med 40–70%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-block w-2 h-2 rounded-full",
            style: { backgroundColor: "oklch(0.65 0.18 145)" }
          }
        ),
        "Low <40%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 gap-3 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            viewBox: `0 0 ${SVG_W} ${SVG_H}`,
            className: "cursor-grab active:cursor-grabbing select-none",
            "aria-label": "Supply network dependency graph",
            role: "img",
            "data-ocid": "network-svg",
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onWheel: handleWheel,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "marker",
                  {
                    id: "arrow",
                    markerWidth: "6",
                    markerHeight: "6",
                    refX: "5",
                    refY: "3",
                    orient: "auto",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,0 L0,6 L6,3 z", fill: "oklch(0.4 0.01 260)" })
                  }
                ),
                [1, 2, 3].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: CX, cy: CY, r: TIER_RADII[t] }, `orbit-${t}`))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "g",
                {
                  transform: `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`,
                  children: [
                    [1, 2, 3].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: CX,
                        cy: CY,
                        r: TIER_RADII[t],
                        fill: "none",
                        stroke: "oklch(0.32 0.01 260)",
                        strokeWidth: 0.5,
                        strokeDasharray: "4 4"
                      },
                      `orbit-${t}`
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: CX,
                        cy: CY,
                        r: 18,
                        fill: "oklch(0.22 0.02 260)",
                        stroke: "oklch(0.75 0.15 190)",
                        strokeWidth: 1.5
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: CX,
                        y: CY + 4,
                        textAnchor: "middle",
                        fontSize: "8",
                        fontFamily: "var(--font-mono)",
                        fill: "oklch(0.75 0.15 190)",
                        fontWeight: "bold",
                        children: "HUB"
                      }
                    ),
                    positionedNodes.filter((n) => n.tier === 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: CX,
                        y1: CY,
                        x2: n.x,
                        y2: n.y,
                        stroke: "oklch(0.35 0.01 260)",
                        strokeWidth: 0.8,
                        strokeOpacity: 0.4
                      },
                      `hub-${n.supplierId}`
                    )),
                    edges.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: e.x1,
                        y1: e.y1,
                        x2: e.x2,
                        y2: e.y2,
                        stroke: e.risk >= 0.7 ? "oklch(0.55 0.2 25)" : e.risk >= 0.4 ? "oklch(0.75 0.15 85)" : "oklch(0.65 0.18 145)",
                        strokeWidth: 1.2,
                        strokeOpacity: 0.35,
                        markerEnd: "url(#arrow)"
                      },
                      e.key
                    )),
                    visibleNodes.map((node) => {
                      const isSelected = (selectedNode == null ? void 0 : selectedNode.supplierId) === node.supplierId;
                      const rScore = normalizeRisk(node.compositeRisk) * 100;
                      const fillColor = getRiskHex(rScore);
                      const ringW = RING_W[node.tier] ?? 1.5;
                      const isDimmed = highlightHigh && rScore < 70 && !isSelected;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "g",
                        {
                          "data-ocid": "network-node",
                          "aria-label": `${node.supplierName} T${node.tier} ${formatRiskScore(node.compositeRisk)}`,
                          style: { cursor: "pointer" },
                          onMouseEnter: () => handleNodeEnter(node),
                          onMouseLeave: handleNodeLeave,
                          onClick: () => handleNodeClick(node),
                          onKeyDown: (e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleNodeClick(node);
                          },
                          children: [
                            isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: node.x,
                                cy: node.y,
                                r: node.radius + 6,
                                fill: "none",
                                stroke: fillColor,
                                strokeWidth: 2,
                                strokeOpacity: 0.4
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: node.x,
                                cy: node.y,
                                r: node.radius,
                                fill: `${fillColor}22`,
                                stroke: fillColor,
                                strokeWidth: ringW,
                                opacity: isDimmed ? 0.2 : 1
                              }
                            ),
                            rScore >= 70 && !isDimmed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: node.x,
                                cy: node.y,
                                r: node.radius * 0.45,
                                fill: fillColor,
                                opacity: 0.3
                              }
                            ),
                            (node.tier === 1 || node.radius > 20) && !isDimmed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "text",
                              {
                                x: node.x,
                                y: node.y + node.radius + 10,
                                textAnchor: "middle",
                                fontSize: "7",
                                fontFamily: "var(--font-mono)",
                                fill: "oklch(0.65 0.01 260)",
                                children: node.supplierName.split(" ")[0]
                              }
                            )
                          ]
                        },
                        node.supplierId.toString()
                      );
                    })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 text-[9px] font-mono text-muted-foreground bg-card/80 px-2 py-1 border border-border rounded-sm", children: [
          Math.round(transform.scale * 100),
          "% · drag to pan · scroll to zoom"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-card border border-border flex-shrink-0 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Node Inspector" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NetworkSidebar,
          {
            node: selectedNode,
            allNodes: positionedNodes,
            suppliers,
            onClose: () => setSelectedNode(null)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1", children: "Network Stats" }),
          [
            {
              label: "High Risk",
              value: positionedNodes.filter(
                (n) => normalizeRisk(n.compositeRisk) >= 0.7
              ).length,
              color: "oklch(0.55 0.2 25)"
            },
            {
              label: "Med Risk",
              value: positionedNodes.filter((n) => {
                const r = normalizeRisk(n.compositeRisk);
                return r >= 0.4 && r < 0.7;
              }).length,
              color: "oklch(0.75 0.15 85)"
            },
            {
              label: "Low Risk",
              value: positionedNodes.filter(
                (n) => normalizeRisk(n.compositeRisk) < 0.4
              ).length,
              color: "oklch(0.65 0.18 145)"
            }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex justify-between text-xs font-mono",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: stat.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", style: { color: stat.color }, children: stat.value })
              ]
            },
            stat.label
          ))
        ] })
      ] })
    ] }),
    tooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(NodeTooltip, { node: tooltip.node, containerRef: svgRef }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: 0 }) })
  ] });
}
export {
  Network as default
};
