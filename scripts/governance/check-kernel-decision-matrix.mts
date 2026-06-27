#!/usr/bin/env tsx
/**
 * PAS-001 §7 — kernel decision matrix registry gate.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KERNEL_DECISION_MATRIX_ROW_IDS,
  type KernelDecisionMatrixBelongsInKernel,
  listKernelDecisionMatrixRows,
} from "../../packages/kernel/src/governance/kernel-decision-matrix.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const pasPath = join(repoRoot, "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md");

interface PasDecisionMatrixRow {
  belongsInKernel: KernelDecisionMatrixBelongsInKernel;
  question: string;
  yesOutcome: string;
}

function stripMarkdownBackticks(value: string): string {
  return value.replace(/`/g, "").trim();
}

function normalizeBelongsInKernel(
  value: string
): KernelDecisionMatrixBelongsInKernel {
  const normalized = value.trim();

  if (normalized === "Yes") {
    return true;
  }

  if (normalized === "No") {
    return false;
  }

  if (normalized === "Yes, as ID only") {
    return "id-only";
  }

  throw new Error(`Unexpected PAS §7 belongs-in-kernel value: "${normalized}"`);
}

function parseMarkdownTableRow(line: string): string[] | null {
  const trimmed = line.trim();

  if (!(trimmed.startsWith("|") && trimmed.endsWith("|"))) {
    return null;
  }

  const cells = trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());

  if (cells.length !== 3) {
    return null;
  }

  return cells;
}

function isTableSeparator(cells: string[]): boolean {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function extractPasSection7Rows(source: string): PasDecisionMatrixRow[] {
  const sectionStart = source.indexOf("# 7. Decision Matrix");
  const sectionEnd = source.indexOf("# 8. Permission Model Standard");

  if (sectionStart === -1 || sectionEnd === -1 || sectionEnd <= sectionStart) {
    throw new Error("Could not locate PAS §7 boundaries in PAS-001.");
  }

  const section = source.slice(sectionStart, sectionEnd);
  const rows: PasDecisionMatrixRow[] = [];

  for (const line of section.split("\n")) {
    const cells = parseMarkdownTableRow(line);

    if (!cells || isTableSeparator(cells)) {
      continue;
    }

    if (cells[0] === "Question") {
      continue;
    }

    rows.push({
      question: cells[0],
      yesOutcome: stripMarkdownBackticks(cells[1]),
      belongsInKernel: normalizeBelongsInKernel(cells[2]),
    });
  }

  return rows;
}

const pasRows = extractPasSection7Rows(readFileSync(pasPath, "utf8"));
const registryRows = listKernelDecisionMatrixRows();

if (pasRows.length !== KERNEL_DECISION_MATRIX_ROW_IDS.length) {
  console.error(
    "Kernel decision matrix gate failed: registry/PAS count mismatch."
  );
  console.error(`  PAS §7 rows: ${pasRows.length}`);
  console.error(`  Registry ids: ${KERNEL_DECISION_MATRIX_ROW_IDS.length}`);
  process.exit(1);
}

for (let index = 0; index < pasRows.length; index += 1) {
  const pasRow = pasRows[index];
  const registryRow = registryRows[index];

  if (pasRow.question !== registryRow.question) {
    console.error("Kernel decision matrix gate failed: question drift.");
    console.error(
      `  index ${index}: PAS="${pasRow.question}" registry="${registryRow.question}"`
    );
    process.exit(1);
  }

  if (pasRow.yesOutcome !== registryRow.yesOutcome) {
    console.error("Kernel decision matrix gate failed: yesOutcome drift.");
    console.error(
      `  index ${index}: PAS="${pasRow.yesOutcome}" registry="${registryRow.yesOutcome}"`
    );
    process.exit(1);
  }

  if (pasRow.belongsInKernel !== registryRow.belongsInKernel) {
    console.error("Kernel decision matrix gate failed: belongsInKernel drift.");
    console.error(
      `  index ${index}: PAS="${String(pasRow.belongsInKernel)}" registry="${String(registryRow.belongsInKernel)}"`
    );
    process.exit(1);
  }
}

console.log("Kernel decision matrix gate passed (PAS-001 §7).");
