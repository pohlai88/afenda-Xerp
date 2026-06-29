/**
 * PAS-001 B112 — ERP format precision ingress wiring registry.
 *
 * Machine-readable attestation surface for governance gate
 * `check:erp-format-precision-ingress-attestation`.
 */
export const ERP_FORMAT_PRECISION_INGRESS_WIRING = [
  {
    id: "company-settings",
    module:
      "@/lib/format-precision/persist-company-format-precision-settings.server",
    delegate: "parseCompanyFormatPrecisionSettingsAtIngress",
    kernelDelegate: "parseUnknownRoundingModeVocabulary",
    persistenceDelegate: "persistCompanyFormatPrecisionSettings",
  },
] as const;

export type ErpFormatPrecisionIngressSurface =
  (typeof ERP_FORMAT_PRECISION_INGRESS_WIRING)[number]["id"];
