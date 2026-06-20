import { afterEach, describe, expect, it } from "vitest";
import {
  AuditAdapterMissingError,
  configureAuditEventPersistence,
  isAuditPersistenceConfigured,
  resetAuditEventPersistence,
  writeAuditEvent,
} from "../audit.writer.js";

const baseInput = {
  correlationId: "corr-writer-001",
  actorType: "system" as const,
  module: "auth",
  action: "sign_in.success",
  targetType: "auth_session",
  result: "success" as const,
  source: "api" as const,
};

afterEach(() => {
  resetAuditEventPersistence();
});

describe("isAuditPersistenceConfigured", () => {
  it("returns false before any adapter is configured", () => {
    expect(isAuditPersistenceConfigured()).toBe(false);
  });

  it("returns true after configureAuditEventPersistence is called", () => {
    configureAuditEventPersistence({
      write: async () => ({ id: "audit-001" }),
    });
    expect(isAuditPersistenceConfigured()).toBe(true);
  });

  it("returns false after resetAuditEventPersistence", () => {
    configureAuditEventPersistence({
      write: async () => ({ id: "audit-001" }),
    });
    resetAuditEventPersistence();
    expect(isAuditPersistenceConfigured()).toBe(false);
  });
});

describe("writeAuditEvent", () => {
  it("throws AuditAdapterMissingError when no adapter is configured and none passed", async () => {
    await expect(writeAuditEvent(baseInput)).rejects.toBeInstanceOf(
      AuditAdapterMissingError
    );
  });

  it("throws AuditAdapterMissingError when explicit null is passed", async () => {
    await expect(writeAuditEvent(baseInput, null)).rejects.toBeInstanceOf(
      AuditAdapterMissingError
    );
  });

  it("writes through a configured global adapter", async () => {
    const rows: unknown[] = [];

    configureAuditEventPersistence({
      write: (row) => {
        rows.push(row);
        return Promise.resolve({ id: "audit-global-001" });
      },
    });

    const result = await writeAuditEvent(baseInput);

    expect(result.id).toBe("audit-global-001");
    expect(rows).toHaveLength(1);
  });

  it("prefers an explicitly passed adapter over the global default", async () => {
    configureAuditEventPersistence({
      write: async () => ({ id: "global" }),
    });

    const result = await writeAuditEvent(baseInput, {
      write: async () => ({ id: "explicit" }),
    });

    expect(result.id).toBe("explicit");
  });
});
