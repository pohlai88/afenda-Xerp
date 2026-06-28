import type { OperatingContext } from "@afenda/kernel";

import { getSystemAdminSectionKnowledgeTitle } from "@/lib/knowledge/enterprise-knowledge-vocabulary.server";

import {
  SYSTEM_ADMIN_SETTINGS_FIELD_LABELS,
  SYSTEM_ADMIN_SETTINGS_SECTION_COPY,
  SYSTEM_ADMIN_SETTINGS_SECTION_FIELD_IDS,
  type SystemAdminSettingsFieldId,
  type SystemAdminSettingsSectionId,
} from "./system-admin-settings.copy.contract";

export interface SystemAdminSettingsFieldRow {
  readonly fieldId: SystemAdminSettingsFieldId;
  readonly label: string;
  readonly value: string;
}

export interface SystemAdminSettingsSectionFormValues {
  readonly description: string;
  readonly fields: readonly SystemAdminSettingsFieldRow[];
  readonly sectionId: SystemAdminSettingsSectionId;
  readonly title: string;
}

export interface SystemAdminSettingsFormValues {
  readonly sections: readonly SystemAdminSettingsSectionFormValues[];
}

function resolveFieldValue(
  operatingContext: OperatingContext,
  fieldId: SystemAdminSettingsFieldId
): string {
  const { tenant, legalEntity, permissionScope } = operatingContext;

  switch (fieldId) {
    case "tenant.displayName":
      return tenant.displayName;
    case "tenant.slug":
      return tenant.slug;
    case "tenant.tenantId":
      return tenant.tenantId;
    case "legalEntity.displayName":
      return legalEntity.displayName;
    case "legalEntity.slug":
      return legalEntity.slug;
    case "legalEntity.companyId":
      return legalEntity.companyId;
    case "permissionScope.grantScopeType":
      return permissionScope.grantScopeType;
    case "permissionScope.tenantId":
      return permissionScope.tenantId;
    case "permissionScope.companyId":
      return permissionScope.companyId ?? "—";
    default: {
      const exhaustive: never = fieldId;
      return exhaustive;
    }
  }
}

export function resolveSystemAdminSettingsFormValues(
  operatingContext: OperatingContext
): SystemAdminSettingsFormValues {
  const sections = SYSTEM_ADMIN_SETTINGS_SECTION_COPY.map((sectionCopy) => {
    const fieldIds =
      SYSTEM_ADMIN_SETTINGS_SECTION_FIELD_IDS[sectionCopy.sectionId];

    return {
      sectionId: sectionCopy.sectionId,
      title: getSystemAdminSectionKnowledgeTitle(sectionCopy.sectionId),
      description: sectionCopy.description,
      fields: fieldIds.map((fieldId) => ({
        fieldId,
        label: SYSTEM_ADMIN_SETTINGS_FIELD_LABELS[fieldId],
        value: resolveFieldValue(operatingContext, fieldId),
      })),
    } satisfies SystemAdminSettingsSectionFormValues;
  });

  return { sections };
}
