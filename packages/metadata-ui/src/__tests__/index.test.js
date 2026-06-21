"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var permissions_1 = require("@afenda/permissions");
var vitest_1 = require("vitest");
var index_1 = require("../index");
var requiredContractFiles = [
    "metadata-surface.contract.ts",
    "metadata-section.contract.ts",
    "metadata-action.contract.ts",
    "metadata-renderer.contract.ts",
    "metadata-registry.contract.ts",
    "metadata-state.contract.ts",
    "metadata-permission.contract.ts",
    "metadata-audit-panel.contract.ts",
    "metadata-layout.contract.ts",
    "metadata-example.contract.ts",
];
var requiredSectionTypes = [
    "page-header",
    "action-bar",
    "list",
    "form",
    "stat",
    "chart",
    "kanban",
    "detail-tabs",
    "audit-panel",
    "empty-state",
    "surface-chrome",
];
var currentDirectory = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
var baseLayout = {
    density: "standard",
    recipe: "card",
    region: "main",
};
(0, vitest_1.describe)("@afenda/metadata-ui", function () {
    (0, vitest_1.it)("exports the package name", function () {
        (0, vitest_1.expect)(index_1.PACKAGE_NAME).toBe("@afenda/metadata-ui");
        (0, vitest_1.expect)((0, index_1.getPackageName)()).toBe("@afenda/metadata-ui");
    });
    (0, vitest_1.it)("defines the required TIP-007 contract files and section types", function () {
        for (var _i = 0, requiredContractFiles_1 = requiredContractFiles; _i < requiredContractFiles_1.length; _i++) {
            var fileName = requiredContractFiles_1[_i];
            (0, vitest_1.expect)((0, node_fs_1.existsSync)((0, node_path_1.join)(currentDirectory, "..", "contracts", fileName))).toBe(true);
        }
        (0, vitest_1.expect)(index_1.governedMetadataSectionTypes).toEqual(requiredSectionTypes);
        (0, vitest_1.expect)(index_1.metadataSectionSchemas.map(function (schema) { return schema.type; })).toEqual(requiredSectionTypes);
    });
    (0, vitest_1.it)("selects the highest-priority compatible renderer and fails safely", function () {
        var _a, _b;
        var registry = (0, index_1.createExampleRendererRegistry)();
        var listResolution = registry.resolve("list");
        var unsupportedResolution = (0, index_1.createMetadataRendererRegistry)().resolve("chart");
        (0, vitest_1.expect)((_a = listResolution.renderer) === null || _a === void 0 ? void 0 : _a.id).toBe("metadata.list.enterprise");
        (0, vitest_1.expect)((_b = listResolution.renderer) === null || _b === void 0 ? void 0 : _b.priority).toBe(200);
        (0, vitest_1.expect)(unsupportedResolution.renderer).toBeNull();
        (0, vitest_1.expect)(unsupportedResolution.reason).toContain("No renderer registered");
        (0, vitest_1.expect)(index_1.defaultMetadataRenderers).toHaveLength(7);
    });
    (0, vitest_1.it)("renderer registry lists all renderers sorted by priority descending", function () {
        var _a, _b, _c;
        var registry = (0, index_1.createExampleRendererRegistry)();
        var renderers = registry.listRenderers();
        var snapshot = registry.snapshot();
        (0, vitest_1.expect)((_a = renderers[0]) === null || _a === void 0 ? void 0 : _a.priority).toBeGreaterThanOrEqual((_c = (_b = renderers[1]) === null || _b === void 0 ? void 0 : _b.priority) !== null && _c !== void 0 ? _c : 0);
        (0, vitest_1.expect)(snapshot.sectionTypes).toEqual(requiredSectionTypes);
        (0, vitest_1.expect)(snapshot.renderers.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("renderer registry returns the same instance from register (fluid chain)", function () {
        var _a;
        var registryA = (0, index_1.createMetadataRendererRegistry)();
        var registryB = registryA.register({
            id: "test.renderer",
            priority: 50,
            recipe: "card",
            sectionTypes: ["stat"],
            stable: false,
        });
        (0, vitest_1.expect)((_a = registryB.resolve("stat").renderer) === null || _a === void 0 ? void 0 : _a.id).toBe("test.renderer");
    });
    (0, vitest_1.it)("MetadataRendererRegistry is a valid exported type", function () {
        var registry = (0, index_1.createMetadataRendererRegistry)();
        (0, vitest_1.expect)(typeof registry.resolve).toBe("function");
        (0, vitest_1.expect)(typeof registry.register).toBe("function");
        (0, vitest_1.expect)(typeof registry.snapshot).toBe("function");
    });
    (0, vitest_1.it)("validates governed metadata surfaces and sensitive actions", function () {
        var _a;
        var surfaceValidation = (0, index_1.validateMetadataSurface)(index_1.governedMetadataSurfaceExample.surface);
        var exportAction = index_1.governedMetadataSurfaceExample.surface.actions[0];
        (0, vitest_1.expect)(surfaceValidation).toEqual({ valid: true, errors: [] });
        (0, vitest_1.expect)(exportAction).toBeDefined();
        (0, vitest_1.expect)((0, index_1.isSensitiveMetadataAction)((_a = exportAction === null || exportAction === void 0 ? void 0 : exportAction.category) !== null && _a !== void 0 ? _a : "standard")).toBe(true);
        (0, vitest_1.expect)(exportAction ? (0, index_1.validateMetadataAction)(exportAction).valid : false).toBe(true);
        (0, vitest_1.expect)(JSON.parse(JSON.stringify(index_1.governedMetadataSurfaceExample))).toEqual(index_1.governedMetadataSurfaceExample);
    });
    (0, vitest_1.it)("validateMetadataSurface rejects a surface with no sections", function () {
        var result = (0, index_1.validateMetadataSurface)({
            id: "surface.empty",
            title: "Empty",
            layout: baseLayout,
            state: (0, index_1.resolveMetadataState)("ready"),
            sections: [],
            actions: [],
        });
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors[0]).toContain("at least one section");
    });
    (0, vitest_1.it)("validateMetadataSection rejects invalid, column-less, and field-less sections", function () {
        var invalidType = (0, index_1.validateMetadataSection)({
            id: "s1",
            title: "Bad",
            layout: baseLayout,
            // @ts-expect-error intentionally invalid type for runtime validation test
            type: "unknown-type",
        });
        var listNoColumns = (0, index_1.validateMetadataSection)({
            id: "s2",
            title: "List",
            layout: baseLayout,
            type: "list",
        });
        var formNoFields = (0, index_1.validateMetadataSection)({
            id: "s3",
            title: "Form",
            layout: baseLayout,
            type: "form",
        });
        var auditNoPanel = (0, index_1.validateMetadataSection)({
            id: "s4",
            title: "Audit",
            layout: baseLayout,
            type: "audit-panel",
        });
        (0, vitest_1.expect)(invalidType.valid).toBe(false);
        (0, vitest_1.expect)(invalidType.errors[0]).toContain("Unsupported section type");
        (0, vitest_1.expect)(listNoColumns.valid).toBe(false);
        (0, vitest_1.expect)(listNoColumns.errors[0]).toContain("at least one governed column");
        (0, vitest_1.expect)(formNoFields.valid).toBe(false);
        (0, vitest_1.expect)(formNoFields.errors[0]).toContain("at least one governed field");
        (0, vitest_1.expect)(auditNoPanel.valid).toBe(false);
        (0, vitest_1.expect)(auditNoPanel.errors[0]).toContain("audit panel contract");
    });
    (0, vitest_1.it)("identifies all five sensitive action categories", function () {
        var sensitiveCategories = index_1.METADATA_ACTION_CATEGORIES.filter(index_1.isSensitiveMetadataAction);
        (0, vitest_1.expect)(sensitiveCategories).toEqual([
            "destructive",
            "financial",
            "export",
            "ai",
            "approval",
        ]);
        (0, vitest_1.expect)((0, index_1.isSensitiveMetadataAction)("standard")).toBe(false);
    });
    (0, vitest_1.it)("validateMetadataAction rejects sensitive actions without confirmation or policy", function () {
        var permission = (0, permissions_1.createPermissionKey)("records", "delete");
        var result = (0, index_1.validateMetadataAction)({
            id: "action.records.delete",
            label: "Delete",
            category: "destructive",
            commandId: "records.delete",
            executionMode: "command",
            permission: {
                denialEffect: "hide",
                permissionKey: permission,
                reason: "Requires delete permission.",
            },
            audit: {
                action: "records.deleted",
                evidence: ["actorId"],
                targetType: "records",
            },
        });
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors[0]).toContain("confirmation or policy metadata");
    });
    (0, vitest_1.it)("resolves permission-aware visibility without executing actions", function () {
        var exportPermission = (0, permissions_1.createPermissionKey)("records", "export");
        var hiddenAction = index_1.governedMetadataSurfaceExample.surface.actions[0];
        if (!hiddenAction) {
            throw new Error("Expected governed example action.");
        }
        (0, vitest_1.expect)((0, index_1.resolveMetadataVisibility)(hiddenAction.permission, {
            grantedPermissions: [],
        })).toMatchObject({
            allowed: false,
            effect: "hide",
        });
        (0, vitest_1.expect)((0, index_1.resolveMetadataActions)([hiddenAction], {
            grantedPermissions: [exportPermission],
        })).toEqual([hiddenAction]);
    });
    (0, vitest_1.it)("resolveMetadataVisibility passes with no requirement and handles disable effect", function () {
        var noRequirement = (0, index_1.resolveMetadataVisibility)(undefined, {
            grantedPermissions: [],
        });
        (0, vitest_1.expect)(noRequirement).toEqual({
            allowed: true,
            effect: null,
            reason: null,
        });
        var disabledPermission = (0, permissions_1.createPermissionKey)("records", "read");
        var disableResult = (0, index_1.resolveMetadataVisibility)({
            denialEffect: "disable",
            permissionKey: (0, permissions_1.createPermissionKey)("records", "export"),
            reason: "Requires export permission.",
        }, { grantedPermissions: [disabledPermission] });
        (0, vitest_1.expect)(disableResult.allowed).toBe(false);
        (0, vitest_1.expect)(disableResult.effect).toBe("disable");
    });
    (0, vitest_1.it)("resolveMetadataActions retains disabled actions but excludes hidden ones", function () {
        var _a;
        var disablePermission = (0, permissions_1.createPermissionKey)("records", "export");
        var disabledAction = {
            id: "action.disable",
            label: "View only",
            category: "standard",
            commandId: "records.view",
            executionMode: "command",
            permission: {
                denialEffect: "disable",
                permissionKey: disablePermission,
                reason: "Read-only without export.",
            },
            audit: {
                action: "records.viewed",
                evidence: ["actorId"],
                targetType: "records",
            },
        };
        var hiddenAction = {
            id: "action.hidden",
            label: "Delete",
            category: "destructive",
            commandId: "records.delete",
            executionMode: "command",
            permission: {
                denialEffect: "hide",
                permissionKey: (0, permissions_1.createPermissionKey)("records", "delete"),
                reason: "Requires delete permission.",
            },
            audit: {
                action: "records.deleted",
                evidence: ["actorId"],
                targetType: "records",
            },
            policy: { confirmationRequired: true },
        };
        var resolved = (0, index_1.resolveMetadataActions)([disabledAction, hiddenAction], {
            grantedPermissions: [],
        });
        (0, vitest_1.expect)(resolved).toHaveLength(1);
        (0, vitest_1.expect)((_a = resolved[0]) === null || _a === void 0 ? void 0 : _a.id).toBe("action.disable");
    });
    (0, vitest_1.it)("maps screen states through the governed design-system state recipe", function () {
        (0, vitest_1.expect)(index_1.metadataStateSchema.map(function (state) { return state.state; })).toEqual([
            "loading",
            "empty",
            "error",
            "forbidden",
            "invalid",
            "ready",
        ]);
        var presentation = (0, index_1.resolveMetadataStatePresentation)((0, index_1.resolveMetadataState)("forbidden"));
        (0, vitest_1.expect)(presentation).toMatchObject({
            recipe: "status-state",
            recipeAvailable: true,
            state: {
                state: "forbidden",
                tone: "forbidden",
            },
        });
    });
    (0, vitest_1.it)("resolveMetadataState throws for an unrecognised state string", function () {
        (0, vitest_1.expect)(function () {
            // @ts-expect-error intentionally invalid state for runtime guard test
            return (0, index_1.resolveMetadataState)("unknown-state");
        }).toThrow('Unsupported metadata surface state "unknown-state"');
    });
});
