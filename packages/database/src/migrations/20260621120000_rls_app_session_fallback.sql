-- RLS session-variable fallback for Drizzle connections without Supabase JWT claims.
-- Policies accept auth.jwt() claims first, then app.tenant_id / app.platform_user_id.

DROP POLICY IF EXISTS "companies_tenant_isolation" ON "companies";--> statement-breakpoint
CREATE POLICY "companies_tenant_isolation" ON "companies"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

DROP POLICY IF EXISTS "organizations_tenant_isolation" ON "organizations";--> statement-breakpoint
CREATE POLICY "organizations_tenant_isolation" ON "organizations"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

DROP POLICY IF EXISTS "entity_groups_tenant_isolation" ON "entity_groups";--> statement-breakpoint
CREATE POLICY "entity_groups_tenant_isolation" ON "entity_groups"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

DROP POLICY IF EXISTS "legal_entity_ownership_tenant_isolation" ON "legal_entity_ownership";--> statement-breakpoint
CREATE POLICY "legal_entity_ownership_tenant_isolation" ON "legal_entity_ownership"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

DROP POLICY IF EXISTS "memberships_actor_isolation" ON "memberships";--> statement-breakpoint
CREATE POLICY "memberships_actor_isolation" ON "memberships"
  AS PERMISSIVE FOR ALL TO public
  USING (
    user_id::text = coalesce(
      nullif(auth.jwt() ->> 'platform_user_id', ''),
      nullif(current_setting('app.platform_user_id', true), '')
    )
  );
