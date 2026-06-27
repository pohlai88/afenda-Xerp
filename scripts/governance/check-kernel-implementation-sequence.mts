#!/usr/bin/env tsx
/**
 * PAS-001 §11 — kernel implementation sequence registry gate.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS,
  KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_PATHS,
  listKernelImplementationSequenceSteps,
} from "../../packages/kernel/src/governance/kernel-implementation-sequence.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const pasPath = join(repoRoot, "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md");
const packageJsonPath = join(repoRoot, "package.json");

function extractPasSection11Deferred(source: string): string[] {
  const sectionStart = source.indexOf("# 11. Implementation Sequence");
  const sectionEnd = source.indexOf("# 12. Enterprise Acceptance Criteria");

  if (sectionStart === -1 || sectionEnd === -1 || sectionEnd <= sectionStart) {
    throw new Error("Could not locate PAS §11 boundaries in PAS-001.");
  }

  const section = source.slice(sectionStart, sectionEnd);
  const deferredStart = section.indexOf("Do not add in kernel:");
  if (deferredStart === -1) {
    throw new Error("Could not locate PAS §11 deferred additions list.");
  }

  const deferredSection = section.slice(deferredStart);
  const labels: string[] = [];

  for (const line of deferredSection.split("\n")) {
    const match = /^\*\s+(.+)\s*$/.exec(line.trim());
    if (!match?.[1]) {
      continue;
    }

    labels.push(match[1].replace(/^`|`$/g, ""));
  }

  return labels;
}

const pasDeferred = extractPasSection11Deferred(readFileSync(pasPath, "utf8"));
const registryDeferred = [...KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS];

if (pasDeferred.length !== registryDeferred.length) {
  console.error(
    `PAS §11 deferred count ${pasDeferred.length} !== registry ${registryDeferred.length}`
  );
  process.exit(1);
}

for (let index = 0; index < pasDeferred.length; index += 1) {
  if (pasDeferred[index] !== registryDeferred[index]) {
    console.error(
      `PAS §11 deferred mismatch at index ${index}: PAS="${pasDeferred[index]}" registry="${registryDeferred[index]}"`
    );
    process.exit(1);
  }
}

for (const step of listKernelImplementationSequenceSteps()) {
  for (const evidencePath of step.evidencePaths) {
    const absolutePath = join(repoRoot, evidencePath);
    if (!existsSync(absolutePath)) {
      console.error(
        `Missing §11 evidence path for step ${step.id}: ${evidencePath}`
      );
      process.exit(1);
    }
  }

  for (const gateScript of step.gateScripts) {
    const packageJson = readFileSync(packageJsonPath, "utf8");
    if (!packageJson.includes(`"${gateScript}"`)) {
      console.error(
        `Missing package.json script for step ${step.id}: ${gateScript}`
      );
      process.exit(1);
    }
  }
}

for (const prohibitedPath of KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_PATHS) {
  const absolutePath = join(repoRoot, prohibitedPath);
  if (existsSync(absolutePath)) {
    console.error(`Prohibited §11 kernel path exists: ${prohibitedPath}`);
    process.exit(1);
  }
}

console.log("Kernel implementation sequence gate passed (PAS-001 §11).");
