import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";

import { CONTEXT_INTEGRATION_WIRING } from "@/lib/context/context-integration-registry";
import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";

const erpSrcRoot = ERP_SRC_ROOT;

describe("operating-context RSC bridge integration", () => {
  const rscSurfaces = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.filter(
    (entry) => entry.kind === "protected-rsc"
  );

  it("registers at least layout and metadata-workspace RSC surfaces", () => {
    expect(rscSurfaces.length).toBeGreaterThanOrEqual(2);
  });

  it("wires every protected RSC surface delegate through the integration spine", () => {
    const spineDelegates = new Set(
      CONTEXT_INTEGRATION_WIRING.map((entry) => entry.delegate)
    );

    for (const surface of rscSurfaces) {
      expect(
        spineDelegates.has(surface.delegate),
        `${surface.id} delegate ${surface.delegate}`
      ).toBe(true);
    }
  });

  it("keeps protected surface modules aligned with integration registry spine", () => {
    const spineDelegates = new Set(
      CONTEXT_INTEGRATION_WIRING.map((entry) => entry.delegate)
    );

    for (const surface of OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY) {
      if (surface.delegate === "resolveApiRouteOperatingContext") {
        expect(spineDelegates.has(surface.delegate)).toBe(true);
        continue;
      }

      expect(spineDelegates.has(surface.delegate)).toBe(true);
    }
  });

  it("requires every protected surface module to exist on disk", () => {
    const registryModules = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
      (entry) => entry.module
    );

    for (const modulePath of registryModules) {
      expect(existsSync(join(erpSrcRoot, modulePath)), modulePath).toBe(true);
      expect(
        readFileSync(join(erpSrcRoot, modulePath), "utf8").length
      ).toBeGreaterThan(0);
    }
  });
});
