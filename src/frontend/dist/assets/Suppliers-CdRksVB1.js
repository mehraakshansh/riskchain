import { c as createLucideIcon, b as useSupplierProfiles, r as reactExports, j as jsxRuntimeExports, S as Skeleton, n as normalizeRisk, i as generateMockTrend, C as ChevronRight, o as useSupplierTrend, p as formatPercent, g as formatRiskScore, h as getRiskColor, q as useLogMitigation } from "./index-3OTCWF_L.js";
import { R as RiskBadge } from "./RiskBadge-00Mr7gXR.js";
import { S as SparklineChart } from "./SparklineChart-BeuMITn5.js";
import { B as Badge } from "./badge-TYyvX5gy.js";
import { X, B as Button } from "./button-C8pW3ns0.js";
import { I as Input } from "./input-Dc7c-uLD.js";
import { S as Search, C as ChevronDown } from "./search-sNNHoRJl.js";
import "./LineChart-BTbZlsvD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
];
const ChevronsUpDown = createLucideIcon("chevrons-up-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const PAGE_SIZE = 20;
function SortIcon({
  col,
  active,
  dir
}) {
  if (col !== active)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 opacity-30 shrink-0" });
  return dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 rotate-180 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 shrink-0" });
}
function MetricRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[11px]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] tabular-nums text-foreground", children: value })
  ] });
}
function MitigationPanel({
  supplierId,
  localActions,
  onAdded
}) {
  const [actionText, setActionText] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const logMitigation = useLogMitigation();
  const handleAdd = reactExports.useCallback(() => {
    const text = actionText.trim();
    if (!text || !dueDate) return;
    const due = BigInt(new Date(dueDate).getTime());
    const newAction = {
      id: BigInt(Date.now()),
      supplierId,
      action: text,
      dueDate: due,
      status: "pending",
      createdAt: BigInt(Date.now())
    };
    logMitigation.mutate(
      { supplierId, action: text, dueDate: due },
      {
        onSuccess: (id) => onAdded({ ...newAction, id }),
        onError: () => onAdded(newAction)
      }
    );
    setActionText("");
    setDueDate("");
  }, [actionText, dueDate, supplierId, logMitigation, onAdded]);
  const statusColor = {
    pending: "bg-warning/15 text-warning border-warning/30",
    completed: "bg-success/15 text-success border-success/30",
    cancelled: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Mitigation Actions" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Describe mitigation action...",
          value: actionText,
          onChange: (e) => setActionText(e.target.value),
          className: "h-7 text-xs flex-1 bg-muted/30 border-border",
          "data-ocid": "mitigation-action-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          value: dueDate,
          onChange: (e) => setDueDate(e.target.value),
          className: "h-7 text-xs w-32 bg-muted/30 border-border",
          "data-ocid": "mitigation-due-date"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          className: "h-7 text-xs px-2 shrink-0",
          onClick: handleAdd,
          disabled: !actionText.trim() || !dueDate || logMitigation.isPending,
          "data-ocid": "mitigation-add-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
        }
      )
    ] }),
    localActions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground italic", children: "No mitigation actions recorded." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-36 overflow-y-auto pr-1", children: localActions.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 py-1 border-b border-border last:border-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center border rounded-sm px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wide shrink-0 ${statusColor[a.status] ?? "bg-muted text-foreground border-border"}`,
              children: a.status.toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-[11px] text-foreground leading-snug min-w-0", children: a.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground shrink-0", children: new Date(Number(a.dueDate)).toLocaleDateString() })
        ]
      },
      a.id.toString()
    )) })
  ] });
}
function DetailPanel({
  supplier,
  onClose,
  localActions,
  onActionAdded
}) {
  const { data: trend } = useSupplierTrend(supplier.id, 30);
  const qTrend = (trend == null ? void 0 : trend.map((t) => normalizeRisk(t.qualityRisk))) ?? generateMockTrend(supplier.qualityRisk, 30);
  const dTrend = (trend == null ? void 0 : trend.map((t) => normalizeRisk(t.delayRisk))) ?? generateMockTrend(supplier.delayRisk, 30);
  const fTrend = (trend == null ? void 0 : trend.map((t) => normalizeRisk(t.failureRisk))) ?? generateMockTrend(supplier.failureRisk, 30);
  const cTrend = (trend == null ? void 0 : trend.map((t) => normalizeRisk(t.compositeRisk))) ?? generateMockTrend(supplier.compositeRisk, 30);
  const riskRows = [
    {
      label: "Quality Risk",
      data: qTrend,
      score: normalizeRisk(supplier.qualityRisk)
    },
    {
      label: "Delay Risk",
      data: dTrend,
      score: normalizeRisk(supplier.delayRisk)
    },
    {
      label: "Failure Risk",
      data: fTrend,
      score: normalizeRisk(supplier.failureRisk)
    },
    {
      label: "Composite",
      data: cTrend,
      score: normalizeRisk(supplier.compositeRisk)
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-muted/10 border-b border-border px-4 py-3 space-y-3",
      "data-ocid": "supplier-detail-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: supplier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] font-mono py-0", children: [
              "Tier ",
              supplier.tier
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: supplier.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: supplier.location })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "h-6 w-6 p-0 shrink-0",
              onClick: onClose,
              "aria-label": "Close detail panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5", children: "Operational Metrics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Defect Rate",
                  value: formatPercent(supplier.defectRate)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "On-Time Delivery",
                  value: formatPercent(supplier.onTimeDeliveryRate)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Avg Lead Time",
                  value: `${Number(supplier.avgLeadTimeDays)}d`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Carrier Score",
                  value: formatPercent(supplier.carrierPerformanceScore)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Equipment Failure",
                  value: formatPercent(supplier.equipmentFailureRate)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Supply Interruptions",
                  value: supplier.supplyInterruptionCount.toString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Volume Handled",
                  value: Number(supplier.volumeHandled).toLocaleString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricRow,
                {
                  label: "Years Active",
                  value: `${Number(supplier.yearsActive)}y`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5", children: "30-Day Risk Trend" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: riskRows.map(({ label, data, score }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground w-24 shrink-0", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SparklineChart,
                {
                  data,
                  score,
                  height: 22,
                  showTooltip: true
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[11px] font-mono tabular-nums shrink-0 ${getRiskColor(score * 100)}`,
                  children: formatRiskScore(score)
                }
              )
            ] }, label)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MitigationPanel,
            {
              supplierId: supplier.id,
              localActions,
              onAdded: onActionAdded
            }
          ) })
        ] })
      ]
    }
  ) }) });
}
function SupplierRow({
  supplier,
  isExpanded,
  onToggle,
  localActions,
  onActionAdded
}) {
  const compositeFloat = normalizeRisk(supplier.compositeRisk);
  const sparkData = reactExports.useMemo(
    () => generateMockTrend(supplier.compositeRisk, 14),
    [supplier.compositeRisk]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-border hover:bg-muted/20 cursor-pointer transition-colors",
        onClick: onToggle,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") onToggle();
        },
        "data-ocid": "supplier-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate max-w-[150px]", children: supplier.name })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-[10px] font-mono py-0 px-1.5",
              children: [
                "T",
                supplier.tier
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-[11px] text-muted-foreground", children: supplier.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-[11px] text-muted-foreground truncate max-w-[110px]", children: supplier.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(supplier.qualityRisk), size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(supplier.delayRisk), size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(supplier.failureRisk), size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: compositeFloat, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 w-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SparklineChart, { data: sparkData, score: compositeFloat, height: 26 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "h-6 text-[11px] px-2",
              onClick: (e) => {
                e.stopPropagation();
                onToggle();
              },
              "data-ocid": "supplier-row-action",
              "aria-label": isExpanded ? "Collapse" : "Expand",
              children: isExpanded ? "Collapse" : "Details"
            }
          ) })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DetailPanel,
      {
        supplier,
        onClose: onToggle,
        localActions,
        onActionAdded
      }
    )
  ] });
}
function Suppliers() {
  const { data: suppliers, isLoading } = useSupplierProfiles();
  const [search, setSearch] = reactExports.useState("");
  const [tierFilter, setTierFilter] = reactExports.useState("all");
  const [riskFilter, setRiskFilter] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("compositeRisk");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(0);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [localMitigations, setLocalMitigations] = reactExports.useState({});
  const handleSort = reactExports.useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => d === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
      setPage(0);
    },
    [sortKey]
  );
  const filtered = reactExports.useMemo(() => {
    const list = suppliers ?? [];
    return list.filter((s) => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (tierFilter !== "all" && s.tier !== Number(tierFilter)) return false;
      if (riskFilter !== "all") {
        const score = Number(s.compositeRisk);
        if (riskFilter === "high" && score <= 70) return false;
        if (riskFilter === "medium" && (score <= 40 || score > 70))
          return false;
        if (riskFilter === "low" && score > 40) return false;
      }
      return true;
    }).sort((a, b) => {
      let av;
      let bv;
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
          av = Number(a[sortKey]);
          bv = Number(b[sortKey]);
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = av;
      const bn = bv;
      return sortDir === "asc" ? an - bn : bn - an;
    });
  }, [suppliers, search, tierFilter, riskFilter, sortKey, sortDir]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const toggleExpand = reactExports.useCallback((id) => {
    setExpandedId((prev) => prev === id ? null : id);
  }, []);
  const handleActionAdded = reactExports.useCallback(
    (supplierId, action) => {
      setLocalMitigations((prev) => ({
        ...prev,
        [supplierId]: [...prev[supplierId] ?? [], action]
      }));
    },
    []
  );
  function ThCol({
    col,
    label,
    className = ""
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: `px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap ${className}`,
        onClick: () => handleSort(col),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") handleSort(col);
        },
        "data-ocid": `sort-${col}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col, active: sortKey, dir: sortDir })
        ] })
      }
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
    "sc10"
  ];
  const windowStart = Math.max(0, Math.min(pageCount - 7, page - 3));
  const pageButtons = Array.from(
    { length: Math.min(pageCount, 7) },
    (_, i) => windowStart + i
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "suppliers-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-4 py-2.5 flex items-center gap-3 flex-wrap shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-sm text-foreground mr-1", children: "Supplier Directory" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[180px] max-w-xs flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(0);
            },
            placeholder: "Search suppliers...",
            className: "h-7 pl-6 text-xs bg-muted/30 border-border",
            "data-ocid": "supplier-search"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            onClick: () => {
              setSearch("");
              setPage(0);
            },
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", "data-ocid": "tier-filter", children: ["all", "1", "2", "3"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setTierFilter(t);
            setPage(0);
          },
          className: `h-7 px-2.5 rounded-sm text-[11px] font-mono transition-colors border ${tierFilter === t ? "bg-primary/15 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border hover:text-foreground"}`,
          children: t === "all" ? "All Tiers" : `T${t}`
        },
        t
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", "data-ocid": "risk-filter", children: ["all", "high", "medium", "low"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setRiskFilter(r);
            setPage(0);
          },
          className: `h-7 px-2.5 rounded-sm text-[11px] font-mono capitalize transition-colors border ${riskFilter === r ? "bg-primary/15 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border hover:text-foreground"}`,
          children: r === "all" ? "All Risk" : r
        },
        r
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "ml-auto text-[11px] text-muted-foreground font-mono tabular-nums shrink-0",
          "data-ocid": "supplier-count",
          children: [
            filtered.length,
            " supplier",
            filtered.length !== 1 ? "s" : ""
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "table",
        {
          className: "w-full text-sm border-collapse",
          "data-ocid": "supplier-table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-card border-b border-border z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "name", label: "Supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "tier", label: "Tier", className: "w-14 text-center" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "category", label: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "location", label: "Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "qualityRisk", label: "Quality" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "delayRisk", label: "Delay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "failureRisk", label: "Failure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ThCol, { col: "compositeRisk", label: "Composite" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-muted-foreground w-24", children: "Trend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 w-20" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? skeletonRows.map((rk) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: skeletonCols.map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `${rk}-${ck}`)) }, rk)) : paged.map((s) => {
              const sid = s.id.toString();
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                SupplierRow,
                {
                  supplier: s,
                  isExpanded: expandedId === sid,
                  onToggle: () => toggleExpand(sid),
                  localActions: localMitigations[sid] ?? [],
                  onActionAdded: (a) => handleActionAdded(sid, a)
                },
                sid
              );
            }) })
          ]
        }
      ),
      !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
          "data-ocid": "suppliers-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No suppliers match your filters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 opacity-70", children: "Try adjusting the search or filter criteria" })
          ]
        }
      )
    ] }),
    pageCount > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border-t border-border px-4 py-2 flex items-center justify-between shrink-0",
        "data-ocid": "pagination",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground font-mono", children: [
            "Page ",
            page + 1,
            " of ",
            pageCount,
            " — ",
            filtered.length,
            " total"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "h-6 text-xs px-2",
                disabled: page === 0,
                onClick: () => setPage((p) => p - 1),
                "data-ocid": "pagination-prev",
                children: "Prev"
              }
            ),
            pageButtons.map((pg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: pg === page ? "default" : "outline",
                size: "sm",
                className: "h-6 w-6 p-0 text-xs",
                onClick: () => setPage(pg),
                "data-ocid": `pagination-page-${pg}`,
                children: pg + 1
              },
              `pg-${pg}`
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "h-6 text-xs px-2",
                disabled: page >= pageCount - 1,
                onClick: () => setPage((p) => p + 1),
                "data-ocid": "pagination-next",
                children: "Next"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  Suppliers as default
};
