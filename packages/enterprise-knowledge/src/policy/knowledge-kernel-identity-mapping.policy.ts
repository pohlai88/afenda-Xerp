import { existsSync } from "node:fs";
import { join } from "node:path";

import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { getKernelEvidencePaths } from "./knowledge-evidence-paths.policy.js";
import { KERNEL_EVIDENCE_PATH_PREFIX } from "./knowledge-kernel-mapping.policy.js";

/** Platform identity atoms governed by PAS-004B §4.1 / ADR-0021. */
export const PLATFORM_IDENTITY_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
  "workspace",
  "surface",
] as const;

export type PlatformIdentityAtomId =
  (typeof PLATFORM_IDENTITY_ATOM_IDS)[number];

/** Repo-relative prefix for kernel identity constitution modules. */
export const KERNEL_IDENTITY_PATH_PREFIX =
  "packages/kernel/src/identity/" as const;

/**
 * ADR-0021 tenant-hierarchy branded ID families — shared identity evidence for
 * tenant, legal entity, and organization unit atoms.
 */
export const TENANT_HIERARCHY_IDENTITY_CONTRACT_PATH =
  "packages/kernel/src/identity/families/tenant-hierarchy-id.contract.ts" as const;

/**
 * Platform entity registry kernel contract paths
 * (`packages/kernel/src/contracts/platform/platform-entity-authority.contract.ts`).
 */
export const PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS = {
  tenant: "packages/kernel/src/context/tenant-context.contract.ts",
  legal_entity: "packages/kernel/src/context/legal-entity-context.contract.ts",
  organization_unit:
    "packages/kernel/src/context/organization-unit-context.contract.ts",
  workspace: "packages/kernel/src/context/workspace-context.contract.ts",
  surface: "packages/kernel/src/context/surface-context.contract.ts",
} as const satisfies Record<PlatformIdentityAtomId, string>;

/** ADR-0021 branded ID names required on implementationMapping for hierarchy atoms. */
export const REQUIRED_IDENTITY_BRANDED_IDS = {
  tenant: "TenantId",
  legal_entity: "CompanyId",
  organization_unit: "OrganizationId",
} as const satisfies Partial<Record<PlatformIdentityAtomId, string>>;

export function isPlatformIdentityAtomId(
  atomId: string
): atomId is PlatformIdentityAtomId {
  return (PLATFORM_IDENTITY_ATOM_IDS as readonly string[]).includes(atomId);
}

/** PAS-004B §4.1 — extends B26 parser prohibition with assert modules. */
export function isProhibitedIdentityKernelEvidencePath(path: string): boolean {
  return path.endsWith(".parser.ts") || path.endsWith(".assert.ts");
}

export function isIdentityConstitutionEvidencePath(path: string): boolean {
  if (!path.endsWith(".contract.ts")) {
    return false;
  }
  if (path.startsWith(KERNEL_IDENTITY_PATH_PREFIX)) {
    return true;
  }
  return (
    Object.values(PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS) as readonly string[]
  ).includes(path);
}

export interface ValidateKnowledgeKernelIdentityMappingOptions {
  readonly fileExists?: (absolutePath: string) => boolean;
  readonly repoRoot: string;
}

function collectProhibitedEvidenceErrors(atom: KnowledgeAtom): string[] {
  const errors: string[] = [];

  for (const entry of atom.typedEvidence) {
    if (isProhibitedIdentityKernelEvidencePath(entry.source)) {
      errors.push(
        `${atom.atomId}: evidence must not reference kernel parser or assert: ${entry.source}`
      );
    }
  }

  return errors;
}

function collectImplementationMappingErrors(
  atom: KnowledgeAtom,
  options: ValidateKnowledgeKernelIdentityMappingOptions,
  fileExists: (absolutePath: string) => boolean
): string[] {
  if (!atom.implementationMapping) {
    return [
      `${atom.atomId}: platform identity atom requires implementationMapping`,
    ];
  }

  const errors: string[] = [];
  const mapping = atom.implementationMapping;
  const expectedContractPath =
    PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS[
      atom.atomId as PlatformIdentityAtomId
    ];

  if (!mapping.contractPath) {
    errors.push(
      `${atom.atomId}: implementationMapping.contractPath is required for platform identity atoms`
    );
    return errors;
  }

  if (isProhibitedIdentityKernelEvidencePath(mapping.contractPath)) {
    errors.push(
      `${atom.atomId}: implementationMapping.contractPath must not reference parser or assert modules`
    );
  }
  if (!mapping.contractPath.endsWith(".contract.ts")) {
    errors.push(
      `${atom.atomId}: implementationMapping.contractPath must end with .contract.ts`
    );
  }
  if (mapping.contractPath !== expectedContractPath) {
    errors.push(
      `${atom.atomId}: implementationMapping.contractPath must match platform entity registry path ${expectedContractPath}`
    );
  }
  if (!fileExists(join(options.repoRoot, mapping.contractPath))) {
    errors.push(
      `${atom.atomId}: implementationMapping.contractPath does not exist: ${mapping.contractPath}`
    );
  }

  const requiredBrandedId =
    REQUIRED_IDENTITY_BRANDED_IDS[
      atom.atomId as keyof typeof REQUIRED_IDENTITY_BRANDED_IDS
    ];
  if (
    requiredBrandedId !== undefined &&
    mapping.brandedId !== requiredBrandedId
  ) {
    errors.push(
      `${atom.atomId}: implementationMapping.brandedId must be ${requiredBrandedId}`
    );
  }

  return errors;
}

function collectKernelEvidenceErrors(
  atom: KnowledgeAtom,
  options: ValidateKnowledgeKernelIdentityMappingOptions,
  fileExists: (absolutePath: string) => boolean
): string[] {
  const errors: string[] = [];
  const kernelPaths = getKernelEvidencePaths(atom);

  if (kernelPaths.length === 0) {
    return [
      `${atom.atomId}: requires at least one kernel evidence path under ${KERNEL_EVIDENCE_PATH_PREFIX}`,
    ];
  }

  const identityPaths = kernelPaths.filter(isIdentityConstitutionEvidencePath);
  if (identityPaths.length === 0) {
    errors.push(
      `${atom.atomId}: requires at least one identity constitution kernel evidence path (packages/kernel/src/identity/** or platform entity registry contract)`
    );
  }

  const requiredBrandedId =
    REQUIRED_IDENTITY_BRANDED_IDS[
      atom.atomId as keyof typeof REQUIRED_IDENTITY_BRANDED_IDS
    ];
  if (
    requiredBrandedId !== undefined &&
    !kernelPaths.includes(TENANT_HIERARCHY_IDENTITY_CONTRACT_PATH)
  ) {
    errors.push(
      `${atom.atomId}: requires tenant-hierarchy identity evidence path ${TENANT_HIERARCHY_IDENTITY_CONTRACT_PATH}`
    );
  }

  for (const relPath of kernelPaths) {
    if (!relPath.startsWith(KERNEL_EVIDENCE_PATH_PREFIX)) {
      continue;
    }
    if (!fileExists(join(options.repoRoot, relPath))) {
      errors.push(
        `${atom.atomId}: kernel evidence path does not exist: ${relPath}`
      );
    }
  }

  return errors;
}

function validatePlatformIdentityAtom(
  atom: KnowledgeAtom,
  options: ValidateKnowledgeKernelIdentityMappingOptions,
  fileExists: (absolutePath: string) => boolean
): string[] {
  const errors = collectProhibitedEvidenceErrors(atom);
  errors.push(...collectImplementationMappingErrors(atom, options, fileExists));

  if (!atom.implementationMapping) {
    return errors;
  }

  errors.push(...collectKernelEvidenceErrors(atom, options, fileExists));
  return errors;
}

/**
 * PAS-004B §4.1 / B33 — validate platform identity atom kernel mapping against
 * ADR-0021 identity constitution surfaces.
 */
export function validateKnowledgeKernelIdentityMapping(
  atoms: readonly KnowledgeAtom[],
  options: ValidateKnowledgeKernelIdentityMappingOptions
): readonly string[] {
  const fileExists = options.fileExists ?? ((path) => existsSync(path));
  const errors: string[] = [];

  for (const atom of atoms) {
    if (!isPlatformIdentityAtomId(atom.atomId)) {
      continue;
    }
    errors.push(...validatePlatformIdentityAtom(atom, options, fileExists));
  }

  return errors;
}
