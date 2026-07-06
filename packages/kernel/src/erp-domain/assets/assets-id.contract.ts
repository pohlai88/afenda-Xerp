import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type FixedAssetId = Brand<string, "FixedAssetId">;

export function brandFixedAssetId(value: string | FixedAssetId): FixedAssetId {
  return brandTrimRequired(value, "fixedAssetId") as FixedAssetId;
}

export function toFixedAssetId(value: FixedAssetId): string {
  return unbrand(value);
}

export type DepreciationRunId = Brand<string, "DepreciationRunId">;

export function brandDepreciationRunId(
  value: string | DepreciationRunId
): DepreciationRunId {
  return brandTrimRequired(value, "depreciationRunId") as DepreciationRunId;
}

export function toDepreciationRunId(value: DepreciationRunId): string {
  return unbrand(value);
}

export type AssetTransferId = Brand<string, "AssetTransferId">;

export function brandAssetTransferId(
  value: string | AssetTransferId
): AssetTransferId {
  return brandTrimRequired(value, "assetTransferId") as AssetTransferId;
}

export function toAssetTransferId(value: AssetTransferId): string {
  return unbrand(value);
}
