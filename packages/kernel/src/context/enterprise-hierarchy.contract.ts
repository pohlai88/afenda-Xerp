/**
 * Canonical enterprise authority hierarchy — do not collapse tiers into a generic organization.
 *
 * @see docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md — Enterprise group hierarchy
 * @see docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md
 */

export const ENTERPRISE_HIERARCHY_TIERS = [
  "tenant",
  "entity_group",
  "legal_entity",
  "ownership_interest",
  "organization_unit",
  "team",
  "project",
  "workspace",
  "surface",
  "workflow",
] as const;

export type EnterpriseHierarchyTier =
  (typeof ENTERPRISE_HIERARCHY_TIERS)[number];

/** Whether a tier is persisted in Postgres or derived at runtime. */
export type EnterpriseHierarchyPersistence = "persisted" | "derived";

export interface EnterpriseHierarchyTierDefinition {
  readonly persistence: EnterpriseHierarchyPersistence;
  readonly tier: EnterpriseHierarchyTier;
}

export const ENTERPRISE_HIERARCHY_TIER_DEFINITIONS = {
  tenant: {
    tier: "tenant",
    persistence: "persisted",
  },
  entity_group: {
    tier: "entity_group",
    persistence: "persisted",
  },
  legal_entity: {
    tier: "legal_entity",
    persistence: "persisted",
  },
  ownership_interest: {
    tier: "ownership_interest",
    persistence: "persisted",
  },
  organization_unit: {
    tier: "organization_unit",
    persistence: "persisted",
  },
  team: {
    tier: "team",
    persistence: "persisted",
  },
  project: {
    tier: "project",
    persistence: "persisted",
  },
  workspace: {
    tier: "workspace",
    persistence: "derived",
  },
  surface: {
    tier: "surface",
    persistence: "derived",
  },
  workflow: {
    tier: "workflow",
    persistence: "derived",
  },
} as const satisfies Record<
  EnterpriseHierarchyTier,
  EnterpriseHierarchyTierDefinition
>;

export function isEnterpriseHierarchyTier(
  value: string
): value is EnterpriseHierarchyTier {
  return (ENTERPRISE_HIERARCHY_TIERS as readonly string[]).includes(value);
}

export function compareEnterpriseHierarchyTierOrder(
  left: EnterpriseHierarchyTier,
  right: EnterpriseHierarchyTier
): number {
  return (
    ENTERPRISE_HIERARCHY_TIERS.indexOf(left) -
    ENTERPRISE_HIERARCHY_TIERS.indexOf(right)
  );
}
