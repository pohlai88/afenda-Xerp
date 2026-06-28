import { existsSync } from "node:fs";
import { join } from "node:path";

import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { getKernelEvidencePaths as getKernelPathsFromTypedEvidence } from "./knowledge-evidence-paths.policy.js";

/** Repo-relative prefix for kernel wire evidence paths cited by atoms. */
export const KERNEL_EVIDENCE_PATH_PREFIX = "packages/kernel/src/" as const;

export function isKernelEvidencePath(path: string): boolean {
  return path.startsWith(KERNEL_EVIDENCE_PATH_PREFIX);
}

/** PAS-004A §4.2 — parsers are kernel-internal; atoms must not cite them. */
export function isProhibitedKernelEvidencePath(path: string): boolean {
  return path.endsWith(".parser.ts");
}

export function getKernelEvidencePaths(atom: KnowledgeAtom): readonly string[] {
  return getKernelPathsFromTypedEvidence(atom);
}

export interface ValidateKnowledgeKernelMappingOptions {
  readonly fileExists?: (absolutePath: string) => boolean;
  readonly repoRoot: string;
}

/**
 * PAS-004A §4.2 / B26 — validate kernel evidence paths for mapped atoms.
 */
export function validateKnowledgeKernelMapping(
  atoms: readonly KnowledgeAtom[],
  options: ValidateKnowledgeKernelMappingOptions
): readonly string[] {
  const fileExists = options.fileExists ?? ((path) => existsSync(path));
  const errors: string[] = [];

  for (const atom of atoms) {
    for (const entry of atom.typedEvidence) {
      if (isProhibitedKernelEvidencePath(entry.source)) {
        errors.push(
          `${atom.atomId}: evidence must not reference kernel parser: ${entry.source}`
        );
      }
    }

    if (!atom.implementationMapping) {
      continue;
    }

    const kernelPaths = getKernelEvidencePaths(atom);
    if (kernelPaths.length === 0) {
      errors.push(
        `${atom.atomId}: implementationMapping requires at least one kernel evidence path under ${KERNEL_EVIDENCE_PATH_PREFIX}`
      );
      continue;
    }

    const hasContractPath = kernelPaths.some((path) =>
      path.endsWith(".contract.ts")
    );
    if (!hasContractPath) {
      errors.push(
        `${atom.atomId}: implementationMapping requires at least one *.contract.ts kernel evidence path`
      );
    }

    for (const relPath of kernelPaths) {
      const absolutePath = join(options.repoRoot, relPath);
      if (!fileExists(absolutePath)) {
        errors.push(
          `${atom.atomId}: kernel evidence path does not exist: ${relPath}`
        );
      }
    }
  }

  return errors;
}
