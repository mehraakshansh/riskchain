import List "mo:core/List";
import Time "mo:core/Time";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";

module {
  /// Log a new mitigation action for a supplier. Returns the assigned action id.
  public func logAction(
    actions : List.List<RiskTypes.MitigationActionInternal>,
    nextId : Nat,
    supplierId : CommonTypes.SupplierId,
    action : Text,
    dueDate : CommonTypes.Timestamp,
  ) : Nat {
    let now = Time.now();
    let entry : RiskTypes.MitigationActionInternal = {
      id = nextId;
      supplierId;
      var action;
      var dueDate;
      var status = #Open;
      createdAt = now;
      var updatedAt = now;
    };
    actions.add(entry);
    nextId;
  };

  /// Convert an internal mitigation action to the public shared type.
  public func toPublic(a : RiskTypes.MitigationActionInternal) : RiskTypes.MitigationAction {
    {
      id = a.id;
      supplierId = a.supplierId;
      action = a.action;
      dueDate = a.dueDate;
      status = a.status;
      createdAt = a.createdAt;
      updatedAt = a.updatedAt;
    };
  };

  /// Get all mitigation actions for a supplier, sorted by createdAt descending.
  public func getActionsForSupplier(
    actions : List.List<RiskTypes.MitigationActionInternal>,
    supplierId : CommonTypes.SupplierId,
  ) : [RiskTypes.MitigationAction] {
    let filtered = actions.filterMap<RiskTypes.MitigationActionInternal, RiskTypes.MitigationAction>(func(a) {
      if (a.supplierId != supplierId) return null;
      ?toPublic(a);
    });
    let arr = filtered.toArray();
    arr.sort(func(a, b) {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
  };
};
