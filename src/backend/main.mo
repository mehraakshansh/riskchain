import List "mo:core/List";
import Map "mo:core/Map";

import SupplierTypes "types/supplier";
import RiskTypes "types/risk";
import CommonTypes "types/common";

import SupplierLib "lib/supplier";

import SupplierApi "mixins/supplier-api";
import PortfolioApi "mixins/portfolio-api";
import MitigationApi "mixins/mitigation-api";

actor {
  // --- State ---
  let suppliers = List.empty<SupplierTypes.SupplierInternal>();
  let trends = Map.empty<CommonTypes.SupplierId, List.List<RiskTypes.DailyRiskSnapshot>>();
  let mitigationActions = List.empty<RiskTypes.MitigationActionInternal>();

  // --- Seed on first deploy ---
  do {
    SupplierLib.seedSuppliers(suppliers);
    SupplierLib.seedTrendHistory(suppliers, trends);
  };

  // --- Mixins ---
  include SupplierApi(suppliers, trends);
  include PortfolioApi(suppliers);
  include MitigationApi(mitigationActions);
};
