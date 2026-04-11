import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, u as usePortfolioSnapshot, b as useSupplierProfiles, d as useThresholds, e as useRiskAlerts, f as usePortfolioTrend, r as reactExports, n as normalizeRisk, t as toNumber, R as RefreshCw, g as formatRiskScore, h as getRiskColor, U as Users, i as generateMockTrend, k as getRiskHex, l as getRiskLabel, m as getRiskLevel } from "./index-BGYIKH_8.js";
import { R as RiskBadge } from "./RiskBadge-Do1oq5s9.js";
import { S as SparklineChart } from "./SparklineChart-Cxsafzjc.js";
import { Z as Zap, C as Clock } from "./zap-COyiOC-O.js";
import { T as TriangleAlert } from "./triangle-alert-CGoDbr8I.js";
import { R as ResponsiveContainer, X as XAxis, Y as YAxis, T as Tooltip } from "./LineChart-D8zoSgap.js";
import { A as AreaChart, C as CartesianGrid, a as Area } from "./AreaChart-C3qUOL3l.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function StatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  colorClass,
  icon,
  className,
  "data-ocid": dataOcid
}) {
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  const trendColor = trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid ?? "stat-card",
      className: cn(
        "bg-card border border-border p-3 flex flex-col gap-1 min-w-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate", children: label }),
          icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "text-2xl font-display font-bold tabular-nums leading-none",
              colorClass ?? "text-foreground"
            ),
            children: value
          }
        ),
        (subValue || trendValue) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
          trendValue && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn("text-[10px] font-mono tabular-nums", trendColor),
              children: [
                trendIcon,
                " ",
                trendValue
              ]
            }
          ),
          subValue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate", children: subValue })
        ] })
      ]
    }
  );
}
function RiskGauge({ score }) {
  const pct = score * 100;
  const color = getRiskHex(pct);
  const label = getRiskLabel(pct);
  const radius = 52;
  const cx = 70;
  const cy = 68;
  const START = 215;
  const END = 325;
  const ARC = END - START;
  function polarToXY(angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }
  function arcPath(a1, a2) {
    const s = polarToXY(a1);
    const e = polarToXY(a2);
    const lg = a2 - a1 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${lg} 1 ${e.x} ${e.y}`;
  }
  const progressEnd = START + Math.min(pct, 100) / 100 * ARC;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 140, height: 88, role: "img", "aria-labelledby": "gauge-title", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "gauge-title", children: `Portfolio risk ${pct.toFixed(1)}%` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: arcPath(START, START + ARC),
        fill: "none",
        stroke: "oklch(0.28 0.02 260)",
        strokeWidth: 9,
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: arcPath(START, progressEnd),
        fill: "none",
        stroke: color,
        strokeWidth: 9,
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "text",
      {
        x: cx,
        y: cy - 2,
        textAnchor: "middle",
        fill: color,
        fontSize: 21,
        fontWeight: 700,
        fontFamily: "Space Grotesk",
        children: [
          pct.toFixed(1),
          "%"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "text",
      {
        x: cx,
        y: cy + 14,
        textAnchor: "middle",
        fill: "oklch(0.55 0.01 260)",
        fontSize: 9,
        fontFamily: "Geist Mono",
        letterSpacing: 2,
        children: [
          label,
          " RISK"
        ]
      }
    )
  ] });
}
function RiskDistribution({
  high,
  medium,
  low
}) {
  const total = Math.max(high + medium + low, 1);
  const bars = [
    {
      label: "HIGH",
      count: high,
      pct: high / total * 100,
      barClass: "bg-destructive"
    },
    {
      label: "MED",
      count: medium,
      pct: medium / total * 100,
      barClass: "bg-warning"
    },
    {
      label: "LOW",
      count: low,
      pct: low / total * 100,
      barClass: "bg-success"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: bars.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono tracking-widest text-muted-foreground w-8 shrink-0", children: b.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "h-full rounded-full transition-all duration-700",
          b.barClass
        ),
        style: { width: `${b.pct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono tabular-nums text-foreground w-20 text-right shrink-0", children: [
      b.count,
      " (",
      b.pct.toFixed(1),
      "%)"
    ] })
  ] }, b.label)) });
}
function SuppliersTable({ suppliers }) {
  const top10 = [...suppliers].sort((a, b) => Number(b.compositeRisk) - Number(a.compositeRisk)).slice(0, 10);
  const TIER_CLS = {
    1: "bg-primary/20 text-primary border-primary/30",
    2: "bg-muted text-muted-foreground border-border",
    3: "bg-muted/50 text-muted-foreground border-border"
  };
  const HEADERS = [
    "Supplier",
    "Tier",
    "Quality",
    "Delay",
    "Failure",
    "Composite",
    "30d Trend"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse min-w-[680px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: HEADERS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "text-left py-1.5 px-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-normal",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: top10.map((s) => {
      const compositeFloat = normalizeRisk(s.compositeRisk);
      const trend = generateMockTrend(s.compositeRisk, 30);
      const tierCls = TIER_CLS[s.tier] ?? TIER_CLS[3];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": "supplier-row",
          className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2 font-medium text-foreground max-w-[150px] truncate", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "inline-flex items-center border rounded-sm px-1.5 py-0.5 text-[9px] font-mono",
                  tierCls
                ),
                children: [
                  "T",
                  s.tier
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(s.qualityRisk), size: "sm" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(s.delayRisk), size: "sm" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { score: normalizeRisk(s.failureRisk), size: "sm" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "font-mono font-bold tabular-nums text-xs",
                  getRiskColor(Number(s.compositeRisk))
                ),
                children: [
                  Number(s.compositeRisk).toFixed(1),
                  "%"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2 w-[100px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              SparklineChart,
              {
                data: trend,
                score: compositeFloat,
                width: 96,
                height: 26
              }
            ) })
          ]
        },
        s.id.toString()
      );
    }) })
  ] }) });
}
function PortfolioTrendChart({ data }) {
  const chartData = data.map((d, i) => {
    const dt = new Date(Number(d.timestamp));
    return {
      i,
      label: `${dt.getMonth() + 1}/${dt.getDate()}`,
      composite: Number((Number(d.compositeRisk) / 100 * 100).toFixed(1)),
      quality: Number((Number(d.qualityRisk) / 100 * 100).toFixed(1)),
      delay: Number((Number(d.delayRisk) / 100 * 100).toFixed(1)),
      failure: Number((Number(d.failureRisk) / 100 * 100).toFixed(1))
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 176, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AreaChart,
    {
      data: chartData,
      margin: { top: 4, right: 4, bottom: 0, left: -20 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "5%",
                stopColor: "oklch(0.75 0.15 190)",
                stopOpacity: 0.28
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "95%",
                stopColor: "oklch(0.75 0.15 190)",
                stopOpacity: 0.02
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gq", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "5%",
                stopColor: "oklch(0.55 0.2 25)",
                stopOpacity: 0.2
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "95%",
                stopColor: "oklch(0.55 0.2 25)",
                stopOpacity: 0.01
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gd", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "5%",
                stopColor: "oklch(0.75 0.15 85)",
                stopOpacity: 0.2
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "95%",
                stopColor: "oklch(0.75 0.15 85)",
                stopOpacity: 0.01
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartesianGrid,
          {
            strokeDasharray: "3 3",
            stroke: "oklch(0.28 0.02 260)",
            strokeOpacity: 0.5,
            vertical: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "label",
            tick: {
              fontSize: 9,
              fill: "oklch(0.55 0.01 260)",
              fontFamily: "Geist Mono"
            },
            tickLine: false,
            axisLine: false,
            interval: "preserveStartEnd"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            domain: [0, 100],
            tick: {
              fontSize: 9,
              fill: "oklch(0.55 0.01 260)",
              fontFamily: "Geist Mono"
            },
            tickLine: false,
            axisLine: false,
            tickFormatter: (v) => `${v}%`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              background: "oklch(0.22 0.02 260)",
              border: "1px solid oklch(0.28 0.02 260)",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "Geist Mono"
            },
            labelStyle: { color: "oklch(0.95 0.01 260)", marginBottom: "4px" },
            itemStyle: { color: "oklch(0.75 0.01 260)" },
            formatter: (v, name) => [`${v}%`, name]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "quality",
            name: "Quality",
            stroke: "oklch(0.55 0.2 25)",
            strokeWidth: 1,
            fill: "url(#gq)",
            dot: false,
            isAnimationActive: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "delay",
            name: "Delay",
            stroke: "oklch(0.75 0.15 85)",
            strokeWidth: 1,
            fill: "url(#gd)",
            dot: false,
            isAnimationActive: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "composite",
            name: "Composite",
            stroke: "oklch(0.75 0.15 190)",
            strokeWidth: 2,
            fill: "url(#gc)",
            dot: false,
            isAnimationActive: false
          }
        )
      ]
    }
  ) });
}
function AlertFeed({ alerts }) {
  if (alerts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "alert-empty",
        className: "flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", children: "No active alerts" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "alert-feed",
      className: "flex flex-col divide-y divide-border/50 overflow-y-auto max-h-[268px]",
      children: alerts.map((alert) => {
        const elapsed = Date.now() - Number(alert.triggeredAt);
        const mins = Math.floor(elapsed / 6e4);
        const timeLabel = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
        const compositeNum = Number(alert.compositeRisk);
        const level = getRiskLevel(compositeNum);
        const dotCls = level === "high" ? "bg-destructive" : level === "medium" ? "bg-warning" : "bg-success";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "alert-row",
            className: "flex items-start gap-3 py-2 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", dotCls)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate", children: alert.supplierName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RiskBadge,
                    {
                      score: normalizeRisk(alert.compositeRisk),
                      size: "sm",
                      showScore: false
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", children: [
                  "Q:",
                  formatRiskScore(alert.qualityRisk),
                  " · D:",
                  formatRiskScore(alert.delayRisk),
                  " · F:",
                  formatRiskScore(alert.failureRisk)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5", children: timeLabel })
            ]
          },
          alert.supplierId.toString()
        );
      })
    }
  );
}
const LEGEND_ITEMS = [
  { label: "Composite", color: "oklch(0.75 0.15 190)" },
  { label: "Quality", color: "oklch(0.55 0.2 25)" },
  { label: "Delay", color: "oklch(0.75 0.15 85)" }
];
function ChartLegend() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: LEGEND_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-3 h-0.5 rounded-full",
        style: { backgroundColor: item.color }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground", children: item.label })
  ] }, item.label)) });
}
function SectionHeader({
  title,
  count
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: title }),
    count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm", children: count })
  ] });
}
function Dashboard() {
  const snapshotQuery = usePortfolioSnapshot();
  const suppliersQuery = useSupplierProfiles();
  const { compositeThreshold } = useThresholds();
  const alertsQuery = useRiskAlerts(compositeThreshold);
  const trendQuery = usePortfolioTrend(30);
  const [lastUpdated, setLastUpdated] = reactExports.useState(/* @__PURE__ */ new Date());
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const prevTs = reactExports.useRef(0);
  reactExports.useEffect(() => {
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
  const portfolioScore = snapshot ? normalizeRisk(snapshot.portfolioRiskScore) : 0;
  const avgRisk = snapshot ? normalizeRisk(snapshot.avgCompositeRisk) : 0;
  const maxRiskScore = snapshot ? normalizeRisk(snapshot.maxRiskScore) : 0;
  const highCount = toNumber((snapshot == null ? void 0 : snapshot.highRiskCount) ?? BigInt(0));
  const medCount = toNumber((snapshot == null ? void 0 : snapshot.mediumRiskCount) ?? BigInt(0));
  const lowCount = toNumber((snapshot == null ? void 0 : snapshot.lowRiskCount) ?? BigInt(0));
  const totalSuppliers = toNumber((snapshot == null ? void 0 : snapshot.totalSuppliers) ?? BigInt(0));
  const timeStr = lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", "data-ocid": "dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-display font-bold text-foreground uppercase tracking-wide", children: "Portfolio Risk Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono", children: "ML-driven supply chain risk intelligence" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "last-updated",
            className: cn(
              "flex items-center gap-1.5 text-[10px] font-mono",
              isRefreshing ? "text-primary" : "text-muted-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: cn("w-3 h-3", isRefreshing && "animate-spin")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Updated ",
                timeStr
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-mono text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-success animate-pulse" }),
          "LIVE · 5s"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 sm:col-span-3 bg-card border border-border p-3 flex flex-col items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono uppercase tracking-widest text-muted-foreground self-start", children: "Portfolio Risk Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RiskGauge, { score: portfolioScore }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono text-muted-foreground", children: [
          "Max:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: getRiskColor(maxRiskScore * 100), children: formatRiskScore((snapshot == null ? void 0 : snapshot.maxRiskScore) ?? BigInt(0)) }),
          " · ",
          "Supplier #",
          toNumber((snapshot == null ? void 0 : snapshot.maxRiskSupplierId) ?? BigInt(0))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 sm:col-span-5 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            "data-ocid": "stat-avg-risk",
            label: "Avg Composite Risk",
            value: formatRiskScore((snapshot == null ? void 0 : snapshot.avgCompositeRisk) ?? BigInt(0)),
            colorClass: getRiskColor(avgRisk * 100),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            "data-ocid": "stat-high-risk",
            label: "High Risk Suppliers",
            value: highCount,
            colorClass: "text-destructive",
            subValue: `of ${totalSuppliers} total`,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            "data-ocid": "stat-total-suppliers",
            label: "Total Suppliers",
            value: totalSuppliers,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            "data-ocid": "stat-alerts",
            label: "Active Alerts",
            value: alerts.length,
            colorClass: alerts.length > 0 ? "text-warning" : "text-success",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 sm:col-span-4 bg-card border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Risk Distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RiskDistribution, { high: highCount, medium: medCount, low: lowCount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 sm:col-span-8 bg-card border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Portfolio Risk Trend — 30 Days" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartLegend, {})
        ] }),
        trend.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(PortfolioTrendChart, { data: trend }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[176px] flex items-center justify-center text-muted-foreground text-[11px] font-mono", children: "Loading trend…" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 sm:col-span-4 bg-card border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Active Alerts", count: alerts.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertFeed, { alerts })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionHeader,
        {
          title: "Top 10 At-Risk Suppliers",
          count: Math.min(10, suppliers.length)
        }
      ),
      suppliers.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SuppliersTable, { suppliers }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 flex items-center justify-center text-muted-foreground text-[11px] font-mono", children: "Loading supplier data…" })
    ] })
  ] });
}
export {
  Dashboard as default
};
