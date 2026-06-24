import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  AUTH_PROTECTED_SURFACE_REGISTRY,
  AUTH_SESSION_DELEGATES,
} from "@/lib/auth/auth-protected-surface.registry";
import { AUTH_SESSION_BRIDGE_WIRING } from "@/lib/context/context-integration-registry";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("auth session bridge integration", () => {
  it("registry surfaces match auth-session bridge wiring modules", () => {
    const registryModules = new Set(
      AUTH_PROTECTED_SURFACE_REGISTRY.map((entry) => entry.module)
    );
    const bridgeModules = AUTH_SESSION_BRIDGE_WIRING.map(
      (entry) => entry.module
    );

    for (const modulePath of bridgeModules) {
      expect(registryModules.has(modulePath)).toBe(true);
    }
  });

  for (const wiring of AUTH_SESSION_BRIDGE_WIRING) {
    it(`${wiring.module} rejects unlinked session via ${wiring.delegate}`, () => {
      const source = readAppSource(`src/${wiring.module}`);
      expect(source).toContain(wiring.delegate);
      expect(source).not.toMatch(/session\.user\.tenantId/);
      expect(source).not.toMatch(/session\.user\.companyId/);
    });
  }

  it("forbids session.user.tenantId across all protected surfaces", () => {
    for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
      const source = readAppSource(`src/${entry.module}`);
      expect(source).not.toMatch(/session\.user\.tenantId/);
    }
  });

  it("uses requireAfendaAuthSession or isAfendaAuthSessionLinked — never authUserId for RBAC", () => {
    const sessionDelegates = new Set(Object.values(AUTH_SESSION_DELEGATES));

    for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
      const source = readAppSource(`src/${entry.module}`);
      expect(sessionDelegates.has(entry.sessionDelegate)).toBe(true);
      expect(source).not.toMatch(/session\.user\.authUserId.*permission/i);
    }
  });
});
