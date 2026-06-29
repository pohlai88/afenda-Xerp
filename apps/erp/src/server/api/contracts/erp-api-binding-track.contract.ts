/**
 * PAS-001A-API-BINDING — track authority (S1–S7).
 *
 * Single source of truth for slice module paths, track status, and maturity.
 * Slice contracts import from here — do not duplicate module registries.
 */

export const ERP_API_RUNTIME_MATURITY = "production-accepted" as const;

export const ERP_API_BINDING_TRACK_SLICE_COUNT = 7 as const;

export const ERP_API_BINDING_TRACK_STATUS = "delivered" as const;

/** S1–S4 bridge attestation modules (composite input for S5+). */
export const ERP_API_BRIDGE_SLICE_MODULES = [
  "apps/erp/src/server/api/contracts/erp-api-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-rest-binding-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-context-bridge.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-auth-bridge.contract.ts",
] as const;

/** Full PAS-001A-API-BINDING track — one module per slice (S1–S7). */
export const ERP_API_BINDING_SLICE_MODULES = [
  ...ERP_API_BRIDGE_SLICE_MODULES,
  "apps/erp/src/server/api/contracts/erp-api-runtime-evidence.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-consumer-impact-sync.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-release-gate.contract.ts",
] as const;

export function assertBindingTrackSliceModulesComplete(): void {
  if (
    ERP_API_BINDING_SLICE_MODULES.length !== ERP_API_BINDING_TRACK_SLICE_COUNT
  ) {
    throw new Error(
      `API binding track must declare ${ERP_API_BINDING_TRACK_SLICE_COUNT} slice modules.`
    );
  }
}
