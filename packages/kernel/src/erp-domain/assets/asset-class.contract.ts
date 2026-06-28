export const ASSET_CLASSES = [
  "tangible",
  "intangible",
  "financial",
  "low_value",
] as const;

export type AssetClass = (typeof ASSET_CLASSES)[number];

export function isAssetClass(value: string): value is AssetClass {
  return (ASSET_CLASSES as readonly string[]).includes(value);
}
