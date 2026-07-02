import type { AppShellNavGroupWire } from "@afenda/shadcn-studio";

export const labNavGroups = [
  {
    label: "Lab",
    items: [{ href: "/", label: "Overview" }],
  },
  {
    label: "Dashboard",
    items: [
      { href: "/dashboard/sales", label: "Sales" },
      { href: "/dashboard/finance", label: "Finance" },
    ],
  },
  {
    label: "Admin",
    items: [{ href: "/admin/users", label: "Users" }],
  },
  {
    label: "Settings",
    items: [{ href: "/settings/appearance", label: "Appearance" }],
  },
] as const satisfies readonly AppShellNavGroupWire[];

export type LabNavGroups = typeof labNavGroups;
