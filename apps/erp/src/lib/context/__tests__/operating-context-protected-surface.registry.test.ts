import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";

import {
  OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY,
  type OperatingContextProtectedSurfaceId,
} from "../operating-context-protected-surface.registry";

const erpSrcRoot = ERP_SRC_ROOT;

describe("operating-context-protected-surface.registry", () => {
  it("declares unique surface ids", () => {
    const ids = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
      (entry) => entry.id
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers skeleton protected RSC minimum (layout + metadata-workspace)", () => {
    const ids = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
      (entry) => entry.id
    ) as OperatingContextProtectedSurfaceId[];

    expect(ids).toContain("protected-rsc-layout");
    expect(ids).toContain("protected-rsc-metadata-workspace");
    expect(ids).toContain("protected-rsc-settings-profile");
  });

  it("maps every registry module to a live delegate on disk", () => {
    for (const entry of OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY) {
      const modulePath = join(erpSrcRoot, entry.module);
      expect(existsSync(modulePath), `${entry.module} must exist`).toBe(true);

      const source = readFileSync(modulePath, "utf8");
      expect(
        source.includes(entry.delegate),
        `${entry.module} must reference ${entry.delegate}`
      ).toBe(true);
    }
  });

  it("includes protected API operating-context resolver surface", () => {
    const apiSurface = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.find(
      (entry) => entry.id === "protected-api-operating-context"
    );

    expect(apiSurface?.delegate).toBe("resolveApiRouteOperatingContext");
    expect(apiSurface?.kind).toBe("protected-api");
  });
});
