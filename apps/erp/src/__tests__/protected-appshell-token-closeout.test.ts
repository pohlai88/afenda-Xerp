import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("TIP-UI-03 protected ApplicationShell token closeout", () => {
  it("composes AppShell with identity, context, and dashboard providers in production layout", () => {
    const layoutSource = readAppSource("src/app/(protected)/layout.tsx");

    expect(layoutSource).toContain(
      'from "@/components/erp-application-shell.client"'
    );
    expect(layoutSource).toContain("<ErpApplicationShell");
    expect(layoutSource).toContain("identity={identity}");
    expect(layoutSource).toContain("DashboardWidgetRenderContextProvider");
    expect(layoutSource).toContain("WorkspaceDashboardCapabilitiesProvider");
    expect(layoutSource).toContain(
      "resolveManifestNavigationFromOperatingContext"
    );
  });

  it("loads governed shell CSS after ui tokens in ERP globals", () => {
    const globals = readAppSource("src/app/globals.css");

    const uiPos = globals.indexOf("@afenda/ui/afenda-ui.css");
    const appshellPos = globals.indexOf("@afenda/appshell/afenda-appshell.css");
    const metadataUiPos = globals.indexOf(
      "@afenda/metadata-ui/afenda-metadata-ui.css"
    );

    expect(uiPos).toBeGreaterThan(-1);
    expect(appshellPos).toBeGreaterThan(uiPos);
    expect(metadataUiPos).toBeGreaterThan(appshellPos);
    expect(globals).not.toContain("@afenda/appshell/fixtures.css");
  });
});
