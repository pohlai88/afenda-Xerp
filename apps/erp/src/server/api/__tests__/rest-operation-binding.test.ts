import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  buildRestOperationBindingRegistry,
  extractRestOperationBinding,
  REST_INTERNAL_V1_NAMESPACE,
} from "@/server/api/contracts/rest-operation-binding.contract";

describe("RestOperationBinding (PAS-API-REST-001-S1)", () => {
  it("maps every registry contract to a REST internal v1 binding", () => {
    const bindings = buildRestOperationBindingRegistry(API_CONTRACTS);

    expect(bindings).toHaveLength(API_CONTRACTS.length);

    for (const binding of bindings) {
      expect(binding.bindingKind).toBe("rest-internal-v1");
      expect(binding.namespace).toBe(REST_INTERNAL_V1_NAMESPACE);
      expect(binding.path.startsWith(`${REST_INTERNAL_V1_NAMESPACE}/`)).toBe(
        true
      );
    }
  });

  it("preserves family operation identity on each binding", () => {
    for (const contract of API_CONTRACTS) {
      const binding = extractRestOperationBinding(contract);
      expect(String(binding.operationId)).toBe(contract.id);
      expect(binding.method).toBe(contract.method);
      expect(binding.path).toBe(contract.path);
    }
  });

  it("keeps REST bindings JSON-serializable for catalog pipelines", () => {
    const bindings = buildRestOperationBindingRegistry(API_CONTRACTS);
    const serialized = JSON.parse(JSON.stringify(bindings)) as typeof bindings;

    expect(serialized).toHaveLength(bindings.length);
    for (const binding of serialized) {
      expect(typeof binding.operationId).toBe("string");
      expect(typeof binding.path).toBe("string");
      expect(typeof binding.method).toBe("string");
    }
  });
});
