import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";

import { AUTH_PROTECTED_SURFACE_REGISTRY } from "@/lib/auth/auth-protected-surface.registry";
import { AUTH_SESSION_BRIDGE_WIRING } from "@/lib/context/context-integration-registry";

const erpSrcRoot = ERP_SRC_ROOT;

describe("auth session bridge integration", () => {
  it("declares auth protected surface registry modules on disk", () => {
    const modules = new Set(
      AUTH_PROTECTED_SURFACE_REGISTRY.map((entry) => entry.module)
    );

    for (const modulePath of modules) {
      expect(existsSync(join(erpSrcRoot, modulePath)), modulePath).toBe(true);
    }
  });

  it("uses session bridge wiring from context integration registry", () => {
    expect(AUTH_SESSION_BRIDGE_WIRING.length).toBeGreaterThan(0);
    expect(
      AUTH_SESSION_BRIDGE_WIRING.some(
        (entry) => entry.delegate === "isAfendaAuthSessionLinked"
      )
    ).toBe(true);
  });

  it("requires governed session delegates in protected surface modules", () => {
    for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
      const source = readFileSync(join(erpSrcRoot, entry.module), "utf8");
      expect(
        source.includes(entry.delegate),
        `${entry.module} must reference ${entry.delegate}`
      ).toBe(true);
    }
  });

  it("uses isAfendaAuthSessionLinked — never authUserId for RBAC on session guards", () => {
    for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
      if (entry.kind !== "session-guard") {
        continue;
      }

      const source = readFileSync(join(erpSrcRoot, entry.module), "utf8");
      expect(source.includes("isAfendaAuthSessionLinked")).toBe(true);
      expect(source.includes("authUserId")).toBe(false);
    }
  });
});
