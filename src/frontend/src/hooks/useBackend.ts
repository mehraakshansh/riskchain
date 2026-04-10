import { createActor } from "@/backend";
import type {
  AlternativeSupplier,
  DisruptionImpact,
  DisruptionType,
  MitigationAction,
  PortfolioRiskSnapshot,
  RiskAlert,
  RiskTrendEntry,
  SupplierCategory,
  SupplierProfile,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fallback mock data for development/demo when backend has no methods yet
const MOCK_SNAPSHOT: PortfolioRiskSnapshot = {
  totalSuppliers: BigInt(48),
  avgCompositeRisk: BigInt(54),
  highRiskCount: BigInt(11),
  mediumRiskCount: BigInt(21),
  lowRiskCount: BigInt(16),
  maxRiskSupplierId: BigInt(7),
  maxRiskScore: BigInt(91),
  portfolioRiskScore: BigInt(58),
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
  return names.map((name, i) => {
    // Risk scores stored as bigint on 0-100 integer scale
    const qr = BigInt(Math.floor((Math.random() * 0.9 + 0.05) * 100));
    const dr = BigInt(Math.floor((Math.random() * 0.9 + 0.05) * 100));
    const fr = BigInt(Math.floor((Math.random() * 0.9 + 0.05) * 100));
    const composite = BigInt(
      Math.floor(Number(qr) * 0.4 + Number(dr) * 0.35 + Number(fr) * 0.25),
    );
    return {
      id: BigInt(i + 1),
      name,
      tier: Math.floor(Math.random() * 3) + 1,
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
  return MOCK_SUPPLIERS.filter((s) => s.compositeRisk > BigInt(60))
    .slice(0, 8)
    .map((s) => ({
      supplierId: s.id,
      supplierName: s.name,
      compositeRisk: s.compositeRisk,
      qualityRisk: s.qualityRisk,
      delayRisk: s.delayRisk,
      failureRisk: s.failureRisk,
      riskLevel: s.compositeRisk >= BigInt(70) ? "high" : "medium",
      triggeredAt: BigInt(Date.now() - Math.floor(Math.random() * 3600000)),
    }));
}

function makeMockTrend(days: number): RiskTrendEntry[] {
  const entries: RiskTrendEntry[] = [];
  for (let i = days; i >= 0; i--) {
    const t = Date.now() - i * 86400000;
    entries.push({
      timestamp: BigInt(t),
      qualityRisk: BigInt(Math.floor((0.4 + Math.random() * 0.3) * 100)),
      delayRisk: BigInt(Math.floor((0.35 + Math.random() * 0.35) * 100)),
      failureRisk: BigInt(Math.floor((0.25 + Math.random() * 0.4) * 100)),
      compositeRisk: BigInt(Math.floor((0.38 + Math.random() * 0.32) * 100)),
    });
  }
  return entries;
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

export function useSimulateDisruption() {
  const { actor } = useActor(createActor);
  return useMutation<
    DisruptionImpact,
    Error,
    { supplierId: bigint; disruptionType: DisruptionType }
  >({
    mutationFn: async ({ supplierId, disruptionType }) => {
      if (!actor) {
        // Mock response for demo purposes
        return {
          affectedSupplierId: supplierId,
          disruptionType: "SupplyInterruption",
          directRiskIncrease: BigInt(22),
          cascadingSupplierIds: [BigInt(2), BigInt(5), BigInt(9)],
          portfolioRiskDelta: BigInt(8),
          estimatedRecoveryDays: BigInt(14),
          severity: "High",
        } satisfies DisruptionImpact;
      }
      return (
        actor as unknown as {
          simulateDisruption: (
            id: bigint,
            t: DisruptionType,
          ) => Promise<DisruptionImpact>;
        }
      ).simulateDisruption(supplierId, disruptionType);
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
