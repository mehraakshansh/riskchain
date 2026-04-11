import { c as createLucideIcon, b as useSupplierProfiles, v as useSimulateDisruption, r as reactExports, n as normalizeRisk, i as generateMockTrend, j as jsxRuntimeExports, a as cn, A as Activity, l as getRiskLabel, w as getRiskBgColor, k as getRiskHex, h as getRiskColor, x as useAlternativeSuppliers } from "./index-BGYIKH_8.js";
import { R as RiskBadge } from "./RiskBadge-Do1oq5s9.js";
import { S as SparklineChart } from "./SparklineChart-Cxsafzjc.js";
import { T as TriangleAlert } from "./triangle-alert-CGoDbr8I.js";
import { C as ChevronDown, S as Search } from "./search-B7oni47F.js";
import { C as Clock, Z as Zap } from "./zap-COyiOC-O.js";
import "./LineChart-D8zoSgap.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
];
const GitBranch = createLucideIcon("git-branch", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const DISRUPTION_VARIANTS = {
  SupplyInterruption: "SupplyInterruption",
  QualityFailure: "QualityFailure",
  LogisticsDelay: "LogisticsDelay",
  EquipmentFailure: "EquipmentFailure",
  NaturalDisaster: "NaturalDisaster"
};
const DISRUPTION_OPTIONS = [
  {
    id: "SupplyInterruption",
    label: "Supply Interruption",
    description: "Raw material or component shortage",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
    baseColor: "text-warning"
  },
  {
    id: "QualityFailure",
    label: "Quality Failure",
    description: "Defect rate spike or compliance breach",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-3.5 h-3.5" }),
    baseColor: "text-destructive"
  },
  {
    id: "LogisticsDelay",
    label: "Logistics Delay",
    description: "Transit delay or carrier disruption",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
    baseColor: "text-primary"
  },
  {
    id: "EquipmentFailure",
    label: "Equipment Failure",
    description: "Production line or machinery failure",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
    baseColor: "text-destructive"
  },
  {
    id: "NaturalDisaster",
    label: "Natural Disaster",
    description: "Seismic, weather, or geopolitical event",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" }),
    baseColor: "text-warning"
  }
];
function SupplierDropdown({
  suppliers,
  selected,
  onSelect
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [query, setQuery] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const filtered = reactExports.useMemo(
    () => suppliers.filter(
      (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase())
    ),
    [suppliers, query]
  );
  function handleSelect(s) {
    onSelect(s);
    setOpen(false);
    setQuery("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "supplier-selector",
        onClick: () => {
          setOpen((v) => !v);
          setTimeout(() => {
            var _a;
            return (_a = inputRef.current) == null ? void 0 : _a.focus();
          }, 50);
        },
        className: cn(
          "w-full flex items-center justify-between px-3 py-2 rounded border bg-card",
          "text-sm text-foreground transition-smooth hover:border-primary/50",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          open ? "border-primary/60" : "border-border"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: selected ? "text-foreground" : "text-muted-foreground",
              children: selected ? selected.name : "Select supplier…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                open && "rotate-180"
              )
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-50 top-full mt-1 w-full rounded border border-border bg-popover shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search suppliers…",
            className: "flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 text-xs text-muted-foreground text-center", children: "No suppliers match" }) : filtered.map((s) => {
        const compositeFloat = normalizeRisk(s.compositeRisk);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleSelect(s),
            className: cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm",
              "hover:bg-muted/50 transition-colors",
              (selected == null ? void 0 : selected.id) === s.id && "bg-primary/10 text-primary"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
                  "T",
                  s.tier
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: cn(
                    "text-xs px-1.5 py-0.5 rounded-sm font-mono shrink-0",
                    getRiskBgColor(compositeFloat * 100)
                  ),
                  children: [
                    (compositeFloat * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ]
          },
          s.id.toString()
        );
      }) })
    ] })
  ] });
}
function RiskDeltaBar({ before, after, label }) {
  const beforePct = Math.min(before * 100, 100);
  const afterPct = Math.min(after * 100, 100);
  const increased = after > before;
  const delta = after - before;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate mr-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: getRiskColor(before * 100), children: [
          beforePct.toFixed(1),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(getRiskColor(after * 100), "font-semibold"), children: [
          afterPct.toFixed(1),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "text-[10px] px-1 py-0.5 rounded-sm border",
              increased ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-success/15 text-success border-success/30"
            ),
            children: [
              increased ? "+" : "",
              (delta * 100).toFixed(1),
              "%"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-2 rounded-full bg-muted overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute left-0 top-0 h-full rounded-full opacity-40 transition-all duration-500",
          style: {
            width: `${beforePct}%`,
            backgroundColor: getRiskHex(before * 100)
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute left-0 top-0 h-full rounded-full transition-all duration-700",
          style: {
            width: `${afterPct}%`,
            backgroundColor: getRiskHex(after * 100)
          }
        }
      )
    ] })
  ] });
}
function AlternativesTable({
  supplierId,
  category
}) {
  const { data: alts = [], isLoading } = useAlternativeSuppliers(
    supplierId,
    category
  );
  const displayAlts = reactExports.useMemo(() => {
    if (alts.length > 0) return alts;
    return [
      {
        supplierId: BigInt(101),
        name: "Apex Components",
        compositeRisk: BigInt(28),
        avgLeadTimeDays: BigInt(12),
        tier: 1,
        category,
        rank: BigInt(1)
      },
      {
        supplierId: BigInt(102),
        name: "Vector Systems",
        compositeRisk: BigInt(35),
        avgLeadTimeDays: BigInt(18),
        tier: 2,
        category,
        rank: BigInt(2)
      },
      {
        supplierId: BigInt(103),
        name: "Meridian Tech",
        compositeRisk: BigInt(42),
        avgLeadTimeDays: BigInt(22),
        tier: 2,
        category,
        rank: BigInt(3)
      },
      {
        supplierId: BigInt(104),
        name: "Nova Parts",
        compositeRisk: BigInt(51),
        avgLeadTimeDays: BigInt(28),
        tier: 3,
        category,
        rank: BigInt(4)
      }
    ];
  }, [alts, category]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["alt-sk-a", "alt-sk-b", "alt-sk-c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 bg-muted/50 rounded animate-pulse" }, k)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-2 text-muted-foreground font-medium", children: "Supplier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-2 px-2 text-muted-foreground font-medium", children: "Tier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-2 text-muted-foreground font-medium", children: "Risk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-2 text-muted-foreground font-medium", children: "Lead Time" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-2 text-muted-foreground font-medium", children: "#" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: displayAlts.map((alt) => {
      const rankNum = Number(alt.rank);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/30 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-2 font-medium", children: alt.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 px-2 text-center text-muted-foreground font-mono", children: [
              "T",
              alt.tier
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              RiskBadge,
              {
                score: normalizeRisk(alt.compositeRisk),
                size: "sm"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 px-2 text-right font-mono text-muted-foreground", children: [
              Number(alt.avgLeadTimeDays),
              "d"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold",
                  rankNum === 1 ? "bg-primary/20 text-primary" : rankNum === 2 ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"
                ),
                children: rankNum
              }
            ) })
          ]
        },
        alt.supplierId.toString()
      );
    }) })
  ] }) });
}
function getSeverityScore(severity) {
  if (severity === "Critical") return 90;
  if (severity === "High") return 75;
  if (severity === "Medium") return 55;
  return 25;
}
function getSeverityBannerClass(severity) {
  if (severity === "Critical") return "bg-destructive/10 border-destructive/40";
  if (severity === "High") return "bg-warning/10 border-warning/40";
  if (severity === "Medium") return "bg-warning/5 border-warning/20";
  return "bg-success/10 border-success/40";
}
function getSeverityIconClass(severity) {
  if (severity === "Critical" || severity === "High") return "text-warning";
  if (severity === "Medium") return "text-warning";
  return "text-success";
}
function getSeverityLabel(severity) {
  return severity.toUpperCase();
}
function Simulator() {
  var _a;
  const { data: suppliers = [], isLoading: suppliersLoading } = useSupplierProfiles();
  const simulate = useSimulateDisruption();
  const [selectedSupplier, setSelectedSupplier] = reactExports.useState(null);
  const [selectedDisruption, setSelectedDisruption] = reactExports.useState("SupplyInterruption");
  function handleRunSimulation() {
    if (!selectedSupplier) return;
    simulate.mutate({
      supplierId: selectedSupplier.id,
      disruptionType: DISRUPTION_VARIANTS[selectedDisruption],
      allSuppliers: suppliers
    });
  }
  const impact = simulate.data;
  const isRunning = simulate.isPending;
  const simError = simulate.error;
  const cascadingSuppliers = reactExports.useMemo(() => {
    if (!impact) return [];
    return impact.cascadingSupplierIds.map((cid) => {
      const match = suppliers.find((s) => s.id === cid);
      const risk = match ? normalizeRisk(match.compositeRisk) : 0.55 + Math.random() * 0.3;
      return {
        id: cid,
        name: (match == null ? void 0 : match.name) ?? `Supplier #${cid.toString()}`,
        risk
      };
    });
  }, [impact, suppliers]);
  const basePortfolioRisk = 0.58;
  const directRiskFloat = impact ? normalizeRisk(impact.directRiskIncrease) : 0;
  const portfolioDeltaFloat = impact ? normalizeRisk(impact.portfolioRiskDelta) : 0;
  const afterPortfolioRisk = impact ? Math.min(1, basePortfolioRisk + portfolioDeltaFloat) : 0;
  const affectedSupplier = impact ? suppliers.find((s) => s.id === impact.affectedSupplierId) ?? null : null;
  const affectedCompositeFloat = affectedSupplier ? normalizeRisk(affectedSupplier.compositeRisk) : 0.5;
  const postDisruptionTrend = reactExports.useMemo(() => {
    if (!impact) return generateMockTrend(0.5, 20);
    return [
      ...generateMockTrend(affectedCompositeFloat - 0.05, 10),
      ...generateMockTrend(affectedCompositeFloat + directRiskFloat, 10)
    ];
  }, [impact, affectedCompositeFloat, directRiskFloat]);
  const estimatedRecoveryDays = impact ? Number(impact.estimatedRecoveryDays) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col overflow-hidden",
      "data-ocid": "simulator-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-5 py-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-semibold font-display text-foreground", children: "Scenario Simulator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono", children: "Model supply chain disruptions and cascade impact analysis" })
          ] }),
          impact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
            "Simulation complete"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-[320px_1fr] overflow-hidden min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border bg-card flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 border-b border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-mono", children: "Simulation Controls" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 flex-1 overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium", children: "Target Supplier" }),
                suppliersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 bg-muted/50 rounded animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SupplierDropdown,
                  {
                    suppliers,
                    selected: selectedSupplier,
                    onSelect: (s) => {
                      setSelectedSupplier(s);
                      simulate.reset();
                    }
                  }
                ),
                selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-background/40 px-3 py-2 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", children: [
                      "T",
                      selectedSupplier.tier,
                      " · ",
                      selectedSupplier.location
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RiskBadge,
                      {
                        score: normalizeRisk(selectedSupplier.compositeRisk),
                        size: "sm"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: [
                    {
                      l: "Quality",
                      v: normalizeRisk(selectedSupplier.qualityRisk)
                    },
                    {
                      l: "Delay",
                      v: normalizeRisk(selectedSupplier.delayRisk)
                    },
                    {
                      l: "Failure",
                      v: normalizeRisk(selectedSupplier.failureRisk)
                    }
                  ].map(({ l, v }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono text-muted-foreground/70", children: l }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: cn(
                          "text-xs font-mono font-bold tabular-nums",
                          getRiskColor(v * 100)
                        ),
                        children: [
                          (v * 100).toFixed(0),
                          "%"
                        ]
                      }
                    )
                  ] }, l)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SparklineChart,
                    {
                      data: generateMockTrend(selectedSupplier.compositeRisk, 14),
                      score: normalizeRisk(selectedSupplier.compositeRisk),
                      height: 28
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium", children: "Disruption Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: DISRUPTION_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `disruption-${opt.id.toLowerCase()}`,
                    onClick: () => {
                      setSelectedDisruption(opt.id);
                      simulate.reset();
                    },
                    className: cn(
                      "w-full flex items-start gap-2.5 px-3 py-2 rounded border text-left transition-smooth",
                      selectedDisruption === opt.id ? "border-primary/60 bg-primary/8" : "border-border hover:border-border/80 hover:bg-muted/30"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: cn(
                            "mt-0.5 shrink-0",
                            selectedDisruption === opt.id ? "text-primary" : opt.baseColor
                          ),
                          children: opt.icon
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: cn(
                              "text-xs font-medium",
                              selectedDisruption === opt.id ? "text-primary" : "text-foreground"
                            ),
                            children: opt.label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5 truncate", children: opt.description })
                      ] }),
                      selectedDisruption === opt.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" })
                    ]
                  },
                  opt.id
                )) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-border shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "run-simulation-btn",
                  disabled: !selectedSupplier || isRunning,
                  onClick: handleRunSimulation,
                  className: cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded",
                    "text-sm font-semibold transition-smooth",
                    !selectedSupplier || isRunning ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99]"
                  ),
                  children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" }),
                    "Running…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" }),
                    "Run Simulation"
                  ] })
                }
              ),
              !selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center mt-1.5 font-mono", children: "Select a supplier to enable simulation" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background overflow-y-auto min-h-0", children: [
            !impact && !isRunning && !simError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "simulator-empty",
                className: "flex flex-col items-center justify-center h-full min-h-64 gap-3 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "w-5 h-5 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No simulation run yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-52", children: "Select a supplier and disruption type, then run the simulation to see cascade impact." })
                  ] })
                ]
              }
            ),
            isRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "sim-loading-state",
                className: "flex flex-col items-center justify-center h-full min-h-64 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "Running ML disruption model…" })
                ]
              }
            ),
            simError && !isRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "simulator-error",
                className: "flex flex-col items-center justify-center h-full min-h-64 gap-3 text-center p-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-warning" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Unable to run simulation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-64", children: "Please select a supplier and try again." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => simulate.reset(),
                      className: "text-xs text-primary hover:underline font-mono mt-1",
                      children: "Dismiss and retry"
                    }
                  )
                ]
              }
            ),
            impact && !isRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "rounded border px-4 py-3 flex items-center justify-between gap-3",
                    getSeverityBannerClass(impact.severity)
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TriangleAlert,
                        {
                          className: cn(
                            "w-3.5 h-3.5 shrink-0",
                            getSeverityIconClass(impact.severity)
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono font-bold text-foreground", children: [
                        getSeverityLabel(impact.severity),
                        " SEVERITY EVENT"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground shrink-0", children: (_a = DISRUPTION_OPTIONS.find((o) => o.id === selectedDisruption)) == null ? void 0 : _a.label })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Affected Supplier" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold font-display text-foreground mt-0.5", children: (affectedSupplier == null ? void 0 : affectedSupplier.name) ?? `Supplier #${impact.affectedSupplierId.toString()}` })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "text-xs px-2 py-1 rounded border font-semibold font-mono shrink-0",
                        getRiskBgColor(getSeverityScore(impact.severity))
                      ),
                      children: getRiskLabel(getSeverityScore(impact.severity))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "sim-direct-risk",
                      className: "px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-wider text-muted-foreground", children: "Direct Risk +Δ" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: cn(
                              "text-xl font-bold font-mono tabular-nums leading-none",
                              getRiskColor(directRiskFloat * 100)
                            ),
                            children: [
                              "+",
                              (directRiskFloat * 100).toFixed(1),
                              "%"
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "sim-portfolio-delta",
                      className: "px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-wider text-muted-foreground", children: "Portfolio Δ" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: cn(
                              "text-xl font-bold font-mono tabular-nums leading-none",
                              portfolioDeltaFloat > 0 ? "text-destructive" : "text-success"
                            ),
                            children: [
                              portfolioDeltaFloat > 0 ? "+" : "",
                              (portfolioDeltaFloat * 100).toFixed(1),
                              "%"
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "sim-recovery",
                      className: "px-3 py-2 rounded bg-muted/30 border border-border space-y-0.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-wider text-muted-foreground", children: "Recovery" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold font-mono tabular-nums leading-none text-foreground", children: [
                          estimatedRecoveryDays,
                          "d"
                        ] })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold", children: "Portfolio Risk Before / After" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RiskDeltaBar,
                  {
                    before: basePortfolioRisk,
                    after: afterPortfolioRisk,
                    label: "Portfolio composite risk"
                  }
                ),
                selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RiskDeltaBar,
                  {
                    before: affectedCompositeFloat,
                    after: Math.min(
                      1,
                      affectedCompositeFloat + directRiskFloat
                    ),
                    label: `${selectedSupplier.name} (direct)`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
                  "Risk Trajectory (post-disruption)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SparklineChart,
                  {
                    data: postDisruptionTrend,
                    score: Math.min(1, affectedCompositeFloat + directRiskFloat),
                    height: 56,
                    showTooltip: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-mono text-muted-foreground", children: [
                  "Projected 20-day composite risk for",
                  " ",
                  (affectedSupplier == null ? void 0 : affectedSupplier.name) ?? "affected supplier"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold", children: "Cascading Impact" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      "data-ocid": "sim-cascading",
                      className: "text-[10px] font-mono text-muted-foreground",
                      children: [
                        cascadingSuppliers.length,
                        " affected"
                      ]
                    }
                  )
                ] }),
                cascadingSuppliers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-2 text-center font-mono", children: "No cascading suppliers detected" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: cascadingSuppliers.map((cs) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "cascade-supplier-row",
                    className: "flex items-center justify-between px-3 py-2 rounded border border-border/50 hover:bg-muted/30 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-1.5 h-1.5 rounded-full shrink-0",
                            style: {
                              backgroundColor: getRiskHex(cs.risk * 100)
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium truncate", children: cs.name })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0 ml-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: cn(
                              "text-[10px] font-mono tabular-nums",
                              getRiskColor(cs.risk * 100)
                            ),
                            children: [
                              (cs.risk * 100).toFixed(1),
                              "%"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: cn(
                              "text-[10px] px-1.5 py-0.5 rounded-sm border font-mono font-semibold",
                              getRiskBgColor(cs.risk * 100)
                            ),
                            children: getRiskLabel(cs.risk * 100)
                          }
                        )
                      ] })
                    ]
                  },
                  cs.id.toString()
                )) })
              ] }),
              selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold", children: "Recommended Alternatives" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground", children: selectedSupplier.category })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlternativesTable,
                  {
                    supplierId: selectedSupplier.id,
                    category: selectedSupplier.category
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold", children: "Recommended Mitigations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: [
                  {
                    id: "m1",
                    text: "Activate secondary supplier contracts within 24h"
                  },
                  {
                    id: "m2",
                    text: "Increase safety stock by 2–3× for affected SKUs"
                  },
                  {
                    id: "m3",
                    text: `Initiate emergency sourcing from ${cascadingSuppliers.length > 0 ? cascadingSuppliers.length : "Tier 2"} alternative suppliers`
                  },
                  {
                    id: "m4",
                    text: `Notify procurement team — estimated ${estimatedRecoveryDays}-day recovery window`
                  }
                ].map(({ id, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2 text-[11px] font-mono text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary shrink-0 mt-0.5", children: "→" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text })
                    ]
                  },
                  id
                )) })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Simulator as default
};
