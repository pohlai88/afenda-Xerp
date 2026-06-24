CREATE TYPE "public"."project_lifecycle_status" AS ENUM('draft', 'active', 'on_hold', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"organization_unit_id" uuid,
	"slug" varchar(128) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"status" "project_lifecycle_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid,
	"organization_unit_id" uuid,
	"slug" varchar(128) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"status" "company_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TYPE "public"."membership_scope" ADD VALUE IF NOT EXISTS 'project';--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_unit_id_organizations_id_fk" FOREIGN KEY ("organization_unit_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_unit_id_organizations_id_fk" FOREIGN KEY ("organization_unit_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_tenant_slug_unique" ON "projects" USING btree ("tenant_id","slug");--> statement-breakpoint
CREATE INDEX "projects_tenant_id_idx" ON "projects" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "projects_tenant_status_idx" ON "projects" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "projects_company_id_idx" ON "projects" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "projects_organization_unit_id_idx" ON "projects" USING btree ("organization_unit_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_tenant_slug_unique" ON "teams" USING btree ("tenant_id","slug");--> statement-breakpoint
CREATE INDEX "teams_tenant_id_idx" ON "teams" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teams_tenant_status_idx" ON "teams" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "teams_company_id_idx" ON "teams" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "teams_organization_unit_id_idx" ON "teams" USING btree ("organization_unit_id");--> statement-breakpoint
CREATE INDEX "memberships_project_id_idx" ON "memberships" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_project_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","project_id","role_id") WHERE "scope_type" = 'project';
