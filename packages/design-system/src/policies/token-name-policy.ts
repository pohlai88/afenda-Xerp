import {
  AFENDA_TOKEN_CATEGORIES,
  type AfendaTokenCategory,
  type AfendaTokenName,
  isAfendaTokenName,
} from "../contracts/token.contract";

export type {
  AfendaTokenCategory,
  AfendaTokenName,
} from "../contracts/token.contract";
export {
  assertAfendaTokenName,
  isAfendaTokenName,
  tokenNameToCssVariable,
} from "../contracts/token.contract";

// ─── Policy declaration ───────────────────────────────────────────────────────

export const tokenNamePolicy = {
  format: "afenda.<category>.<domain>.<name>",
  prefix: "afenda.",
  allowedCategories: AFENDA_TOKEN_CATEGORIES,
  rules: [
    "All token names must start with afenda.",
    "Token category must be one of the governed AfendaTokenCategory values",
    "Token names must be kebab-case segments separated by dots",
    "Token names must never be raw Tailwind class names",
    "Token names must never be unprefixed or abbreviated",
  ],
} as const;

// ─── Validation helpers ───────────────────────────────────────────────────────

export interface TokenNameValidationResult {
  readonly errors: readonly string[];
  readonly name: string;
  readonly valid: boolean;
}

export function validateTokenName(name: string): TokenNameValidationResult {
  const errors: string[] = [];

  if (isAfendaTokenName(name)) {
    const segments = name.split(".");
    if (segments.length < 3) {
      errors.push(
        `Token name "${name}" must have at least 3 segments: afenda.<category>.<name>`
      );
    }

    const category = segments[1] as string;
    if (
      category &&
      !(AFENDA_TOKEN_CATEGORIES as readonly string[]).includes(category)
    ) {
      errors.push(
        `Token category "${category}" in "${name}" is not a governed AfendaTokenCategory. Allowed: ${AFENDA_TOKEN_CATEGORIES.join(", ")}`
      );
    }
  } else {
    errors.push(
      `Token name "${name}" must start with "afenda." (e.g. afenda.color.surface.canvas)`
    );
  }

  return {
    valid: errors.length === 0,
    name,
    errors,
  };
}

/**
 * Extracts the category segment from a governed token name.
 * Returns `undefined` if the name does not have the expected format.
 */
export function extractTokenCategory(
  name: AfendaTokenName
): AfendaTokenCategory | undefined {
  const segment = name.split(".")[1];
  return (AFENDA_TOKEN_CATEGORIES as readonly string[]).includes(segment ?? "")
    ? (segment as AfendaTokenCategory)
    : undefined;
}
