import type {
  CrossRepresentationRouteKey,
  ReportingContextProfileRouteKey,
  StandardProcessRouteKey,
} from "./standard-process-route.contract.js";

export const STANDARD_PROCESS_ROUTING: Readonly<
  Record<StandardProcessRouteKey, readonly string[]>
> = {
  holding_relationship_subsidiary: ["IFRS_10"],
  holding_relationship_joint_venture: ["IFRS_11", "IAS_28"],
  holding_relationship_associate: ["IAS_28"],
  holding_relationship_minority_investment: ["IFRS_9", "LOCAL_POLICY_REVIEW"],
  lease_contract_recognition: ["IFRS_16"],
  financial_statement_presentation: ["IFRS_18"],
} as const;

/** B13 — reporting context profile routing (Domain NS §3.4). */
export const REPORTING_CONTEXT_PROCESS_ROUTING: Readonly<
  Record<ReportingContextProfileRouteKey, readonly string[]>
> = {
  "profile:statutory:holding_relationship_subsidiary": ["IFRS_10"],
  "profile:group_consolidation:holding_relationship_subsidiary": ["IFRS_10"],
  "profile:group_consolidation:holding_relationship_joint_venture": [
    "IFRS_11",
    "IAS_28",
  ],
  "profile:group_consolidation:holding_relationship_associate": ["IAS_28"],
  "profile:tax:holding_relationship_minority_investment": [
    "IFRS_9",
    "LOCAL_POLICY_REVIEW",
  ],
  "profile:statutory:lease_contract_recognition": ["IFRS_16"],
  "profile:group_consolidation:lease_contract_recognition": ["IFRS_16"],
  "profile:regulatory_disclosure:financial_statement_presentation": ["IFRS_18"],
} as const;

/** B16 — cross-representation routing between parallel books (Domain NS §3.2). */
export const CROSS_REPRESENTATION_ROUTING: Readonly<
  Record<CrossRepresentationRouteKey, readonly string[]>
> = {
  "cross_rep:statutory_to_group:holding_relationship_subsidiary": ["IFRS_10"],
  "cross_rep:statutory_to_group:holding_relationship_associate": ["IAS_28"],
  "cross_rep:tax_to_statutory:lease_contract_recognition": ["IFRS_16"],
  "cross_rep:management_to_group:financial_statement_presentation": ["IFRS_18"],
} as const;

export function resolveStandardProcessRoute(
  eventType: string
): readonly string[] {
  if (eventType in STANDARD_PROCESS_ROUTING) {
    return STANDARD_PROCESS_ROUTING[eventType as StandardProcessRouteKey];
  }
  return [];
}

export function resolveReportingContextProcessRoute(
  reportingPurpose: string,
  eventType: string
): readonly string[] {
  const profileKey =
    `profile:${reportingPurpose}:${eventType}` as ReportingContextProfileRouteKey;
  return (
    REPORTING_CONTEXT_PROCESS_ROUTING[profileKey] ??
    resolveStandardProcessRoute(eventType)
  );
}

export function resolveCrossRepresentationRoute(
  representationTransition: string,
  eventType: string
): readonly string[] {
  const routeKey =
    `cross_rep:${representationTransition}:${eventType}` as CrossRepresentationRouteKey;
  return CROSS_REPRESENTATION_ROUTING[routeKey] ?? [];
}
