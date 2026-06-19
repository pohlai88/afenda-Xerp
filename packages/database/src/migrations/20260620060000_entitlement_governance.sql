CREATE TYPE "public"."entitlement_type" AS ENUM('module', 'feature', 'usage_limit', 'localization', 'deployment', 'support', 'security', 'beta');--> statement-breakpoint
CREATE TYPE "public"."entitlement_scope" AS ENUM('global', 'tenant', 'company', 'environment');--> statement-breakpoint
CREATE TYPE "public"."usage_limit_period" AS ENUM('instant', 'daily', 'monthly', 'annual');--> statement-breakpoint
CREATE TABLE "entitlement_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid,
	"key" varchar(191) NOT NULL,
	"type" "entitlement_type" NOT NULL,
	"scope" "entitlement_scope" NOT NULL,
	"environment" varchar(32),
	"enabled" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_limit_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" varchar(64) NOT NULL,
	"scope" "entitlement_scope" NOT NULL,
	"period" "usage_limit_period" NOT NULL,
	"maximum" integer NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"unit" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_commercial_plans" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"plan_template_id" varchar(32) NOT NULL,
	"correlation_id" varchar(128) NOT NULL,
	"provisioned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entitlement_grants" ADD CONSTRAINT "entitlement_grants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlement_grants" ADD CONSTRAINT "entitlement_grants_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_limit_counters" ADD CONSTRAINT "usage_limit_counters_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_commercial_plans" ADD CONSTRAINT "tenant_commercial_plans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entitlement_grants_tenant_key_uidx" ON "entitlement_grants" USING btree ("tenant_id","key");--> statement-breakpoint
CREATE INDEX "entitlement_grants_tenant_id_idx" ON "entitlement_grants" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "entitlement_grants_company_id_idx" ON "entitlement_grants" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_limit_counters_tenant_key_uidx" ON "usage_limit_counters" USING btree ("tenant_id","key");--> statement-breakpoint
CREATE INDEX "usage_limit_counters_tenant_id_idx" ON "usage_limit_counters" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_commercial_plans_template_idx" ON "tenant_commercial_plans" USING btree ("plan_template_id");
