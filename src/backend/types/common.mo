module {
  public type SupplierId = Nat;
  public type Timestamp = Int;
  public type RiskScore = Nat; // 0-100 scale

  public type DisruptionType = {
    #SupplyInterruption;
    #QualityFailure;
    #LogisticsDelay;
    #EquipmentFailure;
    #NaturalDisaster;
  };

  public type MitigationStatus = {
    #Open;
    #InProgress;
    #Completed;
    #Cancelled;
  };

  public type RiskLevel = {
    #Low;    // 0-33
    #Medium; // 34-66
    #High;   // 67-100
  };
};
