ALTER TABLE "organizations" DROP CONSTRAINT "organizations_tenant_id_tenants_id_fk";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_company_id_companies_id_fk";--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
DROP INDEX IF EXISTS "organizations_status_idx";--> statement-breakpoint
CREATE INDEX "organizations_tenant_company_idx" ON "organizations" USING btree ("tenant_id","company_id");--> statement-breakpoint
CREATE INDEX "organizations_company_status_idx" ON "organizations" USING btree ("company_id","status");
