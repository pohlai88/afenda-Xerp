/** Postgres session variables used when Supabase JWT claims are unavailable. */
export const RLS_SESSION_KEYS = {
  legalEntityId: "app.legal_entity_id",
  platformUserId: "app.platform_user_id",
  tenantId: "app.tenant_id",
} as const;

export interface RlsSessionContext {
  readonly legalEntityId?: string | null;
  readonly platformUserId: string;
  readonly tenantId: string;
}
