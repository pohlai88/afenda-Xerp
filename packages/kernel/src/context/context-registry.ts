/**
 * Canonical operating-context module registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 4 §522–536, Kernel §354–369).
 *
 * Naming (PAS-001 §4.4):
 * - `{layer}-context.contract.ts` — structural operating-context **shape** only
 * - `{scope}-scope-context.contract.ts` — grant/metadata scope slots on `OperatingContext`
 * - `operating-context.contract.ts` — composed operating context root
 * - `lifecycle.contract.ts` — shared lifecycle vocabulary for context shapes
 * - `permission-grant-vocabulary.contract.ts` — grant-scope words (not resolved scope records)
 * - `operating-context-hierarchy.contract.ts` / `enterprise-hierarchy.contract.ts` — layer metadata
 * - `{layer}-context.{contract,assert,parser}.ts` — wire ingress triad (PAS §4.4 rule 14)
 * - `*-resolution.ts` / `*.policy.ts` — derivation or merge **behavior** (owner: apps/erp; must not live here)
 *
 * Not `contracts/` — that folder holds platform wire vocabulary (Result, ExecutionContext).
 * ERP domain words live under `erp-domain/{module}/`. See `KERNEL_SRC_FOLDER_BOUNDARY`.
 */

import type { OperatingContextLayerId } from "./operating-context-hierarchy.contract.js";

/** Step 4 primary contract types (multi-tenancy.md §525–535). */
export const KERNEL_OPERATING_CONTEXT_PRIMARY_TYPES = [
  "TenantContext",
  "EntityGroupContext",
  "LegalEntityContext",
  "OwnershipInterestContext",
  "OrganizationUnitContext",
  "TeamContext",
  "ProjectContext",
  "OperatingContext",
  "PermissionScopeContext",
  "ConsolidationScopeContext",
] as const;

export type KernelOperatingContextPrimaryType =
  (typeof KERNEL_OPERATING_CONTEXT_PRIMARY_TYPES)[number];

/** PAS §4.4 — wire ingress triad for contexts that accept JSON/API input. */
export interface KernelOperatingContextWireIngressModule {
  readonly assert: `${string}-context.assert.ts`;
  readonly contract: `${string}-context.contract.ts`;
  readonly parser: `${string}-context.parser.ts`;
  readonly primaryType:
    | KernelOperatingContextPrimaryType
    | "LocalizationContext";
  /** `required` when the contract is a Step 4 required module; otherwise support-only. */
  readonly registryKind: "required" | "support";
  readonly slug: string;
  readonly wireType: string;
}

export interface KernelOperatingContextRequiredModuleDefinition {
  readonly file:
    | `${string}-context.contract.ts`
    | "operating-context.contract.ts";
  /** Null for the composed `OperatingContext` root — not a single hierarchy layer. */
  readonly layerId: OperatingContextLayerId | null;
  readonly primaryType: KernelOperatingContextPrimaryType;
  readonly wireIngress: boolean;
}

/**
 * Step 4 required operating-context contracts — order matches multi-tenancy hierarchy
 * (tenant → consolidation) and `OPERATING_CONTEXT_LAYER_IDS` structural slots.
 */
export const KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES = [
  {
    file: "tenant-context.contract.ts",
    primaryType: "TenantContext",
    layerId: "tenant",
    wireIngress: true,
  },
  {
    file: "entity-group-context.contract.ts",
    primaryType: "EntityGroupContext",
    layerId: "entity-group",
    wireIngress: true,
  },
  {
    file: "legal-entity-context.contract.ts",
    primaryType: "LegalEntityContext",
    layerId: "legal-entity",
    wireIngress: true,
  },
  {
    file: "ownership-interest-context.contract.ts",
    primaryType: "OwnershipInterestContext",
    layerId: "ownership-interest",
    wireIngress: true,
  },
  {
    file: "organization-unit-context.contract.ts",
    primaryType: "OrganizationUnitContext",
    layerId: "organization-unit",
    wireIngress: true,
  },
  {
    file: "team-context.contract.ts",
    primaryType: "TeamContext",
    layerId: "team",
    wireIngress: true,
  },
  {
    file: "project-context.contract.ts",
    primaryType: "ProjectContext",
    layerId: "project",
    wireIngress: true,
  },
  {
    file: "operating-context.contract.ts",
    primaryType: "OperatingContext",
    layerId: null,
    wireIngress: true,
  },
  {
    file: "permission-scope-context.contract.ts",
    primaryType: "PermissionScopeContext",
    layerId: "permission-scope",
    wireIngress: true,
  },
  {
    file: "consolidation-scope-context.contract.ts",
    primaryType: "ConsolidationScopeContext",
    layerId: "consolidation-scope",
    wireIngress: true,
  },
] as const satisfies readonly KernelOperatingContextRequiredModuleDefinition[];

/**
 * PAS §4.4 wire ingress triads — contract + assert + parser siblings.
 * Synced with `KERNEL_PACKAGE_TARGET_PATHS` context wire modules (§6.2).
 */
export const KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES = [
  {
    slug: "localization",
    contract: "localization-context.contract.ts",
    assert: "localization-context.assert.ts",
    parser: "localization-context.parser.ts",
    primaryType: "LocalizationContext",
    wireType: "WireLocalizationContext",
    registryKind: "support",
  },
  {
    slug: "tenant",
    contract: "tenant-context.contract.ts",
    assert: "tenant-context.assert.ts",
    parser: "tenant-context.parser.ts",
    primaryType: "TenantContext",
    wireType: "TenantWireContext",
    registryKind: "required",
  },
  {
    slug: "entity-group",
    contract: "entity-group-context.contract.ts",
    assert: "entity-group-context.assert.ts",
    parser: "entity-group-context.parser.ts",
    primaryType: "EntityGroupContext",
    wireType: "EntityGroupWireContext",
    registryKind: "required",
  },
  {
    slug: "legal-entity",
    contract: "legal-entity-context.contract.ts",
    assert: "legal-entity-context.assert.ts",
    parser: "legal-entity-context.parser.ts",
    primaryType: "LegalEntityContext",
    wireType: "LegalEntityWireContext",
    registryKind: "required",
  },
  {
    slug: "ownership-interest",
    contract: "ownership-interest-context.contract.ts",
    assert: "ownership-interest-context.assert.ts",
    parser: "ownership-interest-context.parser.ts",
    primaryType: "OwnershipInterestContext",
    wireType: "OwnershipInterestWireContext",
    registryKind: "required",
  },
  {
    slug: "organization-unit",
    contract: "organization-unit-context.contract.ts",
    assert: "organization-unit-context.assert.ts",
    parser: "organization-unit-context.parser.ts",
    primaryType: "OrganizationUnitContext",
    wireType: "OrganizationUnitWireContext",
    registryKind: "required",
  },
  {
    slug: "team",
    contract: "team-context.contract.ts",
    assert: "team-context.assert.ts",
    parser: "team-context.parser.ts",
    primaryType: "TeamContext",
    wireType: "TeamWireContext",
    registryKind: "required",
  },
  {
    slug: "project",
    contract: "project-context.contract.ts",
    assert: "project-context.assert.ts",
    parser: "project-context.parser.ts",
    primaryType: "ProjectContext",
    wireType: "ProjectWireContext",
    registryKind: "required",
  },
  {
    slug: "permission-scope",
    contract: "permission-scope-context.contract.ts",
    assert: "permission-scope-context.assert.ts",
    parser: "permission-scope-context.parser.ts",
    primaryType: "PermissionScopeContext",
    wireType: "PermissionScopeWireContext",
    registryKind: "required",
  },
  {
    slug: "operating-context",
    contract: "operating-context.contract.ts",
    assert: "operating-context.assert.ts",
    parser: "operating-context.parser.ts",
    primaryType: "OperatingContext",
    wireType: "OperatingContextWireContext",
    registryKind: "required",
  },
  {
    slug: "consolidation-scope",
    contract: "consolidation-scope-context.contract.ts",
    assert: "consolidation-scope-context.assert.ts",
    parser: "consolidation-scope-context.parser.ts",
    primaryType: "ConsolidationScopeContext",
    wireType: "ConsolidationScopeWireContext",
    registryKind: "required",
  },
] as const satisfies readonly KernelOperatingContextWireIngressModule[];

/** Supporting contracts exported from the same package surface (non-wire or metadata). */
export const KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES = [
  "lifecycle.contract.ts",
  "workspace-context.contract.ts",
  "surface-context.contract.ts",
  "workflow-context.contract.ts",
  "hierarchy-id-boundary.contract.ts",
  "localization-context.contract.ts",
  "localization-context.assert.ts",
  "localization-context.parser.ts",
  "tenant-context.assert.ts",
  "tenant-context.parser.ts",
  "entity-group-context.assert.ts",
  "entity-group-context.parser.ts",
  "organization-unit-context.assert.ts",
  "organization-unit-context.parser.ts",
  "team-context.assert.ts",
  "team-context.parser.ts",
  "project-context.assert.ts",
  "project-context.parser.ts",
  "permission-scope-context.assert.ts",
  "permission-scope-context.parser.ts",
  "operating-context.assert.ts",
  "operating-context.parser.ts",
  "legal-entity-context.assert.ts",
  "legal-entity-context.parser.ts",
  "ownership-interest-context.assert.ts",
  "ownership-interest-context.parser.ts",
  "consolidation-scope-context.assert.ts",
  "consolidation-scope-context.parser.ts",
  "operating-context-hierarchy.contract.ts",
  "permission-grant-vocabulary.contract.ts",
  "enterprise-hierarchy.contract.ts",
] as const;

export type KernelOperatingContextRequiredModule =
  (typeof KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES)[number]["file"];

export type KernelOperatingContextWireIngressSlug =
  (typeof KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES)[number]["slug"];

/** Flattened repo-relative filenames for governance gates and filesystem audits. */
export function listKernelOperatingContextModuleFiles(): readonly string[] {
  const files = new Set<string>([
    "context-registry.ts",
    "index.ts",
    ...KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  ]);

  for (const entry of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
    files.add(entry.file);
  }

  for (const triad of KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES) {
    files.add(triad.contract);
    files.add(triad.assert);
    files.add(triad.parser);
  }

  return [...files].sort();
}

/** Wire triad filenames only — used by structure gates. */
export function listKernelOperatingContextWireIngressFiles(): readonly string[] {
  const files: string[] = [];

  for (const triad of KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES) {
    files.push(triad.contract, triad.assert, triad.parser);
  }

  return files.sort();
}
