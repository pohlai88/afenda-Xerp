/**
 * Shared §447–480 Do's and Prohibitions enforcement.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import {
  MULTI_TENANCY_ACCOUNTING_SCAN_EXCLUDED_SEGMENTS,
  MULTI_TENANCY_ACCOUNTING_SCAN_ROOTS,
  MULTI_TENANCY_FORBIDDEN_ACCOUNTING_PATTERNS,
  MULTI_TENANCY_FORBIDDEN_ANY_SCAN_ROOTS,
  MULTI_TENANCY_FORBIDDEN_BUSINESS_MODULE_SEGMENTS,
  MULTI_TENANCY_GOVERNANCE_TEST_ROOT,
  MULTI_TENANCY_SESSION_TENANT_ID_PATTERN,
  MULTI_TENANCY_SESSION_TENANT_ID_SCAN_ROOTS,
} from "../multi-tenancy-dos-prohibitions-registry.mts";
import { collectGlossaryFirstViolations } from "./multi-tenancy-glossary-first-enforcement.mts";
import {
  sourceContainsCodePattern,
  sourceContainsForbiddenAny,
} from "./multi-tenancy-scan-utils.mts";

export interface DosProhibitionsEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const ARCHITECTURE_SILENCE_PATTERNS = [
  /AFENDA_SKIP_ARCHITECTURE/i,
  /SKIP_ARCHITECTURE_VALIDATION/i,
  /validateArchitecture\s*\([^)]*\)\s*;\s*\/\/\s*ok/i,
] as const;

const TODO_AS_COMPLETION_PATTERNS = [
  /-\s*\[x\][^\n]*\bTODO\b[^\n]*(complete|done|finished)/i,
  /-\s*\[x\][^\n]*(complete|done|finished)[^\n]*\bTODO\b/i,
  /\*\*Overall enterprise score\*\*[^\n]*TODO/i,
] as const;

function isTestOrStoryFile(fileName: string): boolean {
  return (
    fileName.includes(".test.") ||
    fileName.includes(".spec.") ||
    fileName.endsWith(".stories.tsx") ||
    fileName.endsWith(".stories.ts")
  );
}

function isDevRoutePath(relativePath: string): boolean {
  return relativePath.includes("/(dev)/") || relativePath.includes("\\(dev)\\");
}

function listTypeScriptFiles(
  directory: string,
  repoRoot: string,
  excludedSegments: readonly string[] = []
): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        excludedSegments.includes(entry.name)
      ) {
        continue;
      }
      files.push(...listTypeScriptFiles(fullPath, repoRoot, excludedSegments));
      continue;
    }

    if (
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !isTestOrStoryFile(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

export function collectGlossaryViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  return collectGlossaryFirstViolations(repoRoot);
}

export function collectForbiddenAnyViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];

  for (const scanRoot of MULTI_TENANCY_FORBIDDEN_ANY_SCAN_ROOTS) {
    const absoluteRoot = join(repoRoot, scanRoot);

    for (const filePath of listTypeScriptFiles(absoluteRoot, repoRoot)) {
      const source = readFileSync(filePath, "utf8");
      if (sourceContainsForbiddenAny(source)) {
        violations.push({
          rule: "forbidden-any-type",
          file: filePath,
          message:
            "Do not use `any` or `as any` in multi-tenancy authority surfaces (code-only scan)",
        });
      }
    }
  }

  return violations;
}

export function collectSessionTenantIdViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];

  for (const scanRoot of MULTI_TENANCY_SESSION_TENANT_ID_SCAN_ROOTS) {
    const absoluteRoot = join(repoRoot, scanRoot);

    for (const filePath of listTypeScriptFiles(absoluteRoot, repoRoot)) {
      const source = readFileSync(filePath, "utf8");
      if (
        sourceContainsCodePattern(
          source,
          MULTI_TENANCY_SESSION_TENANT_ID_PATTERN
        )
      ) {
        violations.push({
          rule: "session-tenant-id",
          file: filePath,
          message:
            "Do not read tenantId from auth session — resolve from request headers and membership",
        });
      }
    }
  }

  return violations;
}

export function collectForbiddenAccountingViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];

  for (const scanRoot of MULTI_TENANCY_ACCOUNTING_SCAN_ROOTS) {
    const absoluteRoot = join(repoRoot, scanRoot);

    for (const filePath of listTypeScriptFiles(
      absoluteRoot,
      repoRoot,
      MULTI_TENANCY_ACCOUNTING_SCAN_EXCLUDED_SEGMENTS
    )) {
      const relativePath = relative(repoRoot, filePath);
      if (isDevRoutePath(relativePath)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      for (const pattern of MULTI_TENANCY_FORBIDDEN_ACCOUNTING_PATTERNS) {
        if (sourceContainsCodePattern(source, pattern)) {
          violations.push({
            rule: "forbidden-accounting-pattern",
            file: filePath,
            message: `Accounting / Foundation phase 13 implementation pattern prohibited (code-only): ${pattern.source}`,
          });
        }
      }
    }
  }

  return violations;
}

export function collectForbiddenBusinessModulePathViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];
  const protectedRoot = join(repoRoot, "apps/erp/src/app/(protected)");

  if (!existsSync(protectedRoot)) {
    return violations;
  }

  for (const entry of readdirSync(protectedRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (
      MULTI_TENANCY_FORBIDDEN_BUSINESS_MODULE_SEGMENTS.includes(
        entry.name as (typeof MULTI_TENANCY_FORBIDDEN_BUSINESS_MODULE_SEGMENTS)[number]
      )
    ) {
      violations.push({
        rule: "forbidden-business-module-path",
        file: join(protectedRoot, entry.name),
        message: `Business module route segment "${entry.name}" is prohibited before Foundation phase 13`,
      });
    }
  }

  return violations;
}

export function collectArchitectureSilenceViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];
  const scanRoots = ["apps/erp/src", "scripts/governance", "scripts/quality"];

  for (const scanRoot of scanRoots) {
    const absoluteRoot = join(repoRoot, scanRoot);

    for (const filePath of listTypeScriptFiles(absoluteRoot, repoRoot)) {
      const source = readFileSync(filePath, "utf8");

      for (const pattern of ARCHITECTURE_SILENCE_PATTERNS) {
        if (sourceContainsCodePattern(source, pattern)) {
          violations.push({
            rule: "architecture-check-silence",
            file: filePath,
            message:
              "Do not silence architecture checks — fix registry or report drift instead",
          });
        }
      }
    }
  }

  return violations;
}

export function collectTodoAsCompletionViolations(
  deliveryDocContent: string,
  deliveryDocPath: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];

  for (const pattern of TODO_AS_COMPLETION_PATTERNS) {
    if (pattern.test(deliveryDocContent)) {
      violations.push({
        rule: "todo-as-completion",
        file: deliveryDocPath,
        message:
          "Do not leave TODOs as completion — resolve work or keep checklist unchecked",
      });
    }
  }

  return violations;
}

export function collectGovernanceTestPresenceViolations(
  repoRoot: string
): DosProhibitionsEnforcementViolation[] {
  const violations: DosProhibitionsEnforcementViolation[] = [];
  const testRoot = join(repoRoot, MULTI_TENANCY_GOVERNANCE_TEST_ROOT);

  if (!existsSync(testRoot)) {
    violations.push({
      rule: "governance-tests-missing",
      file: testRoot,
      message: `${MULTI_TENANCY_GOVERNANCE_TEST_ROOT} is required (Do add tests)`,
    });
    return violations;
  }

  const hasDosProhibitionsTest = readdirSync(testRoot).some((name) =>
    name.includes("multi-tenancy-dos-prohibitions")
  );

  if (!hasDosProhibitionsTest) {
    violations.push({
      rule: "dos-prohibitions-test-missing",
      file: testRoot,
      message:
        "scripts/governance/__tests__/check-multi-tenancy-dos-prohibitions.test.ts is required",
    });
  }

  return violations;
}
