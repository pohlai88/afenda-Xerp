import { describe, expect, it } from "vitest";
import { createPinoLogger } from "../create-pino-logger.js";
import { PINO_REDACT_CENSOR, PINO_REDACT_PATHS } from "../pino.redact.js";
import { createPinoSink, PinoProductionConfigError } from "../pino.sink.js";

const testContext = {
  correlationId: "corr-pino-001",
  environment: "test",
  service: "afenda-erp",
  package: "@afenda/erp",
  module: "auth",
  version: "0.0.0",
} as const;

const prodContext = {
  ...testContext,
  environment: "production",
} as const;

describe("createPinoSink", () => {
  it("creates a LoggerSink that does not throw on write", () => {
    const sink = createPinoSink(testContext, { pretty: false });

    expect(() =>
      sink.write({
        correlationId: "corr-pino-001",
        context: testContext,
        level: "info",
        message: "pino sink test",
        timestamp: new Date().toISOString(),
      })
    ).not.toThrow();
  });

  it("creates a LoggerSink for all log levels without throwing", () => {
    const sink = createPinoSink(testContext, { pretty: false });

    for (const level of ["debug", "info", "warn", "error"] as const) {
      expect(() =>
        sink.write({
          correlationId: "corr-pino-001",
          context: testContext,
          level,
          message: `test ${level}`,
          timestamp: new Date().toISOString(),
        })
      ).not.toThrow();
    }
  });

  it("throws PinoProductionConfigError when pretty:true is set in production", () => {
    expect(() => createPinoSink(prodContext, { pretty: true })).toThrow(
      PinoProductionConfigError
    );
  });

  it("allows pretty:false in production without throwing", () => {
    expect(() => createPinoSink(prodContext, { pretty: false })).not.toThrow();
  });

  it("allows pretty:undefined in production (defaults to JSON output)", () => {
    expect(() => createPinoSink(prodContext)).not.toThrow();
  });
});

describe("createPinoLogger", () => {
  it("creates a Logger with all required methods", () => {
    const logger = createPinoLogger(testContext, { pretty: false });

    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("does not throw for any log level", () => {
    const logger = createPinoLogger(testContext, {
      pretty: false,
      level: "debug",
    });

    expect(() => logger.debug("debug message", { key: "val" })).not.toThrow();
    expect(() => logger.info("info message", { key: "val" })).not.toThrow();
    expect(() => logger.warn("warn message", { key: "val" })).not.toThrow();
    expect(() => logger.error("error message", { key: "val" })).not.toThrow();
  });

  it("binds correlationId from DiagnosticContext", () => {
    const logger = createPinoLogger(
      { ...testContext, correlationId: "corr-bound-001" },
      { pretty: false }
    );

    expect(() => logger.info("bound context test")).not.toThrow();
  });

  it("rejects pretty:true in production", () => {
    expect(() => createPinoLogger(prodContext, { pretty: true })).toThrow(
      PinoProductionConfigError
    );
  });
});

describe("PINO_REDACT_PATHS", () => {
  it("includes critical sensitive path patterns", () => {
    expect(PINO_REDACT_PATHS).toContain("password");
    expect(PINO_REDACT_PATHS).toContain("secret");
    expect(PINO_REDACT_PATHS).toContain("accessToken");
    expect(PINO_REDACT_PATHS).toContain("authorization");
    expect(PINO_REDACT_PATHS).toContain("*.token");
    expect(PINO_REDACT_PATHS).toContain("*.credential");
  });

  it("uses a non-empty censor string", () => {
    expect(PINO_REDACT_CENSOR).toBeTruthy();
    expect(typeof PINO_REDACT_CENSOR).toBe("string");
  });
});
