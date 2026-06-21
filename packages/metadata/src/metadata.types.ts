/**
 * Metadata derived type exports.
 *
 * Source of truth:
 * - All metadata vocabulary values are declared in `metadata.constants.ts`.
 * - All union types are derived from those governed arrays.
 *
 * Rule:
 * - Do not manually redeclare metadata union types in this file.
 * - Do not add literal unions here.
 * - Do not duplicate governed arrays here.
 */

export type {
  LayoutType,
  MetadataAuthorityKey,
  MetadataDensityMode,
  MetadataLifecycle,
  MetadataRuntimeState,
  PresentationMode,
  RendererCapability,
  SectionType,
  SurfaceType,
} from "./metadata.constants.js";
