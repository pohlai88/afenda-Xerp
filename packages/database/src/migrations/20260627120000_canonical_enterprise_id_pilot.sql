CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  unix_ts_ms bytea;
  uuid_bytes bytea;
BEGIN
  unix_ts_ms = substring(
    int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint)
    from 3
  );
  uuid_bytes = uuid_send(gen_random_uuid());
  uuid_bytes = overlay(uuid_bytes placing unix_ts_ms from 1 for 6);
  uuid_bytes = set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
  uuid_bytes = set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$;
--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_enterprise_id_unique" ON "tenants" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_enterprise_id_unique" ON "products" ("enterprise_id");
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tenants_enterprise_id_tenant_format'
  ) THEN
    ALTER TABLE "tenants"
      ADD CONSTRAINT "tenants_enterprise_id_tenant_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^ten_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_enterprise_id_product_format'
  ) THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "products_enterprise_id_product_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^prd_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
