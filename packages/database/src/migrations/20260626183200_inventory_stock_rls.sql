-- Defense-in-depth tenant isolation for inventory stock runtime (fdr-r02 Slice 3).

ALTER TABLE "stock_levels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stock_movements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "stock_levels_tenant_isolation" ON "stock_levels"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );--> statement-breakpoint

CREATE POLICY "stock_movements_tenant_isolation" ON "stock_movements"
  AS PERMISSIVE FOR ALL TO public
  USING (
    tenant_id::text = coalesce(
      nullif(auth.jwt() ->> 'tenant_id', ''),
      nullif(current_setting('app.tenant_id', true), '')
    )
  );
