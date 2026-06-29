export const API_STABILITY_CLASSIFICATIONS = [
  "experimental",
  "internal-stable",
  "public-stable",
  "deprecated",
] as const;

export type ApiStabilityClassification =
  (typeof API_STABILITY_CLASSIFICATIONS)[number];
