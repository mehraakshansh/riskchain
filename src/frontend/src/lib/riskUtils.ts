import type { RiskLevel } from "@/types";

/**
 * All risk classification functions operate on a 0–100 scale.
 * Thresholds: >70 = HIGH (red), 41–70 = MID (yellow), 0–40 = LOW (green)
 */

/** Returns Tailwind text class based on risk score 0-100 */
export function getRiskColor(score: number): string {
  if (score > 70) return "text-destructive";
  if (score > 40) return "text-warning";
  return "text-success";
}

/** Returns Tailwind bg class based on risk score 0-100 */
export function getRiskBgColor(score: number): string {
  if (score > 70)
    return "bg-destructive/15 text-destructive border-destructive/30";
  if (score > 40) return "bg-warning/15 text-warning border-warning/30";
  return "bg-success/15 text-success border-success/30";
}

/** Returns hex color for chart usage */
export function getRiskHex(score: number): string {
  if (score > 70) return "oklch(0.55 0.2 25)";
  if (score > 40) return "oklch(0.75 0.15 85)";
  return "oklch(0.65 0.18 145)";
}

export function getRiskLevel(score: number): RiskLevel {
  if (score > 70) return "high";
  if (score > 40) return "medium";
  return "low";
}

export function getRiskLabel(score: number): string {
  if (score > 70) return "HIGH";
  if (score > 40) return "MID";
  return "LOW";
}

/** Format a risk score (bigint 0-100 scale OR number 0-1 float) as percentage string */
export function formatRiskScore(score: bigint | number): string {
  const n = typeof score === "bigint" ? Number(score) / 100 : score;
  return `${(n * 100).toFixed(1)}%`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatBigInt(value: bigint): string {
  return value.toString();
}

export function toNumber(value: bigint | number): number {
  return typeof value === "bigint" ? Number(value) : value;
}

/**
 * Normalize a bigint risk score (0–100 scale from backend) or number (0–1 float)
 * to a 0–1 float for use with SparklineChart score prop and getRiskColor/getRiskHex.
 */
export function normalizeRisk(score: bigint | number): number {
  if (typeof score === "bigint") return Number(score) / 100;
  return score;
}

/** Generate mock trend data for sparklines when no backend data */
export function generateMockTrend(
  baseScore: bigint | number,
  points = 14,
): number[] {
  const base =
    typeof baseScore === "bigint" ? Number(baseScore) / 100 : baseScore;
  const arr: number[] = [];
  let current = base;
  for (let i = 0; i < points; i++) {
    current = Math.max(0, Math.min(1, current + (Math.random() - 0.5) * 0.05));
    arr.push(current);
  }
  return arr;
}
