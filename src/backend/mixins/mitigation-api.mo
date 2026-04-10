import List "mo:core/List";
import RiskTypes "../types/risk";
import CommonTypes "../types/common";
import MitigationLib "../lib/mitigation";

mixin (
  mitigationActions : List.List<RiskTypes.MitigationActionInternal>,
) {
  /// Logs a new mitigation action with a due date for a supplier. Returns the new action id.
  public func logMitigationAction(
    supplierId : CommonTypes.SupplierId,
    action : Text,
    dueDate : CommonTypes.Timestamp,
  ) : async Nat {
    let nextId = mitigationActions.size() + 1;
    MitigationLib.logAction(mitigationActions, nextId, supplierId, action, dueDate);
  };

  /// Returns all mitigation actions for a supplier, sorted by createdAt descending.
  public query func getMitigationActions(supplierId : CommonTypes.SupplierId) : async [RiskTypes.MitigationAction] {
    MitigationLib.getActionsForSupplier(mitigationActions, supplierId);
  };
};
