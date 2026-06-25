CREATE TYPE "public"."tenant_sso_protocol" AS ENUM('saml', 'oidc');
--> statement-breakpoint
CREATE TABLE "tenant_sso_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider_id" text NOT NULL,
	"display_name" text NOT NULL,
	"protocol" "tenant_sso_protocol" NOT NULL,
	"domain" text NOT NULL,
	"issuer" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sso_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"domain" text NOT NULL,
	"oidc_config" text,
	"saml_config" text,
	"user_id" text,
	"provider_id" text NOT NULL,
	"organization_id" text,
	"domain_verified" boolean
);
--> statement-breakpoint
ALTER TABLE "tenant_sso_providers" ADD CONSTRAINT "tenant_sso_providers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_provider" ADD CONSTRAINT "sso_provider_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_sso_providers_provider_id_uidx" ON "tenant_sso_providers" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_sso_providers_tenant_provider_uidx" ON "tenant_sso_providers" USING btree ("tenant_id","provider_id");--> statement-breakpoint
CREATE INDEX "tenant_sso_providers_tenant_id_idx" ON "tenant_sso_providers" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_sso_providers_tenant_enabled_idx" ON "tenant_sso_providers" USING btree ("tenant_id","enabled");--> statement-breakpoint
CREATE INDEX "sso_provider_user_id_idx" ON "sso_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sso_provider_domain_idx" ON "sso_provider" USING btree ("domain");--> statement-breakpoint
CREATE UNIQUE INDEX "sso_provider_provider_id_uidx" ON "sso_provider" USING btree ("provider_id");
