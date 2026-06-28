import { ok } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import { API_TEST_CORRELATION_ID } from "@/lib/api/__tests__/api-id-test-fixtures";
import { authorizeApiRoute } from "@/lib/api/authorize-api-route";
import type { ApiRouteAuthorizationResult } from "@/lib/api/authorize-api-route.contract";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

import {
  isEvaluatedApiRouteAuthorizationDenial,
  isPreEvaluationMetadataContextRequiredDenial,
  resolveMetadataAuthorizationFromApiRouteResult,
  resolveOperatingContextFromApiRouteResult,
} from "../resolve-metadata-authorization-from-api-route.server";
import {
  resolveMetadataUiRenderContextFromApiRouteAuthorization,
  resolveMetadataUiRenderContextFromContextRequiredPreview,
} from "../resolve-metadata-ui-render-context.server";

function createMetadataWorkspaceRequest(): Request {
  return new Request("http://localhost/metadata-workspace", {
    headers: {
      [TENANT_SLUG_HEADER]: "acme",
    },
    method: "GET",
  });
}

describe("resolveMetadataAuthorizationFromApiRouteResult", () => {
  it("projects authorizeApiRoute success without re-evaluating permissions", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: API_TEST_CORRELATION_ID,
    });
    const permissionDataSource = createModuleRoutePermissionDataSource([
      PERMISSION_REGISTRY.workspace.dashboard.read,
      PERMISSION_REGISTRY.inventory.product.read,
    ]);

    const authResult = await authorizeApiRoute(
      {
        actorId: operatingContext.actor.userId,
        correlationId: API_TEST_CORRELATION_ID,
        method: "GET",
        path: "/metadata-workspace",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createMetadataWorkspaceRequest(),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: async () => ok(operatingContext),
      }
    );

    expect(authResult.kind).toBe("success");

    const snapshot = await resolveMetadataAuthorizationFromApiRouteResult({
      result: authResult,
      permissionDataSource,
    });

    expect(snapshot).toEqual({
      policyDecision: { kind: "allow" },
      permissionKeys: [
        PERMISSION_REGISTRY.workspace.dashboard.read,
        PERMISSION_REGISTRY.inventory.product.read,
      ],
      permissionModelDescriptors: [
        {
          module: "workspace",
          action: "read",
          scope: "legal_entity",
        },
        {
          module: "inventory",
          action: "read",
          scope: "legal_entity",
        },
      ],
    });
  });

  it("projects authorizeApiRoute evaluated denials into metadata policy deny", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-api-route-bridge-denied",
    });
    const permissionDataSource = createModuleRoutePermissionDataSource([]);

    const authResult = await authorizeApiRoute(
      {
        actorId: operatingContext.actor.userId,
        correlationId: operatingContext.correlationId,
        method: "GET",
        path: "/metadata-workspace",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createMetadataWorkspaceRequest(),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: async () => ok(operatingContext),
      }
    );

    expect(authResult.kind).toBe("failure");
    if (authResult.kind !== "failure") {
      return;
    }

    expect(authResult.evaluation).toBeDefined();
    expect(authResult.evaluation?.authorizationDenialCode).toBe(
      "permission_denied"
    );
    expect(isEvaluatedApiRouteAuthorizationDenial(authResult)).toBe(true);

    const snapshot = await resolveMetadataAuthorizationFromApiRouteResult({
      result: authResult,
      permissionDataSource,
    });

    expect(snapshot).toEqual({
      policyDecision: { kind: "deny", reason: "unauthorized" },
      permissionKeys: [],
      permissionModelDescriptors: [
        {
          module: "workspace",
          action: "read",
          scope: "legal_entity",
        },
      ],
    });
  });
});

describe("resolveMetadataUiRenderContextFromApiRouteAuthorization", () => {
  it("composes metadata runtime from authorizeApiRoute success", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: API_TEST_CORRELATION_ID,
    });
    const permissionDataSource = createModuleRoutePermissionDataSource([
      PERMISSION_REGISTRY.workspace.dashboard.read,
    ]);

    const authResult = await authorizeApiRoute(
      {
        actorId: operatingContext.actor.userId,
        correlationId: API_TEST_CORRELATION_ID,
        method: "GET",
        path: "/metadata-workspace",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createMetadataWorkspaceRequest(),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: async () => ok(operatingContext),
      }
    );

    expect(authResult.kind).toBe("success");

    const context =
      await resolveMetadataUiRenderContextFromApiRouteAuthorization({
        actorId: operatingContext.actor.userId,
        authorizationResult: authResult,
        permissionDataSource,
      });

    expect(context).not.toBeNull();
    expect(context?.runtime.policyDecision).toEqual({ kind: "allow" });
    expect(context?.runtime.permissionModelDescriptors).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });

  it("composes denial preview metadata runtime from authorizeApiRoute evaluated failure", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-api-route-bridge-denial-preview",
    });
    const permissionDataSource = createModuleRoutePermissionDataSource([]);

    const authResult = await authorizeApiRoute(
      {
        actorId: operatingContext.actor.userId,
        correlationId: operatingContext.correlationId,
        method: "GET",
        path: "/metadata-workspace",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createMetadataWorkspaceRequest(),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: async () => ok(operatingContext),
      }
    );

    expect(authResult.kind).toBe("failure");
    expect(isEvaluatedApiRouteAuthorizationDenial(authResult)).toBe(true);

    const context =
      await resolveMetadataUiRenderContextFromApiRouteAuthorization({
        actorId: operatingContext.actor.userId,
        authorizationResult: authResult,
        permissionDataSource,
      });

    expect(context).not.toBeNull();
    expect(context?.runtime.state).toBe("forbidden");
    expect(context?.runtime.readonlyMode).toBe(true);
    expect(context?.runtime.diagnosticsEnabled).toBe(true);
    expect(context?.diagnostics.enabled).toBe(true);
    expect(context?.diagnostics.level).toBe("verbose");
    expect(context?.runtime.policyDecision).toEqual({
      kind: "deny",
      reason: "unauthorized",
    });
    expect(context?.runtime.permissionModelDescriptors).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });

  it("composes context-required preview metadata runtime from missing_context denial", async () => {
    const actorId = createModuleRouteOperatingContext().actor.userId;
    const authResult = {
      kind: "failure",
      apiCode: "forbidden",
      correlationId: "corr-missing-context-preview",
      denialCode: "missing_context",
      message: "Missing context",
    } as ApiRouteAuthorizationResult;

    const context =
      await resolveMetadataUiRenderContextFromApiRouteAuthorization({
        actorId,
        authorizationResult: authResult,
      });

    expect(context).not.toBeNull();
    expect(context?.runtime.state).toBe("readonly");
    expect(context?.runtime.readonlyMode).toBe(true);
    expect(context?.runtime.actorId).toBe(actorId);
    expect(context?.runtime.correlationId).toBe("corr-missing-context-preview");
    expect(context?.runtime.policyDecision).toEqual({
      kind: "defer",
      reason: "context_required",
    });
    expect(context?.diagnostics.level).toBe("verbose");
    expect(context?.runtime.tenantId).toBeUndefined();
  });
});

describe("isPreEvaluationMetadataContextRequiredDenial", () => {
  it("returns true only for missing_context failures", () => {
    const missingContext = {
      kind: "failure",
      apiCode: "forbidden",
      correlationId: "corr-missing-context",
      denialCode: "missing_context",
      message: "Missing context",
    } as ApiRouteAuthorizationResult;

    const missingSession = {
      kind: "failure",
      apiCode: "unauthenticated",
      correlationId: "corr-missing-session",
      denialCode: "missing_session",
      message: "Missing session",
    } as ApiRouteAuthorizationResult;

    expect(isPreEvaluationMetadataContextRequiredDenial(missingContext)).toBe(
      true
    );
    expect(isPreEvaluationMetadataContextRequiredDenial(missingSession)).toBe(
      false
    );
  });
});

describe("resolveMetadataUiRenderContextFromContextRequiredPreview", () => {
  it("builds defer readonly runtime without tenant or company carriers", () => {
    const context = resolveMetadataUiRenderContextFromContextRequiredPreview({
      actorId: "user-metadata-context-preview",
      correlationId: "corr-context-preview-direct",
    });

    expect(context.runtime.state).toBe("readonly");
    expect(context.runtime.policyDecision).toEqual({
      kind: "defer",
      reason: "context_required",
    });
    expect(context.diagnostics.level).toBe("verbose");
    expect(context.runtime.tenantId).toBeUndefined();
  });
});

describe("isEvaluatedApiRouteAuthorizationDenial", () => {
  it("returns false when evaluation operating context is null", () => {
    const failureResult = {
      kind: "failure",
      apiCode: "forbidden",
      correlationId: "corr-null-oc",
      denialCode: "permission_denied",
      message: "Permission denied",
      evaluation: {
        authorizationDenialCode: "permission_denied",
        decision: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
          result: "deny",
          roleId: null,
        },
        operatingContext: null,
        permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
      },
    } as unknown as ApiRouteAuthorizationResult;

    expect(isEvaluatedApiRouteAuthorizationDenial(failureResult)).toBe(false);
  });
});

describe("resolveMetadataAuthorizationFromApiRouteResult pre-evaluation denials", () => {
  it("projects missing_context into defer policy without operating context", async () => {
    const snapshot = await resolveMetadataAuthorizationFromApiRouteResult({
      result: {
        kind: "failure",
        apiCode: "forbidden",
        correlationId: "corr-missing-context",
        denialCode: "missing_context",
        message: "Missing context",
      },
    });

    expect(snapshot).toEqual({
      policyDecision: { kind: "defer", reason: "context_required" },
      permissionKeys: [],
      permissionModelDescriptors: [],
    });
  });

  it("projects missing_session into unauthorized deny", async () => {
    const snapshot = await resolveMetadataAuthorizationFromApiRouteResult({
      result: {
        kind: "failure",
        apiCode: "unauthenticated",
        correlationId: "corr-missing-session",
        denialCode: "missing_session",
        message: "Missing session",
      },
    });

    expect(snapshot).toEqual({
      policyDecision: { kind: "deny", reason: "unauthorized" },
      permissionKeys: [],
      permissionModelDescriptors: [],
    });
  });
});

describe("resolveOperatingContextFromApiRouteResult", () => {
  it("returns operating context from success results", () => {
    const operatingContext = createModuleRouteOperatingContext();

    const successResult = {
      kind: "success",
      operatingContext,
    } as ApiRouteAuthorizationResult;

    expect(resolveOperatingContextFromApiRouteResult(successResult)).toBe(
      operatingContext
    );
  });
});
