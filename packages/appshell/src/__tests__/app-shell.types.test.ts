import { describe, expect, it } from "vitest";
import {
  type AppShellNavItemId,
  DEFAULT_COMMAND_ITEMS,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
  filterVisibleAppShellNavItems,
  groupAppShellNavItemsByKind,
  isAppShellNavItemNavigable,
  resolveAppShellActiveNavItemId,
  resolveAppShellNavBadgeLabel,
  resolveAppShellNavItemState,
} from "../app-shell.types";

describe("@afenda/appshell types", () => {
  it("exports default navigation placeholders with stable ids and governance metadata", () => {
    expect(DEFAULT_NAV_ITEMS).toHaveLength(8);
    expect(DEFAULT_NAV_ITEMS.map((item) => item.id)).toEqual([
      "nexus",
      "manufacturing",
      "inventory",
      "sales",
      "accounting",
      "hrm",
      "projects",
      "system-admin",
    ] satisfies AppShellNavItemId[]);
    expect(DEFAULT_NAV_ITEMS.map((item) => item.label)).toEqual([
      "Nexus",
      "Manufacturing",
      "Inventory",
      "Sales",
      "Accounting",
      "HRM",
      "Projects",
      "System Admin",
    ]);
    expect(DEFAULT_NAV_ITEMS.every((item) => Boolean(item.href))).toBe(true);
    expect(
      DEFAULT_NAV_ITEMS.every((item) => typeof item.order === "number")
    ).toBe(true);
    expect(DEFAULT_NAV_ITEMS.find((item) => item.id === "nexus")).toMatchObject(
      {
        kind: "core",
        icon: "nexus",
        state: "ready",
      }
    );
  });

  it("exports default workspace context placeholders with ids and labels", () => {
    expect(DEFAULT_WORKSPACE_CONTEXT).toEqual({
      tenantId: "tenant-demo",
      tenantLabel: "Demo Tenant",
      companyId: "company-demo",
      companyLabel: "Demo Company",
      organizationId: "org-demo",
      organizationLabel: "Demo Organization",
    });
  });

  it("resolves nav state and filters hidden items", () => {
    expect(resolveAppShellNavItemState({})).toBe("ready");
    expect(resolveAppShellNavItemState({ state: "coming-soon" })).toBe(
      "coming-soon"
    );

    const itemsWithHiddenInventory = DEFAULT_NAV_ITEMS.map((item) =>
      item.id === "inventory" ? { ...item, state: "hidden" as const } : item
    );
    const visible = filterVisibleAppShellNavItems(itemsWithHiddenInventory);

    expect(visible.map((item) => item.id)).not.toContain("inventory");
    expect(visible.map((item) => item.id)).toEqual([
      "nexus",
      "manufacturing",
      "sales",
      "accounting",
      "hrm",
      "projects",
      "system-admin",
    ]);
  });

  it("groups visible nav items by kind for sidebar sections", () => {
    const groups = groupAppShellNavItemsByKind(DEFAULT_NAV_ITEMS);

    expect(groups.map((group) => group.kind)).toEqual(["core", "module", "admin"]);
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["nexus"]);
    expect(groups[1]?.items.map((item) => item.id)).toEqual([
      "manufacturing",
      "inventory",
      "sales",
      "accounting",
      "hrm",
      "projects",
    ]);
    expect(groups[2]?.items.map((item) => item.id)).toEqual(["system-admin"]);
  });

  it("resolves navigability and active item from id or pathname", () => {
    expect(
      isAppShellNavItemNavigable({
        href: "/sales",
        state: "ready",
      })
    ).toBe(true);
    expect(
      isAppShellNavItemNavigable({
        href: "/sales",
        state: "coming-soon",
      })
    ).toBe(false);
    expect(
      isAppShellNavItemNavigable({
        href: "",
        state: "ready",
      })
    ).toBe(false);

    expect(
      resolveAppShellActiveNavItemId(DEFAULT_NAV_ITEMS, {
        activeItemId: "inventory",
      })
    ).toBe("inventory");
    expect(
      resolveAppShellActiveNavItemId(DEFAULT_NAV_ITEMS, {
        currentPathname: "/",
      })
    ).toBe("nexus");
    expect(
      resolveAppShellActiveNavItemId(DEFAULT_NAV_ITEMS, {
        currentPathname: "/sales/orders",
      })
    ).toBe("sales");
    expect(
      resolveAppShellActiveNavItemId(DEFAULT_NAV_ITEMS, {
        activeItemId: "nexus",
        currentPathname: "/sales",
      })
    ).toBe("nexus");
  });

  it("formats badge labels for assistive technology", () => {
    expect(resolveAppShellNavBadgeLabel("3")).toBe("3 items");
  });

  it("exports default command center placeholders", () => {
    expect(DEFAULT_COMMAND_ITEMS).toHaveLength(1);
    expect(DEFAULT_COMMAND_ITEMS[0]).toMatchObject({
      id: "command-center",
      kind: "search",
      keyboardShortcut: "⌘K",
      state: "coming-soon",
    });
  });
});
