import { describe, expect, it } from "vitest";
import { buildAuditEventRow } from "../audit/audit-event.builder.js";
import {
  AUDIT_EVENT_VERSION,
  AUDIT_SOURCES,
  type InsertAuditEventInput,
} from "../audit/audit-event.contract.js";
import {
  AuditValidationError,
  assertAuditMetadata,
  parseInsertAuditEventInput,
} from "../audit/audit-event.validation.js";
import { AUDIT_ACTOR_TYPES } from "../database.types.js";

describe("audit event builder", () => {
  const baseInput: InsertAuditEventInput = {
    actorType: "user",
    actorUserId: "00000000-0000-4000-8000-000000000001",
    module: "platform",
    action: "membership.create",
    targetType: "membership",
    targetId: "00000000-0000-4000-8000-000000000002",
    result: "success",
    correlationId: "corr-001",
    permission: "system_admin.users_manage",
    policyId: "policy-approval-001",
    source: "api",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
    metadata: { sourceModule: "permissions" },
  };

  it("exports governed actor types and sources", () => {
    expect(AUDIT_ACTOR_TYPES).toContain("user");
    expect(AUDIT_ACTOR_TYPES).toContain("cron");
    expect(AUDIT_SOURCES).toContain("api");
    expect(AUDIT_SOURCES).not.toContain("auth");
    expect(AUDIT_EVENT_VERSION).toBe("1.0");
  });

  it("builds a normalized append-only row with evidence fields", () => {
    const row = buildAuditEventRow(baseInput);

    expect(row).toMatchObject({
      actorType: "user",
      actorId: baseInput.actorUserId,
      actorUserId: baseInput.actorUserId,
      module: "platform",
      action: "membership.create",
      targetType: "membership",
      targetId: baseInput.targetId,
      result: "success",
      permission: "system_admin.users_manage",
      policyId: "policy-approval-001",
      source: "api",
      correlationId: "corr-001",
      eventVersion: "1.0",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
      metadata: { sourceModule: "permissions" },
    });
  });

  it("defaults optional scope and request context fields", () => {
    const row = buildAuditEventRow({
      actorType: "system",
      module: "auth",
      action: "sign_in.failed",
      targetType: "auth_session",
      result: "failure",
      correlationId: "corr-002",
    });

    expect(row.tenantId).toBeNull();
    expect(row.companyId).toBeNull();
    expect(row.organizationId).toBeNull();
    expect(row.actorUserId).toBeNull();
    expect(row.reason).toBeNull();
    expect(row.permission).toBeNull();
    expect(row.policyId).toBeNull();
    expect(row.actorId).toBe("system");
    expect(row.source).toBe("api");
    expect(row.eventVersion).toBe("1.0");
    expect(row.metadata).toEqual({});
  });

  it("trims required text fields and rejects empty values", () => {
    const row = buildAuditEventRow({
      ...baseInput,
      module: " platform ",
      action: " membership.create ",
      targetType: " membership ",
      correlationId: " corr-001 ",
    });

    expect(row.module).toBe("platform");
    expect(row.correlationId).toBe("corr-001");

    expect(() =>
      buildAuditEventRow({
        ...baseInput,
        action: "   ",
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects invalid audit sources at runtime", () => {
    expect(() =>
      parseInsertAuditEventInput({
        ...baseInput,
        source: "frontend" as never,
      })
    ).toThrow(AuditValidationError);
  });

  it("normalizes legacy audit source aliases for backward compatibility", () => {
    expect(buildAuditEventRow({ ...baseInput, source: "app" }).source).toBe(
      "api"
    );
    expect(buildAuditEventRow({ ...baseInput, source: "auth" }).source).toBe(
      "api"
    );
    expect(buildAuditEventRow({ ...baseInput, source: "cron" }).source).toBe(
      "job"
    );
  });

  it("rejects unsupported event versions", () => {
    expect(() =>
      parseInsertAuditEventInput({
        ...baseInput,
        eventVersion: "2.0" as never,
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects unsafe metadata values", () => {
    expect(() =>
      assertAuditMetadata({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })
    ).toThrow(AuditValidationError);

    expect(() =>
      assertAuditMetadata({
        nested: { value: undefined },
      })
    ).toThrow(AuditValidationError);

    expect(() =>
      assertAuditMetadata({
        tags: ["ok", new Date()],
      })
    ).toThrow(AuditValidationError);
  });

  it("blocks sensitive metadata keys", () => {
    expect(() =>
      assertAuditMetadata({
        access_token: "secret-value",
      })
    ).toThrow(AuditValidationError);

    expect(() =>
      assertAuditMetadata({
        nested: {
          refresh_token: "secret-value",
        },
      })
    ).toThrow(AuditValidationError);
  });
});
