import {
  isAfendaTokenName,
  RADII,
  SHADOWS,
  STATUS_TONES,
} from "../contracts/token.contract";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";
import type { ValidationResult } from "./index";

export function validateTokenRegistry(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const tokens = AFENDA_TOKEN_REGISTRY.tokens;
  const names = tokens.map((t) => t.name);
  const nameSet = new Set<string>(names);

  // Every token name must start with afenda.
  for (const token of tokens) {
    const prefixed = isAfendaTokenName(token.name);
    results.push({
      rule: `token.name.prefix: ${token.name}`,
      passed: prefixed,
      detail: prefixed
        ? undefined
        : `Token name "${token.name}" must start with "afenda."`,
    });
  }

  // No duplicate names
  results.push({
    rule: "token.names.unique",
    passed: nameSet.size === names.length,
    detail:
      nameSet.size === names.length
        ? undefined
        : "Duplicate token names detected in registry",
  });

  // CSS variables start with --afenda-
  for (const token of tokens) {
    const validVar = token.cssVariable.startsWith("--afenda-");
    results.push({
      rule: `token.cssVariable.prefix: ${token.cssVariable}`,
      passed: validVar,
      detail: validVar
        ? undefined
        : `CSS variable "${token.cssVariable}" must start with "--afenda-"`,
    });
  }

  // Coverage: every RADII value has a token
  for (const radius of RADII) {
    const has = nameSet.has(`afenda.radius.${radius}`);
    results.push({
      rule: `token.coverage.radius.${radius}`,
      passed: has,
      detail: has ? undefined : `Missing afenda.radius.${radius} in registry`,
    });
  }

  // Coverage: every SHADOWS value has a token
  for (const shadow of SHADOWS) {
    const has = nameSet.has(`afenda.shadow.${shadow}`);
    results.push({
      rule: `token.coverage.shadow.${shadow}`,
      passed: has,
      detail: has ? undefined : `Missing afenda.shadow.${shadow} in registry`,
    });
  }

  // Coverage: every STATUS_TONES value has surface + foreground + border + focus tokens
  for (const tone of STATUS_TONES) {
    for (const variant of [
      "surface",
      "foreground",
      "border",
      "focus",
    ] as const) {
      const name = `afenda.status-tone.${tone}.${variant}`;
      const has = nameSet.has(name);
      results.push({
        rule: `token.coverage.status-tone.${tone}.${variant}`,
        passed: has,
        detail: has ? undefined : `Missing ${name} in registry`,
      });
    }
  }

  return results;
}
