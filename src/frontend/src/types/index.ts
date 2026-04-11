export interface SupplierProfile {
  id: bigint;
  name: string;
  tier: number;
  location: string;
  category: string;
  defectRate: number;
  onTimeDeliveryRate: number;
  avgLeadTimeDays: bigint;
  carrierPerformanceScore: number;
  equipmentFailureRate: number;
  supplyInterruptionCount: bigint;
  volumeHandled: bigint;
  yearsActive: bigint;
  qualityRisk: bigint;
  delayRisk: bigint;
  failureRisk: bigint;
  compositeRisk: bigint;
}

export interface PortfolioRiskSnapshot {
  totalSuppliers: bigint;
  avgCompositeRisk: bigint;
  highRiskCount: bigint;
  mediumRiskCount: bigint;
  lowRiskCount: bigint;
  maxRiskSupplierId: bigint;
  maxRiskScore: bigint;
  portfolioRiskScore: bigint;
  timestamp: bigint;
}

export interface RiskAlert {
  supplierId: bigint;
  supplierName: string;
  compositeRisk: bigint;
  qualityRisk: bigint;
  delayRisk: bigint;
  failureRisk: bigint;
  riskLevel: string;
  triggeredAt: bigint;
}

export interface RiskTrendEntry {
  timestamp: bigint;
  qualityRisk: bigint;
  delayRisk: bigint;
  failureRisk: bigint;
  compositeRisk: bigint;
}

export interface DisruptionImpact {
  affectedSupplierId: bigint;
  disruptionType: string;
  directRiskIncrease: bigint;
  cascadingSupplierIds: bigint[];
  portfolioRiskDelta: bigint;
  estimatedRecoveryDays: bigint;
  severity: string;
}

export interface AlternativeSupplier {
  supplierId: bigint;
  name: string;
  compositeRisk: bigint;
  avgLeadTimeDays: bigint;
  tier: number;
  category: string;
  rank: bigint;
}

export interface MitigationAction {
  id: bigint;
  supplierId: bigint;
  action: string;
  dueDate: bigint;
  status: string;
  createdAt: bigint;
}

export interface NetworkNode {
  supplierId: bigint;
  supplierName: string;
  tier: number;
  category: string;
  compositeRisk: bigint;
  dependsOn: bigint[];
}

export type RiskLevel = "high" | "medium" | "low";

export type DisruptionType =
  | { Natural: null }
  | { Geopolitical: null }
  | { OperationalFailure: null }
  | { SupplyShortage: null }
  | { LogisticsDisruption: null };

export type SupplierCategory =
  | { Electronics: null }
  | { RawMaterials: null }
  | { Logistics: null }
  | { Manufacturing: null }
  | { Services: null };

export interface SupplyNetworkGraph {
  nodes: NetworkNode[];
  edgeCount: bigint;
}
