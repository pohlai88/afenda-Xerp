ALTER TABLE "companies" DROP CONSTRAINT "companies_tenant_id_tenants_id_fk";--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_tenant_status_idx" ON "companies" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_tenant_country_registration_unique" ON "companies" USING btree ("tenant_id","country_code","registration_number") WHERE "registration_number" is not null;
