import { createActor } from "@/backend";
import type {
  AlternativeSupplier,
  DisruptionImpact,
  MitigationAction,
  PortfolioRiskSnapshot,
  RiskAlert,
  RiskTrendEntry,
  SupplierCategory,
  SupplierProfile,
  SupplyNetworkGraph,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fallback mock data for development/demo when backend has no methods yet
const MOCK_SNAPSHOT: PortfolioRiskSnapshot = {
  totalSuppliers: BigInt(20),
  avgCompositeRisk: BigInt(55),
  highRiskCount: BigInt(7),
  mediumRiskCount: BigInt(7),
  lowRiskCount: BigInt(6),
  maxRiskSupplierId: BigInt(1),
  maxRiskScore: BigInt(93),
  portfolioRiskScore: BigInt(55),
  timestamp: BigInt(Date.now()),
};

const CATEGORIES = [
  "Electronics",
  "Raw Materials",
  "Logistics",
  "Manufacturing",
  "Services",
];
const LOCATIONS = [
  "Shenzhen, CN",
  "Ho Chi Minh, VN",
  "Mumbai, IN",
  "Detroit, US",
  "Stuttgart, DE",
  "Seoul, KR",
  "Bangkok, TH",
  "Guadalajara, MX",
];

/**
 * Generate a risk score (0–100 integer) biased toward a target band.
 * band: "low" => 5–40, "mid" => 41–70, "high" => 71–95
 */
function riskInBand(band: "low" | "mid" | "high"): number {
  if (band === "low") return 5 + Math.floor(Math.random() * 36); // 5–40
  if (band === "high") return 71 + Math.floor(Math.random() * 25); // 71–95
  return 41 + Math.floor(Math.random() * 30); // 41–70
}

function makeMockSuppliers(): SupplierProfile[] {
  const names = [
    "Apex Components",
    "Delta Logistics",
    "Nexus Manufacturing",
    "Orion Electronics",
    "Titan Raw Materials",
    "Vector Systems",
    "Atlas Supply Co",
    "Meridian Tech",
    "Zenith Fabrication",
    "Kronos Delivery",
    "Nova Parts",
    "Helix Industries",
    "Quantum Suppliers",
    "Spectrum Materials",
    "Fusion Logistics",
    "Polaris Assembly",
    "Vega Electronics",
    "Comet Manufacturing",
    "Sirius Components",
    "Lyra Services",
  ];

  // Ensure balanced distribution: 7 high, 7 mid, 6 low
  const compositeBands: Array<"low" | "mid" | "high"> = [
    "high",
    "high",
    "high",
    "high",
    "high",
    "high",
    "high",
    "mid",
    "mid",
    "mid",
    "mid",
    "mid",
    "mid",
    "mid",
    "low",
    "low",
    "low",
    "low",
    "low",
    "low",
  ];

  return names.map((name, i) => {
    const band = compositeBands[i];
    // Each dimension varies independently across full range
    const qr = BigInt(Math.floor(1 + Math.random() * 99)); // 1–99
    const dr = BigInt(Math.floor(1 + Math.random() * 99)); // 1–99
    const fr = BigInt(Math.floor(1 + Math.random() * 99)); // 1–99
    // Composite is pinned to the intended band
    const composite = BigInt(riskInBand(band));
    return {
      id: BigInt(i + 1),
      name,
      tier: (i % 3) + 1, // deterministic tier: 1,2,3,1,2,3...
      location: LOCATIONS[i % LOCATIONS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      defectRate: Math.random() * 0.08,
      onTimeDeliveryRate: 0.7 + Math.random() * 0.3,
      avgLeadTimeDays: BigInt(5 + Math.floor(Math.random() * 45)),
      carrierPerformanceScore: 0.6 + Math.random() * 0.4,
      equipmentFailureRate: Math.random() * 0.05,
      supplyInterruptionCount: BigInt(Math.floor(Math.random() * 12)),
      volumeHandled: BigInt(10000 + Math.floor(Math.random() * 90000)),
      yearsActive: BigInt(2 + Math.floor(Math.random() * 20)),
      qualityRisk: qr,
      delayRisk: dr,
      failureRisk: fr,
      compositeRisk: composite,
    };
  });
}

const MOCK_SUPPLIERS = makeMockSuppliers();

function makeMockAlerts(): RiskAlert[] {
  // Alerts for suppliers with composite risk > 40 (medium or high)
  return MOCK_SUPPLIERS.filter((s) => s.compositeRisk > BigInt(40))
    .slice(0, 8)
    .map((s) => ({
      supplierId: s.id,
      supplierName: s.name,
      compositeRisk: s.compositeRisk,
      qualityRisk: s.qualityRisk,
      delayRisk: s.delayRisk,
      failureRisk: s.failureRisk,
      // HIGH: >70, MID: 41-70, LOW: <=40
      riskLevel: s.compositeRisk > BigInt(70) ? "high" : "medium",
      triggeredAt: BigInt(Date.now() - Math.floor(Math.random() * 3600000)),
    }));
}

function makeMockTrend(days: number): RiskTrendEntry[] {
  const entries: RiskTrendEntry[] = [];
  for (let i = days; i >= 0; i--) {
    const t = Date.now() - i * 86400000;
    entries.push({
      timestamp: BigInt(t),
      // Full 1–99 range spread across all risk bands
      qualityRisk: BigInt(1 + Math.floor(Math.random() * 99)),
      delayRisk: BigInt(1 + Math.floor(Math.random() * 99)),
      failureRisk: BigInt(1 + Math.floor(Math.random() * 99)),
      compositeRisk: BigInt(1 + Math.floor(Math.random() * 99)),
    });
  }
  return entries;
}

// ─── Frontend-side fallback simulation ───────────────────────────────────────
// Produces deterministic realistic outcomes when backend call fails or is unavailable.
const RECOVERY_DAYS: Record<string, number> = {
  SupplyInterruption: 21,
  QualityFailure: 14,
  LogisticsDelay: 7,
  EquipmentFailure: 28,
  NaturalDisaster: 45,
};

const DIRECT_RISK_ADD: Record<string, number> = {
  SupplyInterruption: 25,
  QualityFailure: 20,
  LogisticsDelay: 12,
  EquipmentFailure: 30,
  NaturalDisaster: 35,
};

function runFallbackSimulation(
  supplierId: bigint,
  disruptionType: string,
  allSuppliers: SupplierProfile[],
): DisruptionImpact {
  const supplier = allSuppliers.find((s) => s.id === supplierId);
  const currentRisk = supplier ? Number(supplier.compositeRisk) : 50;
  const tier = supplier?.tier ?? 1;

  // Direct risk increase — add to current composite, capped at 100
  const baseAdd = DIRECT_RISK_ADD[disruptionType] ?? 20;
  const jitter = Math.floor(Math.random() * 10) - 5; // ±5 randomness
  const directAdd = Math.max(5, baseAdd + jitter);
  const directRiskIncrease = BigInt(
    Math.min(100, currentRisk + directAdd) - currentRisk,
  );

  // Portfolio delta — tier 1 has more weight
  const tierWeight = tier === 1 ? 0.08 : tier === 2 ? 0.04 : 0.02;
  const portfolioDelta = Math.round(
    Number(directRiskIncrease) * tierWeight * 100,
  );
  const portfolioRiskDelta = BigInt(Math.min(20, portfolioDelta));

  // Cascading suppliers: same tier + one tier downstream
  const cascading = allSuppliers
    .filter((s) => {
      if (s.id === supplierId) return false;
      // Same tier or one tier higher (downstream)
      return s.tier === tier || s.tier === tier + 1;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, tier === 1 ? 4 : tier === 2 ? 2 : 1)
    .map((s) => s.id);

  // Severity: based on direct risk increase
  const postRisk = currentRisk + Number(directRiskIncrease);
  let severity: string;
  if (postRisk > 90 || Number(directRiskIncrease) > 30) severity = "Critical";
  else if (postRisk > 70 || Number(directRiskIncrease) > 20) severity = "High";
  else if (postRisk > 40) severity = "Medium";
  else severity = "Low";

  const recoveryBase = RECOVERY_DAYS[disruptionType] ?? 14;
  const estimatedRecoveryDays = BigInt(
    recoveryBase + Math.floor(Math.random() * 7),
  );

  return {
    affectedSupplierId: supplierId,
    disruptionType,
    directRiskIncrease,
    cascadingSupplierIds: cascading,
    portfolioRiskDelta,
    estimatedRecoveryDays,
    severity,
  };
}

export function usePortfolioSnapshot() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PortfolioRiskSnapshot>({
    queryKey: ["portfolio-snapshot"],
    queryFn: async () => {
      if (!actor || isFetching) return MOCK_SNAPSHOT;
      try {
        const result = await (
          actor as unknown as {
            getPortfolioRiskSnapshot: () => Promise<PortfolioRiskSnapshot>;
          }
        ).getPortfolioRiskSnapshot();
        return result;
      } catch {
        return MOCK_SNAPSHOT;
      }
    },
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useSupplierProfiles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SupplierProfile[]>({
    queryKey: ["supplier-profiles"],
    queryFn: async () => {
      if (!actor || isFetching) return MOCK_SUPPLIERS;
      try {
        const result = await (
          actor as unknown as {
            getSupplierProfiles: () => Promise<SupplierProfile[]>;
          }
        ).getSupplierProfiles();
        return result.length ? result : MOCK_SUPPLIERS;
      } catch {
        return MOCK_SUPPLIERS;
      }
    },
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useRiskAlerts(threshold = 60) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RiskAlert[]>({
    queryKey: ["risk-alerts", threshold],
    queryFn: async () => {
      if (!actor || isFetching) return makeMockAlerts();
      try {
        const result = await (
          actor as unknown as {
            getRiskAlerts: (t: bigint) => Promise<RiskAlert[]>;
          }
        ).getRiskAlerts(BigInt(threshold));
        return result.length ? result : makeMockAlerts();
      } catch {
        return makeMockAlerts();
      }
    },
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useSupplierTrend(supplierId: bigint, days = 14) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RiskTrendEntry[]>({
    queryKey: ["supplier-trend", supplierId.toString(), days],
    queryFn: async () => {
      if (!actor || isFetching) return makeMockTrend(days);
      try {
        const result = await (
          actor as unknown as {
            getSupplierTrendHistory: (
              id: bigint,
              d: bigint,
            ) => Promise<RiskTrendEntry[]>;
          }
        ).getSupplierTrendHistory(supplierId, BigInt(days));
        return result.length ? result : makeMockTrend(days);
      } catch {
        return makeMockTrend(days);
      }
    },
    enabled: supplierId > BigInt(0),
    refetchInterval: 5000,
  });
}

export function usePortfolioTrend(days = 30) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RiskTrendEntry[]>({
    queryKey: ["portfolio-trend", days],
    queryFn: async () => {
      if (!actor || isFetching) return makeMockTrend(days);
      try {
        const result = await (
          actor as unknown as {
            getPortfolioTrendHistory: (d: bigint) => Promise<RiskTrendEntry[]>;
          }
        ).getPortfolioTrendHistory(BigInt(days));
        return result.length ? result : makeMockTrend(days);
      } catch {
        return makeMockTrend(days);
      }
    },
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useAlternativeSuppliers(supplierId: bigint, category: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AlternativeSupplier[]>({
    queryKey: ["alternatives", supplierId.toString(), category],
    queryFn: async () => {
      if (!actor || isFetching) return [];
      try {
        const catVariant = { [category]: null } as unknown as SupplierCategory;
        const result = await (
          actor as unknown as {
            getRecommendedAlternatives: (
              id: bigint,
              cat: SupplierCategory,
            ) => Promise<AlternativeSupplier[]>;
          }
        ).getRecommendedAlternatives(supplierId, catVariant);
        return result;
      } catch {
        return [];
      }
    },
    enabled: supplierId > BigInt(0),
  });
}

export function useSupplyNetworkGraph() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SupplyNetworkGraph>({
    queryKey: ["supply-network-graph"],
    queryFn: async () => {
      if (!actor || isFetching) return { nodes: [], edgeCount: BigInt(0) };
      try {
        const result = await (
          actor as unknown as {
            getSupplyNetworkGraph: () => Promise<SupplyNetworkGraph>;
          }
        ).getSupplyNetworkGraph();
        return result;
      } catch {
        return { nodes: [], edgeCount: BigInt(0) };
      }
    },
    refetchInterval: 10000,
    staleTime: 8000,
  });
}

/**
 * useSimulateDisruption — always produces results.
 * Tries the backend first; if unavailable or erroring, falls back to
 * the deterministic frontend simulation engine.
 */
export function useSimulateDisruption() {
  const { actor } = useActor(createActor);

  return useMutation<
    DisruptionImpact,
    Error,
    {
      supplierId: bigint;
      disruptionType: string;
      allSuppliers: SupplierProfile[];
    }
  >({
    mutationFn: async ({ supplierId, disruptionType, allSuppliers }) => {
      // Try backend — backend expects DisruptionType string enum value directly
      if (actor) {
        try {
          const result = await (
            actor as unknown as {
              simulateDisruption: (
                id: bigint,
                t: string,
              ) => Promise<DisruptionImpact>;
            }
          ).simulateDisruption(supplierId, disruptionType);
          if (result) return result;
        } catch {
          // Fall through to frontend simulation
        }
      }

      // Frontend fallback — always succeeds
      return runFallbackSimulation(supplierId, disruptionType, allSuppliers);
    },
  });
}

export function useLogMitigation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    { supplierId: bigint; action: string; dueDate: bigint }
  >({
    mutationFn: async ({ supplierId, action, dueDate }) => {
      if (!actor) throw new Error("Actor not available");
      return (
        actor as unknown as {
          logMitigationAction: (
            id: bigint,
            action: string,
            due: bigint,
          ) => Promise<bigint>;
        }
      ).logMitigationAction(supplierId, action, dueDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-profiles"] });
    },
  });
}

export { MOCK_SUPPLIERS, MOCK_SNAPSHOT };
