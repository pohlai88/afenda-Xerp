import { describe, expect, it } from "vitest";

import {
  buildErpDiagnosticContext,
  createErpLogger,
} from "@/lib/observability/create-erp-logger";
import {
  createErpCorrelationId,
  toErpCorrelationId,
} from "@/lib/observability/erp-correlation-id";
import {
  ERP_APP_VERSION,
  ERP_DIAGNOSTIC_DEFAULTS,
} from "@/lib/observability/erp-diagnostic-defaults";
import erpPackage from "../../../../package.json" with { type: "json" };

describe("erp-correlation-id", () => {
  it("brands non-empty correlation IDs at the trust boundary", () => {
    expect(toErpCorrelationId(" corr-abc ")).toBe("corr-abc");
  });

  it("rejects empty correlation IDs", () => {
    expect(() => toErpCorrelationId("   ")).toThrow(/correlationId is required/);
  });

  it("creates branded correlation IDs for background work", () => {
    const correlationId = createErpCorrelationId("cron");
    expect(correlationId.startsWith("cron-")).toBe(true);
  });
});

describe("ERP diagnostic version", () => {
  it("matches apps/erp/package.json semver", () => {
    expect(ERP_APP_VERSION).toBe(erpPackage.version);
    expect(ERP_DIAGNOSTIC_DEFAULTS.version).toBe(erpPackage.version);
  });
});

describe("buildErpDiagnosticContext", () => {
  it("maps ERP logger context into a serializable DiagnosticContext", () => {
    const context = buildErpDiagnosticContext(
      {
        correlationId: toErpCorrelationId("corr-test"),
        module: "billing",
      },
      "test"
    );

    expect(context).toEqual({
      correlationId: "corr-test",
      environment: "test",
      module: "billing",
      ...ERP_DIAGNOSTIC_DEFAULTS,
    });
  });
});

describe("createErpLogger", () => {
  it("returns a structured logger facade", () => {
    const logger = createErpLogger({
      correlationId: toErpCorrelationId("corr-test"),
      module: "billing",
    });

    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });
});
