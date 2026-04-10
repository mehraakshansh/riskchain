import List "mo:core/List";
import Map "mo:core/Map";
import Float "mo:core/Float";
import SupplierTypes "../types/supplier";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";
import RiskLib "risk";

module {
  /// Build a SupplierProfile from internal state by computing risk scores.
  public func toProfile(s : SupplierTypes.SupplierInternal) : SupplierTypes.SupplierProfile {
    let qRisk = RiskLib.computeQualityRisk(s);
    let dRisk = RiskLib.computeDelayRisk(s);
    let fRisk = RiskLib.computeFailureRisk(s);
    let cRisk = RiskLib.computeCompositeRisk(qRisk, dRisk, fRisk);
    {
      id = s.id;
      name = s.name;
      tier = s.tier;
      location = s.location;
      category = s.category;
      defectRate = s.defectRate;
      onTimeDeliveryRate = s.onTimeDeliveryRate;
      avgLeadTimeDays = s.avgLeadTimeDays;
      carrierPerformanceScore = s.carrierPerformanceScore;
      equipmentFailureRate = s.equipmentFailureRate;
      supplyInterruptionCount = s.supplyInterruptionCount;
      volumeHandled = s.volumeHandled;
      yearsActive = s.yearsActive;
      dependsOn = s.dependsOn;
      qualityRisk = qRisk;
      delayRisk = dRisk;
      failureRisk = fRisk;
      compositeRisk = cRisk;
    };
  };

  /// Apply a metrics update to a supplier in place.
  public func applyMetricsUpdate(
    s : SupplierTypes.SupplierInternal,
    update : SupplierTypes.SupplierMetricsUpdate,
  ) {
    switch (update.defectRate) { case (?v) { s.defectRate := v }; case null {} };
    switch (update.onTimeDeliveryRate) { case (?v) { s.onTimeDeliveryRate := v }; case null {} };
    switch (update.avgLeadTimeDays) { case (?v) { s.avgLeadTimeDays := v }; case null {} };
    switch (update.carrierPerformanceScore) { case (?v) { s.carrierPerformanceScore := v }; case null {} };
    switch (update.equipmentFailureRate) { case (?v) { s.equipmentFailureRate := v }; case null {} };
    switch (update.supplyInterruptionCount) { case (?v) { s.supplyInterruptionCount := v }; case null {} };
    switch (update.volumeHandled) { case (?v) { s.volumeHandled := v }; case null {} };
  };

  /// Return all supplier profiles sorted by composite risk descending.
  public func getAllProfiles(
    suppliers : List.List<SupplierTypes.SupplierInternal>
  ) : [SupplierTypes.SupplierProfile] {
    let profiles = suppliers.map<SupplierTypes.SupplierInternal, SupplierTypes.SupplierProfile>(toProfile);
    let arr = profiles.toArray();
    arr.sort(func(a, b) {
      if (a.compositeRisk > b.compositeRisk) #less
      else if (a.compositeRisk < b.compositeRisk) #greater
      else #equal
    });
  };

  /// Get trend history for a supplier over the last N days (max 30).
  public func getTrendHistory(
    trends : Map.Map<CommonTypes.SupplierId, List.List<RiskTypes.DailyRiskSnapshot>>,
    supplierId : CommonTypes.SupplierId,
    days : Nat,
  ) : [RiskTypes.RiskTrendEntry] {
    let maxDays = if (days > 30) 30 else days;
    switch (trends.get(supplierId)) {
      case null { [] };
      case (?snapshots) {
        let total = snapshots.size();
        let start = if (total > maxDays) total - maxDays else 0;
        let sliced = snapshots.sliceToArray(start, total);
        sliced.map<RiskTypes.DailyRiskSnapshot, RiskTypes.RiskTrendEntry>(func(snap) {
          {
            timestamp = snap.timestamp;
            qualityRisk = snap.qualityRisk;
            delayRisk = snap.delayRisk;
            failureRisk = snap.failureRisk;
            compositeRisk = snap.compositeRisk;
          }
        });
      };
    };
  };

  // ---- Seed data ----

  /// Seed the initial 30+ supplier dataset with realistic metrics.
  public func seedSuppliers(suppliers : List.List<SupplierTypes.SupplierInternal>) {
    let data : [(
      Nat,    // id
      Text,   // name
      SupplierTypes.SupplierTier,
      Text,   // location
      SupplierTypes.SupplierCategory,
      Float,  // defectRate
      Float,  // onTimeDeliveryRate
      Nat,    // avgLeadTimeDays
      Float,  // carrierPerformanceScore
      Float,  // equipmentFailureRate
      Nat,    // supplyInterruptionCount
      Nat,    // volumeHandled
      Nat,    // yearsActive
      [Nat],  // dependsOn
    )] = [
      (1,  "AlphaCore Electronics",    #Tier1, "Shenzhen, CN",       #Electronics,    0.02, 0.95, 7,  0.92, 0.03, 0, 50000, 12, []),
      (2,  "BetaFlex Manufacturing",   #Tier1, "Seoul, KR",          #Manufacturing,  0.03, 0.91, 9,  0.88, 0.04, 1, 35000, 9,  [1]),
      (3,  "CedarPath Logistics",      #Tier1, "Rotterdam, NL",      #Logistics,      0.01, 0.97, 5,  0.95, 0.02, 0, 80000, 15, []),
      (4,  "DeltaChem Chemicals",      #Tier1, "Frankfurt, DE",      #Chemicals,      0.04, 0.89, 11, 0.85, 0.05, 1, 25000, 8,  []),
      (5,  "EastBridge Packaging",     #Tier1, "Chicago, US",        #Packaging,      0.02, 0.93, 8,  0.90, 0.03, 0, 42000, 11, [3]),
      (6,  "FullSpec Services",        #Tier1, "London, UK",         #Services,       0.01, 0.98, 3,  0.97, 0.01, 0, 15000, 20, []),
      (7,  "GreenCore Raw",            #Tier1, "Johannesburg, ZA",   #RawMaterials,   0.05, 0.87, 14, 0.82, 0.06, 2, 30000, 7,  []),
      (8,  "HorizonTech Electronics",  #Tier1, "Tokyo, JP",          #Electronics,    0.02, 0.94, 8,  0.91, 0.03, 0, 45000, 13, [1]),
      (9,  "InfraBuild Manufacturing", #Tier2, "Mumbai, IN",         #Manufacturing,  0.07, 0.82, 18, 0.78, 0.08, 3, 20000, 5,  [2, 4]),
      (10, "JetStream Logistics",      #Tier2, "Dubai, AE",          #Logistics,      0.03, 0.90, 10, 0.87, 0.04, 1, 55000, 10, [3]),
      (11, "KaizenParts Manufacturing",#Tier2, "Osaka, JP",          #Manufacturing,  0.04, 0.88, 12, 0.84, 0.05, 1, 28000, 8,  [1, 8]),
      (12, "LumiTech Electronics",     #Tier2, "Taipei, TW",         #Electronics,    0.06, 0.83, 15, 0.80, 0.07, 2, 18000, 6,  [1]),
      (13, "MetroSupply Raw",          #Tier2, "Sao Paulo, BR",      #RawMaterials,   0.08, 0.79, 20, 0.75, 0.09, 3, 12000, 4,  [7]),
      (14, "NovaPack Packaging",       #Tier2, "Warsaw, PL",         #Packaging,      0.05, 0.86, 13, 0.83, 0.06, 2, 22000, 7,  [5]),
      (15, "OmegaChem Chemicals",      #Tier2, "Lyon, FR",           #Chemicals,      0.06, 0.84, 14, 0.81, 0.07, 2, 16000, 6,  [4]),
      (16, "PeakFlow Logistics",       #Tier2, "Singapore, SG",      #Logistics,      0.03, 0.91, 9,  0.88, 0.04, 1, 48000, 9,  [3, 10]),
      (17, "QuantumServ Services",     #Tier2, "Toronto, CA",        #Services,       0.02, 0.93, 6,  0.91, 0.03, 0, 9000,  11, [6]),
      (18, "RapidCore Electronics",    #Tier2, "Austin, US",         #Electronics,    0.05, 0.85, 16, 0.81, 0.06, 2, 21000, 6,  [1, 8]),
      (19, "SteelMark Raw",            #Tier2, "Pittsburgh, US",     #RawMaterials,   0.07, 0.80, 19, 0.76, 0.08, 3, 14000, 5,  [7]),
      (20, "TerraFlex Manufacturing",  #Tier2, "Istanbul, TR",       #Manufacturing,  0.06, 0.83, 17, 0.79, 0.07, 2, 19000, 6,  [2, 9]),
      (21, "UniPack Packaging",        #Tier3, "Nairobi, KE",        #Packaging,      0.10, 0.72, 25, 0.68, 0.12, 5, 8000,  3,  [5, 14]),
      (22, "VoltEdge Electronics",     #Tier3, "Lagos, NG",          #Electronics,    0.12, 0.68, 28, 0.64, 0.14, 6, 6000,  2,  [12]),
      (23, "WestChem Chemicals",       #Tier3, "Karachi, PK",        #Chemicals,      0.11, 0.70, 27, 0.66, 0.13, 5, 7000,  3,  [15]),
      (24, "XcelRaw Materials",        #Tier3, "Cairo, EG",          #RawMaterials,   0.13, 0.65, 30, 0.61, 0.15, 7, 5000,  2,  [13, 19]),
      (25, "YieldPlus Manufacturing",  #Tier3, "Dhaka, BD",          #Manufacturing,  0.14, 0.63, 32, 0.59, 0.16, 7, 4500,  2,  [9, 20]),
      (26, "ZenithLog Logistics",      #Tier3, "Jakarta, ID",        #Logistics,      0.09, 0.74, 22, 0.70, 0.11, 4, 11000, 4,  [10, 16]),
      (27, "ArcadiaServ Services",     #Tier3, "Manila, PH",         #Services,       0.08, 0.76, 20, 0.72, 0.10, 4, 5500,  3,  [17]),
      (28, "BlueSky Electronics",      #Tier3, "Bangkok, TH",        #Electronics,    0.11, 0.69, 26, 0.65, 0.13, 6, 7500,  3,  [18, 22]),
      (29, "CoralPack Packaging",      #Tier3, "Ho Chi Minh, VN",    #Packaging,      0.10, 0.73, 24, 0.69, 0.12, 5, 6500,  3,  [21]),
      (30, "DawnRaw Materials",        #Tier3, "Colombo, LK",        #RawMaterials,   0.15, 0.60, 35, 0.56, 0.18, 8, 3500,  1,  [24]),
      (31, "EclipseChemicals",         #Tier3, "Lusaka, ZM",         #Chemicals,      0.13, 0.64, 31, 0.60, 0.16, 7, 4000,  2,  [23]),
      (32, "FusionMfg Manufacturing",  #Tier3, "Accra, GH",          #Manufacturing,  0.14, 0.62, 33, 0.58, 0.17, 8, 3800,  1,  [25]),
    ];

    for ((id, name, tier, location, category, defectRate, onTimeDeliveryRate, avgLeadTimeDays, carrierPerformanceScore, equipmentFailureRate, supplyInterruptionCount, volumeHandled, yearsActive, dependsOn) in data.values()) {
      let supplier : SupplierTypes.SupplierInternal = {
        id;
        name;
        tier;
        location;
        category;
        var defectRate;
        var onTimeDeliveryRate;
        var avgLeadTimeDays;
        var carrierPerformanceScore;
        var equipmentFailureRate;
        var supplyInterruptionCount;
        var volumeHandled;
        var yearsActive;
        var dependsOn;
      };
      suppliers.add(supplier);
    };
  };

  /// Seed 30-day trend history per supplier with realistic daily variation.
  public func seedTrendHistory(
    suppliers : List.List<SupplierTypes.SupplierInternal>,
    trends : Map.Map<CommonTypes.SupplierId, List.List<RiskTypes.DailyRiskSnapshot>>,
  ) {
    let nanosPerDay : Int = 86_400_000_000_000;
    let baseTs : Int = 1_704_067_200_000_000_000; // 2024-01-01 in nanoseconds

    suppliers.forEach(func(s) {
      let qBase = RiskLib.computeQualityRisk(s).toFloat();
      let dBase = RiskLib.computeDelayRisk(s).toFloat();
      let fBase = RiskLib.computeFailureRisk(s).toFloat();

      let snapshots = List.empty<RiskTypes.DailyRiskSnapshot>();
      var day = 0;
      while (day < 30) {
        let phase = (day.toFloat() * 0.314159) + (s.id.toFloat() * 0.7);
        let variation = Float.sin(phase) * 4.0;

        let qDay = RiskLib.clampScore(qBase + variation * 1.1);
        let dDay = RiskLib.clampScore(dBase + variation * 0.9);
        let fDay = RiskLib.clampScore(fBase + variation * 0.8);
        let cDay = RiskLib.computeCompositeRisk(qDay, dDay, fDay);

        let snap : RiskTypes.DailyRiskSnapshot = {
          day = day;
          timestamp = baseTs + (day.toInt() * nanosPerDay);
          qualityRisk = qDay;
          delayRisk = dDay;
          failureRisk = fDay;
          compositeRisk = cDay;
        };
        snapshots.add(snap);
        day += 1;
      };
      trends.add(s.id, snapshots);
    });
  };
};
