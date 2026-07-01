import type { OperatingContext } from "@afenda/kernel";
import type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
} from "@afenda/shadcn-studio";
import {
  ERP_ACCOUNT_NAV_GROUP,
  ERP_PLATFORM_NAV_GROUP,
  ERP_PROCUREMENT_NAV_GROUP,
  type ErpOperatorNavItemDefinition,
} from "@/lib/navigation/erp-operator-nav.registry";
import { isOperatingContextPermissionGranted } from "@/lib/permissions/check-operating-context-permission.server";
import { SYSTEM_ADMIN_SECTIONS } from "@/lib/system-admin/system-admin-sections";

async function filterNavItems(
  operatingContext: OperatingContext,
  items: readonly ErpOperatorNavItemDefinition[]
): Promise<readonly AppShellNavItemWire[]> {
  const visible: AppShellNavItemWire[] = [];

  for (const item of items) {
    if (item.readPermissionKey === undefined) {
      visible.push({ href: item.href, label: item.label });
      continue;
    }

    const granted = await isOperatingContextPermissionGranted({
      operatingContext,
      permissionKey: item.readPermissionKey,
    });

    if (granted) {
      visible.push({ href: item.href, label: item.label });
    }
  }

  return visible;
}

async function buildNavGroup(
  operatingContext: OperatingContext,
  group: {
    readonly items: readonly ErpOperatorNavItemDefinition[];
    readonly label: string;
  }
): Promise<AppShellNavGroupWire | null> {
  const items = await filterNavItems(operatingContext, group.items);

  if (items.length === 0) {
    return null;
  }

  return {
    label: group.label,
    items: [...items],
  };
}

async function buildSystemAdminNavGroup(
  operatingContext: OperatingContext
): Promise<AppShellNavGroupWire | null> {
  const items: AppShellNavItemWire[] = [];

  for (const section of SYSTEM_ADMIN_SECTIONS) {
    const granted = await isOperatingContextPermissionGranted({
      operatingContext,
      permissionKey: section.readPermissionKey,
    });

    if (granted) {
      items.push({
        href: section.href,
        label: section.label,
      });
    }
  }

  if (items.length === 0) {
    return null;
  }

  return {
    label: "System Admin",
    items,
  };
}

/** Serializable app-shell navigation filtered by read permissions. */
export async function resolveAppShellNavGroups(
  operatingContext: OperatingContext
): Promise<readonly AppShellNavGroupWire[]> {
  const groups: AppShellNavGroupWire[] = [];

  const platformGroup = await buildNavGroup(
    operatingContext,
    ERP_PLATFORM_NAV_GROUP
  );
  if (platformGroup !== null) {
    groups.push(platformGroup);
  }

  const systemAdminGroup = await buildSystemAdminNavGroup(operatingContext);
  if (systemAdminGroup !== null) {
    groups.push(systemAdminGroup);
  }

  const procurementGroup = await buildNavGroup(
    operatingContext,
    ERP_PROCUREMENT_NAV_GROUP
  );
  if (procurementGroup !== null) {
    groups.push(procurementGroup);
  }

  const accountGroup = await buildNavGroup(
    operatingContext,
    ERP_ACCOUNT_NAV_GROUP
  );
  if (accountGroup !== null) {
    groups.push(accountGroup);
  }

  return groups;
}
