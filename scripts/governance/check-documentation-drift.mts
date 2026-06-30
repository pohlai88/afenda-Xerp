#!/usr/bin/env tsx
/**
 * Documentation drift guard (ADR-0009, PAS authority).
 *
 * Detects obvious stale documentation markers and missing authority index files.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../../packages/architecture-authority/src/index.ts";
import {
  ARCHITECTURE_BASELINE_DOC,
  DOCUMENTATION_DRIFT_SURFACE_RULE,
  DRIFT_AUDIT,
  FINGERPRINT_REQUIRED_DOCS,
  LEGACY_DELIVERY_INDEX_PATTERN,
  LEGACY_DELIVERY_INDEX_SCAN_FILES,
  LEGACY_DELIVERY_PATH_PATTERN,
  LEGACY_DELIVERY_PATH_SCAN_FILES,
  LEGACY_RELATIVE_DELIVERY_PATH_PATTERN,
  MASTER_PLAN,
  MASTER_PLAN_FORBIDDEN_MARKERS,
  MASTER_PLAN_REQUIRED_MARKERS,
  OBSOLETE_BASELINE_FINGERPRINT,
  PAS_ACCOUNTING_STANDARDS_SLICE_DIR,
  PAS_ACCOUNTING_STANDARDS_STANDARD,
  PAS_ENTERPRISE_KNOWLEDGE_SLICE_DIR,
  PAS_ENTERPRISE_KNOWLEDGE_STANDARD,
  PAS_KERNEL_SLICE_DIR,
  PAS_KERNEL_STANDARD,
  PAS_PRESENTATION_README,
  PAS_PRESENTATION_STANDARD,
  PAS_README,
  PAS_STATUS_INDEX,
  PRE_ACCOUNTING_ROADMAP,
  REQUIRED_ACCEPTED_ADRS,
  RUNTIME_TRUTH_MATRIX,
  STALE_DELIVERY_MARKERS,
} from "./documentation-drift-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface DocumentationDriftViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function readText(path: string): string | null {
  const absolute = join(repoRoot, path);
  if (!existsSync(absolute)) {
    return null;
  }

  return readFileSync(absolute, "utf8");
}

function adrIsAccepted(content: string): boolean {
  return /\*\*Status\*\*\s*\|\s*Accepted/i.test(content);
}

function listArchitectureMarkdownFiles(): string[] {
  const root = join(repoRoot, "docs/architecture");
  const files: string[] = [];

  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const absolute = join(dir, name);
      if (statSync(absolute).isDirectory()) {
        walk(absolute);
        continue;
      }

      if (name.endsWith(".md")) {
        files.push(absolute.slice(repoRoot.length + 1).replace(/\\/g, "/"));
      }
    }
  }

  if (existsSync(root)) {
    walk(root);
  }

  return files;
}

export function checkDocumentationDrift(): DocumentationDriftViolation[] {
  const violations: DocumentationDriftViolation[] = [];

  for (const requiredPath of [
    RUNTIME_TRUTH_MATRIX,
    PRE_ACCOUNTING_ROADMAP,
    MASTER_PLAN,
    DRIFT_AUDIT,
    PAS_README,
    PAS_KERNEL_STANDARD,
    PAS_KERNEL_SLICE_DIR,
    PAS_ACCOUNTING_STANDARDS_STANDARD,
    PAS_ACCOUNTING_STANDARDS_SLICE_DIR,
    PAS_PRESENTATION_STANDARD,
    PAS_PRESENTATION_README,
    PAS_ENTERPRISE_KNOWLEDGE_STANDARD,
    PAS_ENTERPRISE_KNOWLEDGE_SLICE_DIR,
    PAS_STATUS_INDEX,
  ]) {
    if (!existsSync(join(repoRoot, requiredPath))) {
      violations.push({
        file: requiredPath,
        message: `Required documentation authority file is missing: ${requiredPath}`,
        rule: "required-authority-file-missing",
      });
    }
  }

  const masterPlan = readText(MASTER_PLAN);
  if (masterPlan) {
    for (const marker of MASTER_PLAN_REQUIRED_MARKERS) {
      if (!masterPlan.includes(marker)) {
        violations.push({
          file: MASTER_PLAN,
          message: `Master plan missing required marker: ${marker}`,
          rule: "master-plan-authority-marker-missing",
        });
      }
    }

    for (const forbidden of MASTER_PLAN_FORBIDDEN_MARKERS) {
      if (masterPlan.includes(forbidden) && !masterPlan.includes("STALE")) {
        const contextIndex = masterPlan.indexOf(forbidden);
        const snippet = masterPlan.slice(
          Math.max(0, contextIndex - 40),
          contextIndex + forbidden.length + 40
        );
        if (!/supersedes|superseded|STALE/i.test(snippet)) {
          violations.push({
            file: MASTER_PLAN,
            message: `Master plan contains stale v4 marker without STALE qualifier: ${forbidden}`,
            rule: "master-plan-v4-stale-marker",
          });
        }
      }
    }
  }

  for (const adrPath of REQUIRED_ACCEPTED_ADRS) {
    const content = readText(adrPath);
    if (!content) {
      violations.push({
        file: adrPath,
        message: `Required ADR file missing: ${adrPath}`,
        rule: "required-adr-missing",
      });
      continue;
    }

    if (!adrIsAccepted(content)) {
      violations.push({
        file: adrPath,
        message: `${adrPath} must be Accepted after foundation documentation closeout`,
        rule: "adr-not-accepted",
      });
    }
  }

  const adrReadme = readText("docs/adr/README.md");
  if (adrReadme) {
    for (const adrPath of REQUIRED_ACCEPTED_ADRS) {
      const id = adrPath.match(/ADR-\d{4}/)?.[0];
      if (!id) {
        continue;
      }

      if (!adrReadme.includes(id)) {
        violations.push({
          file: "docs/adr/README.md",
          message: `ADR index missing ${id}`,
          rule: "adr-index-missing",
        });
        continue;
      }

      const rowPattern = new RegExp(
        `\\|\\s*\\[${id}\\][^\\n]*\\|\\s*[^|]+\\|\\s*Accepted\\s*\\|`,
        "i"
      );
      if (!rowPattern.test(adrReadme)) {
        violations.push({
          file: "docs/adr/README.md",
          message: `ADR index must list ${id} as Accepted`,
          rule: "adr-index-not-accepted",
        });
      }
    }
  }

  const adrDirectory = join(repoRoot, "docs/adr");
  if (existsSync(adrDirectory)) {
    const adrFilesByNumber = new Map<string, string[]>();

    for (const name of readdirSync(adrDirectory)) {
      const numberMatch = name.match(/^ADR-(\d{4})-/);
      if (!numberMatch) {
        continue;
      }

      const adrId = `ADR-${numberMatch[1]}`;
      const relativePath = `docs/adr/${name}`;
      const existing = adrFilesByNumber.get(adrId) ?? [];
      existing.push(relativePath);
      adrFilesByNumber.set(adrId, existing);
    }

    for (const [adrId, paths] of adrFilesByNumber) {
      if (paths.length > 1) {
        violations.push({
          file: paths.join(", "),
          message: `Duplicate ADR number ${adrId}: ${paths.join(" · ")}`,
          rule: "adr-number-collision",
        });
      }
    }
  }

  for (const scanPath of [
    ...new Set([
      ...LEGACY_DELIVERY_PATH_SCAN_FILES,
      ...listArchitectureMarkdownFiles(),
    ]),
  ]) {
    const content = readText(scanPath);
    if (!content) {
      continue;
    }

    const absoluteMatches = content.match(LEGACY_DELIVERY_PATH_PATTERN);
    if (absoluteMatches && absoluteMatches.length > 0) {
      const unique = [...new Set(absoluteMatches)];
      violations.push({
        file: scanPath,
        message: `Legacy delivery/ARCH path reference(s): ${unique.join(", ")} — use docs/PAS/`,
        rule: "legacy-delivery-path-reference",
      });
    }

    const relativeMatches = content.match(
      LEGACY_RELATIVE_DELIVERY_PATH_PATTERN
    );
    if (relativeMatches && relativeMatches.length > 0) {
      violations.push({
        file: scanPath,
        message:
          "Relative link to retired ../delivery/ or ../ARCH/ tree — use docs/PAS/ or in-repo architecture docs",
        rule: "legacy-relative-delivery-path-reference",
      });
    }
  }

  for (const scanPath of LEGACY_DELIVERY_INDEX_SCAN_FILES) {
    const content = readText(scanPath);
    if (!content) {
      continue;
    }

    const indexMatches = content.match(LEGACY_DELIVERY_INDEX_PATTERN);
    if (indexMatches && indexMatches.length > 0) {
      const unique = [...new Set(indexMatches)];
      violations.push({
        file: scanPath,
        message: `Retired PAS delivery index reference(s): ${unique.join(", ")} — use pas-status-index.md and docs/PAS/KERNEL/SLICE/ for kernel handoffs`,
        rule: "legacy-delivery-index-reference",
      });
    }
  }

  for (const entry of STALE_DELIVERY_MARKERS) {
    const content = readText(entry.file);
    if (!content) {
      continue;
    }

    for (const forbidden of entry.forbidden) {
      if (content.includes(forbidden)) {
        violations.push({
          file: entry.file,
          message: `Stale delivery marker still present: ${forbidden}`,
          rule: entry.rule,
        });
      }
    }
  }

  const packageJson = readText("package.json");
  if (packageJson && !packageJson.includes("quality:documentation-drift")) {
    violations.push({
      file: "package.json",
      message: "pnpm quality must include quality:documentation-drift",
      rule: "quality-chain-missing-documentation-drift",
    });
  }

  if (
    packageJson?.includes("quality:documentation-drift") &&
    !/"quality":\s*"[^"]*quality:documentation-drift/.test(
      packageJson.replace(/\s+/g, " ")
    )
  ) {
    violations.push({
      file: "package.json",
      message:
        "quality:documentation-drift must be wired into the quality aggregator script",
      rule: "quality-aggregator-missing-documentation-drift",
    });
  }

  const snapshotPath =
    "packages/architecture-authority/dependency-snapshot.json";
  const snapshot = readText(snapshotPath);
  if (snapshot) {
    try {
      const parsed = JSON.parse(snapshot) as { fingerprint?: string };
      if (parsed.fingerprint !== ARCHITECTURE_BASELINE_FINGERPRINT) {
        violations.push({
          file: snapshotPath,
          message: `dependency-snapshot.json fingerprint must be ${ARCHITECTURE_BASELINE_FINGERPRINT}`,
          rule: "dependency-snapshot-fingerprint-drift",
        });
      }
    } catch {
      violations.push({
        file: snapshotPath,
        message: "dependency-snapshot.json is not valid JSON",
        rule: "dependency-snapshot-invalid-json",
      });
    }
  }

  for (const docPath of FINGERPRINT_REQUIRED_DOCS) {
    const content = readText(docPath);
    if (!content) {
      violations.push({
        file: docPath,
        message: `Fingerprint-required doc missing: ${docPath}`,
        rule: "fingerprint-doc-missing",
      });
      continue;
    }

    if (!content.includes(ARCHITECTURE_BASELINE_FINGERPRINT)) {
      violations.push({
        file: docPath,
        message: `${docPath} must include fingerprint ${ARCHITECTURE_BASELINE_FINGERPRINT}`,
        rule: "fingerprint-doc-stale",
      });
    }

    if (content.includes(OBSOLETE_BASELINE_FINGERPRINT)) {
      violations.push({
        file: docPath,
        message: `${docPath} still references obsolete fingerprint ${OBSOLETE_BASELINE_FINGERPRINT}`,
        rule: "fingerprint-doc-obsolete-reference",
      });
    }
  }

  const baselineDoc = readText(ARCHITECTURE_BASELINE_DOC);
  if (baselineDoc && !baselineDoc.includes(ARCHITECTURE_BASELINE_FINGERPRINT)) {
    violations.push({
      file: ARCHITECTURE_BASELINE_DOC,
      message: `Baseline report must include ${ARCHITECTURE_BASELINE_FINGERPRINT}`,
      rule: "baseline-doc-fingerprint-stale",
    });
  }

  return violations;
}

function main(): void {
  const violations = checkDocumentationDrift();

  if (violations.length === 0) {
    console.log(
      `documentation-drift: OK (${DOCUMENTATION_DRIFT_SURFACE_RULE})`
    );
    return;
  }

  console.error(`documentation-drift: ${violations.length} violation(s)\n`);
  for (const violation of violations) {
    console.error(`  [${violation.rule}] ${violation.file}`);
    console.error(`    ${violation.message}`);
  }

  process.exit(1);
}

main();
