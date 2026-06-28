import { createTestEnterpriseId } from "@afenda/kernel";
import {
  InMemoryPolicyDataSource,
  PERMISSION_REGISTRY,
} from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
  MODULE_ROUTE_TEST_TENANT_ID,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

import { resolveMetadataAuthorizationFromOperatingContext } from "../resolve-metadata-authorization.server";
import {
  resolveMetadataUiRenderContextFromOperatingContext,
  resolveMetadataUiRenderContextFromOperatingContextAsync,
} from "../resolve-metadata-ui-render-context.server";

const TEST_ENTITY_GROUP_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FAX"
);
const TEST_TEAM_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAY"
);
const TEST_PROJECT_ID = createTestEnterpriseId(
  "project",
  "01ARZ3NDEKTSV4RRFFQ69G5FAZ"
);

describe("resolveMetadataUiRenderContextFromOperatingContext", () => {
  it("maps verified operating context into a server metadata render context", () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-metadata-bridge-test",
    });

    const context = resolveMetadataUiRenderContextFromOperatingContext({
      operatingContext,
      permissions: ["workspace.dashboard_read"],
      capabilities: ["metadata.workspace.preview"],
    });

    expect(context.environment.source).toBe("server");
    expect(context.environment.hydration).toBe("none");
    expect(context.runtime.actorId).toBe(operatingContext.actor.userId);
    expect(context.runtime.tenantId).toBe(operatingContext.tenant.tenantId);
    expect(context.runtime.companyId).toBe(
      operatingContext.legalEntity.companyId
    );
    expect(context.runtime.correlationId).toBe("corr-metadata-bridge-test");
    expect(context.runtime.permissions).toEqual(["workspace.dashboard_read"]);
    expect(context.runtime.capabilities).toEqual([
      "metadata.workspace.preview",
    ]);
    expect(context.runtime.workspaceId).toBe(
      `${operatingContext.tenant.tenantId}:${operatingContext.legalEntity.companyId}:root`
    );
    expect(context.runtime.entityGroupId).toBeUndefined();
    expect(context.runtime.teamId).toBeUndefined();
    expect(context.runtime.projectId).toBeUndefined();
    expect(context.runtime.policyDecision).toEqual({ kind: "allow" });
    expect(context.runtime.permissionModelDescriptors).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });

  it("composes metadata runtime from live authorization evaluation", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-live-metadata-bridge",
    });

    const permissionDataSource = createModuleRoutePermissionDataSource([
      PERMISSION_REGISTRY.workspace.dashboard.read,
    ]);

    const authorization =
      await resolveMetadataAuthorizationFromOperatingContext({
        operatingContext,
        permissionDataSource,
        policyDataSource: new InMemoryPolicyDataSource(),
      });

    const context =
      await resolveMetadataUiRenderContextFromOperatingContextAsync({
        operatingContext,
        authorization,
      });

    expect(context.runtime.policyDecision).toEqual({ kind: "allow" });
    expect(context.runtime.permissions).toEqual([
      PERMISSION_REGISTRY.workspace.dashboard.read,
    ]);
    expect(context.runtime.permissionModelDescriptors).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });

  it("maps optional hierarchy scope carriers when operating context slots are set", () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-hierarchy-scope",
    });

    const enrichedContext: typeof operatingContext = {
      ...operatingContext,
      entityGroup: {
        entityGroupId: TEST_ENTITY_GROUP_ID,
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
        slug: "acme-group",
        displayName: "Acme Group",
        parentLegalEntityId: null,
        status: "active",
      },
      team: {
        teamId: TEST_TEAM_ID,
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
        companyId: operatingContext.legalEntity.companyId,
        organizationUnitId: null,
        slug: "platform-team",
        displayName: "Platform Team",
        status: "active",
      },
      project: {
        projectId: TEST_PROJECT_ID,
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
        companyId: operatingContext.legalEntity.companyId,
        organizationUnitId: null,
        slug: "metadata-rollout",
        displayName: "Metadata Rollout",
        status: "active",
      },
    };

    const context = resolveMetadataUiRenderContextFromOperatingContext({
      operatingContext: enrichedContext,
    });

    expect(context.runtime.entityGroupId).toBe(TEST_ENTITY_GROUP_ID);
    expect(context.runtime.teamId).toBe(TEST_TEAM_ID);
    expect(context.runtime.projectId).toBe(TEST_PROJECT_ID);
  });
});
