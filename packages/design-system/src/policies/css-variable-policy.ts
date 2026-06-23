import type { AfendaCssVariableName } from "../contracts/token.contract";

// ─── Policy declaration ───────────────────────────────────────────────────────

export const cssVariablePolicy = {
  prefix: "--afenda-",
  format: "--afenda-<category>-<domain>-<name>",
  rules: [
    "All CSS custom properties must start with --afenda-",
    "CSS variable names are derived deterministically from token names",
    "Dots in token names become hyphens in CSS variable names",
    "Raw CSS variables that bypass the token registry are prohibited",
    "Downstream packages must reference CSS variables by consuming tokenNameToCssVariable, not by hard-coding names",
  ],
} as const;

// ─── Validation helpers ───────────────────────────────────────────────────────

export function isAfendaCssVariable(
  value: string
): value is AfendaCssVariableName {
  return value.startsWith("--afenda-");
}

export function assertAfendaCssVariable(
  value: string
): asserts value is AfendaCssVariableName {
  if (!isAfendaCssVariable(value)) {
    throw new Error(
      `Invalid CSS variable "${value}": must start with "--afenda-" (e.g. --afenda-color-surface-canvas)`
    );
  }
}
