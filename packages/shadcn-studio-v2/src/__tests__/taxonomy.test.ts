import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");
const NON_STRUCTURAL_SRC_FOLDERS = new Set(["__tests__"]);

const allowedRootFolders = new Set([
  "components",
  "configs",
  "contexts",
  "hooks",
  "lib",
  "metadata",
  "storybook",
  "styles",
  "types",
  "utils",
  "views",
]);

const requiredRootFiles = new Set([
  "clients.ts",
  "index.ts",
  "metadata.ts",
  "server.ts",
]);

const allowedSecondLevelFolders: Record<string, Set<string>> = {
  components: new Set(["assets", "layout", "quarantine", "shared", "ui"]),
  metadata: new Set(["builders", "contracts", "gates", "registries"]),
  storybook: new Set(["fixtures", "stories"]),
  views: new Set([
    "auth",
    "dashboards",
    "datatables",
    "dialogs",
    "forms",
    "pages",
    "settings",
    "widgets",
  ]),
};

const requiredSecondLevelFolders: Record<string, Set<string>> = {
  components: new Set(["assets", "layout", "quarantine", "shared", "ui"]),
  metadata: new Set(["builders", "contracts", "gates", "registries"]),
  views: new Set([
    "auth",
    "datatables",
    "dialogs",
    "forms",
    "pages",
    "settings",
    "widgets",
  ]),
};

const forbiddenNames = new Set([
  "blocks",
  "components-auth-shell",
  "components-layouts",
  "components-ui",
  "domains",
  "features",
  "layouts",
  "meta-contracts",
  "meta-gates",
  "meta-registry",
  "modules",
  "sections",
  "shells",
  "theme-config",
  "theme-runtime",
]);

function readNames(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory)
    .filter((name) => !NON_STRUCTURAL_SRC_FOLDERS.has(name))
    .sort();
}

function isDirectory(filePath: string): boolean {
  return statSync(filePath).isDirectory();
}

function buildTree(directory: string, depth = 0, maxDepth = 2): string[] {
  if (!existsSync(directory) || depth > maxDepth) {
    return [];
  }

  const lines: string[] = [];

  for (const name of readNames(directory)) {
    const fullPath = path.join(directory, name);
    const suffix = isDirectory(fullPath) ? "/" : "";

    lines.push(`${"  ".repeat(depth)}${name}${suffix}`);

    if (isDirectory(fullPath)) {
      lines.push(...buildTree(fullPath, depth + 1, maxDepth));
    }
  }

  return lines;
}

describe("shadcn-studio-v2 taxonomy", () => {
  it("uses only registered top-level src names", () => {
    const names = readNames(SRC_ROOT);

    const invalid = names.filter((name) => {
      const fullPath = path.join(SRC_ROOT, name);

      return isDirectory(fullPath)
        ? !allowedRootFolders.has(name)
        : !requiredRootFiles.has(name);
    });

    expect(invalid).toEqual([]);
  });

  it("includes the approved root public export files", () => {
    const names = new Set(readNames(SRC_ROOT));

    for (const fileName of requiredRootFiles) {
      expect(names.has(fileName)).toBe(true);
    }
  });

  it("does not use forbidden legacy structural names anywhere under src", () => {
    const violations: string[] = [];

    function walk(directory: string): void {
      for (const name of readNames(directory)) {
        const fullPath = path.join(directory, name);

        if (forbiddenNames.has(name)) {
          violations.push(path.relative(SRC_ROOT, fullPath));
        }

        if (isDirectory(fullPath)) {
          walk(fullPath);
        }
      }
    }

    walk(SRC_ROOT);

    expect(violations).toEqual([]);
  });

  it("uses only registered second-level folder names", () => {
    const violations: string[] = [];

    for (const [folder, allowedChildren] of Object.entries(
      allowedSecondLevelFolders
    )) {
      const folderPath = path.join(SRC_ROOT, folder);

      for (const name of readNames(folderPath)) {
        const fullPath = path.join(folderPath, name);

        if (isDirectory(fullPath) && !allowedChildren.has(name)) {
          violations.push(path.relative(SRC_ROOT, fullPath));
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("includes the Phase 1 approved source skeleton folders", () => {
    const rootNames = new Set(readNames(SRC_ROOT));

    for (const folder of allowedRootFolders) {
      expect(rootNames.has(folder)).toBe(true);
    }

    for (const [folder, requiredChildren] of Object.entries(
      requiredSecondLevelFolders
    )) {
      const names = new Set(readNames(path.join(SRC_ROOT, folder)));

      for (const child of requiredChildren) {
        expect(names.has(child)).toBe(true);
      }
    }
  });

  it("keeps hook files in kebab use-* form", () => {
    const violations = readNames(path.join(SRC_ROOT, "hooks")).filter(
      (name) =>
        !(
          isDirectory(path.join(SRC_ROOT, "hooks", name)) ||
          /^use-[a-z0-9-]+\.(ts|tsx)$/.test(name)
        )
    );

    expect(violations).toEqual([]);
  });

  it("rejects camelCase canonical config names", () => {
    const configs = readNames(path.join(SRC_ROOT, "configs"));

    expect(configs).not.toContain("themeConfig.ts");
    expect(configs).not.toContain("studioConfig.ts");
  });

  it("matches the approved taxonomy tree snapshot", () => {
    expect(buildTree(SRC_ROOT).join("\n")).toMatchInlineSnapshot(`
      "clients.ts
      components/
        assets/
          IconMark.tsx
        layout/
          AdmincnNav.tsx
          AdmincnShell.tsx
          AppShell.tsx
          Sidebar.tsx
          Topbar.tsx
        quarantine/
          README.md
        shared/
          ThemeToggle.tsx
        ui/
          Alert.tsx
          Badge.tsx
          Button.tsx
          Card.tsx
          Field.tsx
          Table.tsx
      configs/
        studio-config.ts
        theme-config.ts
      contexts/
        ThemeProvider.tsx
        theme-boundary.ts
      hooks/
        use-theme.ts
      index.ts
      lib/
        cn.ts
      metadata/
        builders/
          view-builders.ts
        contracts/
          view-metadata.ts
        gates/
          view-metadata-gates.ts
        registries/
          view-metadata-registry.ts
      metadata.ts
      server.ts
      storybook/
        fixtures/
          consumer-pilot.tsx
      styles/
        shadcn-default.css
        swiss-noir.css
        verdant-noir.css
      types/
        css-export.d.ts
        studio.ts
        theme.ts
      utils/
        .gitkeep
      views/
        auth/
          AuthShell.tsx
        datatables/
          .gitkeep
        dialogs/
          .gitkeep
        forms/
          .gitkeep
        pages/
          PageSurface.tsx
        settings/
          .gitkeep
        widgets/
          MetricWidget.tsx
          StatisticsRevenueCardBlock.tsx
          StatisticsSalesOverviewCardBlock.tsx"
    `);
  });
});
