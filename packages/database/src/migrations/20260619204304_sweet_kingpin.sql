CREATE TYPE "public"."audit_actor_type" AS ENUM('user', 'system', 'service', 'integration', 'cron', 'import');--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "actor_type" "audit_actor_type" DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "actor_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "permission" varchar(128);--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "policy_id" varchar(128);--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "source" varchar(64) DEFAULT 'app' NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "ip_address" varchar(64);--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "event_version" varchar(16) DEFAULT '1.0' NOT NULL;--> statement-breakpoint
CREATE INDEX "audit_events_tenant_created_at_idx" ON "audit_events" USING btree ("tenant_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_org_created_at_idx" ON "audit_events" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_actor_created_at_idx" ON "audit_events" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_events_module_action_idx" ON "audit_events" USING btree ("module","action");