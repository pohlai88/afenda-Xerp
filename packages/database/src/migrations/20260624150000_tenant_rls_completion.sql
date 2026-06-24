-- Defense-in-depth tenant isolation for remaining tenant_id tables (TIP-007/012 DoD #16).
-- Application-level grants remain authoritative; policies accept JWT claims or app session vars.

ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "entitlement_grants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "execution_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "outbox_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "policies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "storage_objects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "usage_limit_counters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "audit_events_tenant_isolation" ON "audit_events"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "entitlement_grants_tenant_isolation" ON "entitlement_grants"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "execution_runs_tenant_isolation" ON "execution_runs"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "outbox_events_tenant_isolation" ON "outbox_events"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "policies_tenant_isolation" ON "policies"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id IS NULL
    OR tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "projects_tenant_isolation" ON "projects"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "roles_tenant_isolation" ON "roles"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id IS NULL
    OR tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "storage_objects_tenant_isolation" ON "storage_objects"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "teams_tenant_isolation" ON "teams"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "usage_limit_counters_tenant_isolation" ON "usage_limit_counters"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );
