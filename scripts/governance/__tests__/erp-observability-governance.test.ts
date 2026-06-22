import { describe, expect, it } from "vitest";

import { checkErpObservabilityGovernance } from "../erp-observability-governance.mjs";

describe("checkErpObservabilityGovernance", () => {
  it("forbids pino imports in proxy.ts", () => {
    const source = `
      import pino from "pino";
      export function proxy() {}
    `;

    const violations = checkErpObservabilityGovernance(
      source,
      "apps/erp/src/proxy.ts"
    );

    expect(violations.join(" ")).toMatch(/Edge\/proxy runtime/);
  });

  it("forbids direct createPinoLogger outside the ERP factory", () => {
    const source = `
      import { createPinoLogger } from "@afenda/observability";
      export const logger = createPinoLogger({});
    `;

    const violations = checkErpObservabilityGovernance(
      source,
      "apps/erp/src/server/foo.ts"
    );

    expect(violations.join(" ")).toMatch(/createErpLogger/);
  });

  it("requires correlation branding for direct createErpLogger callers", () => {
    const source = `
      import { createErpLogger } from "@/lib/observability/create-erp-logger";
      export const logger = createErpLogger({ correlationId: "raw", module: "x" });
    `;

    const violations = checkErpObservabilityGovernance(
      source,
      "apps/erp/src/server/foo.ts"
    );

    expect(violations.join(" ")).toMatch(/brand correlation IDs/);
  });

  it("forbids raw Error objects in logger metadata", () => {
    const source = `
      logger.error("payment.failed", { error: err });
    `;

    const violations = checkErpObservabilityGovernance(
      source,
      "apps/erp/src/server/foo.ts"
    );

    expect(violations.join(" ")).toMatch(/raw Error objects/);
  });

  it("allows compliant api handler logging wiring", () => {
    const source = `
      import { createErpLogger } from "@/lib/observability/create-erp-logger";
      import { toErpCorrelationId } from "@/lib/observability/erp-correlation-id";
      export function createApiHandlerLogger(correlationId: string) {
        return createErpLogger({
          correlationId: toErpCorrelationId(correlationId),
          module: "api-handler",
        });
      }
    `;

    expect(
      checkErpObservabilityGovernance(source, "apps/erp/src/server/api/runtime/api-handler-logging.ts")
    ).toEqual([]);
  });
});
