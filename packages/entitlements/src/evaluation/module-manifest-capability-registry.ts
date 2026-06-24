import type { PermissionKey } from "@afenda/database";

import {
  type CapabilityDefinition,
  capabilities,
  getCapability,
} from "./capability-registry";
import {
  type ErpModuleId,
  getErpModuleManifest,
  listErpModuleManifests,
} from "./feature-manifest.registry";

export interface ModuleManifestCapabilityBinding {
  readonly evaluationCapabilityKey: keyof typeof capabilities | null;
  readonly moduleId: ErpModuleId;
  readonly optionalCapabilityKeys: readonly (keyof typeof capabilities)[];
  readonly permissionKey: PermissionKey;
}

const MODULE_EVALUATION_CAPABILITY: Partial<
  Record<ErpModuleId, keyof typeof capabilities>
> = {
  accounting: "accounting",
  ai_copilot: "aiCopilot",
  manufacturing: "mrp",
  mrp: "mrp",
};

function resolveOptionalCapabilityKeys(
  moduleId: ErpModuleId
): readonly (keyof typeof capabilities)[] {
  const manifest = getErpModuleManifest(moduleId);
  if (!manifest) {
    return [];
  }

  return manifest.optionalCapabilities.filter(
    (key): key is keyof typeof capabilities => key in capabilities
  );
}

export function getModuleManifestCapabilityBinding(
  moduleId: ErpModuleId
): ModuleManifestCapabilityBinding | null {
  const manifest = getErpModuleManifest(moduleId);
  if (!manifest) {
    return null;
  }

  return {
    moduleId,
    permissionKey: manifest.permissionKey,
    evaluationCapabilityKey: MODULE_EVALUATION_CAPABILITY[moduleId] ?? null,
    optionalCapabilityKeys: resolveOptionalCapabilityKeys(moduleId),
  };
}

export function listModuleManifestCapabilityBindings(): readonly ModuleManifestCapabilityBinding[] {
  return listErpModuleManifests().map((entry) => {
    const binding = getModuleManifestCapabilityBinding(entry.moduleId);
    if (!binding) {
      throw new Error(
        `Missing module manifest capability binding for "${entry.moduleId}".`
      );
    }
    return binding;
  });
}

export function resolveModuleOptionalCapabilities(
  moduleId: ErpModuleId
): readonly CapabilityDefinition[] {
  const binding = getModuleManifestCapabilityBinding(moduleId);
  if (!binding) {
    return [];
  }

  return binding.optionalCapabilityKeys
    .map((key) => getCapability(String(key)))
    .filter(
      (capability): capability is CapabilityDefinition => capability !== null
    );
}
