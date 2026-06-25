export const SYSTEM_ADMIN_SETTINGS_SECTION_IDS = [
  "tenant",
  "legal-entity",
  "permission-scope",
] as const;

export type SystemAdminSettingsSectionId =
  (typeof SYSTEM_ADMIN_SETTINGS_SECTION_IDS)[number];

export interface SystemAdminSettingsSectionCopy {
  readonly description: string;
  readonly sectionId: SystemAdminSettingsSectionId;
  readonly title: string;
}

export const SYSTEM_ADMIN_SETTINGS_SECTION_COPY = [
  {
    sectionId: "tenant",
    title: "Tenant",
    description:
      "SaaS isolation boundary for the current workspace. Display name is editable; slug and tenant ID are read-only.",
  },
  {
    sectionId: "legal-entity",
    title: "Legal entity",
    description:
      "Company authority for the active operating context. Values are read-only until settings persistence APIs connect.",
  },
  {
    sectionId: "permission-scope",
    title: "Permission scope",
    description:
      "Resolved grant dimensions for the signed-in actor. Scope changes flow through membership and role assignment surfaces.",
  },
] as const satisfies readonly SystemAdminSettingsSectionCopy[];

export const SYSTEM_ADMIN_SETTINGS_FIELD_IDS = [
  "tenant.displayName",
  "tenant.slug",
  "tenant.tenantId",
  "legalEntity.displayName",
  "legalEntity.slug",
  "legalEntity.companyId",
  "permissionScope.grantScopeType",
  "permissionScope.tenantId",
  "permissionScope.companyId",
] as const;

export type SystemAdminSettingsFieldId =
  (typeof SYSTEM_ADMIN_SETTINGS_FIELD_IDS)[number];

export const SYSTEM_ADMIN_SETTINGS_FIELD_LABELS = {
  "tenant.displayName": "Display name",
  "tenant.slug": "Slug",
  "tenant.tenantId": "Tenant ID",
  "legalEntity.displayName": "Display name",
  "legalEntity.slug": "Slug",
  "legalEntity.companyId": "Company ID",
  "permissionScope.grantScopeType": "Grant scope",
  "permissionScope.tenantId": "Tenant ID",
  "permissionScope.companyId": "Company ID",
} as const satisfies Record<SystemAdminSettingsFieldId, string>;

export const SYSTEM_ADMIN_SETTINGS_SECTION_FIELD_IDS = {
  tenant: ["tenant.displayName", "tenant.slug", "tenant.tenantId"],
  "legal-entity": [
    "legalEntity.displayName",
    "legalEntity.slug",
    "legalEntity.companyId",
  ],
  "permission-scope": [
    "permissionScope.grantScopeType",
    "permissionScope.tenantId",
    "permissionScope.companyId",
  ],
} as const satisfies Record<
  SystemAdminSettingsSectionId,
  readonly SystemAdminSettingsFieldId[]
>;

export const EDITABLE_SYSTEM_ADMIN_SETTINGS_FIELD_IDS = [
  "tenant.displayName",
] as const satisfies readonly SystemAdminSettingsFieldId[];

export type EditableSystemAdminSettingsFieldId =
  (typeof EDITABLE_SYSTEM_ADMIN_SETTINGS_FIELD_IDS)[number];

export const SYSTEM_ADMIN_SETTINGS_FIELD_FORM_NAMES = {
  "tenant.displayName": "companyName",
} as const satisfies Partial<
  Record<EditableSystemAdminSettingsFieldId, string>
>;

export const SYSTEM_ADMIN_SETTINGS_SCAFFOLD_SUBMIT_LABEL =
  "Save settings" as const;

export const SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE =
  "You do not have permission to update organization settings." as const;
