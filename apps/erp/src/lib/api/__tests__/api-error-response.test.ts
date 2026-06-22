import { describe, expect, it } from "vitest";

import {
  createApiRouteErrorFromAuthorizationFailure,
  mapAuthorizationDenialToApiErrorCode,
  toApiClientErrorBody,
  toApiRouteErrorFromClientBody,
} from "../api-error-response";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

describe("api-error-response", () => {
  it("maps authorization denial codes to governed API error codes", () => {
    expect(mapAuthorizationDenialToApiErrorCode("permission_denied")).toBe(
      "forbidden"
    );
    expect(mapAuthorizationDenialToApiErrorCode("missing_tenant")).toBe(
      "not_found"
    );
    expect(mapAuthorizationDenialToApiErrorCode("missing_context")).toBe(
      "forbidden"
    );
  });

  it("creates governed client error bodies with correlation id", () => {
    const body = toApiClientErrorBody(
      "forbidden",
      "You do not have permission to perform this action.",
      "corr-123"
    );

    expect(body).toEqual({
      code: "forbidden",
      correlationId: "corr-123",
      message: "You do not have permission to perform this action.",
    });
  });

  it("converts authorization failures into ApiRouteError", () => {
    const error = createApiRouteErrorFromAuthorizationFailure({
      kind: "failure",
      apiCode: "unauthenticated",
      correlationId: "corr-401",
      denialCode: "missing_session",
      message: "Authentication is required.",
    });

    expect(error).toBeInstanceOf(ApiRouteError);
    expect(error.code).toBe("unauthenticated");
    expect(error.message).toBe("Authentication is required.");
  });

  it("converts client error bodies into ApiRouteError", () => {
    const error = toApiRouteErrorFromClientBody({
      code: "validation_failed",
      correlationId: "corr-meta",
      message: "Invalid payload.",
      details: { field: "layout" },
    });

    expect(error.code).toBe("validation_failed");
    expect(error.details).toEqual({ field: "layout" });
  });
});
