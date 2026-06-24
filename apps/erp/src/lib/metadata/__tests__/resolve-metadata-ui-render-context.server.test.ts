import { describe, expect, it } from "vitest";

import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";

import { resolveMetadataUiRenderContextFromOperatingContext } from "../resolve-metadata-ui-render-context.server";

describe("resolveMetadataUiRenderContextFromOperatingContext", () => {
  it("maps verified operating context into a server metadata render context", () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-metadata-bridge-test",
    });

    const context = resolveMetadataUiRenderContextFromOperatingContext({
      operatingContext,
      permissions: ["workspace.dashboard.read"],
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
    expect(context.runtime.permissions).toEqual(["workspace.dashboard.read"]);
    expect(context.runtime.capabilities).toEqual([
      "metadata.workspace.preview",
    ]);
    expect(context.runtime.workspaceId).toBe(
      `${operatingContext.tenant.tenantId}:${operatingContext.legalEntity.companyId}:root`
    );
  });
});
