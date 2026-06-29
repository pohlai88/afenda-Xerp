/**
 * PAS-001 §4.4 — operating context hierarchy (shape vocabulary only).
 *
 * Kernel owns the hierarchy registry and `OperatingContext` composition fields.
 * Kernel must not load, infer, resolve, persist, authorize, audit, or render context.
 *
 * @see docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md
 */

export const OPERATING_CONTEXT_LAYER_IDS = [
  "tenant",
  "entity-group",
  "legal-entity",
  "ownership-interest",
  "organization-unit",
  "team",
  "project",
  "workspace",
  "surface",
  "workflow",
  "permission-scope",
  "consolidation-scope",
  "accounting-readiness",
] as const;

export type OperatingContextLayerId =
  (typeof OPERATING_CONTEXT_LAYER_IDS)[number];

/** How a layer participates in the composed operating context. */
export type OperatingContextLayerKind =
  | "structural"
  | "runtime"
  | "grant"
  | "metadata"
  | "gate";

export interface OperatingContextLayerDefinition {
  readonly id: OperatingContextLayerId;
  readonly kind: OperatingContextLayerKind;
  /** Key on `OperatingContext` when composed — null for gate-only projections. */
  readonly operatingContextField: keyof OperatingContextFieldMap | null;
  readonly owner: string;
  readonly summary: string;
}

/** Compile-time map of composed operating-context fields (no runtime import cycle). */
export interface OperatingContextFieldMap {
  readonly consolidationScope: unknown;
  readonly entityGroup: unknown;
  readonly legalEntity: unknown;
  readonly organizationUnit: unknown;
  readonly ownershipInterests: unknown;
  readonly permissionScope: unknown;
  readonly project: unknown;
  readonly surface: unknown;
  readonly team: unknown;
  readonly tenant: unknown;
  readonly workflow: unknown;
  readonly workspace: unknown;
}

export const OPERATING_CONTEXT_LAYERS = {
  tenant: {
    id: "tenant",
    kind: "structural",
    operatingContextField: "tenant",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "SaaS and security boundary",
  },
  "entity-group": {
    id: "entity-group",
    kind: "structural",
    operatingContextField: "entityGroup",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Corporate group boundary",
  },
  "legal-entity": {
    id: "legal-entity",
    kind: "structural",
    operatingContextField: "legalEntity",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Statutory / company boundary",
  },
  "ownership-interest": {
    id: "ownership-interest",
    kind: "metadata",
    operatingContextField: "ownershipInterests",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Enterprise hierarchy and consolidation-readiness metadata",
  },
  "organization-unit": {
    id: "organization-unit",
    kind: "structural",
    operatingContextField: "organizationUnit",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Operational boundary",
  },
  team: {
    id: "team",
    kind: "structural",
    operatingContextField: "team",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Execution scope",
  },
  project: {
    id: "project",
    kind: "structural",
    operatingContextField: "project",
    owner:
      "kernel (shape) · apps/erp (resolver) · @afenda/database (persistence)",
    summary: "Execution scope",
  },
  workspace: {
    id: "workspace",
    kind: "runtime",
    operatingContextField: "workspace",
    owner: "kernel (shape) · apps/erp (resolver)",
    summary: "Runtime UI context scope",
  },
  surface: {
    id: "surface",
    kind: "runtime",
    operatingContextField: "surface",
    owner: "kernel (shape) · apps/erp (resolver)",
    summary: "Runtime UI context scope",
  },
  workflow: {
    id: "workflow",
    kind: "runtime",
    operatingContextField: "workflow",
    owner: "kernel (shape) · apps/erp (resolver)",
    summary: "Runtime workflow context scope",
  },
  "permission-scope": {
    id: "permission-scope",
    kind: "grant",
    operatingContextField: "permissionScope",
    owner: "kernel (shape) · @afenda/permissions (evaluation)",
    summary: "Permission grant boundary",
  },
  "consolidation-scope": {
    id: "consolidation-scope",
    kind: "metadata",
    operatingContextField: "consolidationScope",
    owner: "kernel (shape) · apps/erp (derivation metadata)",
    summary: "Accounting-readiness metadata only",
  },
  "accounting-readiness": {
    id: "accounting-readiness",
    kind: "gate",
    operatingContextField: null,
    owner: "apps/erp (AccountingReadinessContext + projection gate)",
    summary: "Gate signal — not accounting runtime",
  },
} satisfies Record<OperatingContextLayerId, OperatingContextLayerDefinition>;

export const OPERATING_CONTEXT_OWNERSHIP_SPLIT = {
  operatingContextShape: "kernel",
  operatingContextResolver: "apps/erp",
  persistence: "@afenda/database",
  permissionEvaluation: "@afenda/permissions",
  auditWriting: "@afenda/observability",
  runtimeExecution: "@afenda/execution",
} as const;

export const OPERATING_CONTEXT_POLICY = {
  pasSection: "4.4",
  layerCount: OPERATING_CONTEXT_LAYER_IDS.length,
  layers: OPERATING_CONTEXT_LAYER_IDS,
  constitutionalRule:
    "Kernel owns the operating context shape. It must not load, infer, resolve, persist, authorize, audit, or render the context.",
  prohibitedKernelBehaviors: [
    "inline tenant lookup at consumer call sites",
    "permission evaluation inside kernel contracts",
    "accounting journal or ledger logic in readiness shape",
    "human reference generation in kernel",
  ] as const,
} as const;

export type OperatingContextProhibitedKernelBehavior =
  (typeof OPERATING_CONTEXT_POLICY.prohibitedKernelBehaviors)[number];

export function isOperatingContextLayerId(
  value: string
): value is OperatingContextLayerId {
  return (OPERATING_CONTEXT_LAYER_IDS as readonly string[]).includes(value);
}

export function getOperatingContextLayer(
  layerId: OperatingContextLayerId
): OperatingContextLayerDefinition {
  return OPERATING_CONTEXT_LAYERS[layerId];
}

export function compareOperatingContextLayerOrder(
  left: OperatingContextLayerId,
  right: OperatingContextLayerId
): number {
  return (
    OPERATING_CONTEXT_LAYER_IDS.indexOf(left) -
    OPERATING_CONTEXT_LAYER_IDS.indexOf(right)
  );
}
