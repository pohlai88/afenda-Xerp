import { PROHIBITED_CLASSNAME_PATTERNS } from "../contracts/class-name-policy.contract";
import type { ValidationResult } from "./index";

const SEPARATOR = /\s+/u;

export function validateClassNames(classNames: string[]): ValidationResult[] {
  return classNames.flatMap((cls) => {
    const tokens = cls.split(SEPARATOR).filter(Boolean);
    return tokens.map((token) => {
      const isProhibited = PROHIBITED_CLASSNAME_PATTERNS.some((p) =>
        token.startsWith(p)
      );
      return {
        rule: `className.semantic.not-prohibited: ${token}`,
        passed: !isProhibited,
        detail: isProhibited
          ? `Class "${token}" uses a prohibited semantic pattern — use governed tokens and recipes instead`
          : undefined,
      };
    });
  });
}
