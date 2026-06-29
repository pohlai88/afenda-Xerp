export const API_STABILITY_CLASSIFICATIONS = [
  "experimental",
  "internal-stable",
  "public-stable",
  "deprecated",
] as const;

export type ApiStabilityClassification =
  (typeof API_STABILITY_CLASSIFICATIONS)[number];

/** PAS-API-001 API-012 — deprecated stability requires lifecycle migration when route stays active. */
export function isDeprecatedStabilityClassification(
  stability: ApiStabilityClassification
): boolean {
  return stability === "deprecated";
}
