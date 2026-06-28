export const ASSET_STATUSES = [
  "active",
  "idle",
  "disposed",
  "under_construction",
] as const;

export type AssetStatus = (typeof ASSET_STATUSES)[number];

export function isAssetStatus(value: string): value is AssetStatus {
  return (ASSET_STATUSES as readonly string[]).includes(value);
}
