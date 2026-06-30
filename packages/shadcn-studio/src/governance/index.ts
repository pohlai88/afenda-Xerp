/**
 * Server/gate-only exports — never import from client components or the main barrel.
 * Uses node:fs for repository filesystem scans.
 */

export {
  assertBlockSlotDomMarkerCoverage,
  type BlockSlotDomMarkerCoverageResult,
  type BlockSlotDomMarkerCoverageRow,
  summarizeBlockSlotDomMarkerCoverage,
} from "../registry/assert-block-slot-dom-marker-coverage.js";
