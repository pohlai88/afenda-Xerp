import { basename } from "node:path";

/** PAS-002A §4.1 / PAS-001 §4.1 — forbidden filename substrings under architecture-authority src. */
export const ARCHITECTURE_KERNEL_FORBIDDEN_FILENAME_PATTERNS = [
  "parser",
  "assert",
  "id-family",
] as const;

/**
 * Legitimate BMD authority files may contain governance assert helpers and kernel path strings.
 * PAS-002A §4.1 allowlist — business-master-data-* policy/registry only.
 */
export const ARCHITECTURE_KERNEL_FILENAME_ALLOWLIST = [
  /^business-master-data-.*\.(policy|registry)\.ts$/,
] as const;

/** Forbidden kernel-duplication content markers (identity wire belongs in @afenda/kernel). */
export const ARCHITECTURE_KERNEL_FORBIDDEN_CONTENT_PATTERNS = [
  { id: "id-families", pattern: /\bID_FAMILIES\b/ },
  { id: "parse-tenant-id", pattern: /\bparseTenantId\b/ },
  {
    id: "identity-parse-export",
    pattern:
      /export\s+function\s+parse(?:Tenant|Customer|Supplier|Employee|Product|Legal|Company|Enterprise)\w*/,
  },
  {
    id: "identity-parse-fn",
    pattern:
      /\bfunction\s+parse(?:Tenant|Customer|Supplier|Employee|Product|Legal|Company|Enterprise)\w*/,
  },
] as const;

/** Architecture-owned parse helpers — not kernel identity parsers. */
export const ARCHITECTURE_KERNEL_PARSE_FUNCTION_ALLOWLIST = [
  "parseIso8601UtcTimestamp",
  "parseWorkspacePackageJson",
] as const;

export const ARCHITECTURE_KERNEL_CONTENT_PATH_ALLOWLIST = [
  "/__tests__/",
  "business-master-data-",
  "iso8601-utc-timestamp.ts",
  "discover-workspaces.ts",
] as const;

export interface ArchitectureKernelScanTarget {
  readonly content: string;
  readonly relativePath: string;
}

export interface ArchitectureKernelViolation {
  readonly message: string;
  readonly relativePath: string;
  readonly rule: "forbidden-filename" | "forbidden-content";
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/");
}

function isFilenameAllowlisted(relativePath: string): boolean {
  const fileName = basename(relativePath);
  return ARCHITECTURE_KERNEL_FILENAME_ALLOWLIST.some((pattern) =>
    pattern.test(fileName)
  );
}

function isContentPathAllowlisted(relativePath: string): boolean {
  const normalized = normalizeRelativePath(relativePath);
  return ARCHITECTURE_KERNEL_CONTENT_PATH_ALLOWLIST.some((suffix) =>
    normalized.includes(suffix)
  );
}

function matchesForbiddenFilename(relativePath: string): boolean {
  if (isFilenameAllowlisted(relativePath)) {
    return false;
  }

  const fileName = basename(relativePath).toLowerCase();
  return ARCHITECTURE_KERNEL_FORBIDDEN_FILENAME_PATTERNS.some((fragment) =>
    fileName.includes(fragment)
  );
}

function collectForbiddenContentViolations(
  relativePath: string,
  content: string
): ArchitectureKernelViolation[] {
  if (isContentPathAllowlisted(relativePath)) {
    return [];
  }

  const violations: ArchitectureKernelViolation[] = [];

  for (const {
    id,
    pattern,
  } of ARCHITECTURE_KERNEL_FORBIDDEN_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      violations.push({
        relativePath,
        rule: "forbidden-content",
        message: `forbidden kernel-duplication content (${id})`,
      });
    }
  }

  const exportParsePattern = /export\s+function\s+(parse[A-Z]\w*)/g;
  for (const match of content.matchAll(exportParsePattern)) {
    const fnName = match[1];
    if (
      fnName &&
      !ARCHITECTURE_KERNEL_PARSE_FUNCTION_ALLOWLIST.includes(
        fnName as (typeof ARCHITECTURE_KERNEL_PARSE_FUNCTION_ALLOWLIST)[number]
      )
    ) {
      violations.push({
        relativePath,
        rule: "forbidden-content",
        message: `forbidden kernel-style parse export (${fnName})`,
      });
    }
  }

  return violations;
}

export function scanArchitectureKernelNonDuplication(
  targets: readonly ArchitectureKernelScanTarget[]
): readonly ArchitectureKernelViolation[] {
  const violations: ArchitectureKernelViolation[] = [];

  for (const target of targets) {
    const relativePath = normalizeRelativePath(target.relativePath);

    if (matchesForbiddenFilename(relativePath)) {
      violations.push({
        relativePath,
        rule: "forbidden-filename",
        message: "filename matches forbidden kernel-duplication pattern",
      });
    }

    violations.push(
      ...collectForbiddenContentViolations(relativePath, target.content)
    );
  }

  return violations;
}
