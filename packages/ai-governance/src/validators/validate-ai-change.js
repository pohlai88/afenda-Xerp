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
exports.validateArchitectureDelegation = validateArchitectureDelegation;
exports.validateContractPreservation = validateContractPreservation;
exports.validateTestCoverage = validateTestCoverage;
exports.validateDeletions = validateDeletions;
exports.validateAiChangeGates = validateAiChangeGates;
var architecture_authority_1 = require("@afenda/architecture-authority");
function mapArchitectureViolations(architectureResult) {
    var violations = [];
    for (var _i = 0, _a = architectureResult.violations; _i < _a.length; _i++) {
        var violation = _a[_i];
        if (violation.gate === "registry") {
            violations.push(__assign({ invariant: "AI-001", gate: "registry", message: violation.message }, (violation.packageName ? { path: violation.packageName } : {})));
            continue;
        }
        if (violation.gate === "dependencies" ||
            violation.gate === "forbidden-dependencies") {
            violations.push(__assign({ invariant: "AI-002", gate: "dependencies", message: violation.message }, (violation.packageName ? { path: violation.packageName } : {})));
        }
    }
    return violations;
}
function validateArchitectureDelegation(context) {
    var architectureResult = (0, architecture_authority_1.validateArchitecture)(context.workspaces);
    return mapArchitectureViolations(architectureResult);
}
function validateContractPreservation(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    var adr = context.scopeManifest.adr;
    for (var _i = 0, _a = context.changedFiles; _i < _a.length; _i++) {
        var path = _a[_i];
        if (!path.endsWith(".contract.ts")) {
            continue;
        }
        if (!adr.trim()) {
            violations.push({
                invariant: "AI-007",
                gate: "change",
                message: "contract file changed without ADR reference in scope manifest",
                path: path,
            });
        }
    }
    return violations;
}
function validateTestCoverage(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    var exemptions = new Set(context.scopeManifest.testExemptions.map(function (entry) { return entry.path; }));
    if (context.scopeManifest.testPlan.length === 0) {
        violations.push({
            invariant: "AI-008",
            gate: "change",
            message: "scope manifest testPlan must not be empty",
        });
    }
    for (var _i = 0, _a = context.addedFiles; _i < _a.length; _i++) {
        var path = _a[_i];
        if (!path.includes("/src/") || path.endsWith(".contract.ts")) {
            continue;
        }
        if (path.includes("/tests/") || path.includes("/__tests__/")) {
            continue;
        }
        if (!path.endsWith(".ts") && !path.endsWith(".tsx")) {
            continue;
        }
        var testCandidates = [
            path.replace(/\/src\//u, "/src/__tests__/").replace(/\.tsx?$/u, ".test.ts"),
            path.replace(/\/src\//u, "/src/tests/").replace(/\.tsx?$/u, ".test.ts"),
        ];
        var hasTest = testCandidates.some(function (candidate) {
            return context.changedFiles.includes(candidate);
        });
        if (!hasTest && !exemptions.has(path)) {
            violations.push({
                invariant: "AI-008",
                gate: "change",
                message: "new source file requires test coverage or testExemptions entry",
                path: path,
            });
        }
    }
    return violations;
}
function validateDeletions(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    var justified = new Set(context.scopeManifest.deletionJustifications.map(function (entry) { return entry.path; }));
    for (var _i = 0, _a = context.deletedFiles; _i < _a.length; _i++) {
        var path = _a[_i];
        if (!justified.has(path)) {
            violations.push({
                invariant: "AI-009",
                gate: "change",
                message: "deleted file requires deletionJustifications entry",
                path: path,
            });
        }
    }
    return violations;
}
function validateAiChangeGates(context) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], validateArchitectureDelegation(context), true), validateContractPreservation(context), true), validateTestCoverage(context), true), validateDeletions(context), true);
}
