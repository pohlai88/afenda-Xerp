ALTER TYPE "public"."audit_result" ADD VALUE IF NOT EXISTS 'blocked';--> statement-breakpoint
ALTER TYPE "public"."audit_result" ADD VALUE IF NOT EXISTS 'pending';--> statement-breakpoint
ALTER TYPE "public"."audit_result" ADD VALUE IF NOT EXISTS 'approved';--> statement-breakpoint
ALTER TYPE "public"."audit_result" ADD VALUE IF NOT EXISTS 'rejected';--> statement-breakpoint
ALTER TYPE "public"."audit_result" ADD VALUE IF NOT EXISTS 'reversed';--> statement-breakpoint
CREATE TYPE "public"."audit_source" AS ENUM('ui', 'api', 'server_action', 'job', 'integration', 'import', 'ai', 'system');--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN "actor_id" varchar(191);--> statement-breakpoint
UPDATE "audit_events"
SET "actor_id" = COALESCE("actor_user_id"::text, "actor_type"::text)
WHERE "actor_id" IS NULL;--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "actor_id" SET NOT NULL;--> statement-breakpoint
UPDATE "audit_events"
SET "source" = CASE
  WHEN "source" IN ('app', 'auth') THEN 'api'
  WHEN "source" = 'cron' THEN 'job'
  ELSE "source"
END;--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "source" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "source" TYPE "public"."audit_source" USING "source"::"public"."audit_source";--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "source" SET DEFAULT 'api';--> statement-breakpoint
CREATE INDEX "audit_events_actor_id_idx" ON "audit_events" USING btree ("actor_id");
