/**
 * PAS-006D P06-008-R1 — optional ERP module slug assignment (string-only; no kernel import).
 * ERP validates slugs at apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts.
 */

/** Manual mirror of PAS-001B KV ids — presentation layer only. */
export const METADATA_BINDING_MODULE_KV_ID_BY_SLUG = {
  crm: "KV-CRM",
  hcm: "KV-HCM",
  inventory: "KV-INV",
  procurement: "KV-PROC",
} as const satisfies Readonly<Record<string, string>>;

const MODULE_ASSIGNMENT_BY_BLOCK_ID = {
  "datatable-invoice": "inventory",
  "hero-section-01": "inventory",
  "login-page-04": "hcm",
  "statistics-card-01": "inventory",
} as const satisfies Readonly<Record<string, string>>;

const MODULE_ASSIGNMENT_PREFIX_RULES: readonly {
  readonly moduleSlug: string;
  readonly prefix: string;
}[] = [
  { prefix: "account-settings-", moduleSlug: "hcm" },
  { prefix: "statistics-", moduleSlug: "inventory" },
  { prefix: "widget-", moduleSlug: "inventory" },
  { prefix: "chart-", moduleSlug: "inventory" },
  { prefix: "dashboard-dialog-", moduleSlug: "inventory" },
];

export interface MetadataBindingModuleAssignment {
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
}

export function resolveMetadataBindingModuleAssignment(
  blockId: string
): MetadataBindingModuleAssignment {
  const exactSlug =
    MODULE_ASSIGNMENT_BY_BLOCK_ID[
      blockId as keyof typeof MODULE_ASSIGNMENT_BY_BLOCK_ID
    ];

  const prefixRule = MODULE_ASSIGNMENT_PREFIX_RULES.find((rule) =>
    blockId.startsWith(rule.prefix)
  );

  const moduleSlug = exactSlug ?? prefixRule?.moduleSlug;

  if (moduleSlug === undefined) {
    return {};
  }

  const kvId =
    METADATA_BINDING_MODULE_KV_ID_BY_SLUG[
      moduleSlug as keyof typeof METADATA_BINDING_MODULE_KV_ID_BY_SLUG
    ];

  return kvId === undefined
    ? { erpDomainModuleSlug: moduleSlug }
    : { erpDomainModuleSlug: moduleSlug, erpDomainKvId: kvId };
}
