import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertNoV1ConsumerImport,
  assertSourcesFreeOfV1Imports,
} from "./helpers/forbidden-v1-import-patterns";
import { assertSliceDocumentComplete } from "./helpers/lane-slice-doc-status";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");
const ERP_SRC_ROOT = path.join(REPO_ROOT, "apps/erp/src");

const B07_EXT_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-07-EXT-ERP-SURFACE-WAVE-2.md"
);

const WAVE_2_TOUCHPOINTS = {
  rolesPage: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/system-admin/roles/page.tsx"
  ),
  permissionsPage: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/system-admin/permissions/page.tsx"
  ),
  auditPage: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/system-admin/audit/page.tsx"
  ),
  diagnosticsPage: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/system-admin/diagnostics/page.tsx"
  ),
  settingsPage: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/system-admin/settings/page.tsx"
  ),
  workspacePage: path.join(ERP_SRC_ROOT, "app/(protected)/workspace/page.tsx"),
  dashboardRenderer: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/workspace/_components/dashboard-layout-renderer.client.tsx"
  ),
  workspaceToolbar: path.join(
    ERP_SRC_ROOT,
    "components/workspace/workspace-dashboard-toolbar.client.tsx"
  ),
  authComplete: path.join(
    ERP_SRC_ROOT,
    "components/auth/auth-complete-ingress.client.tsx"
  ),
  authWorkspaceSelect: path.join(
    ERP_SRC_ROOT,
    "components/auth/auth-workspace-select-ingress.client.tsx"
  ),
  erpErrorPage: path.join(
    ERP_SRC_ROOT,
    "components/presentation/erp-error-page.client.tsx"
  ),
  errorRegistry: path.join(
    ERP_SRC_ROOT,
    "lib/presentation/error-page-surface.registry.ts"
  ),
  errorVariantPath: path.join(
    ERP_SRC_ROOT,
    "lib/presentation/get-error-page-variant-for-path.ts"
  ),
  accountingReadiness: path.join(
    ERP_SRC_ROOT,
    "app/(protected)/standards/accounting-readiness/page.tsx"
  ),
  authWcagTest: path.join(
    ERP_SRC_ROOT,
    "lib/auth/__tests__/auth-wcag-aa.contract.test.tsx"
  ),
  rolesComposer: path.join(
    ERP_SRC_ROOT,
    "components/system-admin/system-admin-roles-composer.client.tsx"
  ),
  permissionsComposer: path.join(
    ERP_SRC_ROOT,
    "components/system-admin/system-admin-permissions-composer.client.tsx"
  ),
} as const;

function readTouchpoint(relativePath: string): string {
  return readFileSync(path.join(ERP_SRC_ROOT, relativePath), "utf8");
}

describe("Lane B-07-ext ERP surface wave 2", () => {
  it("routes roles and permissions through v2 composers without v1 blocks", () => {
    const rolesPage = readFileSync(WAVE_2_TOUCHPOINTS.rolesPage, "utf8");
    const permissionsPage = readFileSync(
      WAVE_2_TOUCHPOINTS.permissionsPage,
      "utf8"
    );
    const rolesComposer = readFileSync(
      WAVE_2_TOUCHPOINTS.rolesComposer,
      "utf8"
    );
    const permissionsComposer = readFileSync(
      WAVE_2_TOUCHPOINTS.permissionsComposer,
      "utf8"
    );

    expect(rolesPage).toContain("SystemAdminRolesComposer");
    expect(permissionsPage).toContain("SystemAdminPermissionsComposer");
    expect(rolesComposer).toContain("ErpDataTableComposer");
    expect(permissionsComposer).toContain("ErpDataTableComposer");
    assertNoV1ConsumerImport(rolesPage);
    assertNoV1ConsumerImport(permissionsPage);
  });

  it("migrates workspace, auth, and error surfaces to v2-only imports", () => {
    const workspacePage = readFileSync(
      WAVE_2_TOUCHPOINTS.workspacePage,
      "utf8"
    );
    const dashboardRenderer = readFileSync(
      WAVE_2_TOUCHPOINTS.dashboardRenderer,
      "utf8"
    );
    const workspaceToolbar = readFileSync(
      WAVE_2_TOUCHPOINTS.workspaceToolbar,
      "utf8"
    );
    const authComplete = readFileSync(WAVE_2_TOUCHPOINTS.authComplete, "utf8");
    const authWorkspaceSelect = readFileSync(
      WAVE_2_TOUCHPOINTS.authWorkspaceSelect,
      "utf8"
    );
    const erpErrorPage = readFileSync(WAVE_2_TOUCHPOINTS.erpErrorPage, "utf8");

    expect(workspacePage).toContain("@afenda/shadcn-studio-v2");
    expect(dashboardRenderer).toContain("WorkspaceBoardCanvasClient");
    expect(workspaceToolbar).toContain("@afenda/shadcn-studio-v2");
    expect(authComplete).toContain("@afenda/shadcn-studio-v2/clients");
    expect(authWorkspaceSelect).toContain("@afenda/shadcn-studio-v2/clients");
    expect(erpErrorPage).toContain("ErpErrorPageShell");

    assertSourcesFreeOfV1Imports([
      { label: "workspacePage", source: workspacePage },
      { label: "dashboardRenderer", source: dashboardRenderer },
      { label: "workspaceToolbar", source: workspaceToolbar },
      { label: "authComplete", source: authComplete },
      { label: "authWorkspaceSelect", source: authWorkspaceSelect },
      { label: "erpErrorPage", source: erpErrorPage },
    ]);
  });

  it("records B-07-ext slice completion", () => {
    const slice = readFileSync(B07_EXT_SLICE_PATH, "utf8");

    assertSliceDocumentComplete(
      DOCS_SLICES_ROOT,
      "LANE-B-07-EXT-ERP-SURFACE-WAVE-2.md"
    );
    expect(slice).toContain("ErpDataTableComposer");
  });

  it("has zero active v1 imports across wave-2 baseline touchpoints", () => {
    const baselineRelativePaths = [
      "app/(protected)/system-admin/roles/page.tsx",
      "app/(protected)/system-admin/permissions/page.tsx",
      "app/(protected)/system-admin/audit/page.tsx",
      "app/(protected)/system-admin/diagnostics/page.tsx",
      "app/(protected)/system-admin/settings/page.tsx",
      "app/(protected)/workspace/page.tsx",
      "app/(protected)/workspace/_components/dashboard-layout-renderer.client.tsx",
      "components/workspace/workspace-dashboard-toolbar.client.tsx",
      "components/presentation/erp-error-page.client.tsx",
      "lib/presentation/error-page-surface.registry.ts",
      "lib/presentation/get-error-page-variant-for-path.ts",
      "app/(protected)/standards/accounting-readiness/page.tsx",
      "lib/auth/__tests__/auth-wcag-aa.contract.test.tsx",
      "components/system-admin/system-admin-roles-composer.client.tsx",
      "components/system-admin/system-admin-permissions-composer.client.tsx",
    ] as const;

    for (const relativePath of baselineRelativePaths) {
      const source = readTouchpoint(relativePath);
      assertNoV1ConsumerImport(source, relativePath);
    }
  });
});
