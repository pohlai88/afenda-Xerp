import { describe, expect, it } from "vitest";

import { ApiClientRequestError } from "../api-policy-gate.error";
import {
  isApiUnauthenticatedError,
  resolveLayoutLoadFallback,
} from "../api-unauthenticated.error";

describe("isApiUnauthenticatedError", () => {
  it("returns true for unauthenticated ApiClientRequestError", () => {
    expect(
      isApiUnauthenticatedError(
        new ApiClientRequestError({
          code: "unauthenticated",
          correlationId: "corr-401",
          message: "Authentication is required.",
        })
      )
    ).toBe(true);
  });

  it("returns false for forbidden errors", () => {
    expect(
      isApiUnauthenticatedError(
        new ApiClientRequestError({
          code: "forbidden",
          correlationId: "corr-403",
          message: "Permission denied.",
        })
      )
    ).toBe(false);
  });
});

describe("resolveLayoutLoadFallback", () => {
  it("returns unauthenticated when fallback is enabled", () => {
    expect(
      resolveLayoutLoadFallback(
        new ApiClientRequestError({
          code: "unauthenticated",
          correlationId: "corr-401",
          message: "Authentication is required.",
        }),
        true
      )
    ).toBe("unauthenticated");
  });

  it("returns null when fallback is disabled", () => {
    expect(
      resolveLayoutLoadFallback(
        new ApiClientRequestError({
          code: "unauthenticated",
          correlationId: "corr-401",
          message: "Authentication is required.",
        }),
        false
      )
    ).toBeNull();
  });
});
