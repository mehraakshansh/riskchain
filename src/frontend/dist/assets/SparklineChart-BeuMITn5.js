import { j as jsxRuntimeExports, k as getRiskHex } from "./index-3OTCWF_L.js";
import { L as LineChart, R as ResponsiveContainer, a as Line, T as Tooltip } from "./LineChart-BTbZlsvD.js";
function SparklineChart({
  data,
  score,
  width = "100%",
  height = 32,
  showTooltip = false
}) {
  const chartData = data.map((value, i) => ({ i, value }));
  const color = score !== void 0 ? getRiskHex(score * 100) : "oklch(0.75 0.15 190)";
  const tooltip = showTooltip ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Tooltip,
    {
      content: ({ active, payload }) => active && (payload == null ? void 0 : payload[0]) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-popover border border-border px-2 py-1 text-[10px] font-mono text-foreground rounded-sm", children: [
        (payload[0].value * 100).toFixed(1),
        "%"
      ] }) : null
    }
  ) : null;
  const line = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Line,
    {
      type: "monotone",
      dataKey: "value",
      stroke: color,
      strokeWidth: 1.5,
      dot: false,
      isAnimationActive: false
    }
  );
  const margin = { top: 2, right: 2, bottom: 2, left: 2 };
  if (typeof width === "number") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { width, height, data: chartData, margin, children: [
      line,
      tooltip
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width, height, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: chartData, margin, children: [
    line,
    tooltip
  ] }) });
}
export {
  SparklineChart as S
};
