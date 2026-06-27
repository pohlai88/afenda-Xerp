-- Platform entity enterprise_id rollout (ADR-0021 / PAS §4.1 Slice E)
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "entity_groups" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "legal_entity_ownership" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
ALTER TABLE "audit_events" ADD COLUMN IF NOT EXISTS "enterprise_id" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companies_enterprise_id_unique" ON "companies" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_enterprise_id_unique" ON "organizations" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "entity_groups_enterprise_id_unique" ON "entity_groups" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_enterprise_id_unique" ON "users" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roles_enterprise_id_unique" ON "roles" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "memberships_enterprise_id_unique" ON "memberships" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_enterprise_id_unique" ON "permissions" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "policies_enterprise_id_unique" ON "policies" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projects_enterprise_id_unique" ON "projects" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "teams_enterprise_id_unique" ON "teams" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "warehouses_enterprise_id_unique" ON "warehouses" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "legal_entity_ownership_enterprise_id_unique" ON "legal_entity_ownership" ("enterprise_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_events_enterprise_id_unique" ON "audit_events" ("enterprise_id");
