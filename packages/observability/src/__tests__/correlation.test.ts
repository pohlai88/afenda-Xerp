import { describe, expect, it } from "vitest";
import { withAuditEvidence } from "../audit-action-evidence.js";
import { buildAuditEventRow } from "../audit-event.builder.js";
import type {
  AuditEventInsertRow,
  WriteAuditEventResult,
} from "../contracts/audit-event.contract.js";
import {
  assertCorrelationId,
  createCorrelationId,
} from "../contracts/correlation.contract.js";
import { createLogger } from "../logger.js";

const CORRELATION_PREFIX_PATTERN = /^[^-]+-/;
const UUID_V4_PATTERN =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

describe("createCorrelationId", () => {
  it("generates a non-empty string with default prefix", () => {
    const id = createCorrelationId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(5);
    expect(id.startsWith("corr-")).toBe(true);
  });

  it("respects a custom prefix", () => {
    const id = createCorrelationId("req");
    expect(id.startsWith("req-")).toBe(true);
  });

  it("generates unique IDs on each call", () => {
    const ids = new Set(
      Array.from({ length: 100 }, () => createCorrelationId())
    );
    expect(ids.size).toBe(100);
  });

  it("includes a UUIDv4 segment", () => {
    const id = createCorrelationId();
    const uuidSegment = id.replace(CORRELATION_PREFIX_PATTERN, "");
    expect(uuidSegment).toMatch(UUID_V4_PATTERN);
  });
});

describe("assertCorrelationId", () => {
  it("returns trimmed valid value", () => {
    expect(assertCorrelationId("  corr-001  ")).toBe("corr-001");
  });

  it("passes through non-padded value", () => {
    expect(assertCorrelationId("corr-abc")).toBe("corr-abc");
  });

  it("throws on empty string", () => {
    expect(() => assertCorrelationId("")).toThrow("correlationId is required");
  });

  it("throws on whitespace-only string", () => {
    expect(() => assertCorrelationId("   ")).toThrow(
      "correlationId is required"
    );
  });
});

describe("correlation ID propagation contract", () => {
  it("same correlation ID flows through audit and log entries", () => {
    const correlationId = createCorrelationId("flow");
    const logEntries: unknown[] = [];

    const logger = createLogger(
      {
        correlationId,
        environment: "test",
        service: "afenda",
        package: "@afenda/observability",
        module: "membership",
        version: "0.0.0",
      },
      { write: (entry: unknown) => logEntries.push(entry) }
    );

    logger.info("correlation propagation test");

    const auditRow = buildAuditEventRow({
      correlationId,
      actorType: "user",
      actorId: "user-001",
      module: "membership",
      action: "membership.create",
      targetType: "membership",
      result: "success",
      source: "api",
    });

    const logEntry = logEntries[0] as { correlationId: string };
    expect(logEntry.correlationId).toBe(correlationId);
    expect(auditRow.correlationId).toBe(correlationId);
  });

  it("middleware correlation ID flows into withAuditEvidence audit row", async () => {
    const middlewareCorrelationId = "x-corr-from-middleware-001";
    const rows: AuditEventInsertRow[] = [];

    const adapter = {
      write: (row: AuditEventInsertRow): Promise<WriteAuditEventResult> => {
        rows.push(row);
        return Promise.resolve({ id: "audit-corr-001" });
      },
    };

    await withAuditEvidence(
      {
        correlationId: middlewareCorrelationId,
        actorType: "user",
        actorUserId: "user-001",
        module: "membership",
        action: "membership.create",
        targetType: "membership",
        source: "server_action",
      },
      async () => ({ id: "mem-001" }),
      adapter
    );

    expect(rows[0]?.correlationId).toBe(middlewareCorrelationId);
  });
});
