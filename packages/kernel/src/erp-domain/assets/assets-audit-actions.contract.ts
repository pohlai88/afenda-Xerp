export const ASSETS_AUDIT_ACTIONS = [
  "asset.capitalized",
  "depreciation.run",
  "asset.transferred",
  "asset.disposed",
] as const;

export type AssetsAuditAction = (typeof ASSETS_AUDIT_ACTIONS)[number];

export function isAssetsAuditAction(value: string): value is AssetsAuditAction {
  return (ASSETS_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseAssetsAuditAction(
  value: string
): AssetsAuditAction | null {
  return isAssetsAuditAction(value) ? value : null;
}
