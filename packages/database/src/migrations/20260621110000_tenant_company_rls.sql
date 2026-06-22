-- Tenant and legal-entity RLS foundation (fail closed by default).
-- Application-level authorization remains primary; these policies prepare Supabase JWT claims.

ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "entity_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "companies_tenant_isolation" ON "companies"
  AS PERMISSIVE FOR ALL TO public
  USING (tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', ''));--> statement-breakpoint

CREATE POLICY "organizations_tenant_isolation" ON "organizations"
  AS PERMISSIVE FOR ALL TO public
  USING (tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', ''));--> statement-breakpoint

CREATE POLICY "entity_groups_tenant_isolation" ON "entity_groups"
  AS PERMISSIVE FOR ALL TO public
  USING (tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', ''));--> statement-breakpoint

CREATE POLICY "legal_entity_ownership_tenant_isolation" ON "legal_entity_ownership"
  AS PERMISSIVE FOR ALL TO public
  USING (tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', ''));--> statement-breakpoint

CREATE POLICY "memberships_actor_isolation" ON "memberships"
  AS PERMISSIVE FOR ALL TO public
  USING (user_id::text = coalesce(auth.jwt() ->> 'platform_user_id', ''));
