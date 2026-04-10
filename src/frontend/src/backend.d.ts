import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type RiskScore = bigint;
export interface RiskTrendEntry {
    qualityRisk: RiskScore;
    delayRisk: RiskScore;
    compositeRisk: RiskScore;
    timestamp: Timestamp;
    failureRisk: RiskScore;
}
export interface RiskAlert {
    qualityRisk: RiskScore;
    delayRisk: RiskScore;
    supplierName: string;
    compositeRisk: RiskScore;
    triggeredAt: Timestamp;
    failureRisk: RiskScore;
    riskLevel: RiskLevel;
    supplierId: SupplierId;
}
export interface SupplierMetricsUpdate {
    carrierPerformanceScore?: number;
    defectRate?: number;
    onTimeDeliveryRate?: number;
    volumeHandled?: bigint;
    equipmentFailureRate?: number;
    avgLeadTimeDays?: bigint;
    supplyInterruptionCount?: bigint;
}
export interface NetworkNode {
    dependsOn: Array<SupplierId>;
    supplierName: string;
    tier: SupplierTier;
    compositeRisk: RiskScore;
    category: SupplierCategory;
    supplierId: SupplierId;
}
export interface MitigationAction {
    id: bigint;
    status: MitigationStatus;
    action: string;
    createdAt: Timestamp;
    dueDate: Timestamp;
    updatedAt: Timestamp;
    supplierId: SupplierId;
}
export interface SupplyNetworkGraph {
    edgeCount: bigint;
    nodes: Array<NetworkNode>;
}
export interface SupplierProfile {
    id: SupplierId;
    carrierPerformanceScore: number;
    defectRate: number;
    dependsOn: Array<SupplierId>;
    qualityRisk: bigint;
    yearsActive: bigint;
    delayRisk: bigint;
    name: string;
    onTimeDeliveryRate: number;
    tier: SupplierTier;
    volumeHandled: bigint;
    compositeRisk: bigint;
    equipmentFailureRate: number;
    avgLeadTimeDays: bigint;
    category: SupplierCategory;
    supplyInterruptionCount: bigint;
    failureRisk: bigint;
    location: string;
}
export interface PortfolioRiskSnapshot {
    totalSuppliers: bigint;
    avgCompositeRisk: bigint;
    maxRiskSupplierId: SupplierId;
    portfolioRiskScore: bigint;
    lowRiskCount: bigint;
    maxRiskScore: RiskScore;
    mediumRiskCount: bigint;
    highRiskCount: bigint;
    timestamp: Timestamp;
}
export interface DisruptionImpact {
    estimatedRecoveryDays: bigint;
    cascadingSupplierIds: Array<SupplierId>;
    affectedSupplierId: SupplierId;
    directRiskIncrease: bigint;
    disruptionType: DisruptionType;
    portfolioRiskDelta: bigint;
    severity: RiskLevel;
}
export type SupplierId = bigint;
export interface AlternativeSupplier {
    name: string;
    rank: bigint;
    tier: SupplierTier;
    compositeRisk: RiskScore;
    avgLeadTimeDays: bigint;
    category: SupplierCategory;
    supplierId: SupplierId;
}
export enum DisruptionType {
    QualityFailure = "QualityFailure",
    LogisticsDelay = "LogisticsDelay",
    SupplyInterruption = "SupplyInterruption",
    NaturalDisaster = "NaturalDisaster",
    EquipmentFailure = "EquipmentFailure"
}
export enum MitigationStatus {
    Open = "Open",
    Cancelled = "Cancelled",
    InProgress = "InProgress",
    Completed = "Completed"
}
export enum RiskLevel {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum SupplierCategory {
    Chemicals = "Chemicals",
    RawMaterials = "RawMaterials",
    Packaging = "Packaging",
    Logistics = "Logistics",
    Services = "Services",
    Electronics = "Electronics",
    Manufacturing = "Manufacturing"
}
export enum SupplierTier {
    Tier1 = "Tier1",
    Tier2 = "Tier2",
    Tier3 = "Tier3"
}
export interface backendInterface {
    computeDelayRisk(supplierId: SupplierId): Promise<bigint>;
    computeFailureRisk(supplierId: SupplierId): Promise<bigint>;
    computeQualityRisk(supplierId: SupplierId): Promise<bigint>;
    getCompositeRisk(supplierId: SupplierId): Promise<bigint>;
    getMitigationActions(supplierId: SupplierId): Promise<Array<MitigationAction>>;
    getPortfolioRiskSnapshot(): Promise<PortfolioRiskSnapshot>;
    getRecommendedAlternatives(supplierId: SupplierId, category: SupplierCategory): Promise<Array<AlternativeSupplier>>;
    getRiskAlerts(threshold: bigint): Promise<Array<RiskAlert>>;
    getSupplierProfiles(): Promise<Array<SupplierProfile>>;
    getSupplierTrendHistory(supplierId: SupplierId, days: bigint): Promise<Array<RiskTrendEntry>>;
    getSupplyNetworkGraph(): Promise<SupplyNetworkGraph>;
    logMitigationAction(supplierId: SupplierId, action: string, dueDate: Timestamp): Promise<bigint>;
    simulateDisruption(supplierId: SupplierId, disruptionType: DisruptionType): Promise<DisruptionImpact>;
    updateSupplierMetrics(supplierId: SupplierId, metrics: SupplierMetricsUpdate): Promise<boolean>;
}
