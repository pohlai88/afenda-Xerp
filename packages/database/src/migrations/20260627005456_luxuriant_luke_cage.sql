-- PAS §4.1 Slice E delta: execution_runs enterprise_id + warehouse human reference scope
--> statement-breakpoint
DROP INDEX IF EXISTS "warehouses_tenant_company_code_unique";
--> statement-breakpoint
ALTER TABLE "execution_runs" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "warehouse_code" SET DATA TYPE varchar(32);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "execution_runs_enterprise_id_unique" ON "execution_runs" USING btree ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "warehouses_tenant_warehouse_code_unique" ON "warehouses" USING btree ("tenant_id","warehouse_code");
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'enterprise_id_execution_format'
  ) THEN
    ALTER TABLE "execution_runs"
      ADD CONSTRAINT "enterprise_id_execution_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^exe_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
