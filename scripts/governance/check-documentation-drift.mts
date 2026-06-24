#!/usr/bin/env tsx
/**
 * Documentation drift guard (TIP-000D / ADR-0009, ADR-0012).
 *
 * Detects obvious stale documentation markers and missing authority index files.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../../packages/architecture-authority/src/contracts/architecture-authority-version.ts";
import {
  ARCHITECTURE_BASELINE_DOC,
  DOCUMENTATION_DRIFT_SURFACE_RULE,
  DRIFT_AUDIT,
  FINGERPRINT_REQUIRED_DOCS,
  LEGACY_DELIVERY_PATH_PATTERN,
  LEGACY_DELIVERY_PATH_SCAN_FILES,
  MASTER_PLAN,
  MASTER_PLAN_FORBIDDEN_MARKERS,
  MASTER_PLAN_REQUIRED_MARKERS,
  OBSOLETE_BASELINE_FINGERPRINT,
  PRE_ACCOUNTING_ROADMAP,
  REQUIRED_ACCEPTED_ADRS,
  RUNTIME_TRUTH_MATRIX,
  STALE_DELIVERY_MARKERS,
  TIP_008_COMPLETE_DOC,
  TIP_008_COMPLETE_REQUIRED_MARKERS,
  TIP_DELIVERY_TIPS_DIR,
  TIP_STATUS_INDEX,
  TIP_STATUS_INDEX_BASENAME,
  TIP_STATUS_INDEX_TIPS_PATH_MARKER,
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

export function checkDocumentationDrift(): DocumentationDriftViolation[] {
  const violations: DocumentationDriftViolation[] = [];

  for (const requiredPath of [
    RUNTIME_TRUTH_MATRIX,
    PRE_ACCOUNTING_ROADMAP,
    MASTER_PLAN,
    DRIFT_AUDIT,
    TIP_STATUS_INDEX,
    TIP_DELIVERY_TIPS_DIR,
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
        message: `${adrPath} must be Accepted after TIP-000D closeout`,
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

  const tipStatusIndex = readText(TIP_STATUS_INDEX);
  if (
    tipStatusIndex &&
    !tipStatusIndex.includes(TIP_STATUS_INDEX_TIPS_PATH_MARKER)
  ) {
    violations.push({
      file: TIP_STATUS_INDEX,
      message: `TIP status index must reference ${TIP_STATUS_INDEX_TIPS_PATH_MARKER} (tips/ layout with [status] prefixes)`,
      rule: "tip-status-index-missing-tips-path",
    });
  }

  const deliveryRoot = join(repoRoot, "docs/delivery");
  if (existsSync(deliveryRoot)) {
    for (const name of readdirSync(deliveryRoot)) {
      if (
        name.startsWith("tip-") &&
        name.endsWith(".md") &&
        name !== TIP_STATUS_INDEX_BASENAME
      ) {
        violations.push({
          file: `docs/delivery/${name}`,
          message:
            "Legacy unprefixed TIP at docs/delivery root — move to docs/delivery/tips/[status] tip-*.md",
          rule: "legacy-delivery-tip-at-root",
        });
      }
    }
  }

  const tipsDirPath = join(repoRoot, TIP_DELIVERY_TIPS_DIR);
  if (existsSync(tipsDirPath)) {
    const tipBasenameGroups = new Map<string, string[]>();

    for (const name of readdirSync(tipsDirPath)) {
      if (!name.endsWith(".md")) {
        continue;
      }

      const basenameMatch = name.match(/(tip-[a-z0-9-]+\.md)$/i);
      if (!basenameMatch) {
        continue;
      }

      const basename = basenameMatch[1].toLowerCase();
      const existing = tipBasenameGroups.get(basename) ?? [];
      existing.push(name);
      tipBasenameGroups.set(basename, existing);
    }

    for (const [basename, files] of tipBasenameGroups) {
      if (files.length > 1) {
        violations.push({
          file: `${TIP_DELIVERY_TIPS_DIR}/${files[0]}`,
          message: `Duplicate TIP delivery files for ${basename}: ${files.join(", ")} — retain one canonical [status] prefix; supersede or remove stale copy`,
          rule: "duplicate-tip-delivery-basename",
        });
      }
    }
  }

  for (const scanPath of LEGACY_DELIVERY_PATH_SCAN_FILES) {
    const content = readText(scanPath);
    if (!content) {
      continue;
    }

    const matches = content.match(LEGACY_DELIVERY_PATH_PATTERN);
    if (matches && matches.length > 0) {
      const unique = [...new Set(matches)];
      violations.push({
        file: scanPath,
        message: `Legacy delivery path(s) without tips/ prefix: ${unique.join(", ")}`,
        rule: "legacy-delivery-path-reference",
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

  const tip008Complete = readText(TIP_008_COMPLETE_DOC);
  if (tip008Complete) {
    for (const marker of TIP_008_COMPLETE_REQUIRED_MARKERS) {
      if (!tip008Complete.includes(marker)) {
        violations.push({
          file: TIP_008_COMPLETE_DOC,
          message: `TIP-008 Complete doc missing authority-only marker: ${marker}`,
          rule: "tip-008-complete-authority-only-marker-missing",
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

  const snapshotPath = "docs/architecture/dependency-snapshot.json";
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
