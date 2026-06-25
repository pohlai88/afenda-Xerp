import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { CONTEXT_INTEGRATION_WIRING } from "@/lib/context/context-integration-registry";
import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("operating-context RSC bridge integration", () => {
  const rscSurfaces = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.filter(
    (entry) => entry.kind === "rsc" || entry.kind === "loader"
  );

  it("registry includes all protected RSC and loader surfaces", () => {
    expect(rscSurfaces.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "protected-layout",
        "module-placeholder-page",
        "metadata-workspace-page",
        "system-admin-context",
        "dashboard-widget-loader",
      ])
    );
  });

  for (const surface of OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY) {
    it(`${surface.module} resolves tenant scope via ${surface.delegate}`, () => {
      const source = readAppSource(`src/${surface.module}`);
      expect(source).toContain(surface.delegate);
      expect(source).not.toMatch(/session\.user\.tenantId/);
      expect(source).not.toMatch(/session\.user\.companyId/);
    });
  }

  it("dashboard widget RBAC derives actor from verified operating context", () => {
    const source = readAppSource(
      "src/lib/workspace/resolve-dashboard-widget-render-context.server.ts"
    );
    expect(source).toContain("operatingContext.actor.userId");
    expect(source).not.toMatch(/session\.user\.tenantId/);
    expect(source).not.toMatch(/session\.user\.companyId/);
  });

  it("context integration wiring covers protected surface registry modules", () => {
    const wiringModules = new Set(
      CONTEXT_INTEGRATION_WIRING.map((entry) => entry.module)
    );
    const registryModules = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
      (entry) => entry.module
    );

    for (const modulePath of registryModules) {
      expect(wiringModules.has(modulePath)).toBe(true);
    }
  });
});
