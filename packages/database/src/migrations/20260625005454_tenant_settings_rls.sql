-- Defense-in-depth tenant isolation for tenant_settings (ARCH-ADMIN-001 Slice 1).

ALTER TABLE "tenant_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "tenant_settings_tenant_isolation" ON "tenant_settings"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );
