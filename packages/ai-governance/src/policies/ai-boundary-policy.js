"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIVATE_AFENDA_SUBPATH_PATTERN = exports.DEEP_RELATIVE_PACKAGE_PATTERN = exports.IMPORT_PATTERN = exports.ARCHITECTURE_AUTHORITY_PACKAGE = exports.DOMAIN_LAYER = exports.FORBIDDEN_BROAD_SCOPE_GLOBS = exports.FORBIDDEN_AI_PACKAGE_PATTERNS = exports.BUSINESS_LOGIC_FORBIDDEN_LAYERS = void 0;
exports.extractWorkspacePackageName = extractWorkspacePackageName;
exports.isPublicExportSpecifier = isPublicExportSpecifier;
var ai_boundary_contract_js_1 = require("../contracts/ai-boundary.contract.js");
Object.defineProperty(exports, "BUSINESS_LOGIC_FORBIDDEN_LAYERS", { enumerable: true, get: function () { return ai_boundary_contract_js_1.BUSINESS_LOGIC_FORBIDDEN_LAYERS; } });
Object.defineProperty(exports, "FORBIDDEN_AI_PACKAGE_PATTERNS", { enumerable: true, get: function () { return ai_boundary_contract_js_1.FORBIDDEN_AI_PACKAGE_PATTERNS; } });
Object.defineProperty(exports, "FORBIDDEN_BROAD_SCOPE_GLOBS", { enumerable: true, get: function () { return ai_boundary_contract_js_1.FORBIDDEN_BROAD_SCOPE_GLOBS; } });
exports.DOMAIN_LAYER = "Domain";
exports.ARCHITECTURE_AUTHORITY_PACKAGE = "@afenda/architecture-authority";
exports.IMPORT_PATTERN = /\bfrom\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/gu;
exports.DEEP_RELATIVE_PACKAGE_PATTERN = /\.\.\/(?:\.\.\/)+packages\/[^/"']+\/src\//u;
exports.PRIVATE_AFENDA_SUBPATH_PATTERN = /^@afenda\/[^/]+\/(?:src|dist)\//u;
function extractWorkspacePackageName(specifier) {
    var segments = specifier.split("/");
    return "".concat(segments[0], "/").concat(segments[1]);
}
function isPublicExportSpecifier(specifier, exportKeys) {
    if (!specifier.startsWith("@afenda/")) {
        return true;
    }
    var packageName = extractWorkspacePackageName(specifier);
    var subpath = specifier.slice(packageName.length);
    if (!subpath) {
        return exportKeys.includes(".");
    }
    var exportKey = ".".concat(subpath);
    return exportKeys.includes(exportKey);
}
