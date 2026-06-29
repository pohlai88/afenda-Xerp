import type {
  ModulePermissionBindingDefinition,
  PermissionParityMode,
} from "./erp-module-foundation.types.js";
import { PERMISSION_PARITY_MODES } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertPermissionKeyFormat,
  assertPermissionNamespaceFormat,
  assertPermissionParityExact,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModulePermissionBindingInput {
  readonly kernelPermissionKeys: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly permissionNamespace?: string;
  readonly permissionParity?: PermissionParityMode;
  readonly registryPermissionKeys?: readonly string[];
}

function assertPermissionParityMode(value: PermissionParityMode): void {
  if (!PERMISSION_PARITY_MODES.includes(value)) {
    throw new Error(`invalid permissionParity mode: "${value}"`);
  }
}

function validateKernelPermissionKeys(
  kernelPermissionKeys: readonly string[],
  permissionNamespace: string
): void {
  if (kernelPermissionKeys.length === 0) {
    throw new Error(
      "defineModulePermissionBinding: kernelPermissionKeys must not be empty"
    );
  }

  assertUniqueStrings(kernelPermissionKeys, "kernel permission key");

  for (const key of kernelPermissionKeys) {
    assertPermissionKeyFormat(key);
    const [namespace] = key.split(".");
    if (namespace !== permissionNamespace) {
      throw new Error(
        `permission key "${key}" namespace "${namespace}" !== permissionNamespace "${permissionNamespace}"`
      );
    }
  }
}

function validateRegistryPermissionKeys(
  kernelPermissionKeys: readonly string[],
  registryPermissionKeys: readonly string[],
  permissionParity: PermissionParityMode
): void {
  assertUniqueStrings(registryPermissionKeys, "registry permission key");

  for (const key of registryPermissionKeys) {
    assertPermissionKeyFormat(key);
  }

  const kernelSet = new Set(kernelPermissionKeys);
  for (const key of registryPermissionKeys) {
    if (!kernelSet.has(key)) {
      throw new Error(
        `registry permission key "${key}" missing from kernelPermissionKeys`
      );
    }
  }

  if (permissionParity === "exact") {
    assertPermissionParityExact({
      kernelPermissionKeys,
      registryPermissionKeys,
    });
  }
}

export function defineModulePermissionBinding(
  input: DefineModulePermissionBindingInput
): ModulePermissionBindingDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  const permissionNamespace = input.permissionNamespace ?? input.module;
  assertPermissionNamespaceFormat(permissionNamespace, "permissionNamespace");

  const permissionParity = input.permissionParity ?? "deferred";
  assertPermissionParityMode(permissionParity);

  validateKernelPermissionKeys(input.kernelPermissionKeys, permissionNamespace);

  if (
    (permissionParity === "exact" || permissionParity === "subset_allowed") &&
    (!input.registryPermissionKeys || input.registryPermissionKeys.length === 0)
  ) {
    throw new Error(
      `defineModulePermissionBinding: permissionParity ${permissionParity} requires non-empty registryPermissionKeys`
    );
  }

  if (input.registryPermissionKeys && input.registryPermissionKeys.length > 0) {
    validateRegistryPermissionKeys(
      input.kernelPermissionKeys,
      input.registryPermissionKeys,
      permissionParity
    );
  }

  return {
    module: input.module,
    kvId: input.kvId,
    kernelPermissionKeys: input.kernelPermissionKeys,
    permissionNamespace,
    permissionParity,
    ...(input.registryPermissionKeys
      ? { registryPermissionKeys: input.registryPermissionKeys }
      : {}),
  } as const;
}
