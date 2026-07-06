/**
 * ERP-owned PAS-006D metadata wire contracts (B-08 v2 bridge).
 * Consumer layer — studio package registries are mirrored in ERP-local bridges.
 */

export const METADATA_BINDING_PRESENTATION_KINDS = [
  "text",
  "textarea",
  "number",
  "date",
  "select",
  "checkbox",
  "readonly",
] as const;

export type MetadataBindingFieldPresentationKind =
  (typeof METADATA_BINDING_PRESENTATION_KINDS)[number];

export const SURFACE_TEMPLATE_CLASSES = [
  "form",
  "table",
  "dashboard",
  "settings",
  "approval",
] as const;

export type SurfaceTemplateClass = (typeof SURFACE_TEMPLATE_CLASSES)[number];

export interface SurfaceTemplateBlockBindingWire {
  readonly blockId: string;
  readonly slotFills: Readonly<Record<string, string>>;
}

export interface SurfaceTemplateContractWire {
  readonly acceptanceRecordIds: readonly string[];
  readonly blockBindings: readonly SurfaceTemplateBlockBindingWire[];
  readonly metadataBindingId: string;
  readonly surfaceTemplateId: string;
  readonly templateClass: SurfaceTemplateClass;
}

export interface MetadataBindingFieldWire {
  readonly fieldKey: string;
  readonly helpTextAtomRef?: string;
  readonly labelAtomRef?: string;
  readonly presentationKind: MetadataBindingFieldPresentationKind;
  readonly requiredDisplay?: boolean;
  readonly slotId: string;
}

export interface MetadataBindingTableColumnWire {
  readonly columnKey: string;
  readonly labelAtomRef?: string;
  readonly slotId: string;
  readonly sortableDisplay?: boolean;
}

export interface MetadataBindingStateTemplateWire {
  readonly messageAtomRef?: string;
  readonly slotId: string;
  readonly stateKind: "empty" | "loading" | "error" | "forbidden";
}

export interface MetadataBindingContractWire {
  readonly blockId: string;
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
  readonly fields: readonly MetadataBindingFieldWire[];
  readonly metadataBindingId: string;
  readonly stateTemplates?: readonly MetadataBindingStateTemplateWire[];
  readonly surfaceTemplateClass?: SurfaceTemplateClass;
  readonly tableColumns?: readonly MetadataBindingTableColumnWire[];
}

export type BlockDataFieldKind =
  | "boolean"
  | "date"
  | "email"
  | "number"
  | "password"
  | "readonly"
  | "select"
  | "text";

export interface BlockDataFieldWire {
  readonly fieldKey: string;
  readonly kind: BlockDataFieldKind;
  readonly labelAtomRef?: string;
  readonly requiredDisplay?: boolean;
  readonly slotId: string;
}

export interface BlockDataContractWire {
  readonly blockId: string;
  readonly fields: readonly BlockDataFieldWire[];
}
