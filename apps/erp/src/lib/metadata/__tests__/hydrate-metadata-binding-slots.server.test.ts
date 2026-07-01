import type { MetadataBindingContractWire } from "@afenda/shadcn-studio";
import { getMetadataBindingByBlockId } from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";
import { hydrateMetadataBindingSlots } from "../hydrate-metadata-binding-slots.server";
import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { projectMetadataUiBindingWire } from "../metadata-ui-binding.projection";

describe("hydrateMetadataBindingSlots (PAS-001A R1c-2)", () => {
  it("maps binding fields to data-afenda-slot hydration targets", () => {
    const binding = getMetadataBindingByBlockId("hero-section-01");
    if (binding === undefined) {
      throw new Error("hero-section-01 binding must exist in registry");
    }

    const runtime = createMetadataRuntimeContext({
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      actorId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      correlationId: "corr-hydration",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    expect(hydration.metadataBindingId).toBe(binding.metadataBindingId);
    expect(hydration.blockId).toBe("hero-section-01");
    expect(hydration.slotTargets.length).toBeGreaterThan(0);

    for (const target of hydration.slotTargets) {
      expect(target.domAttribute).toBe("data-afenda-slot");
      expect(target.slotId.length).toBeGreaterThan(0);
      expect(target.value.length).toBeGreaterThan(0);
    }

    expect(() => JSON.stringify(hydration)).not.toThrow();
  });

  it("hydrates knowledge atom labels when runtime values are absent", () => {
    const binding = {
      metadataBindingId: "metadata-binding.test-tenant",
      blockId: "test-tenant-block",
      fields: [
        {
          fieldKey: "tenantId",
          slotId: "tenant.id",
          presentationKind: "readonly",
          labelAtomRef: "atom.tenant.label",
        },
      ],
    } satisfies MetadataBindingContractWire;

    const runtime = createMetadataRuntimeContext({
      tenantId: "",
      actorId: "",
      correlationId: "corr-knowledge",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    expect(hydration.slotTargets[0]?.value).toBe(
      "Tenant (SaaS customer boundary)"
    );
  });

  it("hydrates help-text slot targets from helpTextAtomRef", () => {
    const binding = {
      metadataBindingId: "metadata-binding.test-tenant-help",
      blockId: "test-tenant-help-block",
      fields: [
        {
          fieldKey: "tenantId",
          slotId: "tenant.id",
          presentationKind: "readonly",
          labelAtomRef: "atom.tenant.label",
          helpTextAtomRef: "atom.tenant.help",
        },
      ],
    } satisfies MetadataBindingContractWire;

    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-help-text",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    expect(hydration.slotTargets).toHaveLength(2);

    const helpTarget = hydration.slotTargets.find(
      (target) => target.presentationKind === "help-text"
    );

    expect(helpTarget?.slotId).toBe("tenant.id.help");
    expect(helpTarget?.value).toBe("Tenant (SaaS customer boundary)");
  });

  it("hydrates login-page-04 password help from binding override", () => {
    const binding = getMetadataBindingByBlockId("login-page-04");
    if (binding === undefined) {
      throw new Error("login-page-04 binding must exist in registry");
    }

    const passwordField = binding.fields.find(
      (field) => field.fieldKey === "password"
    );

    expect(passwordField?.helpTextAtomRef).toBe("atom.auth.password.help");

    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-login-help",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    const helpTarget = hydration.slotTargets.find(
      (target) => target.slotId === "login.password.help"
    );

    expect(helpTarget?.presentationKind).toBe("help-text");
    expect(helpTarget?.value).toBe(
      "Use the password for your Afenda account. Never share it with anyone."
    );
  });

  it("hydrates login-page-04 Afenda branding copy from presentation atoms", () => {
    const binding = getMetadataBindingByBlockId("login-page-04");
    if (binding === undefined) {
      throw new Error("login-page-04 binding must exist in registry");
    }

    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-login-branding",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    expect(
      hydration.slotTargets.find(
        (target) => target.slotId === "login.branding.title"
      )?.value
    ).toBe("Sign in to Afenda ERP");
    expect(
      hydration.slotTargets.find((target) => target.slotId === "login.submit")
        ?.value
    ).toBe("Sign in");
  });

  it("resolves presentation atom refs for seeded hero block labels", () => {
    const binding = getMetadataBindingByBlockId("hero-section-01");
    if (binding === undefined) {
      throw new Error("hero-section-01 binding must exist in registry");
    }

    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-presentation",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    const titleTarget = hydration.slotTargets.find(
      (target) => target.fieldKey === "title"
    );

    expect(titleTarget?.value).toBe("Hero title");
  });
});
