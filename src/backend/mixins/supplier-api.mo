import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import SupplierTypes "../types/supplier";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";
import RiskLib "../lib/risk";
import SupplierLib "../lib/supplier";

mixin (
  suppliers : List.List<SupplierTypes.SupplierInternal>,
  trends : Map.Map<CommonTypes.SupplierId, List.List<RiskTypes.DailyRiskSnapshot>>,
) {
  /// Returns all supplier profiles with current risk scores, sorted by composite risk descending.
  public query func getSupplierProfiles() : async [SupplierTypes.SupplierProfile] {
    SupplierLib.getAllProfiles(suppliers);
  };

  /// Returns daily risk trend history for a supplier (max 30 days).
  public query func getSupplierTrendHistory(supplierId : CommonTypes.SupplierId, days : Nat) : async [RiskTypes.RiskTrendEntry] {
    SupplierLib.getTrendHistory(trends, supplierId, days);
  };

  /// Updates performance metrics for a supplier and returns success flag.
  public func updateSupplierMetrics(
    supplierId : CommonTypes.SupplierId,
    metrics : SupplierTypes.SupplierMetricsUpdate,
  ) : async Bool {
    switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { false };
      case (?s) {
        SupplierLib.applyMetricsUpdate(s, metrics);
        true;
      };
    };
  };

  /// Compute and return quality risk score for a supplier.
  public query func computeQualityRisk(supplierId : CommonTypes.SupplierId) : async Nat {
    switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { Runtime.trap("Supplier not found") };
      case (?s) { RiskLib.computeQualityRisk(s) };
    };
  };

  /// Compute and return delay risk score for a supplier.
  public query func computeDelayRisk(supplierId : CommonTypes.SupplierId) : async Nat {
    switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { Runtime.trap("Supplier not found") };
      case (?s) { RiskLib.computeDelayRisk(s) };
    };
  };

  /// Compute and return failure risk score for a supplier.
  public query func computeFailureRisk(supplierId : CommonTypes.SupplierId) : async Nat {
    switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { Runtime.trap("Supplier not found") };
      case (?s) { RiskLib.computeFailureRisk(s) };
    };
  };

  /// Compute and return composite weighted risk score for a supplier.
  public query func getCompositeRisk(supplierId : CommonTypes.SupplierId) : async Nat {
    switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { Runtime.trap("Supplier not found") };
      case (?s) {
        let q = RiskLib.computeQualityRisk(s);
        let d = RiskLib.computeDelayRisk(s);
        let f = RiskLib.computeFailureRisk(s);
        RiskLib.computeCompositeRisk(q, d, f);
      };
    };
  };
};
