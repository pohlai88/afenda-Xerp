import {
  InMemoryPolicyDataSource,
  PERMISSION_REGISTRY,
} from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

import {
  METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY,
  resolveMetadataAuthorizationFromOperatingContext,
} from "../resolve-metadata-authorization.server";
import { resolveMetadataAuthorizationWithPolicyCheckForTests } from "./metadata-authorization.test-helpers";

describe("resolveMetadataAuthorizationFromOperatingContext", () => {
  it("derives policy allow and role permission descriptors from live evaluation", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-live-authorization",
    });

    const permissionDataSource = createModuleRoutePermissionDataSource([
      PERMISSION_REGISTRY.workspace.dashboard.read,
      PERMISSION_REGISTRY.inventory.product.read,
    ]);

    const snapshot = await resolveMetadataAuthorizationFromOperatingContext({
      operatingContext,
      permissionDataSource,
      policyDataSource: new InMemoryPolicyDataSource(),
    });

    expect(snapshot.policyDecision).toEqual({ kind: "allow" });
    expect(snapshot.permissionKeys).toEqual([
      PERMISSION_REGISTRY.workspace.dashboard.read,
      PERMISSION_REGISTRY.inventory.product.read,
    ]);
    expect(snapshot.permissionModelDescriptors).toEqual([
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
    ]);
  });

  it("maps permission denial to metadata policy deny with boundary descriptor", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-live-denied",
    });

    const permissionDataSource = createModuleRoutePermissionDataSource([]);

    const snapshot = await resolveMetadataAuthorizationFromOperatingContext({
      operatingContext,
      permissionDataSource,
      boundaryPermissionKey: METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY,
    });

    expect(snapshot.policyDecision).toEqual({
      kind: "deny",
      reason: "unauthorized",
    });
    expect(snapshot.permissionKeys).toEqual([]);
    expect(snapshot.permissionModelDescriptors).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });
});

describe("resolveMetadataAuthorizationWithPolicyCheckForTests", () => {
  it("documents checkPolicyDecision divergence without boundary descriptor on deny", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-policy-check-divergence",
    });

    const permissionDataSource = createModuleRoutePermissionDataSource([]);

    const snapshot = await resolveMetadataAuthorizationWithPolicyCheckForTests({
      operatingContext,
      permissionDataSource,
      boundaryPermissionKey: METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY,
    });

    expect(snapshot.policyDecision).toEqual({
      kind: "deny",
      reason: "forbidden",
    });
    expect(snapshot.permissionKeys).toEqual([]);
    expect(snapshot.permissionModelDescriptors).toEqual([]);
  });
});
