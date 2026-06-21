"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAiPrompts = validateAiPrompts;
function isNonEmptyStringArray(value) {
    return value.length > 0 && value.every(function (entry) { return entry.trim().length > 0; });
}
function validateAiPrompts(context) {
    if (context.mode !== "scope" || !context.scopeManifest) {
        return [];
    }
    var violations = [];
    var manifest = context.scopeManifest;
    if (!manifest.tip.trim()) {
        violations.push({
            invariant: "AI-004",
            gate: "prompt",
            message: "scope manifest tip must not be empty",
        });
    }
    if (!manifest.adr.trim()) {
        violations.push({
            invariant: "AI-007",
            gate: "prompt",
            message: "scope manifest adr must not be empty",
        });
    }
    if (!manifest.reason.trim()) {
        violations.push({
            invariant: "AI-004",
            gate: "prompt",
            message: "scope manifest reason must not be empty",
        });
    }
    if (!isNonEmptyStringArray(manifest.nonGoals)) {
        violations.push({
            invariant: "AI-004",
            gate: "prompt",
            message: "scope manifest nonGoals must be a non-empty string array",
        });
    }
    if (!isNonEmptyStringArray(manifest.testPlan)) {
        violations.push({
            invariant: "AI-008",
            gate: "prompt",
            message: "scope manifest testPlan must be a non-empty string array",
        });
    }
    return violations;
}
