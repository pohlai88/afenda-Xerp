/**
 * Supabase platform capabilities excluded from the current production release.
 * Authority: ARCH-SUPA-001 Slice 4.
 *
 * Not in current production release scope.
 * Requires separate ARCH/FDR approval before implementation.
 */
export const SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES = [
  "realtime",
  "edge_functions",
  "database_webhooks",
  "gotrue_erp_identity",
  "postgrest_tenant_writes",
  "supabase_storage_runtime",
] as const;

export type SupabaseExcludedProductionCapability =
  (typeof SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES)[number];

export function isSupabaseExcludedProductionCapability(
  value: string
): value is SupabaseExcludedProductionCapability {
  return (
    SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES as readonly string[]
  ).includes(value);
}
