import type { AppShellNavGroupWire } from "@afenda/shadcn-studio-v2/clients";
import { labRoutePolicies } from "@/lib/lab/route-policy";
import { labRouteSurfaceRegistry } from "@/lib/lab/route-surface-registry";

const findPolicy = (href: string) =>
  labRoutePolicies.find((policy) => policy.href === href);

const navGroupOrder = ["Dashboards", "Operations", "Modules"] as const;

const toNavGroupId = (groupLabel: string) =>
  groupLabel.toLowerCase().replace(/\s+/g, "-");

export const labNavGroups: readonly AppShellNavGroupWire[] = navGroupOrder
  .map((groupLabel) => ({
    id: toNavGroupId(groupLabel),
    label: groupLabel,
    items: labRouteSurfaceRegistry
      .filter((entry) => entry.showInNav && entry.navGroupLabel === groupLabel)
      .map((entry) => ({
        href: entry.href,
        id: entry.routeId,
        label: entry.navLabel ?? entry.routeId,
      })),
  }))
  .filter((group) => group.items.length > 0);

export function getLabNavGroups(pathname: string) {
  return labNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const policy = findPolicy(item.href);

      return {
        ...item,
        isActive:
          item.href === pathname ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
        label: policy ? item.label : `${item.label} (Unmapped)`,
      };
    }),
  }));
}
