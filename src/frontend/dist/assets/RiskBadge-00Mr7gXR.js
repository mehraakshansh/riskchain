import { j as jsxRuntimeExports, a as cn, l as getRiskLabel, w as getRiskBgColor } from "./index-3OTCWF_L.js";
function RiskBadge({
  score,
  showScore = true,
  size = "md",
  className
}) {
  const score100 = score * 100;
  const colorClass = getRiskBgColor(score100);
  const label = getRiskLabel(score100);
  const pct = score100.toFixed(1);
  const sizeClass = {
    sm: "text-[10px] px-1.5 py-0.5 font-mono",
    md: "text-xs px-2 py-0.5 font-mono",
    lg: "text-sm px-2.5 py-1 font-mono"
  }[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      "data-ocid": "risk-badge",
      className: cn(
        "inline-flex items-center gap-1 border rounded-sm font-semibold tabular-nums tracking-wide",
        colorClass,
        sizeClass,
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        showScore && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-80", children: [
          pct,
          "%"
        ] })
      ]
    }
  );
}
export {
  RiskBadge as R
};
