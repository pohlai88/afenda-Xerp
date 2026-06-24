import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetadataWorkspacePreviewSurface } from "@/components/metadata-workspace-preview-surface";
import { resolveMetadataUiRenderContextFromOperatingContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";

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
    expect(pageSource).toContain(
      "resolveMetadataUiRenderContextFromOperatingContext"
    );
    expect(pageSource).toContain("AppShellMain");
  });
});
