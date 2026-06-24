import type {
  SystemAdminSectionDefinition,
  SystemAdminSectionId,
} from "./system-admin-sections";

export type ErpCardNavIconKey = SystemAdminSectionId;

export interface ErpCardNavItem {
  readonly description: string;
  readonly href: SystemAdminSectionDefinition["href"];
  readonly iconKey: ErpCardNavIconKey;
  readonly label: string;
  readonly sectionId: SystemAdminSectionId;
}

const SYSTEM_ADMIN_SECTION_NAV_DESCRIPTIONS = {
  audit: "Review recent security and configuration audit events.",
  memberships: "Manage company and tenant membership assignments.",
  permissions: "Inspect permission registry entries and grants.",
  roles: "Configure role definitions and scoped assignments.",
  settings: "View organization and platform configuration scaffolds.",
  users: "Open the user directory and invite flows when they land.",
} as const satisfies Record<SystemAdminSectionId, string>;

export function resolveSystemAdminCardNavItems(input: {
  readonly currentSectionId?: SystemAdminSectionId;
  readonly visibleSections: readonly SystemAdminSectionDefinition[];
}): readonly ErpCardNavItem[] {
  return input.visibleSections
    .filter((section) => section.sectionId !== input.currentSectionId)
    .map((section) => ({
      description: SYSTEM_ADMIN_SECTION_NAV_DESCRIPTIONS[section.sectionId],
      href: section.href,
      iconKey: section.sectionId,
      label: section.label,
      sectionId: section.sectionId,
    }));
}
