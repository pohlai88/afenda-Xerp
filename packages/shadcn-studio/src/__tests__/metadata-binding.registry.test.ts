import { describe, expect, it } from "vitest";

import { METADATA_BINDING_REGISTRY } from "../registry/metadata-binding.registry.js";

const ERP_DOMAIN_KV_ID_BY_MODULE_SLUG = {
  hcm: "KV-HCM",
  inventory: "KV-INV",
} as const;

describe("metadata-binding.registry", () => {
  it("assigns erpDomainKvId matching erpDomainModuleSlug for every binding", () => {
    for (const binding of METADATA_BINDING_REGISTRY) {
      if (!binding.erpDomainModuleSlug) {
        continue;
      }

      const expectedKvId =
        ERP_DOMAIN_KV_ID_BY_MODULE_SLUG[
          binding.erpDomainModuleSlug as keyof typeof ERP_DOMAIN_KV_ID_BY_MODULE_SLUG
        ];

      expect(
        binding.erpDomainKvId,
        `binding ${binding.metadataBindingId} slug ${binding.erpDomainModuleSlug}`
      ).toBe(expectedKvId);
    }
  });

  it("covers every binding with a module slug", () => {
    const bindingsWithSlug = METADATA_BINDING_REGISTRY.filter(
      (binding) => binding.erpDomainModuleSlug !== undefined
    );

    expect(bindingsWithSlug.length).toBe(METADATA_BINDING_REGISTRY.length);
    expect(bindingsWithSlug.length).toBeGreaterThan(0);
  });
});
