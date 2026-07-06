import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const MEMBERSHIPS_PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/app/(protected)/system-admin/memberships/page.tsx"
);
const USERS_PAGE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/app/(protected)/system-admin/users/page.tsx"
);
const LIST_TOOLBAR_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/components/system-admin/system-admin-list-toolbar.client.tsx"
);
const MEMBERSHIPS_COMPOSER_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/components/system-admin/system-admin-memberships-composer.client.tsx"
);
const USERS_COMPOSER_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/components/system-admin/system-admin-users-composer.client.tsx"
);
const B07_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-07-ERP-SURFACE-WAVE-SYSTEM-ADMIN.md"
);

const FORBIDDEN_V1_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

describe("Lane B-07 ERP system-admin surface wave", () => {
  it("routes memberships and users through v2 composers without v1 blocks", () => {
    const membershipsPage = readFileSync(MEMBERSHIPS_PAGE_PATH, "utf8");
    const usersPage = readFileSync(USERS_PAGE_PATH, "utf8");

    expect(membershipsPage).toContain("SystemAdminMembershipsComposer");
    expect(membershipsPage).not.toMatch(FORBIDDEN_V1_IMPORT);
    expect(usersPage).toContain("SystemAdminUsersComposer");
    expect(usersPage).not.toMatch(FORBIDDEN_V1_IMPORT);
  });

  it("uses v2 toolbar and ErpDataTableComposer for system-admin wave", () => {
    const toolbar = readFileSync(LIST_TOOLBAR_PATH, "utf8");
    const membershipsComposer = readFileSync(MEMBERSHIPS_COMPOSER_PATH, "utf8");
    const usersComposer = readFileSync(USERS_COMPOSER_PATH, "utf8");

    expect(toolbar).toContain("@afenda/shadcn-studio-v2/clients");
    expect(toolbar).toContain("@afenda/shadcn-studio-v2");
    expect(toolbar).not.toMatch(FORBIDDEN_V1_IMPORT);
    expect(membershipsComposer).toContain("ErpDataTableComposer");
    expect(usersComposer).toContain("ErpDataTableComposer");
  });

  it("records B-07 slice completion", () => {
    const slice = readFileSync(B07_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("ErpDataTableComposer");
  });
});
