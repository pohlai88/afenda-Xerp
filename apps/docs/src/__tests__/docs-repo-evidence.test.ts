import { describe, expect, it } from "vitest";
import {
  buildRepoEvidenceGraph,
  discoverErpAppSurfaces,
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
});
