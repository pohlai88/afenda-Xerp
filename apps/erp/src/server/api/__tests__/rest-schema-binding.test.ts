import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  assertRegistryRestSchemaBindings,
  buildRestSchemaBindingRegistry,
  isValidRestSchemaModuleRef,
} from "@/server/api/contracts/rest-schema-binding.contract";

describe("RestSchemaBinding (PAS-API-REST-001-S2)", () => {
  it("accepts REST schema module ref format for governed contracts", () => {
    for (const contract of API_CONTRACTS) {
      expect(isValidRestSchemaModuleRef(contract.requestSchemaRef)).toBe(true);
      expect(isValidRestSchemaModuleRef(contract.responseSchemaRef)).toBe(true);
    }
  });

  it("links every REST operation to family declared-before-runtime authority", () => {
    const bindings = assertRegistryRestSchemaBindings(API_CONTRACTS);

    expect(bindings).toHaveLength(API_CONTRACTS.length);

    for (const binding of bindings) {
      expect(binding.bindingKind).toBe("rest-zod-module");
      expect(binding.authority.authorityKind).toBe("declared-before-runtime");
      expect(String(binding.authority.request)).toBe(
        binding.requestSchemaModuleRef
      );
      expect(String(binding.authority.response)).toBe(
        binding.responseSchemaModuleRef
      );
    }
  });

  it("keeps REST schema binding metadata JSON-serializable", () => {
    const bindings = buildRestSchemaBindingRegistry(API_CONTRACTS);
    const serialized = JSON.parse(JSON.stringify(bindings)) as typeof bindings;

    expect(serialized).toHaveLength(bindings.length);
    for (const binding of serialized) {
      expect(typeof binding.operationId).toBe("string");
      expect(typeof binding.requestSchemaModuleRef).toBe("string");
      expect(typeof binding.responseSchemaModuleRef).toBe("string");
    }
  });
});
