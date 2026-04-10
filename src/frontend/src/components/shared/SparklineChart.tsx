import { getRiskHex } from "@/lib/riskUtils";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineChartProps {
  data: number[];
  score?: number;
  width?: number | string;
  height?: number;
  showTooltip?: boolean;
}

export function SparklineChart({
  data,
  score,
  width = "100%",
  height = 32,
  showTooltip = false,
}: SparklineChartProps) {
  const chartData = data.map((value, i) => ({ i, value }));
  // score is a 0-1 normalized float; getRiskHex expects 0-100
  const color =
    score !== undefined ? getRiskHex(score * 100) : "oklch(0.75 0.15 190)";

  const tooltip = showTooltip ? (
    <Tooltip
      content={({ active, payload }) =>
        active && payload?.[0] ? (
          <div className="bg-popover border border-border px-2 py-1 text-[10px] font-mono text-foreground rounded-sm">
            {((payload[0].value as number) * 100).toFixed(1)}%
          </div>
        ) : null
      }
    />
  ) : null;

  const line = (
    <Line
      type="monotone"
      dataKey="value"
      stroke={color}
      strokeWidth={1.5}
      dot={false}
      isAnimationActive={false}
    />
  );

  const margin = { top: 2, right: 2, bottom: 2, left: 2 };

  // Use explicit pixel dimensions when width is a number to avoid ResponsiveContainer overhead
  if (typeof width === "number") {
    return (
      <LineChart width={width} height={height} data={chartData} margin={margin}>
        {line}
        {tooltip}
      </LineChart>
    );
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={margin}>
        {line}
        {tooltip}
      </LineChart>
    </ResponsiveContainer>
  );
}
