#!/usr/bin/env tsx
/**
 * PAS-001 §10 — kernel runtime rules registry gate.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KERNEL_APPROVED_RUNTIME_PRIMITIVES,
  KERNEL_RUNTIME_RULE_IDS,
  listKernelRuntimeRules,
} from "../../packages/kernel/src/governance/kernel-runtime-rules.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const contractPath = join(
  repoRoot,
  "packages/kernel/src/governance/kernel-runtime-rules.contract.ts"
);

import { KERNEL_PAS_VOCABULARY_ARCHIVE } from "./kernel-pas-paths.mts";

const pasPath = join(repoRoot, KERNEL_PAS_VOCABULARY_ARCHIVE);

function extractPasSection10Labels(source: string): string[] {
  const sectionStart = source.indexOf("# 10. Runtime Rules");
  const sectionEnd = source.indexOf("# 11. Implementation Sequence");

  if (sectionStart === -1 || sectionEnd === -1 || sectionEnd <= sectionStart) {
    throw new Error("Could not locate PAS §10 boundaries in PAS-001.");
  }

  const section = source.slice(sectionStart, sectionEnd);
  const labels: string[] = [];

  for (const line of section.split("\n")) {
    const match = /^\d+\.\s+(.+)\.?\s*$/.exec(line.trim());
    if (match?.[1]) {
      labels.push(match[1].endsWith(".") ? match[1] : `${match[1]}.`);
    }
  }

  return labels;
}

if (!existsSync(contractPath)) {
  console.error("Kernel runtime rules gate failed: contract file missing.");
  process.exit(1);
}

const pasLabels = extractPasSection10Labels(readFileSync(pasPath, "utf8"));
const registryLabels = listKernelRuntimeRules().map((rule) => rule.label);

if (pasLabels.length !== KERNEL_RUNTIME_RULE_IDS.length) {
  console.error(
    "Kernel runtime rules gate failed: registry/PAS count mismatch."
  );
  console.error(`  PAS §10 labels: ${pasLabels.length}`);
  console.error(`  Registry ids: ${KERNEL_RUNTIME_RULE_IDS.length}`);
  process.exit(1);
}

for (let index = 0; index < pasLabels.length; index += 1) {
  const pasLabel = pasLabels[index];
  const registryLabel = registryLabels[index];

  if (pasLabel !== registryLabel) {
    console.error("Kernel runtime rules gate failed: label drift.");
    console.error(
      `  index ${index}: PAS="${pasLabel}" registry="${registryLabel}"`
    );
    process.exit(1);
  }
}

const propagationPrimitive =
  KERNEL_APPROVED_RUNTIME_PRIMITIVES["async-context-propagation"];

for (const evidencePath of propagationPrimitive.evidencePaths) {
  if (!existsSync(join(repoRoot, evidencePath))) {
    console.error(
      `Kernel runtime rules gate failed: missing approved primitive evidence path: ${evidencePath}`
    );
    process.exit(1);
  }
}

const propagationSource = readFileSync(
  join(repoRoot, "packages/kernel/src/propagation/kernel-context.ts"),
  "utf8"
);

for (const api of propagationPrimitive.apiSurface) {
  const method = api.replace("kernelContext.", "");
  if (
    !(
      propagationSource.includes(`${method}<`) ||
      propagationSource.includes(`${method}(`)
    )
  ) {
    console.error(
      `Kernel runtime rules gate failed: approved primitive missing API surface ${api}.`
    );
    process.exit(1);
  }
}

console.log("Kernel runtime rules gate passed (PAS-001 §10).");
