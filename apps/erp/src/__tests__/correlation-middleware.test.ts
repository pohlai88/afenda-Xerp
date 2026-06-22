import { describe, expect, it } from "vitest";
import { CORRELATION_ID_HEADER } from "../proxy";

describe("CORRELATION_ID_HEADER", () => {
  it("is the canonical lowercase header name", () => {
    expect(CORRELATION_ID_HEADER).toBe("x-correlation-id");
  });
});

describe("correlation ID propagation contract", () => {
  it("x-correlation-id header name matches the observability package convention", () => {
    expect(CORRELATION_ID_HEADER.startsWith("x-")).toBe(true);
    expect(CORRELATION_ID_HEADER).toContain("correlation");
  });
});
