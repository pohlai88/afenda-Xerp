export const STANDARD_PROCESS_ROUTE_KEYS = [
  "holding_relationship_subsidiary",
  "holding_relationship_joint_venture",
  "holding_relationship_associate",
  "holding_relationship_minority_investment",
  "lease_contract_recognition",
  "financial_statement_presentation",
] as const;

export type StandardProcessRouteKey =
  (typeof STANDARD_PROCESS_ROUTE_KEYS)[number];

export type ReportingContextProfileRouteKey =
  `profile:${string}:${StandardProcessRouteKey}`;

export type CrossRepresentationRouteKey =
  `cross_rep:${string}:${StandardProcessRouteKey}`;

export type ProcessRoutingTargetKey = string;
