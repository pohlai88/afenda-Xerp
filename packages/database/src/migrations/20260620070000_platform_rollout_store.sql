CREATE TYPE "public"."feature_flag_rollout" AS ENUM('off', 'internal', 'beta', 'limited', 'on');--> statement-breakpoint
CREATE TYPE "public"."kill_switch_severity" AS ENUM('standard', 'urgent', 'critical');--> statement-breakpoint
CREATE TABLE "platform_feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(128) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"rollout" "feature_flag_rollout" NOT NULL,
	"environments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tenant_allowlist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"company_allowlist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"kill_switch_key" varchar(128),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_kill_switches" (
	"key" varchar(128) PRIMARY KEY NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"severity" "kill_switch_severity" NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"activated_by" varchar(128),
	"activated_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "platform_feature_flags_key_uidx" ON "platform_feature_flags" USING btree ("key");--> statement-breakpoint
CREATE INDEX "platform_feature_flags_rollout_idx" ON "platform_feature_flags" USING btree ("rollout");--> statement-breakpoint
CREATE INDEX "platform_kill_switches_active_idx" ON "platform_kill_switches" USING btree ("active");
