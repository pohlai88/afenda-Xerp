#!/usr/bin/env tsx
/**
 * PAS-001 audit — kernel slice catalog ↔ status index ↔ on-disk handoff consistency.
 *
 * Prevents ghost slices (catalog Delivered without handoff file) and orphan handoffs.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const sliceDir = join(repoRoot, "docs/PAS/KERNEL/SLICE");
const statusIndexPath = join(repoRoot, "docs/PAS/pas-status-index.md");
const pas001Path = join(
  repoRoot,
  "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md"
);

export interface KernelSliceCatalogConsistencyViolation {
  readonly message: string;
  readonly rule: string;
}

const HANDOFF_LINK_PATTERN =
  /\]\(\.\/(b\d+[^)]*\.md|pas-001a-r1[^)]*\.md|pas-001a-r2[^)]*\.md|pas-001a-api-binding-s[^)]*\.md|erp-mod-fdn-[^)]*\.md|pas-001-aud-[^)]*\.md)\)/g;

const REMAINING_SLICES_NONE_PATTERN =
  /\|\s*\*\*Remaining slices\*\*\s*\|\s*none/i;

const DELIVERED_B_SLICE_COUNT = 56;
const R1_SLICE_COUNT = 4;

function extractHandoffLinks(source: string): string[] {
  const links: string[] = [];
  for (const match of source.matchAll(HANDOFF_LINK_PATTERN)) {
    const file = match[1];
    if (file) {
      links.push(file);
    }
  }
  return links;
}

function listIndexedHandoffFilesOnDisk(): string[] {
  return readdirSync(sliceDir).filter(
    (entry) =>
      (/^b\d+.*\.md$/i.test(entry) ||
        /^pas-001a-r1.*\.md$/i.test(entry) ||
        /^pas-001a-r2.*\.md$/i.test(entry) ||
        /^pas-001a-api-binding-s\d.*\.md$/i.test(entry) ||
        /^erp-mod-fdn-.*\.md$/i.test(entry) ||
        /^pas-001-aud-.*\.md$/i.test(entry)) &&
      entry !== "kernel-slice-catalog.md" &&
      entry !== "pas-001a-api-binding-slice-catalog.md" &&
      entry !== "pas-001a-api-binding-slice-track.md" &&
      entry !== "slice-compliance-audit.md"
  );
}

function isB112ErpConsumerHandoff(fileName: string): boolean {
  return /^b112-erp-/i.test(fileName);
}

function sliceIdFromFileName(fileName: string): string | null {
  if (isB112ErpConsumerHandoff(fileName)) {
    return null;
  }
  const match = fileName.match(/^(b\d+)/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export function checkKernelSliceCatalogConsistency(): KernelSliceCatalogConsistencyViolation[] {
  const violations: KernelSliceCatalogConsistencyViolation[] = [];

  const catalogPath = join(sliceDir, "kernel-slice-catalog.md");
  const readmePath = join(sliceDir, "README.md");

  const catalogSource = existsSync(catalogPath)
    ? readFileSync(catalogPath, "utf8")
    : "";
  const readmeSource = existsSync(readmePath)
    ? readFileSync(readmePath, "utf8")
    : "";

  const linkedHandoffs = new Set([
    ...extractHandoffLinks(catalogSource),
    ...extractHandoffLinks(readmeSource),
  ]);

  for (const handoff of linkedHandoffs) {
    const absolutePath = join(sliceDir, handoff);
    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "ghost-slice-handoff-missing",
        message: `Catalog links missing handoff file: ${handoff}`,
      });
    }
  }

  const onDisk = listIndexedHandoffFilesOnDisk();
  const onDiskSet = new Set(onDisk);

  for (const file of onDisk) {
    if (!linkedHandoffs.has(file)) {
      violations.push({
        rule: "orphan-handoff-not-in-catalog",
        message: `On-disk handoff not indexed in kernel-slice-catalog.md or README.md: ${file}`,
      });
    }
  }

  const bIds = new Map<string, string>();
  for (const file of onDisk.filter((entry) => /^b\d+/i.test(entry))) {
    const sliceId = sliceIdFromFileName(file);
    if (!sliceId) {
      continue;
    }
    const prior = bIds.get(sliceId);
    if (prior) {
      violations.push({
        rule: "duplicate-b-slice-id",
        message: `Duplicate slice id ${sliceId}: ${prior} and ${file}`,
      });
    } else {
      bIds.set(sliceId, file);
    }
  }

  const deliveredBCount = onDisk.filter((entry) => /^b\d+/i.test(entry)).length;

  const r1Count = onDisk.filter((entry) => /^pas-001a-r1/i.test(entry)).length;

  if (deliveredBCount !== DELIVERED_B_SLICE_COUNT) {
    violations.push({
      rule: "b-slice-count-mismatch",
      message: `Expected ${DELIVERED_B_SLICE_COUNT} delivered b*.md handoffs on disk, found ${deliveredBCount}`,
    });
  }

  if (r1Count !== R1_SLICE_COUNT) {
    violations.push({
      rule: "r1-slice-count-mismatch",
      message: `Expected ${R1_SLICE_COUNT} pas-001a-r1*.md handoffs on disk, found ${r1Count}`,
    });
  }

  const deliveredLinkedCount = [...linkedHandoffs].filter((entry) =>
    /^b\d+/i.test(entry)
  ).length;

  if (
    deliveredLinkedCount + R1_SLICE_COUNT !==
    DELIVERED_B_SLICE_COUNT + R1_SLICE_COUNT
  ) {
    violations.push({
      rule: "catalog-delivered-count-mismatch",
      message: `Catalog must index ${DELIVERED_B_SLICE_COUNT + R1_SLICE_COUNT} delivered handoffs (${DELIVERED_B_SLICE_COUNT} b + ${R1_SLICE_COUNT} R1); found ${deliveredLinkedCount + r1Count} indexed delivered entries`,
    });
  }

  if (existsSync(pas001Path)) {
    const pas001Source = readFileSync(pas001Path, "utf8");
    if (!REMAINING_SLICES_NONE_PATTERN.test(pas001Source)) {
      violations.push({
        rule: "pas001-remaining-slices-not-none",
        message:
          "PAS-001 must declare Remaining slices: none when vocabulary track is closed",
      });
    }
    if (/Remaining slices.*B112/i.test(pas001Source)) {
      violations.push({
        rule: "pas001-open-planned-as-remaining",
        message:
          "Planned B112 must not appear as an open Remaining slice — use Planned amendments table",
      });
    }
  }

  if (existsSync(statusIndexPath)) {
    const statusSource = readFileSync(statusIndexPath, "utf8");
    const pas001Section = statusSource.match(
      /## PAS-001 Kernel Authority[\s\S]*?(?=## PAS-001A|$)/
    )?.[0];

    if (pas001Section && !REMAINING_SLICES_NONE_PATTERN.test(pas001Section)) {
      violations.push({
        rule: "status-index-pas001-open-slices",
        message:
          "pas-status-index PAS-001 section must declare Remaining slices: none",
      });
    }
  }

  const complianceAuditPath = join(sliceDir, "slice-compliance-audit.md");
  if (existsSync(complianceAuditPath)) {
    const auditSource = readFileSync(complianceAuditPath, "utf8");
    if (!auditSource.includes("| **Total** | **68** | **68** |")) {
      violations.push({
        rule: "slice-compliance-audit-count-stale",
        message:
          "slice-compliance-audit.md Total row must read 68 | 68 for delivered vocabulary + API-BINDING + PAS-001C handoffs",
      });
    }

    const countSection = auditSource.match(/## Count[\s\S]*?(?=##|$)/)?.[0];
    if (countSection) {
      const trackRows = [
        ...countSection.matchAll(/^\| ([^|*][^|]*) \| (\d+) \| (\d+) \|$/gm),
      ];
      const expectedSum = trackRows.reduce(
        (sum, row) => sum + Number.parseInt(row[2] ?? "0", 10),
        0
      );
      const onDiskSum = trackRows.reduce(
        (sum, row) => sum + Number.parseInt(row[3] ?? "0", 10),
        0
      );
      const totalMatch = countSection.match(
        /\| \*\*Total\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/
      );
      const totalExpected = totalMatch
        ? Number.parseInt(totalMatch[1] ?? "0", 10)
        : null;
      const totalOnDisk = totalMatch
        ? Number.parseInt(totalMatch[2] ?? "0", 10)
        : null;

      if (
        totalExpected !== null &&
        (expectedSum !== totalExpected || onDiskSum !== totalOnDisk)
      ) {
        violations.push({
          rule: "slice-compliance-audit-count-arithmetic",
          message: `slice-compliance-audit.md Count table sums (${expectedSum}|${onDiskSum}) must match Total row (${totalExpected}|${totalOnDisk})`,
        });
      }
    }

    const r3Row = auditSource.match(
      /\| PAS-001A-R3 \|[\s\S]*?\|([^|]+)\|([^|]+)\|/
    );
    if (r3Row && /Planned/i.test(r3Row[1] ?? "")) {
      violations.push({
        rule: "slice-compliance-audit-r3-planned-stale",
        message:
          "slice-compliance-audit.md PAS-001A-R3 Gap/Risk must not say Planned when pas-status-index declares R3 Delivered",
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkKernelSliceCatalogConsistency();

  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(`[${violation.rule}] ${violation.message}\n`);
    }
    process.exit(1);
  }

  process.stdout.write(
    "Kernel slice catalog consistency gate passed (PAS-001 audit / catalog SSOT).\n"
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-kernel-slice-catalog-consistency.mts")
    );
  } catch {
    return entry.endsWith("check-kernel-slice-catalog-consistency.mts");
  }
})();

if (isDirectRun) {
  main();
}
