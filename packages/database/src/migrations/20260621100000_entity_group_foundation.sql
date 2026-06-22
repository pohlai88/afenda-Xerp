CREATE TYPE "public"."ownership_control_type" AS ENUM('control', 'significant_influence', 'joint_control', 'passive_investment');--> statement-breakpoint
CREATE TYPE "public"."ownership_relationship_type" AS ENUM('subsidiary', 'associate', 'joint_venture', 'minority_interest', 'non_controlling_interest');--> statement-breakpoint
CREATE TYPE "public"."consolidation_method" AS ENUM('full', 'proportional', 'equity', 'cost', 'none');--> statement-breakpoint
CREATE TABLE "entity_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"slug" varchar(128) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"parent_legal_entity_id" uuid,
	"status" "company_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "legal_entity_ownership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"entity_group_id" uuid NOT NULL,
	"parent_legal_entity_id" uuid NOT NULL,
	"child_legal_entity_id" uuid NOT NULL,
	"ownership_percentage" numeric(5, 2) NOT NULL,
	"voting_percentage" numeric(5, 2) NOT NULL,
	"control_type" "ownership_control_type" NOT NULL,
	"relationship_type" "ownership_relationship_type" NOT NULL,
	"consolidation_method" "consolidation_method" NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"status" "company_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "entity_group_id" uuid;--> statement-breakpoint
ALTER TABLE "entity_groups" ADD CONSTRAINT "entity_groups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_groups" ADD CONSTRAINT "entity_groups_parent_legal_entity_id_companies_id_fk" FOREIGN KEY ("parent_legal_entity_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ADD CONSTRAINT "legal_entity_ownership_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ADD CONSTRAINT "legal_entity_ownership_entity_group_id_entity_groups_id_fk" FOREIGN KEY ("entity_group_id") REFERENCES "public"."entity_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ADD CONSTRAINT "legal_entity_ownership_parent_legal_entity_id_companies_id_fk" FOREIGN KEY ("parent_legal_entity_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ADD CONSTRAINT "legal_entity_ownership_child_legal_entity_id_companies_id_fk" FOREIGN KEY ("child_legal_entity_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_entity_group_id_entity_groups_id_fk" FOREIGN KEY ("entity_group_id") REFERENCES "public"."entity_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entity_groups_tenant_slug_unique" ON "entity_groups" USING btree ("tenant_id","slug");--> statement-breakpoint
CREATE INDEX "entity_groups_tenant_id_idx" ON "entity_groups" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "entity_groups_tenant_status_idx" ON "entity_groups" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "entity_groups_parent_legal_entity_id_idx" ON "entity_groups" USING btree ("parent_legal_entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "legal_entity_ownership_parent_child_effective_unique" ON "legal_entity_ownership" USING btree ("parent_legal_entity_id","child_legal_entity_id","effective_from");--> statement-breakpoint
CREATE INDEX "legal_entity_ownership_tenant_id_idx" ON "legal_entity_ownership" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "legal_entity_ownership_entity_group_id_idx" ON "legal_entity_ownership" USING btree ("entity_group_id");--> statement-breakpoint
CREATE INDEX "legal_entity_ownership_parent_legal_entity_id_idx" ON "legal_entity_ownership" USING btree ("parent_legal_entity_id");--> statement-breakpoint
CREATE INDEX "legal_entity_ownership_child_legal_entity_id_idx" ON "legal_entity_ownership" USING btree ("child_legal_entity_id");--> statement-breakpoint
CREATE INDEX "companies_entity_group_id_idx" ON "companies" USING btree ("entity_group_id");
