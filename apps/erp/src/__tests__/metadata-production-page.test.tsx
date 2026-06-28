import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ok } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetadataWorkspacePreviewSurface } from "@/components/metadata-workspace-preview-surface";
import { API_TEST_CORRELATION_ID } from "@/lib/api/__tests__/api-id-test-fixtures";
import { authorizeApiRoute } from "@/lib/api/authorize-api-route";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import {
  resolveMetadataUiRenderContextFromApiRouteAuthorization,
  resolveMetadataUiRenderContextFromContextRequiredPreview,
  resolveMetadataUiRenderContextFromOperatingContext,
} from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

describe("ERP metadata production page", () => {
  it("composes metadata page, layout, and list section renderers", () => {
    const operatingContext = createModuleRouteOperatingContext();
    const context = resolveMetadataUiRenderContextFromOperatingContext({
      operatingContext,
    });

    const { container } = render(
      <MetadataWorkspacePreviewSurface
        companyDisplayName={operatingContext.legalEntity.displayName}
        context={context}
        organizationDisplayName={null}
        tenantDisplayName={operatingContext.tenant.displayName}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Metadata workspace preview" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Resolved workspace scope" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: /resolved workspace scope for this production metadata surface/i,
      })
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-metadata-section="list"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-metadata-source="server"]')
    ).not.toBeNull();
    expect(
      container.querySelector(
        '[data-section-id="erp.metadata-workspace.scope-overview"]'
      )
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="metadata-surface-toolbar"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="metadata-action-bar"]')
    ).not.toBeNull();
  });

  it("renders authorization denial preview with verbose diagnostics", async () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: API_TEST_CORRELATION_ID,
    });
    const permissionDataSource = createModuleRoutePermissionDataSource([]);

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
        request: new Request("http://localhost/metadata-workspace", {
          headers: { [TENANT_SLUG_HEADER]: "acme" },
          method: "GET",
        }),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: async () => ok(operatingContext),
      }
    );

    expect(authResult.kind).toBe("failure");

    const context =
      await resolveMetadataUiRenderContextFromApiRouteAuthorization({
        actorId: operatingContext.actor.userId,
        authorizationResult: authResult,
        permissionDataSource,
      });

    expect(context).not.toBeNull();
    if (context === null) {
      return;
    }

    render(
      <MetadataWorkspacePreviewSurface
        companyDisplayName={operatingContext.legalEntity.displayName}
        context={context}
        organizationDisplayName={null}
        tenantDisplayName={operatingContext.tenant.displayName}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Authorization denial preview" })
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/access denied/i);
    expect(screen.getByLabelText("Metadata diagnostics")).toBeInTheDocument();
  });

  it("renders context-required preview with select workspace action", () => {
    const context = resolveMetadataUiRenderContextFromContextRequiredPreview({
      actorId: "user-context-required-preview",
      correlationId: "corr-context-required-preview",
    });

    render(
      <MetadataWorkspacePreviewSurface
        companyDisplayName="—"
        context={context}
        organizationDisplayName={null}
        tenantDisplayName="Not selected"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Context required preview" })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/context required/i);
    expect(
      screen.getByRole("link", { name: "Select workspace" })
    ).toHaveAttribute("href", "/workspace/select");
    expect(screen.getByLabelText("Metadata diagnostics")).toBeInTheDocument();
  });

  it("does not import fixture CSS in production globals", () => {
    const globals = readFileSync(
      join(import.meta.dirname, "../app/globals.css"),
      "utf8"
    );

    expect(globals).not.toContain("@afenda/metadata-ui/fixtures.css");
    expect(globals).toContain("@afenda/metadata-ui/afenda-metadata-ui.css");
    expect(globals).toContain(".erp-empty-state");
  });

  it("registers a protected production route module", () => {
    const pageSource = readFileSync(
      join(
        import.meta.dirname,
        "../app/(protected)/metadata-workspace/page.tsx"
      ),
      "utf8"
    );

    expect(pageSource).toContain("MetadataWorkspacePreviewSurface");
    expect(pageSource).toContain("authorizeApiRoute");
    expect(pageSource).toContain(
      "resolveMetadataUiRenderContextFromApiRouteAuthorization"
    );
    expect(pageSource).toContain("isEvaluatedApiRouteAuthorizationDenial");
    expect(pageSource).toContain(
      "isPreEvaluationMetadataContextRequiredDenial"
    );
    expect(pageSource).toContain(
      "resolveMetadataUiRenderContextFromContextRequiredPreview"
    );
    expect(pageSource).toContain("isOperatingContextContextRequiredError");
    expect(pageSource).toContain("AppShellMain");
  });
});
