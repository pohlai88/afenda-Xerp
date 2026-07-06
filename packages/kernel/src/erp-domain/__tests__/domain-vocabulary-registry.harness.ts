import { expect } from "vitest";

import type { ErpDomainVocabularyRegistryShape } from "../_internal/domain-vocabulary.types.js";

export interface DeliveredDomainVocabularyRegistryHarnessInput {
  readonly auditActionCount: number;
  readonly brandedIdTypeNames: readonly string[];
  readonly closedVocabularyIds: readonly string[];
  readonly currentLifecycle: string;
  readonly excludedBrandedIdTypeNames?: readonly string[];
  readonly permissionKeyCount: number;
  readonly registry: ErpDomainVocabularyRegistryShape;
  readonly registryId: string;
}

export function assertDeliveredDomainVocabularyRegistry(
  input: DeliveredDomainVocabularyRegistryHarnessInput
): void {
  expect(input.registry.id).toBe(input.registryId);
  expect(input.registry.closedVocabularies.map((entry) => entry.id)).toEqual([
    ...input.closedVocabularyIds,
  ]);

  for (const entry of input.registry.closedVocabularies) {
    expect(entry.pasSection).toBe("4.8");
    expect(entry.valueCount).toBeGreaterThan(0);
  }

  expect(input.registry.brandedIds.map((entry) => entry.typeName)).toEqual([
    ...input.brandedIdTypeNames,
  ]);

  for (const excluded of input.excludedBrandedIdTypeNames ?? []) {
    expect(
      input.registry.brandedIds.map((entry) => entry.typeName)
    ).not.toContain(excluded);
  }

  for (const entry of input.registry.brandedIds) {
    expect(entry.brandFunction).toMatch(/^brand/);
    expect(entry.toFunction).toMatch(/^to/);
  }

  expect(input.registry.auditVocabulary.valueCount).toBe(
    input.auditActionCount
  );
  expect(input.registry.permissionVocabulary.keyCount).toBe(
    input.permissionKeyCount
  );
  expect(input.registry.authorityMetadata.currentLifecycle).toBe(
    input.currentLifecycle
  );
}
