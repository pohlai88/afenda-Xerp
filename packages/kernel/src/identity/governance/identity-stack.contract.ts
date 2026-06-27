/**
 * PAS-001 §4.1.1 — three-layer identity stack (constitutional registry).
 *
 * Layers must not be merged at trust boundaries:
 * - Internal PK (uuid) — database persistence / RLS
 * - Canonical enterprise ID (`prefix_ulid`) — kernel wire + cross-package facts
 * - Tenant human reference — domain admin numbers, not kernel IDs
 */

export const IDENTITY_STACK_LAYER_IDS = [
  "internal-pk",
  "canonical-enterprise-id",
  "tenant-human-reference",
] as const;

export type IdentityStackLayerId = (typeof IDENTITY_STACK_LAYER_IDS)[number];

export interface IdentityStackLayerDefinition {
  readonly egressPattern: string;
  readonly example: string;
  readonly id: IdentityStackLayerId;
  readonly ingressPattern: string;
  readonly kernelModule: string | null;
  readonly owner: string;
  readonly usedFor: readonly string[];
}

export const IDENTITY_STACK_LAYERS = {
  "internal-pk": {
    id: "internal-pk",
    example: "018f9f8c-9f1a-7c2b-9c20-…",
    owner: "@afenda/database",
    usedFor: ["primary key", "foreign keys", "joins", "RLS session scope"],
    kernelModule: "wire/internal-entity-pk.contract.ts",
    ingressPattern: "parseInternalEntityPk",
    egressPattern: "toInternalEntityPk",
  },
  "canonical-enterprise-id": {
    id: "canonical-enterprise-id",
    example: "cus_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD",
    owner: "@afenda/kernel + database CHECK",
    usedFor: ["API ingress", "audit evidence", "events", "cross-package wire"],
    kernelModule: "families/ + canonical/ + wire/",
    ingressPattern: "parse* | parseWireCanonicalId",
    egressPattern: "serializeCanonicalId | to* | normalize*ForWire",
  },
  "tenant-human-reference": {
    id: "tenant-human-reference",
    example: "EMP-000123",
    owner: "Domain / System Admin",
    usedFor: ["admin UX", "tenant-scoped display numbers"],
    kernelModule: "tenant-human-reference/",
    ingressPattern: "parseEmployeeNo | parseCustomerNo | …",
    egressPattern: "normalize*ForWire",
  },
} satisfies Record<IdentityStackLayerId, IdentityStackLayerDefinition>;

export const IDENTITY_STACK_POLICY = {
  pasSection: "4.1.1",
  layerCount: IDENTITY_STACK_LAYER_IDS.length,
  layers: IDENTITY_STACK_LAYER_IDS,
  constitutionalRule:
    "Kernel governs immutable system identity. Tenants govern human administrative numbers. Human numbers are business reference numbers, not canonical Kernel IDs.",
  prohibitedCrossLayerPatterns: [
    "tenant human reference in parseTenantId",
    "canonical enterprise ID in parseInternalEntityPk",
    "uuid wire string in parseCustomerId",
    "human reference in ID_FAMILIES",
    "enterprise_id as PostgreSQL primary key",
  ] as const,
} as const;

export type IdentityStackProhibitedCrossLayerPattern =
  (typeof IDENTITY_STACK_POLICY.prohibitedCrossLayerPatterns)[number];

export function isIdentityStackLayerId(
  value: string
): value is IdentityStackLayerId {
  return (IDENTITY_STACK_LAYER_IDS as readonly string[]).includes(value);
}

export function getIdentityStackLayer(
  layerId: IdentityStackLayerId
): IdentityStackLayerDefinition {
  return IDENTITY_STACK_LAYERS[layerId];
}
