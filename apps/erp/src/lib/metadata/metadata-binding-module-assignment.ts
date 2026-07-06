/** ERP-local metadata binding module assignment (no kernel import). */

export const METADATA_BINDING_MODULE_KV_ID_BY_SLUG = {
  crm: "KV-CRM",
  hcm: "KV-HCM",
  inventory: "KV-INV",
  procurement: "KV-PROC",
} as const satisfies Readonly<Record<string, string>>;

const MODULE_ASSIGNMENT_BY_BLOCK_ID = {
  "datatable-invoice": "inventory",
  "hero-section-01": "inventory",
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
