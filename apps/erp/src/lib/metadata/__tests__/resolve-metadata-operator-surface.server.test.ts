import { describe, expect, it } from "vitest";

import { METADATA_OPERATOR_SURFACE_REGISTRY } from "../metadata-operator-surface.registry";
import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { resolveMetadataOperatorSurface } from "../resolve-metadata-operator-surface.server";

describe("resolveMetadataOperatorSurface (PAS-006D operator routes)", () => {
  it("declares unique operator route ids", () => {
    const ids = METADATA_OPERATOR_SURFACE_REGISTRY.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves account settings surface with slot hydration", () => {
    const runtime = createMetadataRuntimeContext({
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      actorId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      correlationId: "corr-operator-profile",
    });

    const surface = resolveMetadataOperatorSurface({
      surfaceTemplateId: "surface-template.account-settings",
      runtime,
    });

    expect(surface?.surfaceTemplate.surfaceTemplateId).toBe(
      "surface-template.account-settings"
    );
    expect(surface?.slotHydration?.blockId).toBe("account-settings-01");

    const displayNameHelp = surface?.slotHydration?.slotTargets.find(
      (target) => target.slotId === "profile.displayName.help"
    );

    expect(displayNameHelp?.value).toBe(
      "Your name as shown to other workspace members."
    );
  });

  it("resolves auth sign-in surface with password help slot", () => {
    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-operator-sign-in",
    });

    const surface = resolveMetadataOperatorSurface({
      surfaceTemplateId: "surface-template.auth-sign-in",
      runtime,
    });

    expect(surface?.slotHydration?.blockId).toBe("login-page-04");

    const passwordHelp = surface?.slotHydration?.slotTargets.find(
      (target) => target.slotId === "login.password.help"
    );

    expect(passwordHelp?.value).toBe(
      "Use the password for your Afenda account. Never share it with anyone."
    );
  });
});
