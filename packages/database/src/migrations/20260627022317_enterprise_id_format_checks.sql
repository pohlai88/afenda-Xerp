-- PAS §4.1 / ADR-0022 — platform entity enterprise_id format CHECK constraints
-- Patterns mirror @afenda/kernel canonical-id + packages/database/src/ids/enterprise-id-patterns.ts
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_tenant_format') THEN
    ALTER TABLE "tenants"
      ADD CONSTRAINT "enterprise_id_tenant_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^ten_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_entityGroup_format') THEN
    ALTER TABLE "entity_groups"
      ADD CONSTRAINT "enterprise_id_entityGroup_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^egp_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_company_format') THEN
    ALTER TABLE "companies"
      ADD CONSTRAINT "enterprise_id_company_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^cmp_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_organization_format') THEN
    ALTER TABLE "organizations"
      ADD CONSTRAINT "enterprise_id_organization_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^org_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_team_format') THEN
    ALTER TABLE "teams"
      ADD CONSTRAINT "enterprise_id_team_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^tea_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_project_format') THEN
    ALTER TABLE "projects"
      ADD CONSTRAINT "enterprise_id_project_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^prj_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_user_format') THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "enterprise_id_user_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^usr_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_role_format') THEN
    ALTER TABLE "roles"
      ADD CONSTRAINT "enterprise_id_role_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^rol_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_membership_format') THEN
    ALTER TABLE "memberships"
      ADD CONSTRAINT "enterprise_id_membership_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^mem_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_permission_format') THEN
    ALTER TABLE "permissions"
      ADD CONSTRAINT "enterprise_id_permission_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^per_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_policy_format') THEN
    ALTER TABLE "policies"
      ADD CONSTRAINT "enterprise_id_policy_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^pol_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_auditEvent_format') THEN
    ALTER TABLE "audit_events"
      ADD CONSTRAINT "enterprise_id_auditEvent_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^aud_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_execution_format') THEN
    ALTER TABLE "execution_runs"
      ADD CONSTRAINT "enterprise_id_execution_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^exe_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_ownershipInterest_format') THEN
    ALTER TABLE "legal_entity_ownership"
      ADD CONSTRAINT "enterprise_id_ownershipInterest_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^own_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_product_format') THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "enterprise_id_product_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^prd_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enterprise_id_warehouse_format') THEN
    ALTER TABLE "warehouses"
      ADD CONSTRAINT "enterprise_id_warehouse_format"
      CHECK ("enterprise_id" IS NULL OR "enterprise_id" ~ '^whs_[0-9A-HJKMNP-TV-Z]{26}$')
      NOT VALID;
  END IF;
END $$;
