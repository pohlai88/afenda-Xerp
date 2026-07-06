import { describe, expect, it } from "vitest";
import {
  LAB_CORRELATION_ID_HEADER,
  LAB_FORBIDDEN_SPOOF_HEADERS,
  labRequestPolicyRule,
  resolveLabCorrelationId,
  stripForbiddenSpoofHeaders,
} from "@/lib/lab/lab-request-policy";
import { labRequestPolicyRegistry } from "@/lib/lab/lab-request-policy-registry";

describe("lab request policy", () => {
  it("registers the governed edge proxy policy", () => {
    expect(labRequestPolicyRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filePath: "proxy.ts",
          policyId: "lab.request-policy.edge-proxy",
        }),
      ])
    );
  });

  it("forbids auth shortcuts and tenant injection", () => {
    expect(labRequestPolicyRule.forbids).toEqual(
      expect.arrayContaining([
        "auth-redirect",
        "session-gate",
        "tenant-injection",
      ])
    );
  });

  it("preserves an incoming correlation id", () => {
    expect(resolveLabCorrelationId("lab-proof-correlation")).toBe(
      "lab-proof-correlation"
    );
  });

  it("generates a correlation id when none is provided", () => {
    expect(resolveLabCorrelationId(null)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("strips spoof tenant and operating-context headers", () => {
    const headers = new Headers({
      [LAB_CORRELATION_ID_HEADER]: "keep-me",
      "x-operating-context": "spoof",
      "x-tenant-id": "spoof",
      "x-tenant-slug": "spoof",
    });

    const sanitized = stripForbiddenSpoofHeaders(headers);

    for (const headerName of LAB_FORBIDDEN_SPOOF_HEADERS) {
      expect(sanitized.has(headerName)).toBe(false);
    }

    expect(sanitized.get(LAB_CORRELATION_ID_HEADER)).toBe("keep-me");
  });
});
