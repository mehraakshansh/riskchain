import { j as jsxRuntimeExports, a as cn, k as getRiskLabel, s as getRiskBgColor } from "./index-DZ04Si5K.js";
function RiskBadge({
  score,
  showScore = true,
  size = "md",
  className
}) {
  const colorClass = getRiskBgColor(score);
  const label = getRiskLabel(score);
  const pct = (score * 100).toFixed(1);
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
