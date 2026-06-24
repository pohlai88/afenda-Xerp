-- Defense-in-depth tenant isolation for tenant_commercial_plans (Phase 4 closeout).
-- Application-level grants remain authoritative; policies accept JWT claims or app session vars.

ALTER TABLE "tenant_commercial_plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "tenant_commercial_plans_tenant_isolation" ON "tenant_commercial_plans"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );
