import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { CORRELATION_ID_HEADER } from "../correlation-header";
import {
  resolveCorrelationIdFromHeaders,
  resolveCorrelationIdFromRequest,
} from "../resolve-correlation-id";

describe("resolveCorrelationIdFromHeaders", () => {
  it("returns canonical ingress correlation IDs unchanged", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const headers = new Headers({
      [CORRELATION_ID_HEADER]: correlationId,
    });

    expect(resolveCorrelationIdFromHeaders(headers)).toBe(correlationId);
  });

  it("mints canonical correlation IDs when the header is absent", () => {
    const correlationId = resolveCorrelationIdFromHeaders(new Headers());

    expect(correlationId.startsWith("cor_")).toBe(true);
  });

  it("mints canonical correlation IDs when the header is legacy non-canonical", () => {
    const headers = new Headers({
      [CORRELATION_ID_HEADER]: "corr-legacy-client-id",
    });

    const correlationId = resolveCorrelationIdFromHeaders(headers);

    expect(correlationId.startsWith("cor_")).toBe(true);
    expect(correlationId).not.toBe("corr-legacy-client-id");
  });
});

describe("resolveCorrelationIdFromRequest", () => {
  it("delegates to header resolution", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const request = new Request("http://localhost/api", {
      headers: {
        [CORRELATION_ID_HEADER]: correlationId,
      },
    });

    expect(resolveCorrelationIdFromRequest(request)).toBe(correlationId);
  });
});
