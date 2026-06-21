import { cn } from "../lib/utils";

import type { PrimitiveGovernanceResult } from "./primitive-contract";

/** Merges governed slot results for internal composition on plain DOM nodes. */
export function mergeGovernedPresentation(
  ...results: readonly PrimitiveGovernanceResult[]
): PrimitiveGovernanceResult {
  if (results.length === 0) {
    throw new Error("mergeGovernedPresentation requires at least one result.");
  }

  const first = results[0];
  if (first === undefined) {
    throw new Error("mergeGovernedPresentation requires at least one result.");
  }

  const rest = results.slice(1);

  return rest.reduce<PrimitiveGovernanceResult>(
    (merged, next) => ({
      recipeName: next.recipeName,
      recipe: next.recipe,
      selection: next.selection,
      violations: [...merged.violations, ...next.violations],
      className: cn(merged.className, next.className),
      state: next.state,
      slot: next.slot,
      motion: next.motion,
      accessibility: next.accessibility,
      dataAttributes: {
        ...merged.dataAttributes,
        ...next.dataAttributes,
      },
    }),
    first
  );
}

/**
 * Merges consumer DOM props with governed presentation in canonical order:
 * `{...props}` → semantic `data-*` → `{...governed.dataAttributes}` (wins).
 *
 * `className` must be resolved only through primitive governance — never via
 * consumer prop spread.
 */
export function applyGovernedPresentation<P extends object>(
  props: P,
  governed: PrimitiveGovernanceResult,
  semanticData?: Readonly<Record<string, string | boolean | number | undefined>>
): P & Readonly<Record<string, string>> & { readonly className: string } {
  const filteredSemantic = semanticData
    ? (Object.fromEntries(
        Object.entries(semanticData).filter(([, value]) => value !== undefined)
      ) as Record<string, string | boolean | number>)
    : {};

  return {
    ...props,
    ...filteredSemantic,
    ...governed.dataAttributes,
    className: cn(governed.className),
  } as P & Readonly<Record<string, string>> & { readonly className: string };
}
