import { cn } from "../lib/utils";

import type { PrimitiveGovernanceResult } from "./primitive-contract";

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
