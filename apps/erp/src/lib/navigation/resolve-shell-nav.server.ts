import type { OperatingContext } from "@afenda/kernel";
import type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
} from "@afenda/shadcn-studio-v2/clients";
import {
  toNavGroupId,
  toNavItemId,
} from "@/lib/presentation/app-shell-nav-wire";
import {
  ERP_ACCOUNT_NAV_GROUP,
  ERP_PLATFORM_NAV_GROUP,
  ERP_PROCUREMENT_NAV_GROUP,
  type ErpOperatorNavItemDefinition,
} from "@/lib/navigation/erp-operator-nav.registry";
import { OPERATOR_NAV_LABELS } from "@/lib/navigation/operator-nav-label.registry";
import { resolveOperatorNavLabel } from "@/lib/navigation/resolve-operator-nav-label.server";
import { isOperatingContextPermissionGranted } from "@/lib/permissions/check-operating-context-permission.server";
import { SYSTEM_ADMIN_SECTIONS } from "@/lib/system-admin/system-admin-sections";

async function filterNavItems(
  operatingContext: OperatingContext,
  items: readonly ErpOperatorNavItemDefinition[]
): Promise<readonly AppShellNavItemWire[]> {
  const visible: AppShellNavItemWire[] = [];

  for (const item of items) {
    const navItem = {
      href: item.href,
      id: toNavItemId(item.href),
      label: resolveOperatorNavLabel({ label: item.label }),
    };

    if (item.readPermissionKey === undefined) {
      visible.push(navItem);
      continue;
    }

    const granted = await isOperatingContextPermissionGranted({
      operatingContext,
      permissionKey: item.readPermissionKey,
    });

    if (granted) {
      visible.push(navItem);
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
    id: toNavGroupId(group.label),
    items: [...items],
    label: group.label,
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
        id: section.sectionId,
        label: section.label,
      });
    }
  }

  if (items.length === 0) {
    return null;
  }

  const label = resolveOperatorNavLabel(OPERATOR_NAV_LABELS.systemAdminGroup);

  return {
    id: toNavGroupId(label),
    items,
    label,
  };
}

/** Serializable shell navigation filtered by read permissions. */
export async function resolveShellNavGroups(
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
