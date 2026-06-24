import { ERP_MODULE_MANIFEST } from "./feature-manifest.registry";

export interface FeatureManifestContract {
  readonly moduleId: string;
  readonly optionalCapabilities: readonly string[];
  readonly requiredEntitlements: readonly string[];
}

/** @deprecated Prefer `ERP_MODULE_MANIFEST` — retained for TIP-008 backward compatibility. */
export const featureManifests = ERP_MODULE_MANIFEST.filter((entry) =>
  ["accounting", "mrp", "ai_copilot"].includes(entry.moduleId)
).map((entry) => ({
  moduleId: entry.moduleId,
  requiredEntitlements: entry.requiredEntitlements,
  optionalCapabilities: entry.optionalCapabilities,
})) satisfies readonly FeatureManifestContract[];
