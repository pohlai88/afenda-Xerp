import { describe, expect, it } from "vitest";
import {
  buildRepoEvidenceGraph,
  discoverErpAppSurfaces,
  readPackageRegistryRows,
  renderPackageRegistryBody,
} from "@/lib/docs-repo-evidence";

describe("docs repo evidence", () => {
  it("discovers ERP app router surfaces from apps/erp/src/app", () => {
    const surfaces = discoverErpAppSurfaces();
    expect(surfaces.length).toBeGreaterThan(0);
    expect(surfaces.some((surface) => surface.kind === "page")).toBe(true);
    expect(
      surfaces.some((surface) => surface.kind === "error-boundary")
    ).toBe(true);
    expect(
      surfaces.every(
        (surface) =>
          surface.file.startsWith("apps/erp/src/app/") &&
          (surface.file.endsWith("page.tsx") ||
            surface.file.endsWith("route.ts") ||
            surface.file.endsWith("error.tsx"))
      )
    ).toBe(true);
    expect(surfaces.some((surface) => surface.route === "/error")).toBe(true);
  });

  it("builds a repo evidence graph with catalog counts", () => {
    const graph = buildRepoEvidenceGraph({
      authRoutes: 1,
      permissions: 2,
      modules: 3,
      envVariables: 4,
    });
    expect(graph.generated).toBe(true);
    expect(graph.version).toBe(1);
    expect(graph.erpAppSurfaces.length).toBeGreaterThan(0);
    expect(graph.catalogCounts).toEqual({
      authRoutes: 1,
      permissions: 2,
      modules: 3,
      envVariables: 4,
    });
  });

  it("parses active package rows from package-registry.md", () => {
    const rows = readPackageRegistryRows();
    expect(rows.length).toBeGreaterThan(20);
    expect(rows.some((row) => row.packageName === "`@afenda/ai-governance`")).toBe(
      true
    );
    expect(
      rows.some((row) => row.packageName === "`@afenda/architecture-authority`")
    ).toBe(true);
  });

  it("renders package registry body with ai-governance row", () => {
    const rows = readPackageRegistryRows();
    const body = renderPackageRegistryBody(rows, { fingerprint: "test-fp" });
    expect(body).toContain("@afenda/ai-governance");
    expect(body).toContain("test-fp");
  });
});
