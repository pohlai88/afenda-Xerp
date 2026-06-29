/**
 * PAS-004D §4.5 — B53: ERP-domain meaning bridge validation policy.
 *
 * Validates Knowledge Atoms that pair PAS-001B wire vocabulary slugs with
 * kernel erp-domain contract paths and KV-* module identifiers (KV-INV, KV-PROC).
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { isProhibitedKernelEvidencePath } from "./knowledge-kernel-mapping.policy.js";
import { getAtomRealizationMappings } from "./knowledge-realization.policy.js";

/** Minimum B53 bridge atom IDs per PAS-004D §4.5. */
export const B53_ERP_DOMAIN_BRIDGE_ATOM_IDS = [
  "inventory_item",
  "procurement_requisition",
] as const;

export type B53ErpDomainBridgeAtomId =
  (typeof B53_ERP_DOMAIN_BRIDGE_ATOM_IDS)[number];

export const B53_ERP_DOMAIN_KV_ID_BY_ATOM = {
  inventory_item: "KV-INV",
  procurement_requisition: "KV-PROC",
} as const satisfies Record<B53ErpDomainBridgeAtomId, string>;

export const B53_ERP_DOMAIN_KERNEL_CONTRACT_BY_ATOM = {
  inventory_item:
    "packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts",
  procurement_requisition:
    "packages/kernel/src/erp-domain/procurement/procurement-authority.contract.ts",
} as const satisfies Record<B53ErpDomainBridgeAtomId, string>;

export const B53_ERP_DOMAIN_PATH_PREFIX =
  "packages/kernel/src/erp-domain/" as const;

export const KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE =
  "knowledge-erp-domain-bridge-kv-pairs-slug-to-kernel-contract" as const;

export interface ValidateKnowledgeErpDomainBridgeOptions {
  readonly fileExists?: (absolutePath: string) => boolean;
  readonly repoRoot: string;
}

function realizationEntryPath(entry: {
  readonly contractPath?: string;
  readonly reference: string;
}): string {
  return entry.contractPath ?? entry.reference;
}

function atomCitesKvId(atom: KnowledgeAtom, kvId: string): boolean {
  const mappings = getAtomRealizationMappings(atom);
  for (const entry of mappings) {
    if (entry.realizationKind !== "kernel") {
      continue;
    }
    if (entry.notes?.includes(kvId)) {
      return true;
    }
  }
  return false;
}

/**
 * PAS-004D B53 — validate ERP-domain meaning bridge atoms in the corpus.
 */
export function validateKnowledgeErpDomainBridge(
  atoms: readonly KnowledgeAtom[],
  options: ValidateKnowledgeErpDomainBridgeOptions
): readonly string[] {
  const fileExists = options.fileExists ?? ((path) => existsSync(path));
  const errors: string[] = [];
  const atomById = new Map(atoms.map((atom) => [atom.atomId, atom]));

  for (const atomId of B53_ERP_DOMAIN_BRIDGE_ATOM_IDS) {
    const atom = atomById.get(atomId);
    if (!atom) {
      errors.push(`B53 bridge atom "${atomId}" is missing from corpus`);
      continue;
    }

    const expectedKvId =
      B53_ERP_DOMAIN_KV_ID_BY_ATOM[atomId as B53ErpDomainBridgeAtomId];
    const expectedContract =
      B53_ERP_DOMAIN_KERNEL_CONTRACT_BY_ATOM[
        atomId as B53ErpDomainBridgeAtomId
      ];

    const kernelMappings = getAtomRealizationMappings(atom).filter(
      (entry) => entry.realizationKind === "kernel"
    );
    if (kernelMappings.length === 0) {
      errors.push(
        `${atomId}: B53 bridge atom requires kernel realizationMapping`
      );
      continue;
    }

    const hasErpDomainPath = kernelMappings.some((entry) => {
      const path = realizationEntryPath(entry);
      return path.startsWith(B53_ERP_DOMAIN_PATH_PREFIX);
    });
    if (!hasErpDomainPath) {
      errors.push(
        `${atomId}: kernel realizationMapping must cite path under ${B53_ERP_DOMAIN_PATH_PREFIX}`
      );
    }

    if (!atomCitesKvId(atom, expectedKvId)) {
      errors.push(
        `${atomId}: must cite ${expectedKvId} in kernel realizationMapping notes (PAS-001B KV pairing — not slug-only)`
      );
    }

    for (const entry of kernelMappings) {
      const path = realizationEntryPath(entry);
      if (isProhibitedKernelEvidencePath(path)) {
        errors.push(`${atomId}: must not reference parser path: ${path}`);
      }
      if (!path.endsWith(".contract.ts")) {
        errors.push(
          `${atomId}: B53 bridge must cite *.contract.ts paths only, not: ${path}`
        );
      }
      if (!fileExists(join(options.repoRoot, path))) {
        errors.push(`${atomId}: cited contract path does not exist: ${path}`);
      }
    }

    if (!fileExists(join(options.repoRoot, expectedContract))) {
      errors.push(
        `${atomId}: expected kernel contract missing on disk: ${expectedContract}`
      );
    }
  }

  return errors;
}

export function formatKnowledgeErpDomainBridgeErrors(
  errors: readonly string[]
): string {
  if (errors.length === 0) {
    return "knowledge-erp-domain-bridge: PASS";
  }

  const lines = ["knowledge-erp-domain-bridge: FAIL"];
  for (const error of errors) {
    lines.push(`  - ${error}`);
  }
  return lines.join("\n");
}
