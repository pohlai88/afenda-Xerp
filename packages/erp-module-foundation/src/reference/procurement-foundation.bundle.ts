/** Reference procurement foundation bundle — re-exports production bundle for docs/tests. */
// biome-ignore lint/performance/noBarrelFile: intentional reference re-export surface
export {
  buildProcurementFoundationBundle,
  PROCUREMENT_FOUNDATION_BUNDLE,
  PROCUREMENT_FOUNDATION_EVIDENCE,
  REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE,
} from "../../../procurement/src/procurement.foundation.bundle.js";

export const REFERENCE_KV_CATALOG = {
  procurement: "KV-PROC",
} as const;
