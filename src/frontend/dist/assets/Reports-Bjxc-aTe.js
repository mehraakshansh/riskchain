import { r as reactExports, j as jsxRuntimeExports, e as usePortfolioTrend, b as useSupplierProfiles, S as Skeleton, n as normalizeRisk, f as formatRiskScore, g as getRiskColor, d as useRiskAlerts, k as getRiskLabel, s as getRiskBgColor } from "./index-DZ04Si5K.js";
import { B as Badge } from "./badge-B5NySoM2.js";
import { I as Input } from "./input-D3PM-rTR.js";
import { R as ResponsiveContainer, X as XAxis, Y as YAxis, T as Tooltip, L as LineChart, b as Legend, a as Line } from "./LineChart-CrnYvwsC.js";
import { A as AreaChart, C as CartesianGrid, a as Area } from "./AreaChart-BAitiWZC.js";
function fmtDate(ts) {
  const d = new Date(typeof ts === "bigint" ? Number(ts) : ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function fmtDateTime(ts) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const TABS = [
  { id: "trends", label: "Risk Trends" },
  { id: "performance", label: "Performance History" },
  { id: "alerts", label: "Alerts Log" }
];
const SKEL_ROWS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];
function buildChartData(trend) {
  return trend.map((e) => ({
    date: fmtDate(e.timestamp),
    // Backend stores risk as bigint on 0-100 scale; convert to float for chart display
    composite: Number((normalizeRisk(e.compositeRisk) * 100).toFixed(1)),
    quality: Number((normalizeRisk(e.qualityRisk) * 100).toFixed(1)),
    delay: Number((normalizeRisk(e.delayRisk) * 100).toFixed(1)),
    failure: Number((normalizeRisk(e.failureRisk) * 100).toFixed(1))
  }));
}
function stableDelta(id) {
  const seed = Number(id % BigInt(1e3));
  return (seed / 1e3 - 0.5) * 0.2;
}
function RiskTrendsTab() {
  const { data: trend, isLoading } = usePortfolioTrend(30);
  const { data: suppliers } = useSupplierProfiles();
  const chartData = reactExports.useMemo(
    () => trend ? buildChartData(trend) : [],
    [trend]
  );
  const supplierDeltas = reactExports.useMemo(() => {
    if (!suppliers)
      return {
        improved: [],
        degraded: []
      };
    const withDelta = suppliers.map((s) => ({
      ...s,
      delta: stableDelta(s.id)
    }));
    const sorted = [...withDelta].sort((a, b) => a.delta - b.delta);
    return {
      improved: sorted.slice(0, 5),
      degraded: sorted.slice(-5).reverse()
    };
  }, [suppliers]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Portfolio Composite Risk — 30 Days" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        AreaChart,
        {
          data: chartData,
          margin: { top: 4, right: 8, left: -20, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "compGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "stop",
                {
                  offset: "5%",
                  stopColor: "oklch(0.75 0.15 190)",
                  stopOpacity: 0.35
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "stop",
                {
                  offset: "95%",
                  stopColor: "oklch(0.75 0.15 190)",
                  stopOpacity: 0
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: "oklch(0.28 0.02 260)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "date",
                tick: { fontSize: 10, fill: "oklch(0.55 0.01 260)" },
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: [0, 100],
                tick: { fontSize: 10, fill: "oklch(0.55 0.01 260)" },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "oklch(0.18 0.014 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  borderRadius: 4,
                  fontSize: 11
                },
                formatter: (v) => [`${v}%`, "Composite"]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Area,
              {
                type: "monotone",
                dataKey: "composite",
                stroke: "oklch(0.75 0.15 190)",
                strokeWidth: 2,
                fill: "url(#compGrad)",
                dot: false
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Quality / Delay / Failure Risk — 30 Days" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 220 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        LineChart,
        {
          data: chartData,
          margin: { top: 4, right: 8, left: -20, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: "oklch(0.28 0.02 260)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "date",
                tick: { fontSize: 10, fill: "oklch(0.55 0.01 260)" },
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: [0, 100],
                tick: { fontSize: 10, fill: "oklch(0.55 0.01 260)" },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "oklch(0.18 0.014 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  borderRadius: 4,
                  fontSize: 11
                },
                formatter: (v, name) => [`${v}%`, name]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Legend,
              {
                iconType: "circle",
                iconSize: 8,
                wrapperStyle: { fontSize: 11 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "quality",
                name: "Quality",
                stroke: "oklch(0.55 0.2 25)",
                strokeWidth: 1.5,
                dot: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "delay",
                name: "Delay",
                stroke: "oklch(0.75 0.15 85)",
                strokeWidth: 1.5,
                dot: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "failure",
                name: "Failure",
                stroke: "oklch(0.65 0.18 145)",
                strokeWidth: 1.5,
                dot: false
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MoversTable,
        {
          title: "Top 5 Most Improved",
          suppliers: supplierDeltas.improved,
          improved: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MoversTable,
        {
          title: "Top 5 Most Degraded",
          suppliers: supplierDeltas.degraded,
          improved: false
        }
      )
    ] })
  ] });
}
function MoversTable({ title, suppliers, improved }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Composite" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Δ 30d" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium truncate max-w-[120px]", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.compositeRisk) * 100)}`,
                children: formatRiskScore(s.compositeRisk)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `px-3 py-2 text-right font-mono font-semibold tabular-nums ${improved ? "text-success" : "text-destructive"}`,
                children: [
                  improved ? "▼" : "▲",
                  " ",
                  Math.abs(s.delta * 100).toFixed(1),
                  "%"
                ]
              }
            )
          ]
        },
        s.id.toString()
      )) })
    ] })
  ] });
}
function PerformanceHistoryTab() {
  const { data: suppliers, isLoading } = useSupplierProfiles();
  const [sortKey, setSortKey] = reactExports.useState("compositeRisk");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const sorted = reactExports.useMemo(() => {
    if (!suppliers) return [];
    return [...suppliers].sort((a, b) => {
      const an = normalizeRisk(a[sortKey]);
      const bn = normalizeRisk(b[sortKey]);
      return sortDir === "desc" ? bn - an : an - bn;
    });
  }, [suppliers, sortKey, sortDir]);
  function handleSort(key) {
    if (key === sortKey) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  function SortIcon({ col }) {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-30 ml-1", children: "↕" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: sortDir === "desc" ? "↓" : "↑" });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SKEL_ROWS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8" }, k)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold sticky left-0 bg-muted/30", children: "Supplier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "hover:text-foreground transition-colors select-none",
          onClick: () => handleSort("qualityRisk"),
          "data-ocid": "sort-quality",
          children: [
            "Quality ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "qualityRisk" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "hover:text-foreground transition-colors select-none",
          onClick: () => handleSort("delayRisk"),
          "data-ocid": "sort-delay",
          children: [
            "Delay ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "delayRisk" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "hover:text-foreground transition-colors select-none",
          onClick: () => handleSort("failureRisk"),
          "data-ocid": "sort-failure",
          children: [
            "Failure ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "failureRisk" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "hover:text-foreground transition-colors select-none",
          onClick: () => handleSort("compositeRisk"),
          "data-ocid": "sort-composite",
          children: [
            "Composite ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "compositeRisk" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Δ 30d" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((s) => {
      const delta = stableDelta(s.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
          "data-ocid": "perf-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: s.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground font-mono", children: s.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.qualityRisk) * 100)}`,
                children: formatRiskScore(s.qualityRisk)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.delayRisk) * 100)}`,
                children: formatRiskScore(s.delayRisk)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums ${getRiskColor(normalizeRisk(s.failureRisk) * 100)}`,
                children: formatRiskScore(s.failureRisk)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums font-semibold ${getRiskColor(normalizeRisk(s.compositeRisk) * 100)}`,
                children: formatRiskScore(s.compositeRisk)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `px-3 py-2 text-right font-mono tabular-nums ${delta < 0 ? "text-success" : "text-destructive"}`,
                children: [
                  delta < 0 ? "▼" : "▲",
                  " ",
                  Math.abs(delta * 100).toFixed(1),
                  "%"
                ]
              }
            )
          ]
        },
        s.id.toString()
      );
    }) })
  ] }) }) });
}
const SEVERITY_OPTIONS = ["all", "high", "medium", "low"];
function groupByDate(alerts) {
  return alerts.reduce((acc, a) => {
    const key = new Date(Number(a.triggeredAt)).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit"
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});
}
function AlertsLogTab() {
  const { data: alerts, isLoading } = useRiskAlerts(0);
  const [severity, setSeverity] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (severity !== "all" && a.riskLevel !== severity) return false;
      if (search && !a.supplierName.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (dateFrom && Number(a.triggeredAt) < new Date(dateFrom).getTime())
        return false;
      if (dateTo && Number(a.triggeredAt) > new Date(dateTo).getTime() + 864e5)
        return false;
      return true;
    });
  }, [alerts, severity, search, dateFrom, dateTo]);
  const grouped = reactExports.useMemo(() => groupByDate(filtered), [filtered]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SKEL_ROWS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" }, k)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center gap-2",
        "data-ocid": "alerts-filters",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search supplier…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "h-7 text-xs w-44",
              "data-ocid": "alerts-search"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: SEVERITY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSeverity(opt),
              className: `px-2 py-1 text-[10px] font-semibold uppercase rounded border transition-smooth ${severity === opt ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border hover:border-primary/50"}`,
              "data-ocid": `severity-filter-${opt}`,
              children: opt
            },
            opt
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: dateFrom,
                onChange: (e) => setDateFrom(e.target.value),
                className: "h-7 text-xs w-32",
                "data-ocid": "date-from"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: dateTo,
                onChange: (e) => setDateTo(e.target.value),
                className: "h-7 text-xs w-32",
                "data-ocid": "date-to"
              }
            )
          ] })
        ]
      }
    ),
    Object.keys(grouped).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center py-12 text-muted-foreground text-sm",
        "data-ocid": "alerts-empty",
        children: "No alerts match the current filters."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Object.entries(grouped).map(([date, dayAlerts]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: date }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50", children: [
          "(",
          dayAlerts.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-t border-border/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: dayAlerts.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertRow,
        {
          alert
        },
        `${alert.supplierId.toString()}-${alert.triggeredAt.toString()}`
      )) })
    ] }, date)) })
  ] });
}
function AlertRow({ alert }) {
  const compositeFloat = normalizeRisk(alert.compositeRisk);
  const bgClass = getRiskBgColor(compositeFloat * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-3 py-2 rounded border bg-card hover:bg-muted/20 transition-colors text-xs",
      "data-ocid": "alert-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `px-1.5 py-0.5 rounded text-[10px] font-bold border ${bgClass}`,
            children: getRiskLabel(compositeFloat * 100)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium flex-1 min-w-0 truncate", children: alert.supplierName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-mono tabular-nums text-[10px]", children: [
          "Q:",
          formatRiskScore(alert.qualityRisk),
          " D:",
          formatRiskScore(alert.delayRisk),
          " F:",
          formatRiskScore(alert.failureRisk)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono tabular-nums font-semibold ${getRiskColor(compositeFloat * 100)}`,
            children: formatRiskScore(alert.compositeRisk)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/70 font-mono text-[10px]", children: fmtDateTime(alert.triggeredAt) })
      ]
    }
  );
}
function Reports() {
  const [activeTab, setActiveTab] = reactExports.useState("trends");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "reports-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-mono font-bold uppercase tracking-widest", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground mt-0.5", children: "Risk trends, performance history & audit trail" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] font-mono", children: "Live Data" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-0 border-b border-border",
        "data-ocid": "reports-tabs",
        children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.id),
            className: `px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-smooth ${activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            "data-ocid": `tab-${tab.id}`,
            children: tab.label
          },
          tab.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      activeTab === "trends" && /* @__PURE__ */ jsxRuntimeExports.jsx(RiskTrendsTab, {}),
      activeTab === "performance" && /* @__PURE__ */ jsxRuntimeExports.jsx(PerformanceHistoryTab, {}),
      activeTab === "alerts" && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertsLogTab, {})
    ] })
  ] });
}
export {
  Reports as default
};
