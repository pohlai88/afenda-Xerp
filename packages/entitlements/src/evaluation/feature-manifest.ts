export interface FeatureManifestContract {
  readonly moduleId: string;
  readonly optionalCapabilities: readonly string[];
  readonly requiredEntitlements: readonly string[];
}

export const featureManifests = [
  {
    moduleId: "accounting",
    requiredEntitlements: ["module.accounting.enabled"],
    optionalCapabilities: ["eInvoice", "auditExport"],
  },
  {
    moduleId: "mrp",
    requiredEntitlements: ["module.mrp.enabled"],
    optionalCapabilities: ["lotTracking", "forecasting"],
  },
  {
    moduleId: "ai_copilot",
    requiredEntitlements: ["module.ai_copilot.enabled"],
    optionalCapabilities: ["aiRecommendations"],
  },
] as const satisfies readonly FeatureManifestContract[];
