import { describe, expect, it } from "vitest";
import { resolveSystemAdminCardNavItems } from "@/lib/system-admin/resolve-system-admin-card-nav";
import { SYSTEM_ADMIN_SECTIONS } from "@/lib/system-admin/system-admin-sections";

describe("resolveSystemAdminCardNavItems", () => {
  it("maps visible sections to card nav items without hardcoded route arrays", () => {
    const visibleSections = SYSTEM_ADMIN_SECTIONS.filter(
      (section) =>
        section.sectionId === "users" || section.sectionId === "audit"
    );

    const items = resolveSystemAdminCardNavItems({
      visibleSections,
    });

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.href)).toEqual([
      "/system-admin/users",
      "/system-admin/audit",
    ]);
    expect(items.every((item) => item.description.length > 0)).toBe(true);
  });

  it("excludes the current section from cross-navigation items", () => {
    const items = resolveSystemAdminCardNavItems({
      currentSectionId: "settings",
      visibleSections: SYSTEM_ADMIN_SECTIONS,
    });

    expect(items.some((item) => item.sectionId === "settings")).toBe(false);
    expect(items).toHaveLength(SYSTEM_ADMIN_SECTIONS.length - 1);
  });
});
