CREATE TYPE "public"."execution_status" AS ENUM('success', 'failure', 'retrying', 'cancelled', 'blocked', 'timed_out');--> statement-breakpoint
CREATE TABLE "execution_runs" (
  "execution_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workflow_id" varchar(191) NOT NULL,
  "trigger_task_id" varchar(191) NOT NULL,
  "provider_run_id" varchar(191),
  "status" "execution_status" NOT NULL,
  "attempt" integer DEFAULT 1 NOT NULL,
  "correlation_id" varchar(191) NOT NULL,
  "tenant_id" uuid,
  "company_id" uuid,
  "organization_id" uuid,
  "actor_id" varchar(191),
  "source" varchar(64) NOT NULL,
  "context" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "finished_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "execution_runs" ADD CONSTRAINT "execution_runs_tenant_id_tenants_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("tenant_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_runs" ADD CONSTRAINT "execution_runs_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_runs" ADD CONSTRAINT "execution_runs_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("organization_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_runs_workflow_id_idx" ON "execution_runs" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "execution_runs_status_idx" ON "execution_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "execution_runs_correlation_id_idx" ON "execution_runs" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "execution_runs_tenant_id_idx" ON "execution_runs" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "execution_runs_provider_run_id_idx" ON "execution_runs" USING btree ("provider_run_id");--> statement-breakpoint
CREATE INDEX "execution_runs_started_at_idx" ON "execution_runs" USING btree ("started_at");
