#!/usr/bin/env tsx
/**
 * Legacy delivery terminology guard — CI grep gate for retired TIP/PAS strings.
 *
 * Active surfaces must use PAS / Governed UI vocabulary. Historical evidence
 * under docs/adr/ and the drift audit trail are excluded.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LEGACY_DELIVERY_TERMINOLOGY_ALLOWED_LINE_MARKERS,
  LEGACY_DELIVERY_TERMINOLOGY_EXTENSIONS,
  LEGACY_DELIVERY_TERMINOLOGY_PATTERNS,
  LEGACY_DELIVERY_TERMINOLOGY_SKIP_DIRS,
  LEGACY_DELIVERY_TERMINOLOGY_SKIP_FILES,
  LEGACY_DELIVERY_TERMINOLOGY_SKIP_GENERATED_CSS,
  LEGACY_DELIVERY_TERMINOLOGY_SKIP_PATH_PREFIXES,
  LEGACY_DELIVERY_TERMINOLOGY_SURFACE_RULE,
} from "./legacy-delivery-terminology-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface LegacyDeliveryTerminologyViolation {
  readonly file: string;
  readonly line: number;
  readonly match: string;
  readonly message: string;
  readonly rule: string;
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function isSkippedPath(relativePath: string): boolean {
  if (LEGACY_DELIVERY_TERMINOLOGY_SKIP_FILES.has(relativePath)) {
    return true;
  }

  for (const prefix of LEGACY_DELIVERY_TERMINOLOGY_SKIP_PATH_PREFIXES) {
    if (relativePath.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

function isAllowedLine(line: string): boolean {
  return LEGACY_DELIVERY_TERMINOLOGY_ALLOWED_LINE_MARKERS.some((marker) =>
    line.includes(marker)
  );
}

function collectScannableFiles(directory: string, files: string[] = []): string[] {
  for (const name of readdirSync(directory)) {
    const absolute = join(directory, name);

    if (statSync(absolute).isDirectory()) {
      if (LEGACY_DELIVERY_TERMINOLOGY_SKIP_DIRS.has(name)) {
        continue;
      }
      collectScannableFiles(absolute, files);
      continue;
    }

    const relativePath = normalizePath(relative(repoRoot, absolute));
    if (
      isSkippedPath(relativePath) ||
      LEGACY_DELIVERY_TERMINOLOGY_SKIP_GENERATED_CSS.has(relativePath)
    ) {
      continue;
    }

    const extension = name.slice(name.lastIndexOf("."));
    if (!LEGACY_DELIVERY_TERMINOLOGY_EXTENSIONS.has(extension)) {
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

function scanFile(relativePath: string): LegacyDeliveryTerminologyViolation[] {
  const absolute = join(repoRoot, relativePath);
  const content = readFileSync(absolute, "utf8");
  const violations: LegacyDeliveryTerminologyViolation[] = [];
  const lines = content.split(/\r?\n/u);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (isAllowedLine(line)) {
      continue;
    }

    for (const entry of LEGACY_DELIVERY_TERMINOLOGY_PATTERNS) {
      const pattern = new RegExp(
        entry.pattern.source,
        entry.pattern.flags.includes("g") ? entry.pattern.flags : `${entry.pattern.flags}g`
      );

      for (const match of line.matchAll(pattern)) {
        const matched = match[0];
        if (!matched) {
          continue;
        }

        violations.push({
          file: relativePath,
          line: index + 1,
          match: matched,
          rule: entry.id,
          message: `Retired ${entry.label}: "${matched}" — use PAS / pas-status-index / Governed UI vocabulary`,
        });
      }
    }
  }

  return violations;
}

export function checkLegacyDeliveryTerminology(): LegacyDeliveryTerminologyViolation[] {
  const files = collectScannableFiles(repoRoot);
  const violations: LegacyDeliveryTerminologyViolation[] = [];

  for (const file of files) {
    violations.push(...scanFile(file));
  }

  return violations.sort((left, right) => {
    const fileCompare = left.file.localeCompare(right.file);
    if (fileCompare !== 0) {
      return fileCompare;
    }
    return left.line - right.line;
  });
}

export function formatLegacyDeliveryTerminologyViolations(
  violations: readonly LegacyDeliveryTerminologyViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (violation) =>
        `${violation.file}:${violation.line} [${violation.rule}] ${violation.message}`
    )
    .join("\n");
}

function main(): void {
  const violations = checkLegacyDeliveryTerminology();

  if (violations.length === 0) {
    console.log(
      `legacy-delivery-terminology: OK (${LEGACY_DELIVERY_TERMINOLOGY_SURFACE_RULE})`
    );
    return;
  }

  console.error(formatLegacyDeliveryTerminologyViolations(violations));
  console.error(
    `\nlegacy-delivery-terminology: FAIL (${violations.length} violation(s))`
  );
  process.exitCode = 1;
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-legacy-delivery-terminology.mts")
    );
  } catch {
    return entry.endsWith("check-legacy-delivery-terminology.mts");
  }
})();

if (isDirectRun) {
  main();
}
