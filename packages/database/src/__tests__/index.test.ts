import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import {
  auditEvents,
  authIdentityLinks,
  buildSupabaseDatabaseUrl,
  companies,
  entitlementGrants,
  executionRuns,
  getDatabaseConfigStatus,
  getDatabaseUrl,
  getDedicatedDatabaseUrl,
  getDirectDatabaseUrl,
  getPackageName,
  getSessionDatabaseUrl,
  getSupabaseDbPassword,
  getSupabaseDbRegion,
  getSupabasePoolerHost,
  getSupabaseProjectRef,
  getTransactionDatabaseUrl,
  hasDatabaseUrl,
  hasSupabaseDatabaseConfig,
  InvalidSupabaseDbPoolerHostError,
  InvalidSupabaseProjectUrlError,
  MissingDatabaseUrlError,
  MissingSupabaseDbPasswordError,
  MissingSupabaseDbRegionError,
  MissingSupabaseProjectRefError,
  memberships,
  organizations,
  PACKAGE_NAME,
  PLATFORM_LIFECYCLE_STATUSES,
  permissions,
  platformFeatureFlags,
  platformKillSwitches,
  platformSchema,
  policies,
  rolePermissions,
  roles,
  storageObjects,
  tenantCommercialPlans,
  tenants,
  usageLimitCounters,
  users,
} from "../index.js";

const TEST_PROJECT_REF = "abcdefghijklmnopqrst";
const SUPABASE_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: `https://${TEST_PROJECT_REF}.supabase.co`,
  SUPABASE_DB_REGION: "ap-southeast-2",
  SUPABASE_DB_POOLER_HOST: "aws-1-ap-southeast-2.pooler.supabase.com",
  SUPABASE_DB_PASSWORD: "p@ss!word",
} as const;

const PLATFORM_TABLES = {
  auditEvents,
  authIdentityLinks,
  tenants,
  companies,
  entitlementGrants,
  executionRuns,
  organizations,
  users,
  memberships,
  roles,
  permissions,
  platformFeatureFlags,
  platformKillSwitches,
  policies,
  rolePermissions,
  storageObjects,
  tenantCommercialPlans,
  usageLimitCounters,
} as const;

describe("@afenda/database package", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/database");
    expect(getPackageName()).toBe("@afenda/database");
  });

  it("exports all platform schema tables", () => {
    for (const table of Object.values(PLATFORM_TABLES)) {
      expect(table).toBeDefined();
      expect(getTableName(table)).toBeTruthy();
    }
  });

  it("uses stable core table names", () => {
    expect(getTableName(tenants)).toBe("tenants");
    expect(getTableName(companies)).toBe("companies");
    expect(getTableName(organizations)).toBe("organizations");
    expect(getTableName(users)).toBe("users");
    expect(getTableName(memberships)).toBe("memberships");
    expect(getTableName(roles)).toBe("roles");
    expect(getTableName(permissions)).toBe("permissions");
    expect(getTableName(policies)).toBe("policies");
    expect(getTableName(auditEvents)).toBe("audit_events");
  });

  it("exports shared platform lifecycle statuses", () => {
    expect(PLATFORM_LIFECYCLE_STATUSES).toEqual([
      "active",
      "suspended",
      "archived",
    ]);
  });

  it("defines permission table key metadata columns", () => {
    expect(permissions.key).toBeDefined();
    expect(permissions.domain).toBeDefined();
    expect(permissions.action).toBeDefined();
  });

  it("exports a single platform schema registry aligned with table exports", () => {
    expect(Object.keys(platformSchema).sort()).toEqual(
      Object.keys(PLATFORM_TABLES).sort()
    );
  });

  it("supports audit event actor, scope, action, target, result, and correlation fields", () => {
    const auditInsert = {
      tenantId: "00000000-0000-4000-8000-000000000001",
      companyId: "00000000-0000-4000-8000-000000000002",
      organizationId: "00000000-0000-4000-8000-000000000003",
      actorId: "00000000-0000-4000-8000-000000000004",
      actorType: "user" as const,
      actorUserId: "00000000-0000-4000-8000-000000000004",
      module: "platform",
      action: "membership.create",
      targetType: "membership",
      targetId: "00000000-0000-4000-8000-000000000005",
      result: "success" as const,
      reason: "Membership created",
      permission: "system_admin.users_manage",
      policyId: "policy-approval-001",
      source: "api" as const,
      correlationId: "corr-001",
      eventVersion: "1.0",
      metadata: { source: "test" },
    };

    expect(auditEvents.actorType).toBeDefined();
    expect(auditEvents.actorId).toBeDefined();
    expect(auditEvents.actorUserId).toBeDefined();
    expect(auditEvents.tenantId).toBeDefined();
    expect(auditEvents.companyId).toBeDefined();
    expect(auditEvents.organizationId).toBeDefined();
    expect(auditEvents.action).toBeDefined();
    expect(auditEvents.targetType).toBeDefined();
    expect(auditEvents.targetId).toBeDefined();
    expect(auditEvents.result).toBeDefined();
    expect(auditEvents.reason).toBeDefined();
    expect(auditEvents.permission).toBeDefined();
    expect(auditEvents.policyId).toBeDefined();
    expect(auditEvents.source).toBeDefined();
    expect(auditEvents.ipAddress).toBeDefined();
    expect(auditEvents.userAgent).toBeDefined();
    expect(auditEvents.eventVersion).toBeDefined();
    expect(auditEvents.correlationId).toBeDefined();
    expect(auditInsert.correlationId).toBe("corr-001");
  });
});

describe("environment validation", () => {
  it("throws a clear error when DATABASE_URL and Supabase components are missing", () => {
    expect(() => getDatabaseUrl({})).toThrow(MissingDatabaseUrlError);
    expect(() => getDatabaseUrl({ DATABASE_URL: "" })).toThrow(
      MissingDatabaseUrlError
    );
    expect(() => getDatabaseUrl({ DATABASE_URL: "   " })).toThrow(
      MissingDatabaseUrlError
    );
    expect(hasDatabaseUrl({})).toBe(false);
    expect(hasSupabaseDatabaseConfig({})).toBe(false);
    expect(() => getSupabaseDbPassword({})).toThrow(
      MissingSupabaseDbPasswordError
    );
    expect(() =>
      buildSupabaseDatabaseUrl("session", {
        NEXT_PUBLIC_SUPABASE_URL: `https://${TEST_PROJECT_REF}.supabase.co`,
        SUPABASE_DB_PASSWORD: "secret",
      })
    ).toThrow(MissingSupabaseDbRegionError);
  });

  it("rejects invalid Supabase env values with governed errors", () => {
    expect(() =>
      getSupabaseProjectRef({ SUPABASE_PROJECT_REF: "abc def" })
    ).toThrow(MissingSupabaseProjectRefError);
    expect(() =>
      getSupabaseProjectRef({ SUPABASE_PROJECT_REF: "http://bad" })
    ).toThrow(MissingSupabaseProjectRefError);
    expect(() =>
      getSupabaseProjectRef({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        SUPABASE_DB_PASSWORD: "secret",
      })
    ).toThrow(InvalidSupabaseProjectUrlError);
    expect(() =>
      getSupabaseDbRegion({ SUPABASE_DB_REGION: "hello world" })
    ).toThrow(MissingSupabaseDbRegionError);
    expect(() =>
      getSupabasePoolerHost({
        SUPABASE_DB_POOLER_HOST: "bad host",
      })
    ).toThrow(InvalidSupabaseDbPoolerHostError);
  });

  it("reports database config diagnostics without throwing", () => {
    expect(getDatabaseConfigStatus({})).toEqual({
      ready: false,
      source: null,
      issues: [
        "missing_supabase_db_password",
        "missing_supabase_project_ref",
        "missing_supabase_db_region",
      ],
    });
    expect(getDatabaseConfigStatus(SUPABASE_ENV)).toEqual({
      ready: true,
      source: "supabase",
      issues: [],
    });
    expect(
      getDatabaseConfigStatus({
        DATABASE_URL: "postgresql://user:pass@localhost:5432/afenda",
      })
    ).toEqual({
      ready: true,
      source: "database_url",
      issues: [],
    });
  });

  it("returns the trimmed DATABASE_URL when present", () => {
    const url = "postgresql://user:pass@localhost:5432/afenda";
    expect(getDatabaseUrl({ DATABASE_URL: `  ${url}  ` })).toBe(url);
  });

  it("builds Supabase connection strings for direct, dedicated, session, and transaction modes", () => {
    expect(getSupabaseProjectRef(SUPABASE_ENV)).toBe(TEST_PROJECT_REF);
    expect(getSupabaseDbRegion(SUPABASE_ENV)).toBe("ap-southeast-2");
    expect(getSupabasePoolerHost(SUPABASE_ENV)).toBe(
      "aws-1-ap-southeast-2.pooler.supabase.com"
    );
    expect(getSupabaseDbPassword(SUPABASE_ENV)).toBe("p@ss!word");

    expect(buildSupabaseDatabaseUrl("direct", SUPABASE_ENV)).toBe(
      `postgresql://postgres:p%40ss!word@db.${TEST_PROJECT_REF}.supabase.co:5432/postgres`
    );
    expect(buildSupabaseDatabaseUrl("dedicated", SUPABASE_ENV)).toBe(
      `postgresql://postgres:p%40ss!word@db.${TEST_PROJECT_REF}.supabase.co:6543/postgres`
    );
    expect(getSessionDatabaseUrl(SUPABASE_ENV)).toBe(
      `postgresql://postgres.${TEST_PROJECT_REF}:p%40ss!word@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`
    );
    expect(getTransactionDatabaseUrl(SUPABASE_ENV)).toBe(
      `postgresql://postgres.${TEST_PROJECT_REF}:p%40ss!word@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
    );
    expect(getDirectDatabaseUrl(SUPABASE_ENV)).toBe(
      buildSupabaseDatabaseUrl("direct", SUPABASE_ENV)
    );
    expect(getDedicatedDatabaseUrl(SUPABASE_ENV)).toBe(
      buildSupabaseDatabaseUrl("dedicated", SUPABASE_ENV)
    );
    expect(getDatabaseUrl(SUPABASE_ENV)).toBe(
      getTransactionDatabaseUrl(SUPABASE_ENV)
    );
  });
});
