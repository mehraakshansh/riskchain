import CommonTypes "common";
import SupplierTypes "supplier";

module {
  public type SupplierId = CommonTypes.SupplierId;
  public type RiskScore = CommonTypes.RiskScore;
  public type Timestamp = CommonTypes.Timestamp;
  public type DisruptionType = CommonTypes.DisruptionType;
  public type MitigationStatus = CommonTypes.MitigationStatus;
  public type RiskLevel = CommonTypes.RiskLevel;

  // Daily risk snapshot for trend sparklines
  public type DailyRiskSnapshot = {
    day : Nat;           // offset from epoch (days)
    timestamp : Timestamp;
    qualityRisk : RiskScore;
    delayRisk : RiskScore;
    failureRisk : RiskScore;
    compositeRisk : RiskScore;
  };

  // Supplier risk trend entry (returned to frontend)
  public type RiskTrendEntry = {
    timestamp : Timestamp;
    qualityRisk : RiskScore;
    delayRisk : RiskScore;
    failureRisk : RiskScore;
    compositeRisk : RiskScore;
  };

  // Portfolio-level risk metrics
  public type PortfolioRiskSnapshot = {
    totalSuppliers : Nat;
    avgCompositeRisk : Nat;
    highRiskCount : Nat;
    mediumRiskCount : Nat;
    lowRiskCount : Nat;
    maxRiskSupplierId : SupplierId;
    maxRiskScore : RiskScore;
    portfolioRiskScore : Nat;  // 0-100 aggregate
    timestamp : Timestamp;
  };

  // Supply network node
  public type NetworkNode = {
    supplierId : SupplierId;
    supplierName : Text;
    tier : SupplierTypes.SupplierTier;
    category : SupplierTypes.SupplierCategory;
    compositeRisk : RiskScore;
    dependsOn : [SupplierId];
  };

  // Supply network graph
  public type SupplyNetworkGraph = {
    nodes : [NetworkNode];
    edgeCount : Nat;
  };

  // Disruption simulation result
  public type DisruptionImpact = {
    affectedSupplierId : SupplierId;
    disruptionType : DisruptionType;
    directRiskIncrease : Nat;         // added to supplier's composite risk
    cascadingSupplierIds : [SupplierId];
    portfolioRiskDelta : Int;         // signed, portfolio-level change
    estimatedRecoveryDays : Nat;
    severity : RiskLevel;
  };

  // Alternative supplier recommendation
  public type AlternativeSupplier = {
    supplierId : SupplierId;
    name : Text;
    compositeRisk : RiskScore;
    avgLeadTimeDays : Nat;
    tier : SupplierTypes.SupplierTier;
    category : SupplierTypes.SupplierCategory;
    rank : Nat; // 1 = best
  };

  // Risk alert
  public type RiskAlert = {
    supplierId : SupplierId;
    supplierName : Text;
    compositeRisk : RiskScore;
    qualityRisk : RiskScore;
    delayRisk : RiskScore;
    failureRisk : RiskScore;
    riskLevel : RiskLevel;
    triggeredAt : Timestamp;
  };

  // Mitigation action (internal mutable)
  public type MitigationActionInternal = {
    id : Nat;
    supplierId : SupplierId;
    var action : Text;
    var dueDate : Timestamp;
    var status : MitigationStatus;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  // Mitigation action (shared/public)
  public type MitigationAction = {
    id : Nat;
    supplierId : SupplierId;
    action : Text;
    dueDate : Timestamp;
    status : MitigationStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };
};
