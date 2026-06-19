CREATE TYPE "public"."membership_scope" AS ENUM('tenant', 'company', 'organization');--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "scope_type" "membership_scope" DEFAULT 'tenant' NOT NULL;--> statement-breakpoint
UPDATE "memberships" SET "scope_type" = 'organization' WHERE "organization_id" IS NOT NULL;--> statement-breakpoint
UPDATE "memberships" SET "scope_type" = 'company' WHERE "organization_id" IS NULL AND "company_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "scope_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_tenant_id_tenants_id_fk";--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_company_id_companies_id_fk";--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organization_id_organizations_id_fk";--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
DROP INDEX IF EXISTS "memberships_status_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_tenant_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","role_id") WHERE "scope_type" = 'tenant';--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_company_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","company_id","role_id") WHERE "scope_type" = 'company';--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_organization_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","organization_id","role_id") WHERE "scope_type" = 'organization';--> statement-breakpoint
CREATE INDEX "memberships_user_status_idx" ON "memberships" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "memberships_user_tenant_status_idx" ON "memberships" USING btree ("user_id","tenant_id","status");--> statement-breakpoint
CREATE INDEX "memberships_user_company_status_idx" ON "memberships" USING btree ("user_id","company_id","status");--> statement-breakpoint
CREATE INDEX "memberships_user_organization_status_idx" ON "memberships" USING btree ("user_id","organization_id","status");
