import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  clientErrorPostRequestSchema,
  clientErrorPostResponseSchema,
} from "@/server/api/contracts/observability/client-error.api-contract";
import { clientErrorPostContract } from "@/server/api/contracts/observability/client-error.contract";

const appSrcRoot = join(import.meta.dirname, "..");

function readSource(relativePath: string): string {
  return readFileSync(join(appSrcRoot, relativePath), "utf8");
}

describe("client-error API contract", () => {
  it("registers a governed POST contract", () => {
    expect(clientErrorPostContract.method).toBe("POST");
    expect(clientErrorPostContract.path).toBe("/api/internal/v1/client-error");
    expect(clientErrorPostContract.tags).toContain("telemetry");
    expect(clientErrorPostContract.tags).toContain("public");
  });

  it("accepts digest-only payloads", () => {
    const parsed = clientErrorPostRequestSchema.safeParse({
      digest: "abc123",
      segment: "protected",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects payloads that include error messages or stack traces", () => {
    const withMessage = clientErrorPostRequestSchema.safeParse({
      digest: "abc123",
      message: "Something failed",
      segment: "protected",
    });

    expect(withMessage.success).toBe(true);
    if (withMessage.success) {
      expect(Object.keys(withMessage.data)).toEqual(["digest", "segment"]);
    }

    const withSpaces = clientErrorPostRequestSchema.safeParse({
      digest: "Error at line 1",
      segment: "protected",
    });

    expect(withSpaces.success).toBe(false);
  });

  it("returns a serializable acceptance DTO", () => {
    const parsed = clientErrorPostResponseSchema.parse({ accepted: true });
    expect(parsed).toEqual({ accepted: true });
  });
});

describe("client-error reporting — static hygiene", () => {
  it("uses createApiHandler on the route module", () => {
    const source = readSource("app/api/internal/v1/client-error/route.ts");
    expect(source).toContain("createApiHandler");
    expect(source).not.toMatch(/\bconsole\.(log|info|warn|error)\s*\(/);
  });

  it("reports digest and segment only from the client reporter", () => {
    const source = readSource(
      "lib/observability/report-client-error.client.ts"
    );
    expect(source).toContain("digest");
    expect(source).toContain("segment");
    expect(source).not.toContain("error.message");
    expect(source).not.toContain("error.stack");
  });

  it("allows unauthenticated access through public route policy", () => {
    const source = readSource("lib/auth/public-routes.ts");
    expect(source).toContain("/api/internal/v1/client-error");
  });

  it("does not render digest in user-facing error copy", () => {
    const source = readSource("components/route-segment-error.tsx");
    expect(source).not.toMatch(/\{error\.digest/);
    expect(source).toContain("reportClientError");
  });
});
