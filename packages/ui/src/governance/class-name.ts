import {
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "./design-system";
import { isDevelopment } from "./dev-env";
import type { ClassNamePolicyResult, ClassNamePolicyViolation } from "./types";

const CLASS_NAME_SEPARATOR_PATTERN = /\s+/u;
const ARBITRARY_CLASS_PATTERN = /[[\]()]/u;

function splitClassName(className: string): readonly string[] {
  return className.split(CLASS_NAME_SEPARATOR_PATTERN).filter(Boolean);
}

function matchesAnyPrefix(token: string, patterns: readonly string[]): boolean {
  return patterns.some(
    (pattern) => token === pattern || token.startsWith(pattern)
  );
}

function isAllowedLayoutClassNameToken(token: string): boolean {
  return matchesAnyPrefix(token, ALLOWED_LAYOUT_CLASSNAME_PATTERNS);
}

function isProhibitedClassNameToken(token: string): boolean {
  return matchesAnyPrefix(token, PROHIBITED_CLASSNAME_PATTERNS);
}

export function validateLayoutClassName(
  className: string | undefined
): ClassNamePolicyResult {
  const violations: ClassNamePolicyViolation[] = [];

  if (!className) {
    return {
      valid: true,
      violations,
    };
  }

  for (const token of splitClassName(className)) {
    if (ARBITRARY_CLASS_PATTERN.test(token)) {
      violations.push({ token, reason: "arbitrary-value" });
      continue;
    }

    if (isProhibitedClassNameToken(token)) {
      violations.push({
        token,
        reason: "prohibited-semantic-pattern",
      });
      continue;
    }

    if (!isAllowedLayoutClassNameToken(token)) {
      violations.push({
        token,
        reason: "not-approved-layout-pattern",
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

function formatClassNamePolicyViolation(result: ClassNamePolicyResult): string {
  return result.violations
    .map((violation) => `${violation.token} (${violation.reason})`)
    .join(", ");
}

function formatClassNamePolicyError(result: ClassNamePolicyResult): string {
  return `TIP-004 className policy violation. Offending classes: ${formatClassNamePolicyViolation(
    result
  )}. Move semantic styling into governed recipe/variant.`;
}

export function getClassNamePolicy() {
  return {
    allowedPurpose: "layout-only" as const,
    prohibitedPatterns: PROHIBITED_CLASSNAME_PATTERNS,
    allowedLayoutPatterns: ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
    violationMessage:
      "TIP-004 className policy: className may control layout only. Semantic color, tone, size, radius, shadow, typography, opacity, focus, and motion must come from governed recipes and variants.",
  };
}

export function assertAllowedLayoutClassName(
  className: string | undefined
): void {
  const result = validateLayoutClassName(className);

  if (!result.valid && isDevelopment) {
    throw new Error(formatClassNamePolicyError(result));
  }
}

export function assertAllowedLayoutClassNameStrict(
  className: string | undefined
): void {
  const result = validateLayoutClassName(className);

  if (!result.valid) {
    throw new Error(formatClassNamePolicyError(result));
  }
}

export function resolveLayoutClassName(className: string | undefined): string {
  assertAllowedLayoutClassName(className);
  return className ?? "";
}

export type { ClassNamePolicyResult, ClassNamePolicyViolation };
