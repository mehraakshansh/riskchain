import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import SupplierTypes "../types/supplier";
import CommonTypes "../types/common";

module {
  /// Sigmoid activation: maps any real number to (0, 1). Used for ML-style normalization.
  public func sigmoid(x : Float) : Float {
    1.0 / (1.0 + Float.exp(-x));
  };

  /// Clamp a float-derived risk score (0.0-100.0 range) to a Nat in [0, 100].
  public func clampScore(raw : Float) : Nat {
    let clamped = if (raw < 0.0) 0.0 else if (raw > 100.0) 100.0 else raw;
    clamped.toInt().toNat();
  };

  /// Quality risk (0-100) using sigmoid normalization of defect rate weighted by product complexity proxy.
  public func computeQualityRisk(supplier : SupplierTypes.SupplierInternal) : Nat {
    let defectRate = supplier.defectRate;
    let complexityFactor = 1.0 - supplier.carrierPerformanceScore;
    let rawInput = (defectRate * 2.0 + complexityFactor) * 3.0 - 1.5;
    let score = sigmoid(rawInput) * 100.0;
    clampScore(score);
  };

  /// Delay risk (0-100) using weighted carrier performance, on-time delivery, and lead time.
  public func computeDelayRisk(supplier : SupplierTypes.SupplierInternal) : Nat {
    let onTimeFactor = (1.0 - supplier.onTimeDeliveryRate) * 40.0;
    let carrierFactor = (1.0 - supplier.carrierPerformanceScore) * 35.0;
    let leadTimeDays = supplier.avgLeadTimeDays.toFloat();
    let leadNorm = if (leadTimeDays >= 60.0) 1.0 else leadTimeDays / 60.0;
    let leadFactor = leadNorm * 25.0;
    let raw = onTimeFactor + carrierFactor + leadFactor;
    clampScore(raw);
  };

  /// Failure risk (0-100): equipment failure rate + supply interruption count + tier-based base risk.
  public func computeFailureRisk(supplier : SupplierTypes.SupplierInternal) : Nat {
    let equipFactor = supplier.equipmentFailureRate * 45.0;
    let interruptions = supplier.supplyInterruptionCount.toFloat();
    let interruptNorm = if (interruptions >= 6.0) 1.0 else interruptions / 6.0;
    let interruptFactor = interruptNorm * 35.0;
    let tierBase : Float = switch (supplier.tier) {
      case (#Tier1) 0.1;
      case (#Tier2) 0.5;
      case (#Tier3) 1.0;
    };
    let tierFactor = tierBase * 20.0;
    let raw = equipFactor + interruptFactor + tierFactor;
    clampScore(raw);
  };

  /// Composite risk: 35% quality + 35% delay + 30% failure, clamped to 0-100.
  public func computeCompositeRisk(qualityRisk : Nat, delayRisk : Nat, failureRisk : Nat) : Nat {
    clampScore(
      qualityRisk.toFloat() * 0.35 +
      delayRisk.toFloat() * 0.35 +
      failureRisk.toFloat() * 0.30
    );
  };

  /// Classify a 0-100 risk score into Low / Medium / High.
  public func classifyRiskLevel(score : Nat) : CommonTypes.RiskLevel {
    if (score <= 40) #Low
    else if (score <= 70) #Medium
    else #High;
  };
};
