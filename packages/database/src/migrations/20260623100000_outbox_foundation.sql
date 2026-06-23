CREATE TYPE "public"."outbox_status" AS ENUM('pending', 'processing', 'published', 'failed', 'dead_letter');--> statement-breakpoint
CREATE TABLE "outbox_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" varchar(191) NOT NULL,
  "event_type" varchar(191) NOT NULL,
  "event_version" varchar(16) DEFAULT '1.0' NOT NULL,
  "tenant_id" uuid,
  "company_id" uuid,
  "organization_id" uuid,
  "correlation_id" varchar(191) NOT NULL,
  "causation_id" varchar(191),
  "execution_run_id" uuid,
  "actor_type" "audit_actor_type",
  "actor_id" varchar(191),
  "reason" text,
  "summary" text,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" "outbox_status" DEFAULT 'pending' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "max_attempts" integer DEFAULT 5 NOT NULL,
  "available_at" timestamp with time zone DEFAULT now() NOT NULL,
  "locked_at" timestamp with time zone,
  "locked_by" varchar(191),
  "published_at" timestamp with time zone,
  "failed_at" timestamp with time zone,
  "last_error" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_execution_run_id_execution_runs_execution_id_fk" FOREIGN KEY ("execution_run_id") REFERENCES "public"."execution_runs"("execution_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "outbox_events_tenant_event_id_idx" ON "outbox_events" USING btree ("tenant_id","event_id");--> statement-breakpoint
CREATE INDEX "outbox_events_tenant_id_idx" ON "outbox_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "outbox_events_company_id_idx" ON "outbox_events" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "outbox_events_organization_id_idx" ON "outbox_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "outbox_events_status_available_at_idx" ON "outbox_events" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX "outbox_events_correlation_id_idx" ON "outbox_events" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "outbox_events_event_type_idx" ON "outbox_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "outbox_events_execution_run_id_idx" ON "outbox_events" USING btree ("execution_run_id");--> statement-breakpoint
CREATE INDEX "outbox_events_locked_at_idx" ON "outbox_events" USING btree ("locked_at");
