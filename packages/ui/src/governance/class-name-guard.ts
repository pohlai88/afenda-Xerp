import { visualDriftPolicy } from "@afenda/design-system";

import {
  assertAllowedLayoutClassName,
  assertAllowedLayoutClassNameStrict,
  getClassNamePolicy,
  resolveLayoutClassName,
  validateLayoutClassName,
} from "./class-name";
import type { ClassNamePolicyResult, ClassNamePolicyViolation } from "./types";

const VISUAL_SLOP_PATTERNS = [
  /\bfrom-/u,
  /\bto-/u,
  /\bvia-/u,
  /\bbackdrop-blur/u,
  /\bglass/u,
  /\bbg-gradient/u,
  /\bshadow-\[/u,
  /\brounded-\[/u,
  /\btext-\[/u,
  /\bbg-\[/u,
  /\bbg-#/u,
  /\btext-#/u,
  /\bblur-\[/u,
  /\boutline-\[/u,
  /\bstroke-\[/u,
  /\bdrop-shadow-\[/u,
] as const;

const CLASS_NAME_SEPARATOR_PATTERN = /\s+/u;

function splitClassName(className: string): readonly string[] {
  return className.split(CLASS_NAME_SEPARATOR_PATTERN).filter(Boolean);
}

function detectVisualSlop(token: string): ClassNamePolicyViolation | undefined {
  for (const pattern of VISUAL_SLOP_PATTERNS) {
    if (pattern.test(token)) {
      return {
        token,
        reason: "prohibited-semantic-pattern",
      };
    }
  }

  return;
}

/** Extended class-name guard — layout policy + enterprise anti-slop patterns. */
export function guardClassName(
  className: string | undefined
): ClassNamePolicyResult {
  const base = validateLayoutClassName(className);

  if (!className) {
    return base;
  }

  const slopViolations: ClassNamePolicyViolation[] = [];

  for (const token of splitClassName(className)) {
    const slop = detectVisualSlop(token);
    if (slop !== undefined) {
      slopViolations.push(slop);
    }
  }

  if (slopViolations.length === 0) {
    return base;
  }

  const merged = [...base.violations];
  for (const violation of slopViolations) {
    if (!merged.some((entry) => entry.token === violation.token)) {
      merged.push(violation);
    }
  }

  return {
    valid: merged.length === 0,
    violations: merged,
  };
}

export function assertGuardedClassName(className: string | undefined): void {
  const result = guardClassName(className);

  if (!result.valid) {
    const detail = result.violations
      .map((violation) => `${violation.token} (${violation.reason})`)
      .join(", ");
    throw new Error(
      `Governed UI className policy violation. Offending classes: ${detail}. Move semantic styling into governed recipe/variant.`
    );
  }
}

export type { ClassNamePolicyResult, ClassNamePolicyViolation };
export {
  assertAllowedLayoutClassName,
  assertAllowedLayoutClassNameStrict,
  getClassNamePolicy,
  resolveLayoutClassName,
  validateLayoutClassName,
  visualDriftPolicy,
};
