import List "mo:core/List";
import SupplierTypes "../types/supplier";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";
import PortfolioLib "../lib/portfolio";

mixin (
  suppliers : List.List<SupplierTypes.SupplierInternal>,
) {
  /// Returns portfolio-level risk snapshot with distribution metrics.
  public query func getPortfolioRiskSnapshot() : async RiskTypes.PortfolioRiskSnapshot {
    PortfolioLib.getPortfolioSnapshot(suppliers);
  };

  /// Returns the supply network graph with supplier tier relationships.
  public query func getSupplyNetworkGraph() : async RiskTypes.SupplyNetworkGraph {
    PortfolioLib.buildNetworkGraph(suppliers);
  };

  /// Simulates a disruption event and models its portfolio impact.
  public query func simulateDisruption(
    supplierId : CommonTypes.SupplierId,
    disruptionType : CommonTypes.DisruptionType,
  ) : async RiskTypes.DisruptionImpact {
    PortfolioLib.simulateDisruption(suppliers, supplierId, disruptionType);
  };

  /// Returns ranked alternative suppliers for a category (top 5, sorted by risk ascending).
  public query func getRecommendedAlternatives(
    supplierId : CommonTypes.SupplierId,
    category : SupplierTypes.SupplierCategory,
  ) : async [RiskTypes.AlternativeSupplier] {
    PortfolioLib.getRecommendedAlternatives(suppliers, supplierId, category);
  };

  /// Returns all suppliers with composite risk exceeding the threshold, sorted descending.
  public query func getRiskAlerts(threshold : Nat) : async [RiskTypes.RiskAlert] {
    PortfolioLib.getRiskAlerts(suppliers, threshold);
  };
};
