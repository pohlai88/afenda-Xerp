export const ATTRIBUTION_MODELS = [
  "first_touch",
  "last_touch",
  "linear",
  "u_shaped",
] as const;

export type AttributionModel = (typeof ATTRIBUTION_MODELS)[number];

export function isAttributionModel(value: string): value is AttributionModel {
  return (ATTRIBUTION_MODELS as readonly string[]).includes(value);
}
