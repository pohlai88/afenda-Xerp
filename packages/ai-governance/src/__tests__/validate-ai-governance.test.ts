import { describe, expect, it } from "vitest";
import type { DiscoveredWorkspace } from "@afenda/architecture-authority";
import type {
  AiChangeScopeManifest,
  ChangedLine,
  PackageExportMap,
} from "../contracts/ai-change.contract.js";
import type { AiGovernanceContext } from "../validators/validate-ai-change.js";
import { validateAiGovernance } from "../validators/validate-ai-governance.js";

function workspace(
  name: string,
  directoryName: string,
  dependencies: Record<string, string> = {}
): DiscoveredWorkspace {
  return {
    packageJson: { name, dependencies },
    packageJsonPath: `/mock/${directoryName}/package.json`,
    root: `/mock/${directoryName}`,
    directoryName,
  };
}

function baseScope(
  overrides: Partial<AiChangeScopeManifest> = {}
): AiChangeScopeManifest {
  return {
    tip: "TIP-002",
    adr: "ADR-0007",
    allowedPaths: ["packages/ai-governance/**", "docs/ai/**"],
    forbiddenPaths: ["apps/erp/**"],
    reason: "Implement TIP-002 only",
    nonGoals: ["No ERP changes"],
    testPlan: ["pnpm --filter @afenda/ai-governance test:run"],
    deletionJustifications: [],
    testExemptions: [],
    ...overrides,
  };
}

function baselineWorkspaces(): DiscoveredWorkspace[] {
  return [
    workspace("@afenda/appshell", "appshell", {
      "@afenda/ui": "workspace:*",
      "@afenda/kernel": "workspace:*",
    }),
    workspace("@afenda/auth", "auth", {
      "@afenda/database": "workspace:*",
      "@afenda/kernel": "workspace:*",
    }),
    workspace("@afenda/database", "database", {
      "@afenda/observability": "workspace:*",
    }),
    workspace("@afenda/design-system", "design-system"),
    workspace("@afenda/docs", "docs"),
    workspace("@afenda/entitlements", "entitlements", {
      "@afenda/database": "workspace:*",
    }),
    workspace("@afenda/erp", "erp", {
      "@afenda/appshell": "workspace:*",
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
      "@afenda/design-system": "workspace:*",
      "@afenda/observability": "workspace:*",
      "@afenda/ui": "workspace:*",
    }),
    workspace("@afenda/execution", "execution", {
      "@afenda/kernel": "workspace:*",
      "@afenda/observability": "workspace:*",
    }),
    workspace("@afenda/feature-flags", "feature-flags", {
      "@afenda/entitlements": "workspace:*",
    }),
    workspace("@afenda/kernel", "kernel"),
    workspace("@afenda/metadata", "metadata"),
    workspace("@afenda/metadata-ui", "metadata-ui", {
      "@afenda/design-system": "workspace:*",
      "@afenda/metadata": "workspace:*",
      "@afenda/ui": "workspace:*",
    }),
    workspace("@afenda/observability", "observability"),
    workspace("@afenda/permissions", "permissions", {
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
    }),
    workspace("@afenda/storybook", "storybook", {
      "@afenda/appshell": "workspace:*",
      "@afenda/design-system": "workspace:*",
      "@afenda/ui": "workspace:*",
    }),
    workspace("@afenda/storage", "storage"),
    workspace("@afenda/testing", "testing"),
    workspace("@afenda/typescript-config", "typescript-config"),
    workspace("@afenda/ui", "ui", { "@afenda/design-system": "workspace:*" }),
    workspace("@afenda/architecture-authority", "architecture-authority"),
    workspace("@afenda/ai-governance", "ai-governance", {
      "@afenda/architecture-authority": "workspace:*",
    }),
  ];
}

function context(
  overrides: Partial<AiGovernanceContext> = {}
): AiGovernanceContext {
  return {
    mode: "scope",
    workspaces: [workspace("@afenda/ai-governance", "ai-governance")],
    changedFiles: [],
    deletedFiles: [],
    addedFiles: [],
    changedLines: [],
    scopeManifest: baseScope(),
    packageExports: [
      {
        packageName: "@afenda/database",
        exportKeys: ["."],
      },
      {
        packageName: "@afenda/metadata-ui",
        exportKeys: [".", "./server", "./client"],
      },
    ],
    sourceFilesByPath: new Map(),
    ...overrides,
  };
}

describe("validateAiGovernance", () => {
  it("fails for unregistered packages (AI-001)", () => {
    const result = validateAiGovernance(
      context({
        mode: "baseline",
        scopeManifest: null,
        workspaces: [workspace("@afenda/not-registered", "not-registered")],
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-001")).toBe(true);
  });

  it("fails for unapproved dependencies (AI-002)", () => {
    const result = validateAiGovernance(
      context({
        mode: "baseline",
        scopeManifest: null,
        workspaces: [
          workspace("@afenda/ai-governance", "ai-governance", {
            "@afenda/database": "workspace:*",
          }),
          workspace("@afenda/database", "database"),
          workspace("@afenda/observability", "observability"),
          workspace("@afenda/architecture-authority", "architecture-authority"),
        ],
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-002")).toBe(true);
  });

  it("fails for forbidden package suffix patterns (AI-003)", () => {
    const result = validateAiGovernance(
      context({
        mode: "baseline",
        scopeManifest: null,
        workspaces: [workspace("@afenda/database", "database-v2")],
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-003")).toBe(true);
  });

  it("fails for private import paths (AI-006)", () => {
    const filePath = "packages/ai-governance/src/example.ts";
    const dbPackage = "@afenda/database";
    const internalPath = "/src/internal";
    const result = validateAiGovernance(
      context({
        changedFiles: [filePath],
        sourceFilesByPath: new Map([
          [
            filePath,
            `import { db } from "${dbPackage}${internalPath}";`,
          ],
        ]),
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-006")).toBe(true);
  });

  it("allows declared export subpaths (AI-006 pass)", () => {
    const filePath = "packages/ai-governance/src/example.ts";
    const metadataPackage = "@afenda/metadata-ui";
    const serverExport = "/server";
    const result = validateAiGovernance(
      context({
        changedFiles: [filePath],
        sourceFilesByPath: new Map([
          [
            filePath,
            `import { server } from "${metadataPackage}${serverExport}";`,
          ],
        ]),
      })
    );

    expect(result.violations.some((v) => v.invariant === "AI-006")).toBe(false);
  });

  it("allows wildcard export subpaths (AI-006 pass)", () => {
    const filePath = "packages/ui/src/components/button.tsx";
    const uiPackage = "@afenda/ui";
    const governanceExport = "/governance/primitive-governance";
    const result = validateAiGovernance(
      context({
        changedFiles: [filePath],
        packageExports: [
          {
            packageName: "@afenda/database",
            exportKeys: ["."],
          },
          {
            packageName: "@afenda/metadata-ui",
            exportKeys: [".", "./server", "./client"],
          },
          {
            packageName: "@afenda/ui",
            exportKeys: [
              ".",
              "./governance",
              "./governance/*",
              "./lib/utils",
              "./lib/*",
            ],
          },
        ],
        sourceFilesByPath: new Map([
          [
            filePath,
            `import { resolvePrimitiveGovernance } from "${uiPackage}${governanceExport}";`,
          ],
        ]),
      })
    );

    expect(result.violations.some((v) => v.invariant === "AI-006")).toBe(false);
  });

  it("fails for new unsafe suppressions on changed lines (AI-010)", () => {
    const filePath = "packages/ai-governance/src/example.ts";
    const changedLines: ChangedLine[] = [
      {
        path: filePath,
        lineNumber: 1,
        content: "// @ts-ignore",
      },
    ];

    const result = validateAiGovernance(
      context({
        changedFiles: [filePath],
        changedLines,
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-010")).toBe(true);
  });

  it("fails for out-of-scope file changes (AI-004)", () => {
    const result = validateAiGovernance(
      context({
        changedFiles: ["packages/database/src/schema/user.schema.ts"],
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-004")).toBe(true);
  });

  it("fails for broad scope globs without ADR expansion (AI-004-SCOPE)", () => {
    const result = validateAiGovernance(
      context({
        scopeManifest: baseScope({ allowedPaths: ["**/*"] }),
        changedFiles: ["docs/ai/README.md"],
      })
    );

    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.invariant === "AI-004-SCOPE")).toBe(
      true
    );
  });

  it("passes for a valid TIP-002-shaped change", () => {
    const filePath = "packages/ai-governance/src/example.ts";
    const testPath = "packages/ai-governance/src/__tests__/example.test.ts";

    const result = validateAiGovernance(
      context({
        mode: "scope",
        workspaces: baselineWorkspaces(),
        changedFiles: [filePath, testPath, "docs/ai/README.md"],
        addedFiles: [filePath, testPath],
        sourceFilesByPath: new Map([
          [filePath, 'export const value = "ok";'],
        ]),
      })
    );

    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
