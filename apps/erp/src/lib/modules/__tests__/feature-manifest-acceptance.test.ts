import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ERP_MODULE_IDS, listErpModuleManifests } from "@afenda/entitlements";
import { describe, expect, it } from "vitest";

import {
  generateModuleRoutes,
  getGeneratedModuleRoute,
} from "../generate-module-routes";

const ERP_APP_SRC = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const MODULE_PLACEHOLDER_PAGE = join(
  ERP_APP_SRC,
  "app/(protected)/modules/[moduleId]/page.tsx"
);

const FORBIDDEN_ACCOUNTING_IMPORTS = [
  "@afenda/accounting",
  "ledger",
  "journal",
  "posting",
] as const;

const PLACEHOLDER_DOMAIN_COPY = /Domain[\s\S]*capabilities will appear here/i;

function collectProductionSourceFiles(
  directory: string,
  collected: string[] = []
): string[] {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "e2e") {
        continue;
      }
      collectProductionSourceFiles(fullPath, collected);
      continue;
    }

    if (
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !entry.name.includes(".test.")
    ) {
      collected.push(fullPath);
    }
  }

  return collected;
}

describe("TIP-007A acceptance — manifest-only module routes", () => {
  it("materializes a route for every manifest module without hand-edited ERP paths", () => {
    const routes = generateModuleRoutes();
    const manifestModuleIds = listErpModuleManifests().map(
      (entry) => entry.moduleId
    );

    expect(routes.map((route) => route.moduleId)).toEqual(manifestModuleIds);
    expect(
      routes.every((route) => route.path === `/modules/${route.moduleId}`)
    ).toBe(true);
  });

  it("uses a single dynamic placeholder page for all manifest modules", () => {
    const placeholderSource = readFileSync(MODULE_PLACEHOLDER_PAGE, "utf8");

    expect(MODULE_PLACEHOLDER_PAGE).toContain("[moduleId]");
    expect(placeholderSource).toContain("guardModuleRoute");
    expect(placeholderSource).toContain("AppShellMain");
    expect(placeholderSource).toMatch(PLACEHOLDER_DOMAIN_COPY);

    for (const forbiddenImport of FORBIDDEN_ACCOUNTING_IMPORTS) {
      expect(placeholderSource).not.toContain(forbiddenImport);
    }
  });
});

describe("TIP-007A acceptance — accounting shell placeholder (ADR-0010)", () => {
  it("exposes accounting only as a manifest-driven shell route", () => {
    const accountingRoute = getGeneratedModuleRoute("accounting");

    expect(accountingRoute).toEqual({
      moduleId: "accounting",
      segment: "accounting",
      path: "/modules/accounting",
      permissionKey: "accounting.journal_read",
      label: "Accounting",
    });
  });

  it("does not import Accounting Core packages from module wiring", () => {
    const moduleLayerFiles = collectProductionSourceFiles(
      join(ERP_APP_SRC, "lib/modules")
    );

    for (const filePath of moduleLayerFiles) {
      const source = readFileSync(filePath, "utf8");

      for (const forbiddenImport of FORBIDDEN_ACCOUNTING_IMPORTS) {
        expect(source).not.toContain(forbiddenImport);
      }
    }
  });
});

describe("TIP-007A acceptance — no ad-hoc module route strings in ERP app", () => {
  it("does not hardcode manifest module paths outside the dynamic route segment", () => {
    const hardcodedRoutePattern = new RegExp(
      `/modules/(?:${ERP_MODULE_IDS.join("|")})\\b`
    );
    const productionFiles = collectProductionSourceFiles(ERP_APP_SRC);
    const violations: string[] = [];

    for (const filePath of productionFiles) {
      if (filePath === MODULE_PLACEHOLDER_PAGE) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (hardcodedRoutePattern.test(source)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });
});
