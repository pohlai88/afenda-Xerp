/**
 * @afenda.governance-envelope governance-barrel
 * Role: @afenda/shadcn-studio/governance subpath exports
 * Family: governance-barrel
 * Relies on: block-metadata.registry, ui-primitive-metadata.registry, _governance.registry, registry/assert-block-slot-dom-marker-coverage
 * Relied on by: scripts/governance/check-studio-*, package.json ./governance export
 * Refactored: 2026-07-01 · series flat-governance
 * Gate: check:studio-governance-envelope
 */

/**
 * Server/gate-only exports — never import from client components or the main barrel.
 */

export {
  assertBlockSlotDomMarkerCoverage,
  type BlockSlotDomMarkerCoverageResult,
  type BlockSlotDomMarkerCoverageRow,
  summarizeBlockSlotDomMarkerCoverage,
} from "../meta-registry/assert-block-slot-dom-marker-coverage.js";
export {
  BLOCK_METADATA_REGISTRY,
  type BlockContractMetadata,
  type BlockMetadata,
} from "./block-metadata.registry.js";
export {
  UI_PRIMITIVE_METADATA_REGISTRY,
  type UiPrimitiveMetadataPayload,
} from "./ui-primitive-metadata.registry.js";
