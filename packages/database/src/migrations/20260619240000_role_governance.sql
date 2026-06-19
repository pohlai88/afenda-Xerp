ALTER TABLE "roles" DROP CONSTRAINT "roles_tenant_id_tenants_id_fk";--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TYPE "role_status" ADD VALUE IF NOT EXISTS 'archived';--> statement-breakpoint
CREATE INDEX "roles_tenant_status_idx" ON "roles" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "roles_tenant_scope_status_idx" ON "roles" USING btree ("tenant_id","scope","status");
