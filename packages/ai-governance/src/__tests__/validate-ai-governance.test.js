"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var validate_ai_governance_js_1 = require("../validators/validate-ai-governance.js");
function workspace(name, directoryName, dependencies) {
    if (dependencies === void 0) { dependencies = {}; }
    return {
        packageJson: { name: name, dependencies: dependencies },
        packageJsonPath: "/mock/".concat(directoryName, "/package.json"),
        root: "/mock/".concat(directoryName),
        directoryName: directoryName,
    };
}
function baseScope(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ tip: "TIP-002", adr: "ADR-0007", allowedPaths: ["packages/ai-governance/**", "docs/ai/**"], forbiddenPaths: ["apps/erp/**"], reason: "Implement TIP-002 only", nonGoals: ["No ERP changes"], testPlan: ["pnpm --filter @afenda/ai-governance test:run"], deletionJustifications: [], testExemptions: [] }, overrides);
}
function baselineWorkspaces() {
    return [
        workspace("@afenda/appshell", "appshell"),
        workspace("@afenda/auth", "auth", { "@afenda/database": "workspace:*" }),
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
            "@afenda/observability": "workspace:*",
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
            "@afenda/permissions": "workspace:*",
        }),
        workspace("@afenda/observability", "observability"),
        workspace("@afenda/permissions", "permissions", {
            "@afenda/auth": "workspace:*",
            "@afenda/database": "workspace:*",
        }),
        workspace("@afenda/storage", "storage"),
        workspace("@afenda/testing", "testing"),
        workspace("@afenda/typescript-config", "typescript-config"),
        workspace("@afenda/ui", "ui"),
        workspace("@afenda/architecture-authority", "architecture-authority"),
        workspace("@afenda/ai-governance", "ai-governance", {
            "@afenda/architecture-authority": "workspace:*",
        }),
    ];
}
function context(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ mode: "scope", workspaces: [workspace("@afenda/ai-governance", "ai-governance")], changedFiles: [], deletedFiles: [], addedFiles: [], changedLines: [], scopeManifest: baseScope(), packageExports: [
            {
                packageName: "@afenda/database",
                exportKeys: ["."],
            },
            {
                packageName: "@afenda/metadata-ui",
                exportKeys: [".", "./server", "./client"],
            },
        ], sourceFilesByPath: new Map() }, overrides);
}
(0, vitest_1.describe)("validateAiGovernance", function () {
    (0, vitest_1.it)("fails for unregistered packages (AI-001)", function () {
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            mode: "baseline",
            scopeManifest: null,
            workspaces: [workspace("@afenda/not-registered", "not-registered")],
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-001"; })).toBe(true);
    });
    (0, vitest_1.it)("fails for unapproved dependencies (AI-002)", function () {
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
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
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-002"; })).toBe(true);
    });
    (0, vitest_1.it)("fails for forbidden package suffix patterns (AI-003)", function () {
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            mode: "baseline",
            scopeManifest: null,
            workspaces: [workspace("@afenda/database", "database-v2")],
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-003"; })).toBe(true);
    });
    (0, vitest_1.it)("fails for private import paths (AI-006)", function () {
        var filePath = "packages/ai-governance/src/example.ts";
        var dbPackage = "@afenda/database";
        var internalPath = "/src/internal";
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            changedFiles: [filePath],
            sourceFilesByPath: new Map([
                [
                    filePath,
                    "import { db } from \"".concat(dbPackage).concat(internalPath, "\";"),
                ],
            ]),
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-006"; })).toBe(true);
    });
    (0, vitest_1.it)("allows declared export subpaths (AI-006 pass)", function () {
        var filePath = "packages/ai-governance/src/example.ts";
        var metadataPackage = "@afenda/metadata-ui";
        var serverExport = "/server";
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            changedFiles: [filePath],
            sourceFilesByPath: new Map([
                [
                    filePath,
                    "import { server } from \"".concat(metadataPackage).concat(serverExport, "\";"),
                ],
            ]),
        }));
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-006"; })).toBe(false);
    });
    (0, vitest_1.it)("fails for new unsafe suppressions on changed lines (AI-010)", function () {
        var filePath = "packages/ai-governance/src/example.ts";
        var changedLines = [
            {
                path: filePath,
                lineNumber: 1,
                content: "// @ts-ignore",
            },
        ];
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            changedFiles: [filePath],
            changedLines: changedLines,
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-010"; })).toBe(true);
    });
    (0, vitest_1.it)("fails for out-of-scope file changes (AI-004)", function () {
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            changedFiles: ["packages/database/src/schema/user.schema.ts"],
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-004"; })).toBe(true);
    });
    (0, vitest_1.it)("fails for broad scope globs without ADR expansion (AI-004-SCOPE)", function () {
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            scopeManifest: baseScope({ allowedPaths: ["**/*"] }),
            changedFiles: ["docs/ai/README.md"],
        }));
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.violations.some(function (v) { return v.invariant === "AI-004-SCOPE"; })).toBe(true);
    });
    (0, vitest_1.it)("passes for a valid TIP-002-shaped change", function () {
        var filePath = "packages/ai-governance/src/example.ts";
        var testPath = "packages/ai-governance/src/__tests__/example.test.ts";
        var result = (0, validate_ai_governance_js_1.validateAiGovernance)(context({
            mode: "scope",
            workspaces: baselineWorkspaces(),
            changedFiles: [filePath, testPath, "docs/ai/README.md"],
            addedFiles: [filePath, testPath],
            sourceFilesByPath: new Map([
                [filePath, 'export const value = "ok";'],
            ]),
        }));
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(result.violations).toHaveLength(0);
    });
});
