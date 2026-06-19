import {
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  type ClassNamePolicyContract,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "../contracts/class-name-policy.contract";

const CLASS_NAME_SEPARATOR_PATTERN = /\s+/;

export const classNamePolicy = {
  allowedPurpose: "layout-only",
  prohibitedPatterns: PROHIBITED_CLASSNAME_PATTERNS,
  allowedLayoutPatterns: ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  violationMessage:
    "className may control layout only; semantic color, tone, size, radius, shadow, and motion must come from governed recipes and variants.",
} as const satisfies ClassNamePolicyContract;

export interface ClassNamePolicyResult {
  readonly valid: boolean;
  readonly violations: readonly string[];
}

export const validateLayoutClassName = (
  className: string
): ClassNamePolicyResult => {
  const classes = className.split(CLASS_NAME_SEPARATOR_PATTERN).filter(Boolean);
  const violations = classes.filter((classToken) =>
    classNamePolicy.prohibitedPatterns.some((pattern) =>
      classToken.startsWith(pattern)
    )
  );

  return {
    valid: violations.length === 0,
    violations,
  };
};
