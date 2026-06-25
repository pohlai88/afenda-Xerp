import { describe, expect, it } from "vitest";

import { CONTEXT_INTEGRATION_WIRING } from "../context-integration-registry";
import {
  OPERATING_CONTEXT_DELEGATES,
  OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY,
} from "../operating-context-protected-surface.registry";

describe("operating-context protected surface registry", () => {
  it("enumerates every RSC, API, action, and loader integration point", () => {
    expect(
      OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.length
    ).toBeGreaterThanOrEqual(8);
    expect(
      OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map((entry) => entry.id)
    ).toEqual(
      expect.arrayContaining([
        "protected-layout",
        "module-placeholder-page",
        "metadata-workspace-page",
        "system-admin-context",
        "dashboard-widget-loader",
        "protected-api-authorization",
        "protected-server-action-binding",
        "context-switch-action",
        "user-settings-context",
        "user-settings-layout",
      ])
    );
  });

  it("uses only canonical operating-context delegates", () => {
    const delegates = new Set(Object.values(OPERATING_CONTEXT_DELEGATES));

    for (const entry of OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY) {
      expect(delegates.has(entry.delegate)).toBe(true);
    }
  });

  it("wires RSC and loader modules into context integration registry", () => {
    const wiringModules = new Set(
      CONTEXT_INTEGRATION_WIRING.map((entry) => entry.module)
    );
    const rscAndLoaderModules =
      OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.filter(
        (entry) => entry.kind === "rsc" || entry.kind === "loader"
      ).map((entry) => entry.module);

    for (const modulePath of rscAndLoaderModules) {
      expect(wiringModules.has(modulePath)).toBe(true);
    }
  });

  it("assigns unique surface ids", () => {
    const ids = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
      (entry) => entry.id
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
