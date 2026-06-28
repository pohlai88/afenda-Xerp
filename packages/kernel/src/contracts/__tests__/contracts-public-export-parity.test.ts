import { describe, expect, it } from "vitest";

import * as kernelRoot from "../../index.js";
import { APP_ERROR_CODES as directAppErrorCodes } from "../app-error.contract.js";
import { EXECUTION_CONTEXT_SOURCES as directExecutionSources } from "../execution-context.contract.js";
import { EXECUTION_CONTEXT_POLICY as directExecutionPolicy } from "../execution-context.policy.contract.js";
import { KERNEL_CONTRACTS_CANONICAL_PATHS as directContractsPaths } from "../kernel-package-layout.contract.js";
import * as platformBarrel from "../platform/index.js";
import {
  getPlatformEntityAuthority as directGetPlatformEntityAuthority,
  isPlatformEntityId as directIsPlatformEntityId,
  PLATFORM_ENTITY_AUTHORITY_ENTRIES as directPlatformEntries,
  PLATFORM_ENTITY_IDS as directPlatformIds,
  PLATFORM_ENTITY_POLICY as directPlatformPolicy,
  PLATFORM_ENTITY_AUTHORITY_REGISTRY as directPlatformRegistry,
  PLATFORM_ENTITY_RUNTIME_STATUSES as directPlatformRuntimeStatuses,
} from "../platform/platform-entity-authority.contract.js";
import { ok as directOk, okWire as directOkWire } from "../result.contract.js";

const CONTRACT_ROOT_EXPORT_KEYS = [
  "APP_ERROR_CODES",
  "AppErrors",
  "EXECUTION_CONTEXT_POLICY",
  "EXECUTION_CONTEXT_REQUIRED_FIELDS",
  "EXECUTION_CONTEXT_SOURCES",
  "KERNEL_CONTRACTS_CANONICAL_PATHS",
  "getPlatformEntityAuthority",
  "isPlatformEntityId",
  "ok",
  "okWire",
  "PLATFORM_ENTITY_AUTHORITY_ENTRIES",
  "PLATFORM_ENTITY_AUTHORITY_REGISTRY",
  "PLATFORM_ENTITY_IDS",
  "PLATFORM_ENTITY_POLICY",
  "PLATFORM_ENTITY_RUNTIME_STATUSES",
  "toAppErrorWire",
] as const satisfies readonly (keyof typeof kernelRoot)[];

describe("contracts public export parity (@afenda/kernel root vs contracts modules)", () => {
  it("re-exports every locked contract symbol from the root barrel", () => {
    for (const exportKey of CONTRACT_ROOT_EXPORT_KEYS) {
      expect(kernelRoot[exportKey], exportKey).toBeDefined();
    }
  });

  it("re-exports contract registries by reference from direct modules and platform barrel", () => {
    expect(kernelRoot.APP_ERROR_CODES).toBe(directAppErrorCodes);
    expect(kernelRoot.EXECUTION_CONTEXT_SOURCES).toBe(directExecutionSources);
    expect(kernelRoot.EXECUTION_CONTEXT_REQUIRED_FIELDS).toHaveLength(8);
    expect(kernelRoot.EXECUTION_CONTEXT_POLICY).toBe(directExecutionPolicy);
    expect(kernelRoot.KERNEL_CONTRACTS_CANONICAL_PATHS).toBe(
      directContractsPaths
    );
    expect(kernelRoot.PLATFORM_ENTITY_IDS).toBe(directPlatformIds);
    expect(kernelRoot.PLATFORM_ENTITY_POLICY).toBe(directPlatformPolicy);
    expect(kernelRoot.PLATFORM_ENTITY_RUNTIME_STATUSES).toBe(
      directPlatformRuntimeStatuses
    );
    expect(kernelRoot.PLATFORM_ENTITY_AUTHORITY_ENTRIES).toBe(
      directPlatformEntries
    );
    expect(kernelRoot.PLATFORM_ENTITY_AUTHORITY_REGISTRY).toBe(
      directPlatformRegistry
    );
    expect(kernelRoot.getPlatformEntityAuthority).toBe(
      directGetPlatformEntityAuthority
    );
    expect(kernelRoot.isPlatformEntityId).toBe(directIsPlatformEntityId);
  });

  it("re-exports platform barrel symbols by reference from ./contracts/platform", () => {
    expect(kernelRoot.PLATFORM_ENTITY_IDS).toBe(
      platformBarrel.PLATFORM_ENTITY_IDS
    );
    expect(kernelRoot.PLATFORM_ENTITY_POLICY).toBe(
      platformBarrel.PLATFORM_ENTITY_POLICY
    );
    expect(kernelRoot.PLATFORM_ENTITY_AUTHORITY_REGISTRY).toBe(
      platformBarrel.PLATFORM_ENTITY_AUTHORITY_REGISTRY
    );
    expect(kernelRoot.getPlatformEntityAuthority).toBe(
      platformBarrel.getPlatformEntityAuthority
    );
  });

  it("re-exports contract helpers with stable behavior", () => {
    expect(kernelRoot.ok({ id: "x" })).toEqual(directOk({ id: "x" }));
    expect(kernelRoot.okWire("value")).toEqual(directOkWire("value"));
    expect(kernelRoot.AppErrors.notFound("Tenant").code).toBe("NOT_FOUND");
    expect(
      kernelRoot.toAppErrorWire(kernelRoot.AppErrors.internal(new Error("x")))
        .code
    ).toBe("INTERNAL_ERROR");
  });
});
