CREATE TYPE "public"."storage_provider" AS ENUM('r2', 'blob');--> statement-breakpoint
CREATE TABLE "storage_objects" (
  "object_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "company_id" uuid,
  "organization_id" uuid,
  "bucket" varchar(191) NOT NULL,
  "path" varchar(1024) NOT NULL,
  "filename" varchar(255) NOT NULL,
  "mime_type" varchar(191) NOT NULL,
  "size_bytes" bigint NOT NULL,
  "checksum" jsonb,
  "provider" "storage_provider" NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "storage_objects" ADD CONSTRAINT "storage_objects_tenant_id_tenants_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("tenant_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_objects" ADD CONSTRAINT "storage_objects_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_objects" ADD CONSTRAINT "storage_objects_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("organization_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storage_objects_tenant_id_idx" ON "storage_objects" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "storage_objects_company_id_idx" ON "storage_objects" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "storage_objects_organization_id_idx" ON "storage_objects" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "storage_objects_provider_idx" ON "storage_objects" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "storage_objects_path_idx" ON "storage_objects" USING btree ("bucket", "path");--> statement-breakpoint
CREATE INDEX "storage_objects_created_at_idx" ON "storage_objects" USING btree ("created_at");
