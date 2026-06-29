/**
 * PAS-001-AUD-13 — ERP localization context ingress wiring registry.
 *
 * Machine-readable attestation surface for governance gate
 * `check:erp-localization-context-ingress-attestation`.
 */
export const ERP_LOCALIZATION_INGRESS_WIRING = [
  {
    id: "user-preferences",
    module: "@/lib/localization/persist-user-localization-preferences.server",
    delegate: "parseUserLocalizationPreferencesAtIngress",
    kernelDelegate: "parseUnknownLocalizationContext",
    persistenceDelegate: "persistUserLocalizationPreferences",
  },
  {
    id: "company-settings",
    module: "@/lib/localization/persist-company-localization-settings.server",
    delegate: "parseCompanyLocalizationSettingsAtIngress",
    kernelDelegate: "parseUnknownLocalizationContext",
    persistenceDelegate: "persistCompanyLocalizationSettings",
  },
] as const;

export type ErpLocalizationIngressSurface =
  (typeof ERP_LOCALIZATION_INGRESS_WIRING)[number]["id"];
