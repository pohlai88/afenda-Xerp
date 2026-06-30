#!/usr/bin/env tsx
/**
 * PAS-004D B49 — authority mirror sync gate.
 *
 * Ensures PAS headers, enterprise-knowledge SKILL, and pas-status-index stay aligned
 * after PAS-004C closure (58/58) and during PAS-004D operational closure.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EK_ACTIVE_SLICE_ID,
  EK_PAS_PATHS,
  EK_PAS004C_SLICE_HANDOFFS,
  EK_SEMANTIC_SCORECARD,
  EK_SKILL_PATH,
  EK_STALE_ACTIVE_SLICE_IDS,
  KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE,
} from "./knowledge-authority-mirror-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface KnowledgeAuthorityMirrorViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function readText(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function countSliceTableRows(
  section: string,
  tableHeader: string
): Map<string, number> {
  const start = section.indexOf(tableHeader);
  if (start === -1) {
    return new Map();
  }

  const afterHeader = section.slice(start);
  const lines = afterHeader.split("\n");
  const counts = new Map<string, number>();

  for (const line of lines) {
    if (!(line.startsWith("| b") || line.startsWith("| B"))) {
      if (counts.size > 0 && line.trim() === "") {
        break;
      }
      continue;
    }

    const cells = line.split("|").map((cell) => cell.trim());
    const sliceCell = cells[1] ?? "";
    const match = sliceCell.match(/^(b\d+[-\w]*)/i);
    if (!match) {
      continue;
    }

    const key = match[1]!.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

export function checkKnowledgeAuthorityMirror(): KnowledgeAuthorityMirrorViolation[] {
  const violations: KnowledgeAuthorityMirrorViolation[] = [];

  const skill = readText(EK_SKILL_PATH);
  const pas004 = readText(EK_PAS_PATHS.pas004);
  const pas004b = readText(EK_PAS_PATHS.pas004b);
  const pas004c = readText(EK_PAS_PATHS.pas004c);
  const pas004d = readText(EK_PAS_PATHS.pas004d);
  const statusIndex = readText(EK_PAS_PATHS.pasStatusIndex);

  if (!skill.includes(EK_SEMANTIC_SCORECARD)) {
    violations.push({
      file: EK_SKILL_PATH,
      message: `SKILL mirror must cite semantic scorecard ${EK_SEMANTIC_SCORECARD}`,
      rule: "skill-scorecard-mirror",
    });
  }

  for (const stale of EK_STALE_ACTIVE_SLICE_IDS) {
    if (skill.includes(stale)) {
      violations.push({
        file: EK_SKILL_PATH,
        message: `SKILL must not cite stale active slice marker: ${stale}`,
        rule: "skill-stale-active-slice",
      });
    }
  }

  if (!skill.includes(`Active slice: ${EK_ACTIVE_SLICE_ID}`)) {
    violations.push({
      file: EK_SKILL_PATH,
      message: `SKILL must declare active slice ${EK_ACTIVE_SLICE_ID} during PAS-004D mirror sync`,
      rule: "skill-active-slice-pointer",
    });
  }

  if (
    !(
      pas004.includes("**Runtime truth:**") &&
      pas004.includes("PAS-004C") &&
      pas004.includes("PAS-004D")
    )
  ) {
    violations.push({
      file: EK_PAS_PATHS.pas004,
      message:
        "PAS-004 header blockquote must point agents to PAS-004C/D for live runtime truth",
      rule: "pas004-runtime-truth-blockquote",
    });
  }

  if (!(pas004.includes("PAS-004C") && pas004.includes("PAS-004D"))) {
    violations.push({
      file: EK_PAS_PATHS.pas004,
      message: "PAS-004 runtime_status must reference PAS-004C and PAS-004D",
      rule: "pas004-runtime-status-pointer",
    });
  }

  if (!pas004c.includes("none — operational closure in")) {
    violations.push({
      file: EK_PAS_PATHS.pas004c,
      message:
        "PAS-004C remaining_slices must defer to PAS-004D operational closure",
      rule: "pas004c-remaining-slices-pointer",
    });
  }

  for (const handoff of EK_PAS004C_SLICE_HANDOFFS) {
    if (!pas004c.includes(handoff)) {
      violations.push({
        file: EK_PAS_PATHS.pas004c,
        message: `PAS-004C §17 slice catalog missing ${handoff}`,
        rule: "pas004c-slice-catalog-b47-b48",
      });
    }
  }

  const pas004bSliceCounts = countSliceTableRows(
    pas004b,
    "# 17. Slice Catalog (PAS-004B)"
  );
  for (const [sliceId, count] of pas004bSliceCounts) {
    if (count > 1) {
      violations.push({
        file: EK_PAS_PATHS.pas004b,
        message: `PAS-004B §17 duplicate slice row: ${sliceId} (${count}x)`,
        rule: "pas004b-duplicate-slice-row",
      });
    }
  }

  if (
    !statusIndex.includes(
      "**Next sequence item:** [PAS-004D operational closure"
    )
  ) {
    violations.push({
      file: EK_PAS_PATHS.pasStatusIndex,
      message:
        "pas-status-index PAS-004C section must point Next sequence item to PAS-004D B49",
      rule: "pas-status-index-004c-next-sequence",
    });
  }

  if (!pas004d.includes("check:knowledge-authority-mirror")) {
    violations.push({
      file: EK_PAS_PATHS.pas004d,
      message: "PAS-004D must register check:knowledge-authority-mirror gate",
      rule: "pas004d-gate-registration",
    });
  }

  if (!pas004d.includes("check:knowledge-legacy-surface-retirement")) {
    violations.push({
      file: EK_PAS_PATHS.pas004d,
      message:
        "PAS-004D must register check:knowledge-legacy-surface-retirement gate",
      rule: "pas004d-legacy-gate-registration",
    });
  }

  return violations;
}

export function formatKnowledgeAuthorityMirrorViolations(
  violations: readonly KnowledgeAuthorityMirrorViolation[]
): string {
  if (violations.length === 0) {
    return "knowledge-authority-mirror: PASS";
  }

  const lines = ["knowledge-authority-mirror: FAIL"];
  for (const violation of violations) {
    lines.push(
      `  - [${violation.rule}] ${violation.file}: ${violation.message}`
    );
  }
  return lines.join("\n");
}

function main(): void {
  const violations = checkKnowledgeAuthorityMirror();

  if (violations.length > 0) {
    console.error(formatKnowledgeAuthorityMirrorViolations(violations));
    console.error(`surface-rule: ${KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE}`);
    process.exit(1);
  }

  console.log(formatKnowledgeAuthorityMirrorViolations(violations));
  console.log(`surface-rule: ${KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE}`);
}

main();
