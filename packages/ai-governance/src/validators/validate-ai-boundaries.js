"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAiBoundaries = validateAiBoundaries;
var architecture_authority_1 = require("@afenda/architecture-authority");
var ai_boundary_policy_js_1 = require("../policies/ai-boundary-policy.js");
var glob_js_1 = require("../utils/glob.js");
function validateForbiddenPackageNames(context) {
    var violations = [];
    for (var _i = 0, _a = context.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        for (var _b = 0, FORBIDDEN_AI_PACKAGE_PATTERNS_1 = ai_boundary_policy_js_1.FORBIDDEN_AI_PACKAGE_PATTERNS; _b < FORBIDDEN_AI_PACKAGE_PATTERNS_1.length; _b++) {
            var pattern = FORBIDDEN_AI_PACKAGE_PATTERNS_1[_b];
            if (pattern.test(workspace.directoryName)) {
                violations.push({
                    invariant: "AI-003",
                    gate: "boundaries",
                    message: "forbidden package directory name pattern: ".concat(workspace.directoryName),
                    path: workspace.packageJson.name,
                });
            }
        }
    }
    return violations;
}
function validateScopePaths(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    var _a = context.scopeManifest, allowedPaths = _a.allowedPaths, forbiddenPaths = _a.forbiddenPaths, tip = _a.tip;
    for (var _i = 0, _b = context.changedFiles; _i < _b.length; _i++) {
        var path = _b[_i];
        if ((0, glob_js_1.pathMatchesAnyGlob)(path, forbiddenPaths)) {
            violations.push({
                invariant: "AI-004",
                gate: "scope",
                message: "changed file matches forbiddenPaths in scope manifest (TIP: ".concat(tip, ")"),
                path: path,
            });
            continue;
        }
        if (!(0, glob_js_1.pathMatchesAnyGlob)(path, allowedPaths)) {
            violations.push({
                invariant: "AI-004",
                gate: "scope",
                message: "changed file is outside declared TIP scope (TIP: ".concat(tip, ")"),
                path: path,
            });
        }
    }
    return violations;
}
function validateBroadScopeGlobs(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    for (var _i = 0, _a = context.scopeManifest.allowedPaths; _i < _a.length; _i++) {
        var glob = _a[_i];
        if (!ai_boundary_policy_js_1.FORBIDDEN_BROAD_SCOPE_GLOBS.includes(glob)) {
            continue;
        }
        if (!context.scopeManifest.scopeExpansionAdr) {
            violations.push({
                invariant: "AI-004-SCOPE",
                gate: "scope-drift",
                message: "broad scope glob not permitted without scopeExpansionAdr: ".concat(glob),
            });
        }
    }
    return violations;
}
function validateBusinessLogicBoundaries(context) {
    var _a, _b;
    if (context.mode !== "scope") {
        return [];
    }
    var violations = [];
    var _loop_1 = function (path) {
        var source = context.sourceFilesByPath.get(path);
        if (!source) {
            return "continue";
        }
        var workspace = context.workspaces.find(function (entry) {
            return path.replaceAll("\\", "/").includes(entry.root.replaceAll("\\", "/"));
        });
        if (!workspace) {
            return "continue";
        }
        var layer = (0, architecture_authority_1.getPackageLayer)(workspace.packageJson.name);
        var isForbiddenLayer = ai_boundary_policy_js_1.BUSINESS_LOGIC_FORBIDDEN_LAYERS.includes(layer !== null && layer !== void 0 ? layer : "");
        if (!isForbiddenLayer && workspace.packageJson.name !== ai_boundary_policy_js_1.ARCHITECTURE_AUTHORITY_PACKAGE) {
            return "continue";
        }
        for (var _d = 0, _e = source.matchAll(ai_boundary_policy_js_1.IMPORT_PATTERN); _d < _e.length; _d++) {
            var match = _e[_d];
            var specifier = (_b = (_a = match[1]) !== null && _a !== void 0 ? _a : match[2]) !== null && _b !== void 0 ? _b : match[3];
            if (!(specifier === null || specifier === void 0 ? void 0 : specifier.startsWith("@afenda/"))) {
                continue;
            }
            var importedPackage = (0, ai_boundary_policy_js_1.extractWorkspacePackageName)(specifier);
            var importedLayer = (0, architecture_authority_1.getPackageLayer)(importedPackage);
            if (importedLayer === ai_boundary_policy_js_1.DOMAIN_LAYER) {
                violations.push({
                    invariant: "AI-005",
                    gate: "boundaries",
                    message: "".concat(workspace.packageJson.name, " must not import domain package ").concat(importedPackage),
                    path: path,
                });
            }
        }
    };
    for (var _i = 0, _c = context.changedFiles; _i < _c.length; _i++) {
        var path = _c[_i];
        _loop_1(path);
    }
    return violations;
}
function isTestOrFixturePath(path) {
    return (path.includes("/__tests__/") ||
        path.includes("/tests/") ||
        path.endsWith(".test.ts") ||
        path.endsWith(".test.tsx") ||
        path.endsWith(".spec.ts") ||
        path.endsWith(".spec.tsx"));
}
function validateImports(context) {
    var _a, _b;
    var violations = [];
    var exportMap = new Map(context.packageExports.map(function (entry) { return [entry.packageName, entry.exportKeys]; }));
    var pathsToScan = context.mode === "scope"
        ? context.changedFiles
        : __spreadArray([], context.sourceFilesByPath.keys(), true).filter(function (path) { return !isTestOrFixturePath(path); });
    for (var _i = 0, pathsToScan_1 = pathsToScan; _i < pathsToScan_1.length; _i++) {
        var path = pathsToScan_1[_i];
        var source = context.sourceFilesByPath.get(path);
        if (!source) {
            continue;
        }
        for (var _c = 0, _d = source.matchAll(ai_boundary_policy_js_1.IMPORT_PATTERN); _c < _d.length; _c++) {
            var match = _d[_c];
            var specifier = (_b = (_a = match[1]) !== null && _a !== void 0 ? _a : match[2]) !== null && _b !== void 0 ? _b : match[3];
            if (!specifier) {
                continue;
            }
            if (ai_boundary_policy_js_1.DEEP_RELATIVE_PACKAGE_PATTERN.test(specifier)) {
                violations.push({
                    invariant: "AI-006",
                    gate: "boundaries",
                    message: "deep relative import across package boundary: ".concat(specifier),
                    path: path,
                });
                continue;
            }
            if (!specifier.startsWith("@afenda/")) {
                continue;
            }
            if (ai_boundary_policy_js_1.PRIVATE_AFENDA_SUBPATH_PATTERN.test(specifier)) {
                violations.push({
                    invariant: "AI-006",
                    gate: "boundaries",
                    message: "private import path blocked: ".concat(specifier),
                    path: path,
                });
                continue;
            }
            var packageName = (0, ai_boundary_policy_js_1.extractWorkspacePackageName)(specifier);
            var exportKeys = exportMap.get(packageName);
            if (!exportKeys) {
                continue;
            }
            if (!(0, ai_boundary_policy_js_1.isPublicExportSpecifier)(specifier, exportKeys)) {
                violations.push({
                    invariant: "AI-006",
                    gate: "boundaries",
                    message: "import must use public export entrypoint: ".concat(specifier),
                    path: path,
                });
            }
        }
    }
    return violations;
}
function validateAiBoundaries(context) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], validateForbiddenPackageNames(context), true), validateScopePaths(context), true), validateBroadScopeGlobs(context), true), validateBusinessLogicBoundaries(context), true), validateImports(context), true);
}
