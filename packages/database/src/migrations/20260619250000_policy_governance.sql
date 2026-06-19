CREATE TYPE "public"."policy_scope" AS ENUM('platform', 'tenant', 'company', 'organization', 'module', 'workflow');--> statement-breakpoint
ALTER TABLE "policies" DROP CONSTRAINT "policies_tenant_id_tenants_id_fk";--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TYPE "policy_status" ADD VALUE IF NOT EXISTS 'archived';--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "scope" "policy_scope";--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "priority" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "condition" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "policies" SET "scope" = 'platform' WHERE "tenant_id" IS NULL;--> statement-breakpoint
UPDATE "policies" SET "scope" = 'tenant' WHERE "tenant_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "policies" ALTER COLUMN "scope" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "policies_tenant_status_idx" ON "policies" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "policies_tenant_scope_status_idx" ON "policies" USING btree ("tenant_id","scope","status");--> statement-breakpoint
CREATE INDEX "policies_effect_status_idx" ON "policies" USING btree ("effect","status");
