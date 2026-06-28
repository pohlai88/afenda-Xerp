import { existsSync } from "node:fs";
import { join } from "node:path";

import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import {
  type KnowledgeRealizationMapping,
  REALIZATION_KINDS,
  type RealizationKind,
} from "../contracts/knowledge-realization.contract.js";
import {
  isPlatformIdentityAtomId,
  isProhibitedIdentityKernelEvidencePath,
  type PLATFORM_IDENTITY_ATOM_IDS,
} from "./knowledge-kernel-identity-mapping.policy.js";
import { KERNEL_EVIDENCE_PATH_PREFIX } from "./knowledge-kernel-mapping.policy.js";

/** Platform identity atoms that must carry explicit realizationMapping in B44 corpus. */
export const REALIZATION_MAPPING_EVIDENCE_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
] as const satisfies readonly (typeof PLATFORM_IDENTITY_ATOM_IDS)[number][];

export function isRealizationKind(value: string): value is RealizationKind {
  return (REALIZATION_KINDS as readonly string[]).includes(value);
}

export function getAtomRealizationMappings(
  atom: KnowledgeAtom
): readonly KnowledgeRealizationMapping[] {
  return atom.realizationMapping ?? [];
}

export function collectRealizationKinds(
  atoms: readonly KnowledgeAtom[]
): ReadonlySet<RealizationKind> {
  const kinds = new Set<RealizationKind>();
  for (const atom of atoms) {
    for (const entry of getAtomRealizationMappings(atom)) {
      kinds.add(entry.realizationKind);
    }
  }
  return kinds;
}

export interface ValidateKnowledgeRealizationMappingOptions {
  readonly fileExists?: (absolutePath: string) => boolean;
  readonly repoRoot: string;
}

function validateKernelRealizationEntry(
  atom: KnowledgeAtom,
  entry: KnowledgeRealizationMapping,
  index: number,
  fileExists: (absolutePath: string) => boolean,
  repoRoot: string
): string[] {
  const errors: string[] = [];
  const prefix = `${atom.atomId}: realizationMapping[${index}]`;

  const contractPath = entry.contractPath ?? entry.reference;
  if (!contractPath.endsWith(".contract.ts")) {
    errors.push(
      `${prefix}: kernel realization must cite a *.contract.ts path (contractPath or reference)`
    );
  }
  if (isProhibitedIdentityKernelEvidencePath(contractPath)) {
    errors.push(
      `${prefix}: kernel realization must not reference parser or assert modules`
    );
  }
  if (!contractPath.startsWith(KERNEL_EVIDENCE_PATH_PREFIX)) {
    errors.push(
      `${prefix}: kernel contractPath must be under ${KERNEL_EVIDENCE_PATH_PREFIX}`
    );
  }
  const absolutePath = join(repoRoot, contractPath);
  if (!fileExists(absolutePath)) {
    errors.push(
      `${prefix}: kernel contractPath does not exist: ${contractPath}`
    );
  }
  return errors;
}

/**
 * PAS-004C §4.4 / B44 — validate realizationMapping entries on atoms.
 */
export function validateKnowledgeRealizationMapping(
  atoms: readonly KnowledgeAtom[],
  options: ValidateKnowledgeRealizationMappingOptions
): readonly string[] {
  const fileExists = options.fileExists ?? ((path) => existsSync(path));
  const errors: string[] = [];

  for (const atom of atoms) {
    const mappings = getAtomRealizationMappings(atom);
    for (let index = 0; index < mappings.length; index++) {
      const entry = mappings[index];
      if (!entry) {
        continue;
      }
      const prefix = `${atom.atomId}: realizationMapping[${index}]`;

      if (!isRealizationKind(entry.realizationKind)) {
        errors.push(
          `${prefix}: invalid realizationKind "${entry.realizationKind}"`
        );
        continue;
      }
      if (entry.reference.length === 0) {
        errors.push(`${prefix}: reference must be non-empty`);
      }

      if (entry.realizationKind === "kernel") {
        errors.push(
          ...validateKernelRealizationEntry(
            atom,
            entry,
            index,
            fileExists,
            options.repoRoot
          )
        );
      }
    }

    if (
      isPlatformIdentityAtomId(atom.atomId) &&
      (REALIZATION_MAPPING_EVIDENCE_ATOM_IDS as readonly string[]).includes(
        atom.atomId
      ) &&
      mappings.length === 0 &&
      !atom.implementationMapping
    ) {
      errors.push(
        `${atom.atomId}: platform identity atom requires realizationMapping or implementationMapping`
      );
    }
  }

  const evidenceAtomsWithMapping = REALIZATION_MAPPING_EVIDENCE_ATOM_IDS.filter(
    (atomId) => {
      const atom = atoms.find((candidate) => candidate.atomId === atomId);
      return atom !== undefined && getAtomRealizationMappings(atom).length > 0;
    }
  );
  if (
    evidenceAtomsWithMapping.length <
    REALIZATION_MAPPING_EVIDENCE_ATOM_IDS.length
  ) {
    errors.push(
      `expected realizationMapping on ${REALIZATION_MAPPING_EVIDENCE_ATOM_IDS.join(", ")}, missing on: ${REALIZATION_MAPPING_EVIDENCE_ATOM_IDS.filter((id) => !evidenceAtomsWithMapping.includes(id)).join(", ")}`
    );
  }

  const kindCount = collectRealizationKinds(atoms).size;
  if (kindCount < 3) {
    errors.push(
      `expected at least 3 distinct realizationKind values in corpus, found ${kindCount}`
    );
  }

  return errors;
}
