import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Int "mo:core/Int";
import SupplierTypes "../types/supplier";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";
import RiskLib "risk";

module {
  /// Compute portfolio-level risk snapshot across all suppliers.
  public func getPortfolioSnapshot(
    suppliers : List.List<SupplierTypes.SupplierInternal>
  ) : RiskTypes.PortfolioRiskSnapshot {
    let total = suppliers.size();
    if (total == 0) {
      return {
        totalSuppliers = 0;
        avgCompositeRisk = 0;
        highRiskCount = 0;
        mediumRiskCount = 0;
        lowRiskCount = 0;
        maxRiskSupplierId = 0;
        maxRiskScore = 0;
        portfolioRiskScore = 0;
        timestamp = Time.now();
      };
    };

    var sumRisk : Nat = 0;
    var highCount : Nat = 0;
    var medCount : Nat = 0;
    var lowCount : Nat = 0;
    var maxRiskId : Nat = 0;
    var maxRisk : Nat = 0;

    suppliers.forEach(func(s) {
      let q = RiskLib.computeQualityRisk(s);
      let d = RiskLib.computeDelayRisk(s);
      let f = RiskLib.computeFailureRisk(s);
      let c = RiskLib.computeCompositeRisk(q, d, f);
      sumRisk += c;
      switch (RiskLib.classifyRiskLevel(c)) {
        case (#High)   { highCount += 1 };
        case (#Medium) { medCount += 1 };
        case (#Low)    { lowCount += 1 };
      };
      if (c > maxRisk) {
        maxRisk := c;
        maxRiskId := s.id;
      };
    });

    let avg = sumRisk / total;
    // Portfolio risk score: weighted toward high-risk concentration
    let highWeight = (highCount.toFloat() / total.toFloat()) * 30.0;
    let portfolioRaw = avg.toFloat() * 0.7 + highWeight;

    {
      totalSuppliers = total;
      avgCompositeRisk = avg;
      highRiskCount = highCount;
      mediumRiskCount = medCount;
      lowRiskCount = lowCount;
      maxRiskSupplierId = maxRiskId;
      maxRiskScore = maxRisk;
      portfolioRiskScore = RiskLib.clampScore(portfolioRaw);
      timestamp = Time.now();
    };
  };

  /// Build the supply network graph from all suppliers and their dependency edges.
  public func buildNetworkGraph(
    suppliers : List.List<SupplierTypes.SupplierInternal>
  ) : RiskTypes.SupplyNetworkGraph {
    var edgeCount : Nat = 0;
    let nodes = suppliers.map<SupplierTypes.SupplierInternal, RiskTypes.NetworkNode>(func(s) {
      let q = RiskLib.computeQualityRisk(s);
      let d = RiskLib.computeDelayRisk(s);
      let f = RiskLib.computeFailureRisk(s);
      let c = RiskLib.computeCompositeRisk(q, d, f);
      edgeCount += s.dependsOn.size();
      {
        supplierId = s.id;
        supplierName = s.name;
        tier = s.tier;
        category = s.category;
        compositeRisk = c;
        dependsOn = s.dependsOn;
      }
    });
    { nodes = nodes.toArray(); edgeCount };
  };

  /// Simulate a disruption at a supplier and return cascading portfolio impact.
  /// Direct supplier gets 30-50% risk increase; dependents get 15-25% increase.
  public func simulateDisruption(
    suppliers : List.List<SupplierTypes.SupplierInternal>,
    supplierId : CommonTypes.SupplierId,
    disruptionType : CommonTypes.DisruptionType,
  ) : RiskTypes.DisruptionImpact {
    // Disruption severity multiplier per type
    let (directPct, cascadePct, recoveryDays) : (Float, Float, Nat) = switch (disruptionType) {
      case (#SupplyInterruption) (0.40, 0.20, 14);
      case (#QualityFailure)     (0.35, 0.15, 10);
      case (#LogisticsDelay)     (0.30, 0.18, 7);
      case (#EquipmentFailure)   (0.45, 0.22, 21);
      case (#NaturalDisaster)    (0.50, 0.25, 30);
    };

    // Find the affected supplier
    let affected = switch (suppliers.find(func(s : SupplierTypes.SupplierInternal) : Bool { s.id == supplierId })) {
      case null { Runtime.trap("Supplier not found: " # supplierId.toText()) };
      case (?s) { s };
    };

    let q = RiskLib.computeQualityRisk(affected);
    let d = RiskLib.computeDelayRisk(affected);
    let f = RiskLib.computeFailureRisk(affected);
    let currentRisk = RiskLib.computeCompositeRisk(q, d, f);

    let directIncrease = RiskLib.clampScore(currentRisk.toFloat() * directPct);

    // Find suppliers that depend on the affected one (cascading)
    let cascadeIds = suppliers.filterMap<SupplierTypes.SupplierInternal, CommonTypes.SupplierId>(func(s) {
      if (s.id == supplierId) return null;
      let dependsOnAffected = s.dependsOn.find(func(dep : Nat) : Bool { dep == supplierId });
      switch (dependsOnAffected) {
        case null { null };
        case (?_) { ?s.id };
      };
    });

    // Compute portfolio risk delta
    let cascadeCount = cascadeIds.toArray().size();
    let cascadeContrib = cascadeCount.toFloat() * currentRisk.toFloat() * cascadePct;
    let portfolioDelta : Int = Int.fromNat(RiskLib.clampScore(directIncrease.toFloat() * 0.3 + cascadeContrib * 0.1));

    let newRisk = RiskLib.clampScore((currentRisk + directIncrease).toFloat());

    {
      affectedSupplierId = supplierId;
      disruptionType;
      directRiskIncrease = directIncrease;
      cascadingSupplierIds = cascadeIds.toArray();
      portfolioRiskDelta = portfolioDelta;
      estimatedRecoveryDays = recoveryDays;
      severity = RiskLib.classifyRiskLevel(newRisk);
    };
  };

  /// Return ranked alternative suppliers for a given category, excluding the target supplier.
  /// Sorted by compositeRisk ascending, top 5.
  public func getRecommendedAlternatives(
    suppliers : List.List<SupplierTypes.SupplierInternal>,
    supplierId : CommonTypes.SupplierId,
    category : SupplierTypes.SupplierCategory,
  ) : [RiskTypes.AlternativeSupplier] {
    let candidates = suppliers.filterMap<SupplierTypes.SupplierInternal, RiskTypes.AlternativeSupplier>(func(s) {
      if (s.id == supplierId) return null;
      let sameCategory = switch (s.category, category) {
        case (#Electronics, #Electronics) true;
        case (#RawMaterials, #RawMaterials) true;
        case (#Logistics, #Logistics) true;
        case (#Manufacturing, #Manufacturing) true;
        case (#Packaging, #Packaging) true;
        case (#Chemicals, #Chemicals) true;
        case (#Services, #Services) true;
        case (_, _) false;
      };
      if (not sameCategory) return null;
      let q = RiskLib.computeQualityRisk(s);
      let d = RiskLib.computeDelayRisk(s);
      let f = RiskLib.computeFailureRisk(s);
      let c = RiskLib.computeCompositeRisk(q, d, f);
      ?{
        supplierId = s.id;
        name = s.name;
        compositeRisk = c;
        avgLeadTimeDays = s.avgLeadTimeDays;
        tier = s.tier;
        category = s.category;
        rank = 0; // placeholder, set after sort
      };
    });

    let arr = candidates.toArray();
    let sorted = arr.sort(func(a, b) {
      if (a.compositeRisk < b.compositeRisk) #less
      else if (a.compositeRisk > b.compositeRisk) #greater
      else #equal
    });

    let top5 = sorted.sliceToArray(0, if (sorted.size() < 5) sorted.size() else 5);
    top5.mapEntries<RiskTypes.AlternativeSupplier, RiskTypes.AlternativeSupplier>(func(alt, i) {
      { alt with rank = i + 1 }
    });
  };

  /// Return all suppliers whose composite risk exceeds the given threshold, sorted descending.
  public func getRiskAlerts(
    suppliers : List.List<SupplierTypes.SupplierInternal>,
    threshold : Nat,
  ) : [RiskTypes.RiskAlert] {
    let now = Time.now();
    let alerts = suppliers.filterMap<SupplierTypes.SupplierInternal, RiskTypes.RiskAlert>(func(s) {
      let q = RiskLib.computeQualityRisk(s);
      let d = RiskLib.computeDelayRisk(s);
      let f = RiskLib.computeFailureRisk(s);
      let c = RiskLib.computeCompositeRisk(q, d, f);
      if (c <= threshold) return null;
      ?{
        supplierId = s.id;
        supplierName = s.name;
        compositeRisk = c;
        qualityRisk = q;
        delayRisk = d;
        failureRisk = f;
        riskLevel = RiskLib.classifyRiskLevel(c);
        triggeredAt = now;
      };
    });
    let arr = alerts.toArray();
    arr.sort(func(a, b) {
      if (a.compositeRisk > b.compositeRisk) #less
      else if (a.compositeRisk < b.compositeRisk) #greater
      else #equal
    });
  };
};
