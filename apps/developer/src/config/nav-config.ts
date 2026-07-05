import type { AppShellNavGroupWire } from "@afenda/shadcn-studio";
import { labRoutePolicies } from "@/lib/lab/route-policy";

const findPolicy = (href: string) =>
  labRoutePolicies.find((policy) => policy.href === href);

export const labNavGroups = [
  {
    label: "Dashboards",
    items: [
      {
        href: "/dashboard/sales",
        label: "Sales",
      },
      {
        href: "/dashboard/finance",
        label: "Finance",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/users",
        label: "Users",
      },
      {
        href: "/settings/appearance",
        label: "Appearance",
      },
    ],
  },
] satisfies readonly AppShellNavGroupWire[];

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
