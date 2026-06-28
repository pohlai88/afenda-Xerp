import { MOTION_INTENTS } from "../contracts/motion.contract";
import { AFENDA_MOTION_REGISTRY } from "../registries/motion.registry";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";
import type { ValidationResult } from "./index";

export function validateMotionRegistry(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const tokenNames = new Set<string>(
    AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
  );
  const coveredIntents = new Set<string>();

  for (const entry of AFENDA_MOTION_REGISTRY) {
    coveredIntents.add(entry.intent);

    const durationExists = tokenNames.has(entry.durationToken);
    results.push({
      rule: `motion.${entry.intent}.durationToken.exists`,
      passed: durationExists,
      detail: durationExists
        ? undefined
        : `Motion "${entry.intent}" references missing duration token "${entry.durationToken}"`,
    });

    const easingExists = tokenNames.has(entry.easingToken);
    results.push({
      rule: `motion.${entry.intent}.easingToken.exists`,
      passed: easingExists,
      detail: easingExists
        ? undefined
        : `Motion "${entry.intent}" references missing easing token "${entry.easingToken}"`,
    });

    const durationPrefixed = entry.durationToken.startsWith("afenda.");
    results.push({
      rule: `motion.${entry.intent}.durationToken.prefix`,
      passed: durationPrefixed,
      detail: durationPrefixed
        ? undefined
        : `Motion "${entry.intent}" duration token "${entry.durationToken}" lacks afenda. prefix`,
    });
  }

  // Every governed intent must be covered
  for (const intent of MOTION_INTENTS) {
    results.push({
      rule: `motion.${intent}.has-entry`,
      passed: coveredIntents.has(intent),
      detail: coveredIntents.has(intent)
        ? undefined
        : `Motion intent "${intent}" has no registry entry`,
    });
  }

  return results;
}
