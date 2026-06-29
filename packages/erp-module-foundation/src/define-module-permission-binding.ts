import type { ModulePermissionBindingDefinition } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertPermissionKeyFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModulePermissionBindingInput {
  readonly kernelPermissionKeys: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly registryNamespace: string;
  readonly registryPermissionKeys?: readonly string[];
}

export function defineModulePermissionBinding(
  input: DefineModulePermissionBindingInput
): ModulePermissionBindingDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);
  assertModuleSlugFormat(input.registryNamespace, "registryNamespace");

  if (input.kernelPermissionKeys.length === 0) {
    throw new Error(
      "defineModulePermissionBinding: kernelPermissionKeys must not be empty"
    );
  }

  assertUniqueStrings(input.kernelPermissionKeys, "kernel permission key");

  for (const key of input.kernelPermissionKeys) {
    assertPermissionKeyFormat(key);
    const [namespace] = key.split(".");
    if (namespace !== input.registryNamespace) {
      throw new Error(
        `permission key "${key}" namespace "${namespace}" !== registryNamespace "${input.registryNamespace}"`
      );
    }
  }

  if (input.registryPermissionKeys) {
    assertUniqueStrings(
      input.registryPermissionKeys,
      "registry permission key"
    );
    for (const key of input.registryPermissionKeys) {
      assertPermissionKeyFormat(key);
    }
    const kernelSet = new Set(input.kernelPermissionKeys);
    for (const key of input.registryPermissionKeys) {
      if (!kernelSet.has(key)) {
        throw new Error(
          `registry permission key "${key}" missing from kernelPermissionKeys`
        );
      }
    }
  }

  return {
    module: input.module,
    kvId: input.kvId,
    kernelPermissionKeys: input.kernelPermissionKeys,
    registryNamespace: input.registryNamespace,
    ...(input.registryPermissionKeys
      ? { registryPermissionKeys: input.registryPermissionKeys }
      : {}),
  } as const;
}
