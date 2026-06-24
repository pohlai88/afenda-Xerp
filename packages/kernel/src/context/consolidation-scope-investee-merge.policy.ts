import type { ConsolidationEntityScope } from "./consolidation-scope-context.contract.js";

/**
 * When multiple effective ownership interests reference the same investee
 * (`childLegalEntityId`), the resolver keeps one entry per company id.
 *
 * Policy: **last-wins by input array order** — the last matching interest in
 * `ownershipInterests` wins. Full merge semantics (e.g. highest percentage,
 * control-type precedence) require a future ADR after data-quality rules exist.
 */
export const CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY =
  "last_wins_by_input_order" as const;

export type ConsolidationScopeInvesteeDedupPolicy =
  typeof CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY;

/**
 * Merges a duplicate investee scope entry. Explicit last-wins — prior entry is discarded.
 */
export function mergeInvesteeConsolidationScopeEntry(
  _existing: ConsolidationEntityScope | undefined,
  incoming: ConsolidationEntityScope
): ConsolidationEntityScope {
  return incoming;
}
