import {
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "./design-system";

const CLASS_NAME_SEPARATOR_PATTERN = /\s+/u;
const ARBITRARY_CLASS_PATTERN = /[\[\]()]/u;

const isDevelopment = process.env["NODE_ENV"] !== "production";

interface ClassNamePolicyResult {
  readonly valid: boolean;
  readonly violations: readonly ClassNamePolicyViolation[];
}

interface ClassNamePolicyViolation {
  readonly token: string;
  readonly reason:
    | "prohibited-semantic-pattern"
    | "not-approved-layout-pattern"
    | "arbitrary-value";
}

function splitClassName(className: string): readonly string[] {
  return className.split(CLASS_NAME_SEPARATOR_PATTERN).filter(Boolean);
}

function matchesAnyPrefix(
  token: string,
  patterns: readonly string[]
): boolean {
  return patterns.some((pattern) => token === pattern || token.startsWith(pattern));
}

function isAllowedLayoutClassNameToken(token: string): boolean {
  return matchesAnyPrefix(token, ALLOWED_LAYOUT_CLASSNAME_PATTERNS);
}

function isProhibitedClassNameToken(token: string): boolean {
  return matchesAnyPrefix(token, PROHIBITED_CLASSNAME_PATTERNS);
}

function validateLayoutClassName(className: string): ClassNamePolicyResult {
  const violations: ClassNamePolicyViolation[] = [];

  for (const token of splitClassName(className)) {
    if (ARBITRARY_CLASS_PATTERN.test(token)) {
      violations.push({ token, reason: "arbitrary-value" });
      continue;
    }

    if (isProhibitedClassNameToken(token)) {
      violations.push({ token, reason: "prohibited-semantic-pattern" });
      continue;
    }

    if (!isAllowedLayoutClassNameToken(token)) {
      violations.push({ token, reason: "not-approved-layout-pattern" });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

function formatClassNamePolicyViolation(
  result: ClassNamePolicyResult
): string {
  return result.violations
    .map((violation) => `${violation.token} (${violation.reason})`)
    .join(", ");
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
  if (!className) {
    return;
  }

  const result = validateLayoutClassName(className);

  if (!result.valid && isDevelopment) {
    throw new Error(
      `TIP-004 className policy violation. Offending classes: ${formatClassNamePolicyViolation(
        result
      )}. Move semantic styling into governed recipe/variant.`
    );
  }
}

export function resolveLayoutClassName(
  className: string | undefined
): string {
  assertAllowedLayoutClassName(className);
  return className ?? "";
}
