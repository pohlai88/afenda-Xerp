CREATE TYPE "public"."legal_entity_company_type" AS ENUM(
  'holding',
  'parent',
  'subsidiary',
  'associate',
  'joint_venture',
  'minority_interest',
  'branch_entity',
  'standalone'
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "company_type" "legal_entity_company_type" DEFAULT 'standalone' NOT NULL;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "fiscal_calendar_id" uuid;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "effective_from" date;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "effective_to" date;
