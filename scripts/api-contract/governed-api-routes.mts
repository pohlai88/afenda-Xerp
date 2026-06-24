/**
 * CI entry surface for route-coverage utilities.
 * Canonical implementation: `apps/erp/src/server/api/contracts/api-route-coverage.ts`.
 * `check-api-contracts.mts` dynamic-imports the canonical module (Node ESM static re-export limitation).
 */
export {
  collectGovernedRouteContractExportNames,
  collectRouteFiles,
  extractContractExportNames,
  GOVERNED_ROUTE_ALLOWLIST,
  isAllowlistedRoute,
  isGovernedRouteSource,
  validateApiContractRegistryCoverage,
} from "../../apps/erp/src/server/api/contracts/api-route-coverage.ts";
