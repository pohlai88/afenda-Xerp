import { describe, expect, it } from "vitest";
import {
  AUDIT_RESULTS,
  AUDIT_SOURCES,
  AuditValidationError,
  buildAuditEventRow,
  createLogger,
  getPackageName,
  PACKAGE_NAME,
  writeAuditEvent,
} from "../index";

describe("@afenda/observability", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/observability");
    expect(getPackageName()).toBe("@afenda/observability");
  });

  it("exports TIP-010 governed audit vocabularies", () => {
    expect(AUDIT_RESULTS).toEqual([
      "success",
      "failure",
      "blocked",
      "denied",
      "pending",
      "approved",
      "rejected",
      "reversed",
    ]);
    expect(AUDIT_SOURCES).toEqual([
      "ui",
      "api",
      "server_action",
      "job",
      "integration",
      "import",
      "ai",
      "system",
    ]);
  });

  it("builds serializable audit rows and rejects forbidden metadata", () => {
    expect(
      buildAuditEventRow({
        actorId: "user-001",
        actorType: "user",
        module: "authorization",
        action: "permission.granted",
        targetType: "role",
        targetId: "role-001",
        result: "approved",
        source: "api",
        correlationId: "corr-001",
        metadata: { permission: "system_admin.users_manage" },
      })
    ).toMatchObject({
      actorId: "user-001",
      result: "approved",
      source: "api",
      correlationId: "corr-001",
    });

    expect(() =>
      buildAuditEventRow({
        actorId: "user-001",
        actorType: "user",
        module: "auth",
        action: "session.created",
        targetType: "session",
        result: "success",
        source: "api",
        correlationId: "corr-002",
        metadata: { accessToken: "blocked" },
      })
    ).toThrow(AuditValidationError);
  });

  it("writes audit events only through a configured persistence adapter", async () => {
    const writtenRows: unknown[] = [];

    const result = await writeAuditEvent(
      {
        actorType: "system",
        module: "feature_control",
        action: "feature.enabled",
        targetType: "feature",
        targetId: "ap-approval",
        result: "success",
        source: "system",
        correlationId: "corr-003",
      },
      {
        write: (row) => {
          writtenRows.push(row);
          return Promise.resolve({ id: "audit-001" });
        },
      }
    );

    expect(result).toEqual({ id: "audit-001" });
    expect(writtenRows).toHaveLength(1);
    expect(writtenRows[0]).toMatchObject({
      actorId: "system",
      source: "system",
      correlationId: "corr-003",
    });
  });

  it("creates structured logs with the diagnostic correlation id", () => {
    const entries: unknown[] = [];
    const logger = createLogger(
      {
        correlationId: "corr-log-001",
        environment: "test",
        service: "afenda",
        package: "@afenda/observability",
        module: "logger",
        version: "0.0.0",
      },
      { write: (entry) => entries.push(entry) }
    );

    logger.info("audit written", { module: "authorization" });

    expect(entries[0]).toMatchObject({
      correlationId: "corr-log-001",
      level: "info",
      message: "audit written",
    });
  });
});
