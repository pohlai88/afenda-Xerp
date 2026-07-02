/**
 * PAS-006B — relational presentation inventory registry (ADR-0027).
 */

import type { EditorialLabPresetStatus } from "../styles/presentation-lab-presets.registry.js";
import type { BlockLifecycleState } from "./block-lifecycle.js";
import { buildPresentationInventoryFromParity } from "./build-presentation-inventory-from-parity.js";
import type { StudioBlockParityStatus } from "./studio-block-parity.registry.js";

export type PresentationLayerKind =
  | "theme-preset"
  | "editorial-lab-preset"
  | "presentation-primitive"
  | "primitive-variant"
  | "presentation-block"
  | "block-slot"
  | "block-data-contract"
  | "metadata-binding"
  | "surface-template"
  | "operator-surface"
  | "acceptance-record";

export type PresentationInventoryEntry =
  | {
      readonly entryId: string;
      readonly label: string;
      readonly layerKind: "theme-preset";
      readonly sourcePath: string;
      readonly themePresetSlug: string;
    }
  | {
      readonly entryId: string;
      readonly label: string;
      readonly layerKind: "editorial-lab-preset";
      readonly presetId: string;
      readonly status: EditorialLabPresetStatus;
      readonly className: string;
      readonly presetSourcePath: string;
      readonly cssMirrorPath: string;
      readonly specPath: string;
      readonly editorialVocab: "lab-*" | "afenda-*";
    }
  | {
      readonly entryId: string;
      readonly label: string;
      readonly layerKind: "presentation-block";
      readonly lifecycleState: BlockLifecycleState;
      readonly mcpBlockId: string;
      readonly parityStatus: StudioBlockParityStatus;
      readonly sourcePath: string;
    };

export const PRESENTATION_INVENTORY_REGISTRY =
  buildPresentationInventoryFromParity() satisfies readonly PresentationInventoryEntry[];
