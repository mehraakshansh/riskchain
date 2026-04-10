import CommonTypes "common";

module {
  public type SupplierId = CommonTypes.SupplierId;

  public type SupplierTier = {
    #Tier1;
    #Tier2;
    #Tier3;
  };

  public type SupplierCategory = {
    #Electronics;
    #RawMaterials;
    #Logistics;
    #Manufacturing;
    #Packaging;
    #Chemicals;
    #Services;
  };

  // Internal mutable supplier record
  public type SupplierInternal = {
    id : SupplierId;
    name : Text;
    tier : SupplierTier;
    location : Text;
    category : SupplierCategory;
    var defectRate : Float;          // 0.0-1.0, historical defect proportion
    var onTimeDeliveryRate : Float;  // 0.0-1.0
    var avgLeadTimeDays : Nat;
    var carrierPerformanceScore : Float; // 0.0-1.0
    var equipmentFailureRate : Float;    // 0.0-1.0
    var supplyInterruptionCount : Nat;   // last 12 months
    var volumeHandled : Nat;             // units per month
    var yearsActive : Nat;
    // Dependencies for network graph
    var dependsOn : [SupplierId];
  };

  // Shared/public supplier profile (no var fields, serializable)
  public type SupplierProfile = {
    id : SupplierId;
    name : Text;
    tier : SupplierTier;
    location : Text;
    category : SupplierCategory;
    defectRate : Float;
    onTimeDeliveryRate : Float;
    avgLeadTimeDays : Nat;
    carrierPerformanceScore : Float;
    equipmentFailureRate : Float;
    supplyInterruptionCount : Nat;
    volumeHandled : Nat;
    yearsActive : Nat;
    dependsOn : [SupplierId];
    qualityRisk : Nat;
    delayRisk : Nat;
    failureRisk : Nat;
    compositeRisk : Nat;
  };

  // Metrics update payload
  public type SupplierMetricsUpdate = {
    defectRate : ?Float;
    onTimeDeliveryRate : ?Float;
    avgLeadTimeDays : ?Nat;
    carrierPerformanceScore : ?Float;
    equipmentFailureRate : ?Float;
    supplyInterruptionCount : ?Nat;
    volumeHandled : ?Nat;
  };
};
